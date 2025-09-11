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