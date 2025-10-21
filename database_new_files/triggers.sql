DELIMITER $$

CREATE TRIGGER after_payment_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    UPDATE bill
    SET due_amount = due_amount - NEW.paid_amount,
        bill_status = CASE 
                         WHEN (due_amount - NEW.paid_amount) <= 0 THEN 'paid'
                         ELSE bill_status 
                      END
    WHERE bill_id = NEW.bill_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_bill_update
BEFORE UPDATE ON bill
FOR EACH ROW
BEGIN
    DECLARE v_tax_rate DECIMAL(5,2);
    
    -- Only recalculate if sub_total changes
    IF NEW.sub_total != OLD.sub_total THEN
        -- Get the latest tax percentage from your view
        SELECT latest_tax_percentage INTO v_tax_rate
        FROM latest_tax_percentage
        LIMIT 1;
        
        -- Calculate tax_amount based on new sub_total
        SET NEW.tax_amount = NEW.sub_total * (v_tax_rate / 100);
        
        -- Recalculate grand_total
        SET NEW.grand_total = NEW.sub_total + NEW.tax_amount;
        
        -- Update due_amount proportionally if needed
        IF NEW.due_amount = OLD.grand_total THEN
            SET NEW.due_amount = NEW.grand_total;
        END IF;
    END IF;
END$$

DELIMITER ;


DELIMITER $$

-- Trigger for INSERT
CREATE TRIGGER before_bill_insert_2
BEFORE INSERT ON bill
FOR EACH ROW
BEGIN
    -- Set bill_status based on due_amount
    IF NEW.due_amount > 0 THEN
        SET NEW.bill_status = 'Pending';
    ELSE
        SET NEW.bill_status = 'Paid';
    END IF;
END$$

-- Trigger for UPDATE
CREATE TRIGGER before_bill_update
BEFORE UPDATE ON bill
FOR EACH ROW
BEGIN
    -- Set bill_status based on due_amount
    IF NEW.due_amount > 0 THEN
        SET NEW.bill_status = 'Pending';
    ELSE
        SET NEW.bill_status = 'Paid';
    END IF;
END$$

DELIMITER ;









-- Trigger to log staff modifications

DELIMITER //

CREATE TRIGGER after_staff_update

    AFTER UPDATE ON Staff_User

    FOR EACH ROW

BEGIN

    INSERT INTO staff_logs (username, action)

    VALUES (NEW.username, CONCAT('Staff updated: ', OLD.official_role, ' to ', NEW.official_role));

END //

DELIMITER ;



-- Trigger to log staff deletions

DELIMITER //

CREATE TRIGGER before_staff_delete

    BEFORE DELETE ON Staff_User

    FOR EACH ROW

BEGIN

    INSERT INTO staff_logs (username, action)

    VALUES (OLD.username, CONCAT('Staff deleted: ', OLD.official_role));

END //

DELIMITER ;




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


-- Trigger 2/: Update room status to 'Available' when booked_room status becomes 'CheckedOut'
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


-- Trigger 3: When booking status = 'Cancelled' Booked_rooms also change to cancelled state.

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

-- Trigger 6: Create Bill when booking status = 'CheckedIn' - more sophisticated
DELIMITER //

CREATE TRIGGER initialize_bill_on_checkin
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    DECLARE v_room_total DECIMAL(10,2);
    DECLARE v_tax_amount DECIMAL(10,2);
    DECLARE v_grand_total DECIMAL(10,2);
    
    IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
        -- Calculate room total and tax amount using your functions
        SET v_room_total = CalculateNetRoomTotal(NEW.booking_id);
        SET v_tax_amount = CalculateTaxAmount(NEW.booking_id);
        SET v_grand_total = v_room_total + v_tax_amount;
        
        -- Insert a new bill record with calculated amounts
        INSERT INTO Bill (
            bill_date, 
            booking_id,
            room_total, 
            service_total,
            tax_amount,
            due_amount,
            bill_status
        )
        VALUES (
            DATE(NOW()), 
            NEW.booking_id, 
            v_room_total,
            0.00,
            v_tax_amount,
            v_grand_total,  -- due_amount = grand_total initially
            'Pending'
        );
    END IF;
END;
//

DELIMITER ;

-- Trigger 7: Update Bill when service_request status = 'Completed'

DELIMITER //

CREATE TRIGGER update_bill_after_service_completed 
AFTER UPDATE ON service_request
FOR EACH ROW
BEGIN
     DECLARE service_charge DECIMAL(10,2);
     DECLARE current_service_total DECIMAL(10,2);
     DECLARE current_room_total DECIMAL(10,2);
     DECLARE current_due_amount DECIMAL(10,2);
     DECLARE tax_percentage DECIMAL(10,2);
     DECLARE new_service_total DECIMAL(10,2);
     DECLARE new_tax_amount DECIMAL(10,2);
     DECLARE service_increase DECIMAL(10,2);
     DECLARE tax_increase DECIMAL(10,2);
     DECLARE total_increase DECIMAL(10,2);
     
     -- Check if status changed to 'Completed'
     IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
         
         -- Calculate the service charge for this completed service
         SELECT unit_quantity_charges INTO service_charge
         FROM service 
         WHERE service_type = NEW.request_type 
         AND service.branch_id = NEW.branch_id;
         
         -- If service charge found, update the bill
         IF service_charge IS NOT NULL THEN
             -- Get current values from bill
             SELECT service_total, room_total, due_amount 
             INTO current_service_total, current_room_total, current_due_amount
             FROM bill 
             WHERE booking_id = NEW.booking_id;
             
             -- Get the latest tax percentage
             SELECT latest_tax_percentage 
             INTO tax_percentage
             FROM taxes_and_charges 
             ORDER BY revision_date DESC 
             LIMIT 1;
             
             -- If tax percentage not found, set default to 0
             IF tax_percentage IS NULL THEN
                 SET tax_percentage = 0;
             END IF;
             
             -- Calculate the increase amounts
             SET service_increase = service_charge * NEW.quantity;
             SET new_service_total = current_service_total + service_increase;
             
             -- Calculate tax increase for the new service amount
             SET tax_increase = service_increase * tax_percentage / 100;
             SET new_tax_amount = (current_room_total + new_service_total) * tax_percentage / 100;
             
             -- Calculate total amount to add to due_amount
             SET total_increase = service_increase + tax_increase;
             
             -- Update service_total, tax_amount, and due_amount
             UPDATE bill
             SET service_total = new_service_total,
                 tax_amount = new_tax_amount,
                 due_amount = current_due_amount + total_increase
             WHERE booking_id = NEW.booking_id;
         END IF;
     END IF;
 END//

DELIMITER ;


-- trigger 8: Update Bill status automatically when due_amount > 0
DROP TRIGGER IF EXISTS update_bill_status_on_due_amount;

DELIMITER //

CREATE TRIGGER update_bill_status_on_due_amount
BEFORE UPDATE ON bill
FOR EACH ROW
BEGIN
    -- Check if due_amount is being updated and becomes greater than 0
    IF NEW.due_amount > 0 AND (OLD.due_amount <= 0 OR OLD.due_amount IS NULL) THEN
        SET NEW.bill_status = 'Pending';
    END IF;
END//

DELIMITER ;

-- Trigger 9: Update room status to 'Available' when booked_room status becomes 'Cancelled'
DELIMITER $$

CREATE TRIGGER after_booking_cancelled
AFTER UPDATE ON Booked_Room
FOR EACH ROW
BEGIN
    -- Check if the status changed to 'Cancelled'
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        -- Update the room to Available
        UPDATE Room
        SET current_status = 'Available'
        WHERE room_number = NEW.room_number
          AND branch_id = NEW.branch_id;
    END IF;
END$$

DELIMITER ;

-- Trigger 10: Update room status to 'Available' when booking status becomes 'Cancelled'

DELIMITER $$

CREATE TRIGGER after_booking_cancelled_update_room_status
AFTER UPDATE ON Booked_Room
FOR EACH ROW
BEGIN
    -- Check if the status changed to 'Cancelled'
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        -- Update the room to Available
        UPDATE Room
        SET current_status = 'Available'
        WHERE room_number = NEW.room_number
          AND branch_id = NEW.branch_id;
    END IF;
END$$

DELIMITER ;

-- Trigger 11: Update Bill status automatically when due_amount becomes zero

DROP TRIGGER IF EXISTS update_bill_status_on_due_amount_become_zero;
DELIMITER //

CREATE TRIGGER update_bill_status_on_due_amount_become_zero
BEFORE UPDATE ON Bill
FOR EACH ROW
BEGIN
    IF NEW.due_amount = 0 AND (OLD.due_amount > 0 ) THEN
        SET NEW.bill_status = 'Paid';
    END IF;
END;
//

DELIMITER ;
-- Trigger 12: Update Bill after Payment deletion
DELIMITER //

CREATE TRIGGER trg_update_bill_after_payment_delete
AFTER DELETE ON Payment
FOR EACH ROW
BEGIN
    DECLARE total_paid DECIMAL(10,2);
    DECLARE room_total DECIMAL(10,2);
    DECLARE service_total DECIMAL(10,2);
    DECLARE tax_amount DECIMAL(10,2);
    DECLARE original_total DECIMAL(10,2);
    DECLARE new_due DECIMAL(10,2);

    -- Get current bill details
    SELECT room_total, service_total, tax_amount
    INTO room_total, service_total, tax_amount
    FROM Bill
    WHERE bill_id = OLD.bill_id;

    SET original_total = COALESCE(room_total,0) + COALESCE(service_total,0) + COALESCE(tax_amount,0);

    -- Sum of remaining payments
    SELECT COALESCE(SUM(paid_amount),0)
    INTO total_paid
    FROM Payment
    WHERE bill_id = OLD.bill_id;

    -- Calculate new due
    SET new_due = original_total - total_paid;

    -- Update Bill table
    UPDATE Bill
    SET due_amount = new_due,
        bill_status = CASE 
                        WHEN new_due <= 0 THEN 'Paid'
                        ELSE 'Pending'
                      END
    WHERE bill_id = OLD.bill_id;
END;
//

DELIMITER ;