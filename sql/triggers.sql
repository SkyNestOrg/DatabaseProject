-- Trigger 1: Update room status to 'Occupied' when booked_room status becomes 'CheckedIn'
DELIMITER $$

CREATE TRIGGER after_booked_room_checkedin
AFTER UPDATE ON booked_room
FOR EACH ROW
BEGIN
    IF NEW.status = 'CheckedIn' AND (OLD.status IS NULL OR OLD.status != 'CheckedIn') THEN
        UPDATE room 
        SET current_status = 'Occupied' 
        WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
    END IF;
END$$

DELIMITER ;


-- Trigger 2: Update room status to 'Available' when booked_room status becomes 'CheckedOut'
DELIMITER $$

CREATE TRIGGER after_booked_room_checkedout
AFTER UPDATE ON booked_room
FOR EACH ROW
BEGIN
    IF NEW.status = 'CheckedOut' AND (OLD.status IS NULL OR OLD.status != 'CheckedOut') THEN
        UPDATE room 
        SET current_status = 'Available' 
        WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
    END IF;
END$$

DELIMITER ;


--Trigger 3: When booking status = 'Cancelled' Booked_rooms also change to cancelled state.

DELIMITER //

CREATE TRIGGER after_booking_cancelled
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        UPDATE booked_room 
        SET status = 'Cancelled'
        WHERE booking_id = NEW.booking_id;
    END IF;
END;
//

DELIMITER ;

--Trigger 4: When booking status = 'Checkedin' Booked_rooms also change to checked in state.

DELIMITER //

CREATE TRIGGER after_booking_checkedin
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
        UPDATE booked_room 
        SET status = 'CheckedIn'
        WHERE booking_id = NEW.booking_id;
    END IF;
END;
//

DELIMITER ;

--Trigger 5: When booking status = 'Checkedout' Booked_rooms also change to checkedout state.
DELIMITER //

CREATE TRIGGER after_booking_checkedout
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    IF NEW.status = 'CheckedOut' AND OLD.status != 'CheckedOut' THEN
        UPDATE booked_room 
        SET status = 'CheckedOut'
        WHERE booking_id = NEW.booking_id;
    END IF;
END;
//

DELIMITER ;

-- Trigger 6: Create Bill when booking status = 'Confirmed'
DELIMITER //

CREATE TRIGGER initialize_bill_on_checkin
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
        -- Insert a new bill record when booking is confirmed
        INSERT INTO Bill (bill_date, booking_id,room_total, service_total,sub_total,tax_amount, grand_total,due_amount ,bill_status)
        VALUES (DATE(NOW()), NEW.booking_id, 0.00,0.00,0.00,0.00,0.00,0.00, 'Pending');
    END IF;
END;
//

DELIMITER ;