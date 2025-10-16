-- Additional database setup for admin features

-- View for staff logs with branch information
CREATE VIEW staff_logs_detailed AS
SELECT 
    sl.log_id,
    sl.username,
    sl.timestamp,
    sl.action,
    su.official_role,
    b.branch_name
FROM staff_logs sl
JOIN Staff_User su ON sl.username = su.username
JOIN Branch b ON su.branch_id = b.branch_id;

-- Index for better performance on logs
CREATE INDEX idx_staff_logs_timestamp ON staff_logs(timestamp);
CREATE INDEX idx_staff_logs_username ON staff_logs(username);

-- Function to check if user is admin
DELIMITER //
CREATE FUNCTION is_admin_user(p_username VARCHAR(20))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE user_role VARCHAR(20);
    SELECT official_role INTO user_role 
    FROM Staff_User 
    WHERE username = p_username;
    
    RETURN (user_role = 'Admin');
END //
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