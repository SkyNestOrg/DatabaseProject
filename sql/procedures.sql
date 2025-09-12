--Procedure 1: Check Availability
DELIMITER //

CREATE PROCEDURE CheckRoomAvailability(
    IN p_branch_id INT,
    IN p_check_in DATE,
    IN p_check_out DATE,
    OUT p_result_message VARCHAR(40)
)
BEGIN
    DECLARE v_unavailable_count INT;

    -- Find if any requested room type has fewer available rooms than needed
    SELECT COUNT(*) INTO v_unavailable_count
    FROM temp_room_booking t
    LEFT JOIN (
        SELECT r.room_type, COUNT(*) AS available_count
        FROM room r
        WHERE r.branch_id = p_branch_id
          AND r.current_status = 'Available'
          AND r.room_number NOT IN (
              SELECT br.room_number
              FROM booked_room br
              WHERE br.branch_id = p_branch_id
                AND br.status NOT IN ('Cancelled', 'CheckedOut')
                AND (
                    (p_check_in BETWEEN br.check_in AND br.check_out) OR
                    (p_check_out BETWEEN br.check_in AND br.check_out) OR
                    (br.check_in BETWEEN p_check_in AND p_check_out)
                )
          )
        GROUP BY r.room_type
    ) avail ON t.room_type = avail.room_type
    WHERE t.branch_id = p_branch_id
      AND (avail.available_count IS NULL OR avail.available_count < t.quantity);

    IF v_unavailable_count > 0 THEN
        SET p_result_message = 'Not enough rooms available for your request.';
    ELSE
        SET p_result_message = 'All requested rooms available.';
    END IF;
END //

DELIMITER ;




-- Procedure 2: Create booking

DELIMITER //

CREATE PROCEDURE CreateBooking(
    IN p_guest_id INT,
    IN p_booking_date DATETIME,
    IN p_branch_id INT,
    IN p_number_of_pax INT,
    IN p_check_in DATE,
    IN p_check_out DATE,
    OUT p_result_message VARCHAR(255),
    OUT p_booking_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_message = 'Error during booking. Rolled back.';
        SET p_booking_id = NULL;
    END;

    START TRANSACTION;

    -- Create booking record
    INSERT INTO booking (guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status)
    SELECT p_guest_id, p_booking_date, p_branch_id, SUM(quantity), p_number_of_pax, 'Confirmed'
    FROM temp_room_booking
    WHERE branch_id = p_branch_id;

    SET p_booking_id = LAST_INSERT_ID();

    -- Insert booked rooms in bulk
    INSERT INTO booked_room (room_number, booking_id, branch_id, check_in, check_out, status)
    SELECT r.room_number, p_booking_id, p_branch_id, p_check_in, p_check_out, 'Reserved'
    FROM room r
    JOIN temp_room_booking t ON r.room_type = t.room_type AND r.branch_id = t.branch_id
    WHERE r.current_status = 'Available'
      AND r.room_number NOT IN (
          SELECT br.room_number
          FROM booked_room br
          WHERE br.branch_id = p_branch_id
            AND br.status NOT IN ('Cancelled', 'CheckedOut')
            AND (
                (p_check_in BETWEEN br.check_in AND br.check_out) OR
                (p_check_out BETWEEN br.check_in AND br.check_out) OR
                (br.check_in BETWEEN p_check_in AND p_check_out)
            )
      )
    LIMIT (SELECT SUM(quantity) FROM temp_room_booking WHERE branch_id = p_branch_id);

    -- Update status of those rooms
    UPDATE room r
    JOIN booked_room br ON r.room_number = br.room_number AND r.branch_id = br.branch_id
    SET r.current_status = 'Reserved'
    WHERE br.booking_id = p_booking_id;

    -- Clear temp data
    DELETE FROM temp_room_booking WHERE branch_id = p_branch_id;

    COMMIT;
    SET p_result_message = CONCAT('Booking successful. ID = ', p_booking_id);
END //

DELIMITER ;


-----------------

DELIMITER //

CREATE PROCEDURE CreateBookingAtomic(
    IN p_guest_id INT,
    IN p_booking_date DATETIME,
    IN p_branch_id INT,
    IN p_number_of_pax INT,
    IN p_check_in DATE,
    IN p_check_out DATE,
    OUT p_result_message VARCHAR(255),
    OUT p_booking_id INT
)
BEGIN
    DECLARE v_total_rooms INT;
    DECLARE v_room_type VARCHAR(50);
    DECLARE v_quantity INT;
    DECLARE v_room_number VARCHAR(10);
    DECLARE v_available INT;
    DECLARE done INT DEFAULT FALSE;
    
    DECLARE room_cursor CURSOR FOR 
        SELECT room_type, quantity 
        FROM temp_room_booking 
        WHERE branch_id = p_branch_id;
    
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_message = CONCAT('Error: ', COALESCE(NULLIF(SQLERRM, ''), 'Unknown error'));
        SET p_booking_id = NULL;
    END;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Start single atomic transaction
    START TRANSACTION;

    -- Verify availability within the same transaction
    IF NOT EXISTS (SELECT 1 FROM temp_room_booking WHERE branch_id = p_branch_id) THEN
        ROLLBACK;
        SET p_result_message = 'No room requests found';
        SET p_booking_id = NULL;
        LEAVE;
    END IF;

    -- Check availability for each room type with proper locking
    OPEN room_cursor;
    
    room_check_loop: LOOP
        FETCH room_cursor INTO v_room_type, v_quantity;
        IF done THEN
            LEAVE room_check_loop;
        END IF;
        
        -- Count available rooms with locking to prevent race conditions
        SELECT COUNT(*) INTO v_available
        FROM room r
        WHERE r.branch_id = p_branch_id
          AND r.room_type = v_room_type
          AND r.current_status = 'Available'
          AND r.room_number NOT IN (
              SELECT br.room_number
              FROM booked_room br
              WHERE br.branch_id = p_branch_id
                AND br.status NOT IN ('Cancelled', 'CheckedOut')
                AND (p_check_in < br.check_out AND p_check_out > br.check_in)
          )
        FOR UPDATE; -- Lock the rows to prevent concurrent modifications
        
        IF v_available < v_quantity THEN
            ROLLBACK;
            SET p_result_message = CONCAT('Not enough ', v_room_type, 
                                       ' rooms. Required: ', v_quantity, 
                                       ', Available: ', v_available);
            SET p_booking_id = NULL;
            CLOSE room_cursor;
            LEAVE;
        END IF;
    END LOOP;
    
    CLOSE room_cursor;
    SET done = FALSE;

    -- Calculate total rooms
    SELECT COALESCE(SUM(quantity), 0) INTO v_total_rooms 
    FROM temp_room_booking 
    WHERE branch_id = p_branch_id;

    -- Create booking record
    INSERT INTO booking (guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status)
    VALUES (p_guest_id, p_booking_date, p_branch_id, v_total_rooms, p_number_of_pax, 'Confirmed');
    
    SET p_booking_id = LAST_INSERT_ID();

    -- Reopen cursor for room assignment
    OPEN room_cursor;
    
    room_assign_loop: LOOP
        FETCH room_cursor INTO v_room_type, v_quantity;
        IF done THEN
            LEAVE room_assign_loop;
        END IF;
        
        -- Assign specific quantity of rooms for this type
        INSERT INTO booked_room (room_number, booking_id, branch_id, check_in, check_out, status)
        SELECT r.room_number, p_booking_id, p_branch_id, p_check_in, p_check_out, 'Reserved'
        FROM room r
        WHERE r.branch_id = p_branch_id
          AND r.room_type = v_room_type
          AND r.current_status = 'Available'
          AND r.room_number NOT IN (
              SELECT br.room_number
              FROM booked_room br
              WHERE br.branch_id = p_branch_id
                AND br.status NOT IN ('Cancelled', 'CheckedOut')
                AND (p_check_in < br.check_out AND p_check_out > br.check_in)
          )
        LIMIT v_quantity;
        
        -- Update room statuses in bulk
        UPDATE room r
        JOIN booked_room br ON r.room_number = br.room_number AND r.branch_id = br.branch_id
        SET r.current_status = 'Reserved'
        WHERE br.booking_id = p_booking_id
          AND br.branch_id = p_branch_id;
    END LOOP;
    
    CLOSE room_cursor;

    -- Clear temp data
    DELETE FROM temp_room_booking WHERE branch_id = p_branch_id;

    COMMIT;
    SET p_result_message = CONCAT('Booking successful. Booking ID: ', p_booking_id);
END //

DELIMITER ;