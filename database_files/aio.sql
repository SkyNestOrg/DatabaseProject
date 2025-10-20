-- -- Database Schema for Hotel Management System - CORRECTED VERSION

-- CREATE TABLE `Branch` (
--   `branch_id` INT AUTO_INCREMENT,
--   `branch_name` VARCHAR(25) NOT NULL,
--   `address` VARCHAR(75) NOT NULL,
--   `city` VARCHAR(25) NOT NULL,
--   `contact_number` CHAR(10) NOT NULL,
--   PRIMARY KEY (`branch_id`)
-- );

-- CREATE TABLE `Staff_User` (
--   `username` VARCHAR(20),
--   `password` VARCHAR(255),
--   `official_role` VARCHAR(20) NOT NULL,
--   `branch_id` INT NOT NULL,
--   PRIMARY KEY (`username`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`)
-- );

-- CREATE TABLE `staff_logs` (
--   `log_id` INT AUTO_INCREMENT,
--   `username` VARCHAR(20) NOT NULL,
--   `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
--   `action` VARCHAR(50),
--   PRIMARY KEY (`log_id`),
--   FOREIGN KEY (`username`) REFERENCES `Staff_User`(`username`)
-- );

-- CREATE TABLE `Guest` (
--   `guest_id` INT AUTO_INCREMENT,
--   `first_name` VARCHAR(20) NOT NULL,
--   `last_name` VARCHAR(20) NOT NULL,
--   `email` VARCHAR(50) UNIQUE NOT NULL,
--   `phone_number` VARCHAR(15),
--   `address` VARCHAR(75),
--   `passport_number` VARCHAR(25) UNIQUE,
--   `country_of_residence` VARCHAR(25),
--   `date_of_birth` DATE,
--   PRIMARY KEY (`guest_id`)
-- );

-- CREATE TABLE Guest_User (
--     `guest_id` INT AUTO_INCREMENT,
--     `username` VARCHAR(20) UNIQUE,
--     `password` VARCHAR(255) NOT NULL,
--     PRIMARY KEY (`guest_id`)
-- );

-- CREATE TABLE `RoomType` (
--   `type_name` VARCHAR(20),
--   `base_price` NUMERIC(9,2) NOT NULL,
--   `amenities` TEXT,
--   `capacity` INT NOT NULL,
--   PRIMARY KEY (`type_name`)
-- );

-- CREATE TABLE `Room` (
--   `room_number` INT,
--   `current_status` VARCHAR(20) DEFAULT 'Available',
--   `room_type` VARCHAR(20) NOT NULL,
--   `branch_id` INT NOT NULL,
--   PRIMARY KEY (`room_number`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`),
--   FOREIGN KEY (`room_type`) REFERENCES `RoomType`(`type_name`),
--   -- ADDED: Unique constraint for the composite foreign key
--   UNIQUE KEY `unique_room_branch` (`room_number`, `branch_id`)
-- );

-- CREATE TABLE `Booking` (
--   `booking_id` INT AUTO_INCREMENT,
--   `guest_id` INT NOT NULL,
--   `booking_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
--   `branch_id` INT NOT NULL,
--   `number_of_rooms` INT NOT NULL,
--   `number_of_pax` INT NOT NULL,
--   `status` VARCHAR(20) DEFAULT 'Confirmed',
--   PRIMARY KEY (`booking_id`),
--   FOREIGN KEY (`guest_id`) REFERENCES `Guest`(`guest_id`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`)
-- );

-- CREATE TABLE `Booked_Room` (
--   `room_number` INT,
--   `booking_id` INT,
--   `branch_id` INT NOT NULL,
--   `check_in` DATE NOT NULL,
--   `check_out` DATE NOT NULL,
--   `status` VARCHAR(20) DEFAULT 'Booked',
--   PRIMARY KEY (`room_number`, `booking_id`),
--   FOREIGN KEY (`room_number`) REFERENCES `Room`(`room_number`),
--   FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`),
--   -- CORRECTED: Now references the unique constraint
--   FOREIGN KEY (`room_number`, `branch_id`) REFERENCES `Room`(`room_number`, `branch_id`),
--   CONSTRAINT chk_checkout_after_checkin CHECK (`check_out` > `check_in`)
-- );

-- CREATE TABLE `Bill` (
--   `bill_id` INT AUTO_INCREMENT,
--   `bill_date` DATE DEFAULT (CURRENT_DATE),
--   `booking_id` INT NOT NULL,
--   `room_total` NUMERIC(11,2) DEFAULT 0,
--   `service_total` NUMERIC(11,2) DEFAULT 0,
--   `sub_total` NUMERIC(11,2) GENERATED ALWAYS AS (`room_total` + `service_total`) STORED,
--   `tax_amount` NUMERIC(11,2) DEFAULT 0,
--   `grand_total` NUMERIC(11,2) GENERATED ALWAYS AS (`sub_total` + `tax_amount`) STORED,
--   `due_amount` NUMERIC(11,2) DEFAULT 0,
--   `bill_status` VARCHAR(10) DEFAULT 'Pending',
--   PRIMARY KEY (`bill_id`),
--   FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`)
-- );

-- CREATE TABLE `Payment` (
--   `payment_reference` INT AUTO_INCREMENT,
--   `bill_id` INT NOT NULL,
--   `payment_method` VARCHAR(20),
--   `paid_amount` NUMERIC(11,2) NOT NULL,
--   `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`payment_reference`),
--   FOREIGN KEY (`bill_id`) REFERENCES `Bill`(`bill_id`)
-- );

-- CREATE TABLE `Service` (
--   `service_type` VARCHAR(40),
--   `unit_quantity_charges` NUMERIC(7,2) NOT NULL,
--   `branch_id` INT NOT NULL,
--   `availability` VARCHAR(10) DEFAULT 'Available',
--   PRIMARY KEY (`service_type`, `branch_id`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`)
-- );

-- CREATE TABLE `Service_Request` (
--   `service_request_id` INT AUTO_INCREMENT,
--   `request_type` VARCHAR(40) NOT NULL,
--   `date_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
--   `booking_id` INT NOT NULL,
--   `room_number` INT NOT NULL,
--   `status` VARCHAR(15) DEFAULT 'Pending',
--   `quantity` INT DEFAULT 1,
--   `branch_id` INT NOT NULL,
--   PRIMARY KEY (`service_request_id`),
--   FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`),
--   FOREIGN KEY (`room_number`) REFERENCES `Room`(`room_number`),
--   FOREIGN KEY (`request_type`, `branch_id`) REFERENCES `Service`(`service_type`, `branch_id`)
-- );

-- CREATE TABLE `Discount` (
--   `discount_id` INT AUTO_INCREMENT,
--   `percentage` INT NOT NULL,
--   `branch_id` INT NOT NULL,
--   `room_type` VARCHAR(20),
--   `start_date` DATE NOT NULL,
--   `end_date` DATE NOT NULL,
--   PRIMARY KEY (`discount_id`),
--   FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`branch_id`),
--   FOREIGN KEY (`room_type`) REFERENCES `RoomType`(`type_name`),
--   CONSTRAINT chk_discount_dates CHECK (`end_date` > `start_date`),
--   CONSTRAINT chk_percentage CHECK (`percentage` BETWEEN 1 AND 100)
-- );

-- CREATE TABLE `Taxes_and_Charges` ( 
--   `revision_id` INT NOT NULL AUTO_INCREMENT,
--   `revision_date` DATE NOT NULL unique,
--   `latest_tax_percentage` INT NOT NULL,
--   `latest_surcharge_percentage` INT NOT NULL,
--   PRIMARY KEY (`revision_id`),
--   CONSTRAINT chk_tax CHECK (`latest_tax_percentage` BETWEEN 0 AND 100),
--   CONSTRAINT chk_surcharge CHECK (`latest_surcharge_percentage` BETWEEN 0 AND 100)
-- );
-- -- insert data for tables


-- insert the required RoomType data
-- INSERT INTO RoomType (type_name, base_price, amenities, capacity) VALUES
-- ('Budget', 13500.00, 'Family Bed, WiFi, Air Conditioning, TV (50°), Mini-Fridge, Desk, Wardrobe, In-room Safe, Free Toiletries', 5),
-- ('Deluxe', 12000.00, 'King Bed, High-Speed WiFi, Air Conditioning, Smart TV (55°) with Streaming, Private Bathroom with Bathtub and Shower, Premium Mini-Bar, Espresso Machine, Sitting Area, Wardrobe, In-room Safe, Robe, Slippers, Premium Toiletries, Hair Dryer, Iron, Ironing Board', 4),
-- ('Double', 7500.00, 'Double Bed, WiFi, Air Conditioning, TV (43°), Private Bathroom with Bathtub/Shower, Mini-Fridge, Desk, Wardrobe, In-room Safe, Free Toiletries, Hair Dryer', 2),
-- ('Single', 5000.00, 'Single Bed, WiFi, Air Conditioning, TV (32°), Private Bathroom with Shower, Desk, Wardrobe, Free Toiletries', 1),
-- ('Suite', 20000.00, 'King Bed, Ultra High-Speed WiFi, Climate Control AC, Smart TV (65°) + Second TV, Private Bathroom with Jacuzzi and Rain Shower, Separate Living Room, Kitchenette (sink, microwave, Nespresso machine), Dining Table, Stocked Premium Mini-Bar, Work Office Area', 4);



-- -- branches
-- INSERT INTO `Branch` (`branch_id`, `branch_name`, `address`, `city`, `contact_number`) VALUES
-- (1, 'SkyNest Urban', '123 Galle Face', 'Colombo 01', '0112345678'),
-- (2, 'SkyNest Coast', '456 Galle Road', 'Galle', '0912345679'),
-- (3, 'SkyNest Hills', '789 Colombo Road', 'Kandy', '0812345680');




-- services
-- INSERT INTO Service(service_type, unit_quantity_charges, branch_id, availability) VALUES
-- -- Branch 1
-- ('Airport Drop', 9700.00, 1, 'No'),
-- ('In-Room Entertainment', 6000.00, 1, 'Yes'),
-- ('Laundry - extra', 4800.00, 1, 'No'),
-- ('Laundry - regular', 2500.00, 1, 'Yes'),
-- ('minibar - extra', 6500.00, 1, 'No'),
-- ('minibar - premium', 9500.00, 1, 'Yes'),
-- ('minibar - regular', 3800.00, 1, 'Yes'),
-- ('Room Service - Premium', 8500.00, 1, 'Yes'),
-- ('Room Service - regular', 4500.00, 1, 'Yes'),
-- ('spa and wellness - extra', 18000.00, 1, 'Yes'),
-- ('spa and wellness - regular', 12000.00, 1, 'Yes'),
-- ('wifi - upgrade', 3500.00, 1, 'Yes'),

-- -- Branch 2
-- ('In-Room Entertainment', 6500.00, 2, 'Yes'),
-- ('Laundry - extra', 5200.00, 2, 'Yes'),
-- ('Laundry - regular', 2700.00, 2, 'Yes'),
-- ('minibar - extra', 6800.00, 2, 'Yes'),
-- ('minibar - premium', 9800.00, 2, 'No'),
-- ('minibar - regular', 4000.00, 2, 'Yes'),
-- ('Room Service - Premium', 9000.00, 2, 'No'),
-- ('Room Service - regular', 4800.00, 2, 'Yes'),
-- ('spa and wellness - extra', 18500.00, 2, 'No'),
-- ('spa and wellness - regular', 12500.00, 2, 'Yes'),
-- ('wifi - upgrade', 3800.00, 2, 'Yes'),

-- -- Branch 3
-- ('In-Room Entertainment', 6200.00, 3, 'Yes'),
-- ('Laundry - extra', 5000.00, 3, 'Yes'),
-- ('Laundry - regular', 2600.00, 3, 'No'),
-- ('minibar - extra', 6700.00, 3, 'Yes'),
-- ('minibar - premium', 9700.00, 3, 'Yes'),
-- ('minibar - regular', 3900.00, 3, 'Yes'),
-- ('Room Service - Premium', 8800.00, 3, 'Yes'),
-- ('Room Service - regular', 4600.00, 3, 'Yes'),
-- ('spa and wellness - extra', 18200.00, 3, 'Yes'),
-- ('spa and wellness - regular', 12200.00, 3, 'Yes'),
-- ('wifi - upgrade', 3700.00, 3, 'No');


-- -- initial staff-users


-- INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES
-- ('AD001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'admin-user', 1),
-- ('FO001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 1),
-- ('FO002', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 2),
-- ('FO003', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 3),
-- ('MN001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'management-user', 1),
-- ('SO001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 1),
-- ('SO002', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 2),
-- ('SO003', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 3);

-- -- note that all these hashed passwords =  123456.


-- -- Insert Room data
-- INSERT INTO `Room` (`room_number`, `current_status`, `room_type`, `branch_id`) VALUES
-- -- Branch 1 Rooms
-- (101, 'Available', 'Single', 1),
-- (102, 'Available', 'Single', 1),
-- (103, 'Available', 'Double', 1),
-- (104, 'Available', 'Double', 1),
-- (105, 'Available', 'Deluxe', 1),
-- (106, 'Available', 'Deluxe', 1),
-- (107, 'Available', 'Suite', 1),
-- (108, 'Available', 'Suite', 1),
-- (109, 'Available', 'Budget', 1),
-- (110, 'Available', 'Budget', 1),

-- -- Branch 2 Rooms
-- (201, 'Available', 'Single', 2),
-- (202, 'Available', 'Single', 2),
-- (203, 'Available', 'Double', 2),
-- (204, 'Available', 'Double', 2),
-- (205, 'Available', 'Deluxe', 2),
-- (206, 'Available', 'Deluxe', 2),
-- (207, 'Available', 'Suite', 2),
-- (208, 'Available', 'Suite', 2),
-- (209, 'Available', 'Budget', 2),
-- (210, 'Available', 'Budget', 2),

-- -- Branch 3 Rooms
-- (301, 'Available', 'Single', 3),
-- (302, 'Available', 'Single', 3),
-- (303, 'Available', 'Double', 3),
-- (304, 'Available', 'Double', 3),
-- (305, 'Available', 'Deluxe', 3),
-- (306, 'Available', 'Deluxe', 3),
-- (307, 'Available', 'Suite', 3),
-- (308, 'Available', 'Suite', 3),
-- (309, 'Available', 'Budget', 3),
-- (310, 'Available', 'Budget', 3);







-- initial tax and charges

-- INSERT INTO Taxes_and_Charges(revision_id, revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES
-- (1, '2025-10-06', 15, 5),
-- (2, '2025-10-01', 25, 5);

-- 1. Booking creation performance
-- CREATE INDEX idx_room_branch_type_status ON Room(branch_id, room_type, current_status);
-- CREATE INDEX idx_booked_room_branch_dates_status ON Booked_Room(branch_id, check_in, check_out, status);


-- CREATE INDEX idx_booked_room_dates_status ON Booked_Room(check_in, check_out, status);
-- CREATE INDEX idx_bill_status ON Bill(bill_status);
-- CREATE INDEX idx_bill_date ON Bill(bill_date);

-- CREATE INDEX idx_service_request_comprehensive ON Service_Request(request_type, date_time, status);
-- CREATE INDEX idx_booked_room_booking ON Booked_Room(booking_id);
-- CREATE INDEX idx_bill_booking ON Bill(booking_id);


-- CREATE INDEX idx_roomtype_name ON RoomType(type_name);
-- CREATE INDEX idx_discount_branch_type_dates ON Discount(branch_id, room_type, start_date, end_date);
-- CREATE INDEX idx_service_branch_type ON Service(service_type, branch_id, availability);
-- -- function to calculate room_total for a given booking, return room_total

-- DELIMITER //

-- CREATE FUNCTION CalculateRoomTotal(p_booking_id INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_price DECIMAL(10,2);
    
--     SELECT COALESCE(SUM(rt.base_price * DATEDIFF(br.check_out, br.check_in)), 0) INTO total_price
--     FROM booking b
--     INNER JOIN booked_room br ON b.booking_id = br.booking_id
--     INNER JOIN room r ON br.room_number = r.room_number
--     INNER JOIN roomtype rt ON r.room_type = rt.type_name
--     WHERE b.booking_id = p_booking_id
--     AND br.status != 'Cancelled';
    
--     RETURN total_price;
-- END//

-- -- --------------------------------------------------------------------------------------------------------------
-- -- function returning net_room_total after discounts

-- CREATE FUNCTION CalculateNetRoomTotal(p_booking_id INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE v_room_total DECIMAL(10,2);
--     DECLARE v_check_in DATE;
--     DECLARE v_branch_id INT;
--     DECLARE v_discount_percentage DECIMAL(5,2) DEFAULT 0;
--     DECLARE v_tax_percentage DECIMAL(5,2) DEFAULT 0;
--     DECLARE v_discounted_amount DECIMAL(10,2);
    
--     -- Get room total, check_in date, and branch_id
--     SELECT CalculateRoomTotal(p_booking_id), br.check_in, b.branch_id 
--     INTO v_room_total, v_check_in, v_branch_id
--     FROM booking b 
--     JOIN booked_room br ON b.booking_id = br.booking_id
--     WHERE b.booking_id = p_booking_id
--     LIMIT 1;
    
--     -- If no booking found, return 0
--     IF v_check_in IS NULL THEN
--         RETURN 0.00;
--     END IF;
    
--     -- Get applicable discount percentage
--     SELECT COALESCE(MAX(d.percentage), 0) INTO v_discount_percentage
--     FROM discount d
--     WHERE d.branch_id = v_branch_id
--     AND d.start_date <= v_check_in
--     AND d.end_date >= v_check_in;
    
--     -- Calculate discounted amount
--     SET v_discounted_amount = v_room_total * (v_discount_percentage / 100);
    
--     -- Return net room total (room total - discount)
--     RETURN v_room_total - v_discounted_amount;
-- END//

-- -- ---------------------------------------------------------------------------------------------------------------
-- -- function returning tax_amount
-- CREATE FUNCTION CalculateTaxAmount(p_booking_id INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE v_net_room_total DECIMAL(10,2);
--     DECLARE v_check_in DATE;
--     DECLARE v_tax_percentage DECIMAL(5,2) DEFAULT 0;
    
--     -- Get net room total and check_in date
--     SELECT CalculateNetRoomTotal(p_booking_id), br.check_in INTO v_net_room_total, v_check_in
--     FROM booking b 
--     JOIN booked_room br ON b.booking_id = br.booking_id
--     WHERE b.booking_id = p_booking_id
--     LIMIT 1;
    
--     -- If no booking found, return 0
--     IF v_check_in IS NULL THEN
--         RETURN 0.00;
--     END IF;
    
--     -- Get tax percentage
--     SELECT COALESCE(tc.latest_tax_percentage, 0) INTO v_tax_percentage
--     FROM taxes_and_charges tc
--     WHERE tc.revision_date <= v_check_in
--     ORDER BY tc.revision_date DESC
--     LIMIT 1;
    
--     -- Calculate tax amount
--     RETURN v_net_room_total * (v_tax_percentage / 100);
-- END//


-- -- ---------------------------------------------------------------------------------------------------------------
-- -- functions required for report 1

-- CREATE FUNCTION GetTotalRooms() 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_count INT;
--     SELECT COUNT(*) INTO total_count FROM room;
--     RETURN total_count;
-- END//

-- CREATE FUNCTION GetTotalRoomsByBranch(branch_id_param INT) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_count INT;
--     SELECT COUNT(*) INTO total_count FROM room WHERE branch_id = branch_id_param;
--     RETURN total_count;
-- END//


-- CREATE FUNCTION GetOccupiedRoomsCount() 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE occupied_count INT;
--     SELECT COUNT(*) INTO occupied_count FROM room WHERE current_status = 'Occupied';
--     RETURN occupied_count;
-- END//



-- CREATE FUNCTION GetAvailableRoomsCount() 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE available_count INT;
--     SELECT COUNT(*) INTO available_count FROM room WHERE current_status = 'Available';
--     RETURN available_count;
-- END//






-- CREATE FUNCTION GetOccupiedRoomsByBranch(branch_id_param INT) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE occupied_count INT;
--     SELECT COUNT(*) INTO occupied_count FROM room WHERE branch_id = branch_id_param AND current_status = 'Occupied';
--     RETURN occupied_count;
-- END//



-- CREATE FUNCTION GetAvailableRoomsByBranch(branch_id_param INT) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE available_count INT;
--     SELECT COUNT(*) INTO available_count FROM room WHERE branch_id = branch_id_param AND current_status = 'Available';
--     RETURN available_count;
-- END//


-- CREATE FUNCTION GetOccupiedRoomsByDateRange(start_date DATE, end_date DATE) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE occupied_count INT;
    
--     SELECT COUNT(DISTINCT room_number) INTO occupied_count
--     FROM booked_room
--     WHERE status != 'Cancelled'
--     AND (
--         (check_in BETWEEN start_date AND end_date) OR
--         (check_out BETWEEN start_date AND end_date) OR
--         (check_in <= start_date AND check_out >= end_date)
--     );
    
--     RETURN occupied_count;
-- END//



-- CREATE FUNCTION GetAvailableRoomsByDateRange(start_date DATE, end_date DATE) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE available_count INT;
    
--     SELECT COUNT(*) INTO available_count
--     FROM room r
--     WHERE r.room_number NOT IN (
--         SELECT DISTINCT br.room_number
--         FROM booked_room br
--         WHERE br.status != 'Cancelled'
--         AND (
--             (br.check_in BETWEEN start_date AND end_date) OR
--             (br.check_out BETWEEN start_date AND end_date) OR
--             (br.check_in <= start_date AND br.check_out >= end_date)
--         )
--     );
    
--     RETURN available_count;
-- END//



-- CREATE FUNCTION GetOccupiedRoomsByDateRangeAndBranch(start_date DATE, end_date DATE, branch_id_param INT) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE occupied_count INT;
    
--     SELECT COUNT(DISTINCT room_number) INTO occupied_count
--     FROM booked_room
--     WHERE branch_id = branch_id_param
--     AND status != 'Cancelled'
--     AND (
--         (check_in BETWEEN start_date AND end_date) OR
--         (check_out BETWEEN start_date AND end_date) OR
--         (check_in <= start_date AND check_out >= end_date)
--     );
    
--     RETURN occupied_count;
-- END//



-- CREATE FUNCTION GetAvailableRoomsByDateRangeAndBranch(start_date DATE, end_date DATE, branch_id_param INT) 
-- RETURNS INT
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE available_count INT;
    
--     SELECT COUNT(*) INTO available_count
--     FROM room r
--     WHERE r.branch_id = branch_id_param
--     AND r.room_number NOT IN (
--         SELECT DISTINCT br.room_number
--         FROM booked_room br
--         WHERE br.branch_id = branch_id_param
--         AND br.status != 'Cancelled'
--         AND (
--             (br.check_in BETWEEN start_date AND end_date) OR
--             (br.check_out BETWEEN start_date AND end_date) OR
--             (br.check_in <= start_date AND br.check_out >= end_date)
--         )
--     );
    
--     RETURN available_count;
-- END//


-- -- -----------------------------------------------------------------------------------------------------------------
-- -- functions required for report 2

-- CREATE FUNCTION GetTotalPaidForCheckedIn() 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_paid DECIMAL(10,2);
--     SELECT SUM(grand_total - due_amount) INTO total_paid FROM bill WHERE bill_status = 'Pending';
--     RETURN COALESCE(total_paid, 0.00);
-- END//



-- CREATE FUNCTION GetTotalDueForCheckedIn() 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_due DECIMAL(10,2);
--     SELECT SUM(due_amount) INTO total_due FROM bill WHERE bill_status = 'Pending';
--     RETURN COALESCE(total_due, 0.00);
-- END//



-- CREATE FUNCTION GetTotalTaxPaidForCheckedIn() 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_tax DECIMAL(10,2);
--     SELECT SUM(tax_amount) INTO total_tax FROM bill WHERE bill_status = 'Pending';
--     RETURN COALESCE(total_tax, 0.00);
-- END//



-- CREATE FUNCTION GetTotalPaidForCheckedInByBranch(branch_id_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_paid DECIMAL(10,2);
    
--     SELECT SUM(b.grand_total - b.due_amount) INTO total_paid
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE b.bill_status = 'Pending'
--     AND bk.branch_id = branch_id_param;
    
--     RETURN COALESCE(total_paid, 0.00);
-- END//


-- CREATE FUNCTION GetTotalDueForCheckedInByBranch(branch_id_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_due DECIMAL(10,2);
    
--     SELECT SUM(b.due_amount) INTO total_due
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE b.bill_status = 'Pending'
--     AND bk.branch_id = branch_id_param;
    
--     RETURN COALESCE(total_due, 0.00);
-- END//


-- CREATE FUNCTION GetTotalGrandTotalForCheckedInByBranch(branch_id_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_grand DECIMAL(10,2);
    
--     SELECT SUM(b.grand_total) INTO total_grand
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE b.bill_status = 'Pending'
--     AND bk.branch_id = branch_id_param;
    
--     RETURN COALESCE(total_grand, 0.00);
-- END//



-- CREATE FUNCTION GetTotalTaxPaidForCheckedInByBranch(branch_id_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_tax DECIMAL(10,2);
    
--     SELECT SUM(b.tax_amount) INTO total_tax
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE b.bill_status = 'Pending'
--     AND bk.branch_id = branch_id_param;
    
--     RETURN COALESCE(total_tax, 0.00);
-- END//



-- -- -----------------------------------------------------------------------------------------------------------
-- -- functions for report 3

-- CREATE FUNCTION CalculateServiceCharges(
--     p_room_number VARCHAR(10),
--     p_service_type VARCHAR(100),
--     p_start_date DATE,
--     p_end_date DATE
-- ) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_charges DECIMAL(10,2) DEFAULT 0;
    
--     SELECT COALESCE(SUM(s.unit_quantity_charges * sr.quantity), 0)
--     INTO total_charges
--     FROM service_request sr
--     JOIN service s ON sr.request_type = s.service_type 
--                    AND sr.branch_id = s.branch_id
--     JOIN booked_room br ON sr.booking_id = br.booking_id 
--     JOIN room r ON br.room_number = r.room_number
--     WHERE r.room_number = p_room_number
--       AND sr.request_type = p_service_type
--       AND DATE(sr.date_time) BETWEEN p_start_date AND p_end_date
--       AND sr.status = 'Completed';
    
--     RETURN total_charges;
-- END//



-- -- -------------------------------------------------------------------------------------------------------------
-- -- for report 4

-- CREATE FUNCTION GetRoomTotalByBranchAndMonth(branch_id_param INT, month_param INT, year_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_room DECIMAL(10,2);
    
--     SELECT COALESCE(SUM(b.room_total), 0) INTO total_room
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE bk.branch_id = branch_id_param
--     AND MONTH(b.bill_date) = month_param
--     AND YEAR(b.bill_date) = year_param;
    
--     RETURN total_room;
-- END//


-- CREATE FUNCTION GetServiceTotalByBranchAndMonth(branch_id_param INT, month_param INT, year_param INT) 
-- RETURNS DECIMAL(10,2)
-- READS SQL DATA
-- DETERMINISTIC
-- BEGIN
--     DECLARE total_service DECIMAL(10,2);
    
--     SELECT COALESCE(SUM(b.service_total), 0) INTO total_service
--     FROM bill b
--     INNER JOIN booking bk ON b.booking_id = bk.booking_id
--     WHERE bk.branch_id = branch_id_param
--     AND MONTH(b.bill_date) = month_param
--     AND YEAR(b.bill_date) = year_param;
    
--     RETURN total_service;
-- END//




-- DELIMITER ;

-- -- --------------------------------------------------------------------
-- -- --------------------------------------------------------------------
-- -- procedure 1.0

-- DELIMITER //

-- CREATE PROCEDURE CreateBookingAtomic(
--     IN p_guest_id INT,
--     IN p_booking_date DATETIME,
--     IN p_branch_id INT,
--     IN p_number_of_pax INT,
--     IN p_check_in DATE,
--     IN p_check_out DATE,
--     IN p_room_requests JSON,  -- JSON array: [{room_type, quantity}, ...]
--     OUT p_result_message VARCHAR(255),
--     OUT p_booking_id INT
-- )
-- proc_main: BEGIN
--     DECLARE v_index INT DEFAULT 0;
--     DECLARE v_count INT;
--     DECLARE v_room_type VARCHAR(50);
--     DECLARE v_quantity INT;
--     DECLARE v_available INT;
--     DECLARE v_total_rooms INT DEFAULT 0;

--     DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SET p_result_message = 'Unexpected database error';
--         SET p_booking_id = NULL;
--     END;

--     START TRANSACTION;

--     -- Count how many requests
--     SET v_count = JSON_LENGTH(p_room_requests);

--     IF v_count = 0 THEN
--         ROLLBACK;
--         SET p_result_message = 'No room requests provided';
--         SET p_booking_id = NULL;
--         LEAVE proc_main;
--     END IF;

--     -- Step 1: Check availability for all requests
--     room_check_loop: WHILE v_index < v_count DO
--         SET v_room_type = JSON_UNQUOTE(JSON_EXTRACT(p_room_requests, CONCAT('$[', v_index, '].room_type')));
--         SET v_quantity  = JSON_UNQUOTE(JSON_EXTRACT(p_room_requests, CONCAT('$[', v_index, '].quantity')));

--         SET v_total_room$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.s = v_total_rooms + v_quantity;

--         SELECT COUNT(*) INTO v_available
--         FROM room r
--         WHERE r.branch_id = p_branch_id
--           AND r.room_type = v_room_type
--           AND r.current_status = 'Available'
--           AND r.room_number NOT IN (
--               SELECT br.room_number
--               FROM booked_room br
--               WHERE br.branch_id = p_branch_id
--                 AND br.status NOT IN ('Cancelled', 'CheckedOut')
--                 AND (p_check_in < br.check_out AND p_check_out > br.check_in)
--           )
--         FOR UPDATE;

--         IF v_available < v_quantity THEN
--             ROLLBACK;
--             SET p_result_message = CONCAT('Not enough ', v_room_type,
--                                           ' rooms. Required: ', v_quantity,
--                                           ', Available: ', v_available);
--             SET p_booking_id = NULL;
--             LEAVE proc_main;
--         END IF;

--         SET v_index = v_index + 1;
--     END WHILE;

--     -- Step 2: Insert booking record
--     INSERT INTO booking (guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status)
--     VALUES (p_guest_id, p_booking_date, p_branch_id, v_total_rooms, p_number_of_pax, 'Confirmed');

--     SET p_booking_id = LAST_INSERT_ID();

--     -- Step 3: Assign rooms
--     SET v_index = 0;
--     room_assign_loop: WHILE v_index < v_count DO
--         SET v_room_type = JSON_UNQUOTE(JSON_EXTRACT(p_room_requests, CONCAT('$[', v_index, '].room_type')));
--         SET v_quantity  = JSON_UNQUOTE(JSON_EXTRACT(p_room_requests, CONCAT('$[', v_index, '].quantity')));

--         INSERT INTO booked_room (room_number, booking_id, branch_id, check_in, check_out, status)
--         SELECT r.room_number, p_booking_id, p_branch_id, p_check_in, p_check_out, 'Confirmed'
--         FROM room r
--         WHERE r.branch_id = p_branch_id
--           AND r.room_type = v_room_type
--           AND r.current_status = 'Available'
--           AND r.room_number NOT IN (
--               SELECT br.room_number
--               FROM booked_room br
--               WHERE br.branch_id = p_branch_id
--                 AND br.status NOT IN ('Cancelled', 'CheckedOut')
--                 AND (p_check_in < br.check_out AND p_check_out > br.check_in)
--           )
--         LIMIT v_quantity;

--         -- UPDATE room r
--         -- JOIN booked_room br ON r.room_number = br.room_number AND r.branch_id = br.branch_id
--         -- SET r.current_status = 'Confirmed'
--         -- WHERE br.booking_id = p_booking_id
--         --   AND br.branch_id = p_branch_id;

--         SET v_index = v_index + 1;
--     END WHILE;

--     COMMIT;
--     SET p_result_message = CONCAT('Booking successful. Booking ID: ', p_booking_id);
-- END //

-- DELIMITER ;
-- -- Trigger 1: Update room status to 'Occupied' when booked_room status becomes 'CheckedIn'
-- DELIMITER $$

-- CREATE TRIGGER after_booked_room_checkedin
-- AFTER UPDATE ON Booked_Room
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedIn' AND (OLD.status IS NULL OR OLD.status != 'CheckedIn') THEN
--         UPDATE Room 
--         SET current_status = 'Occupied' 
--         WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
--     END IF;
-- END$$

-- DELIMITER ;


-- Trigger 2/a: Update room status to 'Available' when booked_room status becomes 'CheckedOut'
-- DELIMITER $$

-- CREATE TRIGGER after_booked_room_checkedout
-- AFTER UPDATE ON Booked_Room
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedOut' AND (OLD.status IS NULL OR OLD.status != 'CheckedOut') THEN
--         UPDATE room 
--         SET current_status = 'Available' 
--         WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
--     END IF;
-- END$$

-- DELIMITER ;


-- Trigger 3: When booking status = 'Cancelled' Booked_rooms also change to cancelled state.

-- DELIMITER //

-- CREATE TRIGGER after_booking_cancelled
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
--         UPDATE booked_room 
--         SET status = 'Cancelled'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- --Trigger 4: When booking status = 'Checkedin' Booked_rooms also change to checked in state.

-- DELIMITER //

-- CREATE TRIGGER after_booking_checkedin
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
--         UPDATE Booked_Room 
--         SET status = 'CheckedIn'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- --Trigger 5: When booking status = 'Checkedout' Booked_rooms also change to checkedout state.
-- DELIMITER //

-- CREATE TRIGGER after_booking_checkedout
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedOut' AND OLD.status != 'CheckedOut' THEN
--         UPDATE Booked_oom 
--         SET status = 'CheckedOut'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- Trigger 6: Create Bill when booking status = 'CheckedIn' - more sophisticated
-- DELIMITER //

-- CREATE TRIGGER initialize_bill_on_checkin
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     DECLARE v_room_total DECIMAL(10,2);
--     DECLARE v_tax_amount DECIMAL(10,2);
--     DECLARE v_grand_total DECIMAL(10,2);
    
--     IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
--         -- Calculate room total and tax amount using your functions
--         SET v_room_total = CalculateNetRoomTotal(NEW.booking_id);
--         SET v_tax_amount = CalculateTaxAmount(NEW.booking_id);
--         SET v_grand_total = v_room_total + v_tax_amount;
        
--         -- Insert a new bill record with calculated amounts
--         INSERT INTO Bill (
--             bill_date, 
--             booking_id,
--             room_total, 
--             service_total,
--             tax_amount,
--             due_amount,
--             bill_status
--         )
--         VALUES (
--             DATE(NOW()), 
--             NEW.booking_id, 
--             v_room_total,
--             0.00,
--             v_tax_amount,
--             v_grand_total,  -- due_amount = grand_total initially
--             'Pending'
--         );
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -------------------------------------------------

-- DELIMITER //

-- CREATE TRIGGER update_bill_service_total 
-- AFTER UPDATE ON Service_Request
-- FOR EACH ROW
-- BEGIN
--      DECLARE service_charge DECIMAL(10,2);
--      DECLARE current_service_total DECIMAL(10,2);
--      DECLARE current_room_total DECIMAL(10,2);
--      DECLARE current_due_amount DECIMAL(10,2);
--      DECLARE tax_percentage DECIMAL(10,2);
--      DECLARE new_service_total DECIMAL(10,2);
--      DECLARE new_tax_amount DECIMAL(10,2);
--      DECLARE service_increase DECIMAL(10,2);
--      DECLARE tax_increase DECIMAL(10,2);
--      DECLARE total_increase DECIMAL(10,2);
     
--      -- Check if status changed to 'Completed'
--      IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
         
--          -- Calculate the service charge for this completed service
--          SELECT unit_quantity_charges INTO service_charge
--          FROM service 
--          WHERE service_type = NEW.request_type 
--          AND service.branch_id = NEW.branch_id;
         
--          -- If service charge found, update the bill
--          IF service_charge IS NOT NULL THEN
--              -- Get current values from bill
--              SELECT service_total, room_total, due_amount 
--              INTO current_service_total, current_room_total, current_due_amount
--              FROM bill 
--              WHERE booking_id = NEW.booking_id;
             
--              -- Get the latest tax percentage
--              SELECT latest_tax_percentage 
--              INTO tax_percentage
--              FROM taxes_and_charges 
--              ORDER BY revision_date DESC 
--              LIMIT 1;
             
--              -- If tax percentage not found, set default to 0
--              IF tax_percentage IS NULL THEN
--                  SET tax_percentage = 0;
--              END IF;
             
--              -- Calculate the increase amounts
--              SET service_increase = service_charge * NEW.quantity;
--              SET new_service_total = current_service_total + service_increase;
             
--              -- Calculate tax increase for the new service amount
--              SET tax_increase = service_increase * tax_percentage / 100;
--              SET new_tax_amount = (current_room_total + new_service_total) * tax_percentage / 100;
             
--              -- Calculate total amount to add to due_amount
--              SET total_increase = service_increase + tax_increase;
             
--              -- Update service_total, tax_amount, and due_amount
--              UPDATE bill
--              SET service_total = new_service_total,
--                  tax_amount = new_tax_amount,
--                  due_amount = current_due_amount + total_increase
--              WHERE booking_id = NEW.booking_id;
--          END IF;
--      END IF;
--  END//

-- DELIMITER ;


-- ----------------------------------------------------------------------
-- error handling in bill status = (paid with >0 due_amount)

-- DELIMITER //

-- CREATE TRIGGER update_bill_status_on_due_amount
-- BEFORE UPDATE ON Bill
-- FOR EACH ROW
-- BEGIN
--     -- Check if due_amount is being updated and becomes greater than 0
--     IF NEW.due_amount > 0 AND (OLD.due_amount <= 0 OR OLD.due_amount IS NULL) THEN
--         SET NEW.bill_status = 'Pending';
--     END IF;
-- END//

-- DELIMITER ;

-- ----------------------------------------------------------------------------------------------
-- this view used in ViewDueServices.js in Service Office End

-- CREATE VIEW DueServicesView AS
-- SELECT 
--     sr.service_request_id,
--     sr.request_type,
--     sr.date_time,
--     sr.room_number,
--     sr.status,
--     sr.booking_id,
--     sr.quantity,
--     sr.branch_id
-- FROM Service_Request sr
-- LEFT JOIN Service s ON sr.request_type = s.service_type AND sr.branch_id = s.branch_id
-- WHERE sr.status = 'Request Placed'
-- ORDER BY sr.date_time ASC;

-- -------------------------------------

-- CREATE VIEW view_all_rooms AS
-- SELECT 
--     r.room_number
-- FROM Room r;

-- -------------------------------------

-- CREATE VIEW view_all_services AS
-- SELECT distinct s.service_type
-- FROM Service s;

-- -- -------------------------------------

-- CREATE VIEW view_all_branches AS
-- SELECT distinct b.branch_name 
-- FROM Branch b;

-- -------------------------------------

-- CREATE VIEW latest_tax_percentage AS
-- SELECT 
--     latest_tax_percentage
-- FROM Taxes_and_Charges
-- WHERE revision_id = (
--     SELECT revision_id 
--     FROM Taxes_and_Charges 
--     WHERE revision_date IS NOT NULL 
--     ORDER BY revision_date DESC 
--     LIMIT 1
-- );


-- DROP PROCEDURE IF EXISTS ViewGuestDetails;
-- DELIMITER //
-- CREATE PROCEDURE ViewGuestDetails(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT 
--         g.guest_id, g.first_name, g.last_name, g.email,
--         g.phone_number, g.address, g.passport_number, g.country_of_residence
--     FROM Booking bk
--     JOIN Guest g ON bk.guest_id = g.guest_id
--     WHERE bk.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Branch Details
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewBranchDetails;
-- DELIMITER //
-- CREATE PROCEDURE ViewBranchDetails(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT
--         br.branch_id,
--         br.branch_name,
--         br.address AS branch_address,
--         br.city AS branch_city,
--         br.contact_number AS branch_contact
--     FROM Booking bk
--     JOIN Branch br ON bk.branch_id = br.branch_id
--     WHERE bk.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Bill Details
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewBillDetails;
-- DELIMITER //
-- CREATE PROCEDURE ViewBillDetails(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT
--         b.bill_id,
--         b.bill_date,
--         b.room_total,
--         b.service_total,
--         b.sub_total,
--         b.tax_amount,
--         b.grand_total,
--         b.due_amount,
--         b.bill_status
--     FROM Booking bk
--     LEFT JOIN Bill b ON bk.booking_id = b.booking_id
--     WHERE bk.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Booking Details
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewBookingDetails;
-- DELIMITER //
-- CREATE PROCEDURE ViewBookingDetails(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT
--         bk.booking_id,
--         bk.booking_date
--     FROM Booking bk
--     WHERE bk.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Room Charges
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewRoomCharges;
-- DELIMITER //
-- CREATE PROCEDURE ViewRoomCharges(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT 
--         br.room_number,
--         r.room_type,
--         rt.base_price,
--         br.check_in,
--         br.check_out,
--         DATEDIFF(br.check_out, br.check_in) AS nights,
--         COALESCE(d.percentage, 0) AS discount_percentage,
--         rt.base_price * DATEDIFF(br.check_out, br.check_in) AS base_charge,
--         rt.base_price * DATEDIFF(br.check_out, br.check_in) * (1 - COALESCE(d.percentage, 0) / 100) AS final_room_charge
--     FROM Booked_Room br
--     JOIN Room r ON br.room_number = r.room_number
--     JOIN RoomType rt ON r.room_type = rt.type_name
--     LEFT JOIN Discount d ON d.branch_id = br.branch_id 
--         AND (d.room_type = r.room_type OR d.room_type IS NULL)
--         AND d.start_date <= br.check_in 
--         AND d.end_date >= br.check_out
--     WHERE br.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Service Charges
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewServiceCharges;
-- DELIMITER //
-- CREATE PROCEDURE ViewServiceCharges(IN p_booking_id SMALLINT)
-- BEGIN
--     SELECT 
--         sr.service_request_id,
--         sr.request_type,
--         sr.quantity,
--         s.unit_quantity_charges,
--         sr.date_time,
--         (sr.quantity * s.unit_quantity_charges) AS total_service_charge
--     FROM Service_Request sr
--     JOIN Service s ON sr.request_type = s.service_type 
--         AND sr.branch_id = s.branch_id
--     WHERE sr.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;

-- -- ============================================================
-- -- 🔧 Stored Procedure: View Payment and Summary
-- -- ============================================================
-- DROP PROCEDURE IF EXISTS ViewPaymentAndSummary;
-- DELIMITER //
-- CREATE PROCEDURE ViewPaymentAndSummary(IN p_booking_id SMALLINT)
-- BEGIN
--     -- Payment history
--     SELECT 
--         p.payment_reference,
--         p.payment_method,
--         p.paid_amount,
--         p.payment_date
--     FROM Payment p
--     JOIN Bill b ON p.bill_id = b.bill_id
--     WHERE b.booking_id = p_booking_id
--     ORDER BY p.payment_date DESC;

--     -- Summary totals
--     SELECT 
--         b.room_total,
--         b.service_total,
--         b.sub_total,
--         b.tax_amount,
--         b.grand_total,
--         b.due_amount,
--         (SELECT COALESCE(SUM(p.paid_amount), 0)
--          FROM Payment p
--          WHERE p.bill_id = b.bill_id) AS total_paid,
--         b.bill_status
--     FROM Bill b
--     WHERE b.booking_id = p_booking_id;
-- END;
-- //
-- DELIMITER ;







-- INSERT INTO Guest_User (guest_id, username, password) VALUES
-- (2, 'emma_st', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.'),
-- (3, 'ravi_p', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.');

-- DELETE FROM Booked_Room
-- WHERE room_number = 101;


-- INSERT INTO Booking (guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES
-- (1, '2025-10-10 10:00:00', 1, 1, 1, 'Confirmed'),
-- (2, '2025-10-12 15:30:00', 2, 1, 2, 'CheckedIn'),
-- (3, '2025-10-14 12:45:00', 3, 1, 1, 'Confirmed');

-- INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES
-- (101, 101, 1, '2025-10-15', '2025-10-18', 'Pending'),
-- (205, 101, 2, '2025-10-13', '2025-10-16', 'Pending'),
-- (301, 102, 3, '2025-10-20', '2025-10-22', 'Pending');


-- -- ============================================================
-- -- 🔧 HOTEL MANAGEMENT SYSTEM TRIGGERS (Linux Compatible)
-- -- All table names match the schema exactly (case-sensitive)
-- -- Each trigger is dropped first to avoid duplication errors
-- -- ============================================================

-- -- ------------------------------------------------------------
-- -- Trigger 1: Update Room status to 'Occupied' when Booked_Room status becomes 'CheckedIn'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS after_booked_room_checkedin;
-- DELIMITER $$

-- CREATE TRIGGER after_booked_room_checkedin
-- AFTER UPDATE ON Booked_Room
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedIn' AND (OLD.status IS NULL OR OLD.status != 'CheckedIn') THEN
--         UPDATE Room 
--         SET current_status = 'Occupied' 
--         WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
--     END IF;
-- END$$

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 2: Update Room status to 'Available' when Booked_Room status becomes 'CheckedOut'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS after_booked_room_checkedout;
-- DELIMITER $$

-- CREATE TRIGGER after_booked_room_checkedout
-- AFTER UPDATE ON Booked_Room
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedOut' AND (OLD.status IS NULL OR OLD.status != 'CheckedOut') THEN
--         UPDATE Room 
--         SET current_status = 'Available' 
--         WHERE room_number = NEW.room_number AND branch_id = NEW.branch_id;
--     END IF;
-- END$$

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 3: When Booking is 'Cancelled', update Booked_Room status to 'Cancelled'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS after_booking_cancelled;
-- DELIMITER //

-- CREATE TRIGGER after_booking_cancelled
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
--         UPDATE Booked_Room 
--         SET status = 'Cancelled'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 4: When Booking is 'CheckedIn', update Booked_Room status to 'CheckedIn'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS after_booking_checkedin;
-- DELIMITER //

-- CREATE TRIGGER after_booking_checkedin
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
--         UPDATE Booked_Room 
--         SET status = 'CheckedIn'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 5: When Booking is 'CheckedOut', update Booked_Room status to 'CheckedOut'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS after_booking_checkedout;
-- DELIMITER //

-- CREATE TRIGGER after_booking_checkedout
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'CheckedOut' AND OLD.status != 'CheckedOut' THEN
--         UPDATE Booked_Room 
--         SET status = 'CheckedOut'
--         WHERE booking_id = NEW.booking_id;
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 6: Automatically create a Bill when Booking becomes 'CheckedIn'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS initialize_bill_on_checkin;
-- DELIMITER //

-- CREATE TRIGGER initialize_bill_on_checkin
-- AFTER UPDATE ON Booking
-- FOR EACH ROW
-- BEGIN
--     DECLARE v_room_total DECIMAL(10,2);
--     DECLARE v_tax_amount DECIMAL(10,2);
--     DECLARE v_grand_total DECIMAL(10,2);
    
--     IF NEW.status = 'CheckedIn' AND OLD.status != 'CheckedIn' THEN
--         -- Calculate room total and tax using user-defined functions
--         SET v_room_total = CalculateNetRoomTotal(NEW.booking_id);
--         SET v_tax_amount = CalculateTaxAmount(NEW.booking_id);
--         SET v_grand_total = v_room_total + v_tax_amount;
        
--         -- Insert a new Bill record
--         INSERT INTO Bill (
--             bill_date, 
--             booking_id,
--             room_total, 
--             service_total,
--             tax_amount,
--             due_amount,
--             bill_status
--         )
--         VALUES (
--             DATE(NOW()), 
--             NEW.booking_id, 
--             v_room_total,
--             0.00,
--             v_tax_amount,
--             v_grand_total,
--             'Pending'
--         );
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 7: Update Bill totals when Service_Request status becomes 'Completed'
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS update_bill_service_total;
-- DELIMITER //

-- CREATE TRIGGER update_bill_service_total 
-- AFTER UPDATE ON Service_Request
-- FOR EACH ROW
-- BEGIN
--      DECLARE service_charge DECIMAL(10,2);
--      DECLARE current_service_total DECIMAL(10,2);
--      DECLARE current_room_total DECIMAL(10,2);
--      DECLARE current_due_amount DECIMAL(10,2);
--      DECLARE tax_percentage DECIMAL(10,2);
--      DECLARE new_service_total DECIMAL(10,2);
--      DECLARE new_tax_amount DECIMAL(10,2);
--      DECLARE service_increase DECIMAL(10,2);
--      DECLARE tax_increase DECIMAL(10,2);
--      DECLARE total_increase DECIMAL(10,2);
     
--      IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
         
--          -- Find the charge for this service
--          SELECT unit_quantity_charges INTO service_charge
--          FROM Service 
--          WHERE service_type = NEW.request_type 
--            AND Service.branch_id = NEW.branch_id;
         
--          IF service_charge IS NOT NULL THEN
--              -- Get current Bill values
--              SELECT service_total, room_total, due_amount 
--              INTO current_service_total, current_room_total, current_due_amount
--              FROM Bill 
--              WHERE booking_id = NEW.booking_id;
             
--              -- Get latest tax percentage
--              SELECT latest_tax_percentage 
--              INTO tax_percentage
--              FROM Taxes_and_Charges 
--              ORDER BY revision_date DESC 
--              LIMIT 1;
             
--              IF tax_percentage IS NULL THEN
--                  SET tax_percentage = 0;
--              END IF;
             
--              -- Calculate new totals
--              SET service_increase = service_charge * NEW.quantity;
--              SET new_service_total = current_service_total + service_increase;
--              SET tax_increase = service_increase * tax_percentage / 100;
--              SET new_tax_amount = (current_room_total + new_service_total) * tax_percentage / 100;
--              SET total_increase = service_increase + tax_increase;
             
--              -- Update Bill
--              UPDATE Bill
--              SET service_total = new_service_total,
--                  tax_amount = new_tax_amount,
--                  due_amount = current_due_amount + total_increase
--              WHERE booking_id = NEW.booking_id;
--          END IF;
--      END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 8: Update Bill status automatically when due_amount > 0
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS update_bill_status_on_due_amount;
-- DELIMITER //

-- CREATE TRIGGER update_bill_status_on_due_amount
-- BEFORE UPDATE ON Bill
-- FOR EACH ROW
-- BEGIN
--     IF NEW.due_amount > 0 AND (OLD.due_amount <= 0 OR OLD.due_amount IS NULL) THEN
--         SET NEW.bill_status = 'Pending';
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- -- ============================================================
-- -- ✅ All triggers recreated successfully with correct casing
-- -- ============================================================

-- DELIMITER $$

-- CREATE TRIGGER after_booking_cancelled_update_room_status
-- AFTER UPDATE ON Booked_Room
-- FOR EACH ROW
-- BEGIN
--     -- Check if the status changed to 'Cancelled'
--     IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
--         -- Update the room to Available
--         UPDATE Room
--         SET current_status = 'Available'
--         WHERE room_number = NEW.room_number
--           AND branch_id = NEW.branch_id;
--     END IF;
-- END$$

-- DELIMITER ;

-- -- ------------------------------------------------------------
-- -- Trigger 8: Update Bill status automatically when due_amount == 0
-- -- ------------------------------------------------------------
-- DROP TRIGGER IF EXISTS update_bill_status_on_due_amount_become_zero;
-- DELIMITER //

-- CREATE TRIGGER update_bill_status_on_due_amount_become_zero
-- BEFORE UPDATE ON Bill
-- FOR EACH ROW
-- BEGIN
--     IF NEW.due_amount = 0 AND (OLD.due_amount > 0 ) THEN
--         SET NEW.bill_status = 'Paid';
--     END IF;
-- END;
-- //

-- DELIMITER ;

-- DELIMITER //

-- CREATE TRIGGER trg_update_bill_after_payment_delete
-- AFTER DELETE ON Payment
-- FOR EACH ROW
-- BEGIN
--     DECLARE total_paid DECIMAL(10,2);
--     DECLARE room_total DECIMAL(10,2);
--     DECLARE service_total DECIMAL(10,2);
--     DECLARE tax_amount DECIMAL(10,2);
--     DECLARE original_total DECIMAL(10,2);
--     DECLARE new_due DECIMAL(10,2);

--     -- Get current bill details
--     SELECT room_total, service_total, tax_amount
--     INTO room_total, service_total, tax_amount
--     FROM Bill
--     WHERE bill_id = OLD.bill_id;

--     SET original_total = COALESCE(room_total,0) + COALESCE(service_total,0) + COALESCE(tax_amount,0);

--     -- Sum of remaining payments
--     SELECT COALESCE(SUM(paid_amount),0)
--     INTO total_paid
--     FROM Payment
--     WHERE bill_id = OLD.bill_id;

--     -- Calculate new due
--     SET new_due = original_total - total_paid;

--     -- Update Bill table
--     UPDATE Bill
--     SET due_amount = new_due,
--         bill_status = CASE 
--                         WHEN new_due <= 0 THEN 'Paid'
--                         ELSE 'Pending'
--                       END
--     WHERE bill_id = OLD.bill_id;
-- END;
-- //

-- DELIMITER ;

-- =================================================================================================
-- 🔧 HOTEL MANAGEMENT SYSTEM FUNCTIONS (Linux Compatible, Case-Sensitive)
-- Each function is dropped first to avoid duplication errors
-- All table and column names match schema exactly
-- =================================================================================================

DELIMITER //

-- -------------------------------------------------------------------------------------------------
-- Function 1: CalculateRoomTotal
-- -------------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS CalculateRoomTotal;
CREATE FUNCTION CalculateRoomTotal(p_booking_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_price DECIMAL(10,2);
    
    SELECT COALESCE(SUM(rt.base_price * DATEDIFF(br.check_out, br.check_in)), 0)
    INTO total_price
    FROM Booking b
    INNER JOIN Booked_Room br ON b.booking_id = br.booking_id
    INNER JOIN Room r ON br.room_number = r.room_number
    INNER JOIN RoomType rt ON r.room_type = rt.type_name
    WHERE b.booking_id = p_booking_id
      AND br.status != 'Cancelled';
    
    RETURN total_price;
END//

-- -------------------------------------------------------------------------------------------------
-- Function 2: CalculateNetRoomTotal
-- -------------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS CalculateNetRoomTotal;
CREATE FUNCTION CalculateNetRoomTotal(p_booking_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_room_total DECIMAL(10,2);
    DECLARE v_check_in DATE;
    DECLARE v_branch_id INT;
    DECLARE v_discount_percentage DECIMAL(5,2) DEFAULT 0;
    DECLARE v_discounted_amount DECIMAL(10,2);
    
    SELECT CalculateRoomTotal(p_booking_id), br.check_in, b.branch_id 
    INTO v_room_total, v_check_in, v_branch_id
    FROM Booking b 
    JOIN Booked_Room br ON b.booking_id = br.booking_id
    WHERE b.booking_id = p_booking_id
    LIMIT 1;
    
    IF v_check_in IS NULL THEN
        RETURN 0.00;
    END IF;
    
    SELECT COALESCE(MAX(d.percentage), 0) 
    INTO v_discount_percentage
    FROM Discount d
    WHERE d.branch_id = v_branch_id
      AND d.start_date <= v_check_in
      AND d.end_date >= v_check_in;
    
    SET v_discounted_amount = v_room_total * (v_discount_percentage / 100);
    
    RETURN v_room_total - v_discounted_amount;
END//

-- -------------------------------------------------------------------------------------------------
-- Function 3: CalculateTaxAmount
-- -------------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS CalculateTaxAmount;
CREATE FUNCTION CalculateTaxAmount(p_booking_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_net_room_total DECIMAL(10,2);
    DECLARE v_check_in DATE;
    DECLARE v_tax_percentage DECIMAL(5,2) DEFAULT 0;
    
    SELECT CalculateNetRoomTotal(p_booking_id), br.check_in 
    INTO v_net_room_total, v_check_in
    FROM Booking b 
    JOIN Booked_Room br ON b.booking_id = br.booking_id
    WHERE b.booking_id = p_booking_id
    LIMIT 1;
    
    IF v_check_in IS NULL THEN
        RETURN 0.00;
    END IF;
    
    SELECT COALESCE(tc.latest_tax_percentage, 0) 
    INTO v_tax_percentage
    FROM Taxes_and_Charges tc
    WHERE tc.revision_date <= v_check_in
    ORDER BY tc.revision_date DESC
    LIMIT 1;
    
    RETURN v_net_room_total * (v_tax_percentage / 100);
END//

-- =================================================================================================
-- 🧾 REPORT 1: Room Statistics
-- =================================================================================================

DROP FUNCTION IF EXISTS GetTotalRooms;
CREATE FUNCTION GetTotalRooms() 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_count INT;
    SELECT COUNT(*) INTO total_count FROM Room;
    RETURN total_count;
END//

DROP FUNCTION IF EXISTS GetTotalRoomsByBranch;
CREATE FUNCTION GetTotalRoomsByBranch(branch_id_param INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_count INT;
    SELECT COUNT(*) INTO total_count FROM Room WHERE branch_id = branch_id_param;
    RETURN total_count;
END//

DROP FUNCTION IF EXISTS GetOccupiedRoomsCount;
CREATE FUNCTION GetOccupiedRoomsCount() 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE occupied_count INT;
    SELECT COUNT(*) INTO occupied_count FROM Room WHERE current_status = 'Occupied';
    RETURN occupied_count;
END//

DROP FUNCTION IF EXISTS GetAvailableRoomsCount;
CREATE FUNCTION GetAvailableRoomsCount() 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE available_count INT;
    SELECT COUNT(*) INTO available_count FROM Room WHERE current_status = 'Available';
    RETURN available_count;
END//

DROP FUNCTION IF EXISTS GetOccupiedRoomsByBranch;
CREATE FUNCTION GetOccupiedRoomsByBranch(branch_id_param INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE occupied_count INT;
    SELECT COUNT(*) INTO occupied_count 
    FROM Room 
    WHERE branch_id = branch_id_param 
      AND current_status = 'Occupied';
    RETURN occupied_count;
END//

DROP FUNCTION IF EXISTS GetAvailableRoomsByBranch;
CREATE FUNCTION GetAvailableRoomsByBranch(branch_id_param INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE available_count INT;
    SELECT COUNT(*) INTO available_count 
    FROM Room 
    WHERE branch_id = branch_id_param 
      AND current_status = 'Available';
    RETURN available_count;
END//

DROP FUNCTION IF EXISTS GetOccupiedRoomsByDateRange;
CREATE FUNCTION GetOccupiedRoomsByDateRange(start_date DATE, end_date DATE) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE occupied_count INT;
    
    SELECT COUNT(DISTINCT room_number) INTO occupied_count
    FROM Booked_Room
    WHERE status != 'Cancelled'
      AND (
            (check_in BETWEEN start_date AND end_date) OR
            (check_out BETWEEN start_date AND end_date) OR
            (check_in <= start_date AND check_out >= end_date)
          );
    RETURN occupied_count;
END//

DROP FUNCTION IF EXISTS GetAvailableRoomsByDateRange;
CREATE FUNCTION GetAvailableRoomsByDateRange(start_date DATE, end_date DATE) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE available_count INT;
    
    SELECT COUNT(*) INTO available_count
    FROM Room r
    WHERE r.room_number NOT IN (
        SELECT DISTINCT br.room_number
        FROM Booked_Room br
        WHERE br.status != 'Cancelled'
          AND (
                (br.check_in BETWEEN start_date AND end_date) OR
                (br.check_out BETWEEN start_date AND end_date) OR
                (br.check_in <= start_date AND br.check_out >= end_date)
              )
    );
    
    RETURN available_count;
END//

DROP FUNCTION IF EXISTS GetOccupiedRoomsByDateRangeAndBranch;
CREATE FUNCTION GetOccupiedRoomsByDateRangeAndBranch(start_date DATE, end_date DATE, branch_id_param INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE occupied_count INT;
    
    SELECT COUNT(DISTINCT room_number) INTO occupied_count
    FROM Booked_Room
    WHERE branch_id = branch_id_param
      AND status != 'Cancelled'
      AND (
            (check_in BETWEEN start_date AND end_date) OR
            (check_out BETWEEN start_date AND end_date) OR
            (check_in <= start_date AND check_out >= end_date)
          );
    
    RETURN occupied_count;
END//

DROP FUNCTION IF EXISTS GetAvailableRoomsByDateRangeAndBranch;
CREATE FUNCTION GetAvailableRoomsByDateRangeAndBranch(start_date DATE, end_date DATE, branch_id_param INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE available_count INT;
    
    SELECT COUNT(*) INTO available_count
    FROM Room r
    WHERE r.branch_id = branch_id_param
      AND r.room_number NOT IN (
          SELECT DISTINCT br.room_number
          FROM Booked_Room br
          WHERE br.branch_id = branch_id_param
            AND br.status != 'Cancelled'
            AND (
                  (br.check_in BETWEEN start_date AND end_date) OR
                  (br.check_out BETWEEN start_date AND end_date) OR
                  (br.check_in <= start_date AND br.check_out >= end_date)
                )
      );
    
    RETURN available_count;
END//

-- =================================================================================================
-- 🧾 REPORT 2: Billing Summary (Checked-In Bookings)
-- =================================================================================================

DROP FUNCTION IF EXISTS GetTotalPaidForCheckedIn;
CREATE FUNCTION GetTotalPaidForCheckedIn() 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_paid DECIMAL(10,2);
    SELECT SUM(grand_total - due_amount) INTO total_paid FROM Bill WHERE bill_status = 'Pending';
    RETURN COALESCE(total_paid, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalDueForCheckedIn;
CREATE FUNCTION GetTotalDueForCheckedIn() 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_due DECIMAL(10,2);
    SELECT SUM(due_amount) INTO total_due FROM Bill WHERE bill_status = 'Pending';
    RETURN COALESCE(total_due, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalTaxPaidForCheckedIn;
CREATE FUNCTION GetTotalTaxPaidForCheckedIn() 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_tax DECIMAL(10,2);
    SELECT SUM(tax_amount) INTO total_tax FROM Bill WHERE bill_status = 'Pending';
    RETURN COALESCE(total_tax, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalPaidForCheckedInByBranch;
CREATE FUNCTION GetTotalPaidForCheckedInByBranch(branch_id_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_paid DECIMAL(10,2);
    
    SELECT SUM(b.grand_total - b.due_amount) INTO total_paid
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE b.bill_status = 'Pending'
      AND bk.branch_id = branch_id_param;
    
    RETURN COALESCE(total_paid, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalDueForCheckedInByBranch;
CREATE FUNCTION GetTotalDueForCheckedInByBranch(branch_id_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_due DECIMAL(10,2);
    
    SELECT SUM(b.due_amount) INTO total_due
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE b.bill_status = 'Pending'
      AND bk.branch_id = branch_id_param;
    
    RETURN COALESCE(total_due, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalGrandTotalForCheckedInByBranch;
CREATE FUNCTION GetTotalGrandTotalForCheckedInByBranch(branch_id_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_grand DECIMAL(10,2);
    
    SELECT SUM(b.grand_total) INTO total_grand
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE b.bill_status = 'Pending'
      AND bk.branch_id = branch_id_param;
    
    RETURN COALESCE(total_grand, 0.00);
END//

DROP FUNCTION IF EXISTS GetTotalTaxPaidForCheckedInByBranch;
CREATE FUNCTION GetTotalTaxPaidForCheckedInByBranch(branch_id_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_tax DECIMAL(10,2);
    
    SELECT SUM(b.tax_amount) INTO total_tax
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE b.bill_status = 'Pending'
      AND bk.branch_id = branch_id_param;
    
    RETURN COALESCE(total_tax, 0.00);
END//

-- =================================================================================================
-- 🧾 REPORT 3: Service Charges
-- =================================================================================================

DROP FUNCTION IF EXISTS CalculateServiceCharges;
CREATE FUNCTION CalculateServiceCharges(
    p_room_number VARCHAR(10),
    p_service_type VARCHAR(100),
    p_start_date DATE,
    p_end_date DATE
) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_charges DECIMAL(10,2) DEFAULT 0;
    
    SELECT COALESCE(SUM(s.unit_quantity_charges * sr.quantity), 0)
    INTO total_charges
    FROM Service_Request sr
    JOIN Service s ON sr.request_type = s.service_type 
                  AND sr.branch_id = s.branch_id
    JOIN Booked_Room br ON sr.booking_id = br.booking_id 
    JOIN Room r ON br.room_number = r.room_number
    WHERE r.room_number = p_room_number
      AND sr.request_type = p_service_type
      AND DATE(sr.date_time) BETWEEN p_start_date AND p_end_date
      AND sr.status = 'Completed';
    
    RETURN total_charges;
END//

-- =================================================================================================
-- 🧾 REPORT 4: Monthly Revenue
-- =================================================================================================

DROP FUNCTION IF EXISTS GetRoomTotalByBranchAndMonth;
CREATE FUNCTION GetRoomTotalByBranchAndMonth(branch_id_param INT, month_param INT, year_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_room DECIMAL(10,2);
    
    SELECT COALESCE(SUM(b.room_total), 0) INTO total_room
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE bk.branch_id = branch_id_param
      AND MONTH(b.bill_date) = month_param
      AND YEAR(b.bill_date) = year_param;
    
    RETURN total_room;
END//

DROP FUNCTION IF EXISTS GetServiceTotalByBranchAndMonth;
CREATE FUNCTION GetServiceTotalByBranchAndMonth(branch_id_param INT, month_param INT, year_param INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_service DECIMAL(10,2);
    
    SELECT COALESCE(SUM(b.service_total), 0) INTO total_service
    FROM Bill b
    INNER JOIN Booking bk ON b.booking_id = bk.booking_id
    WHERE bk.branch_id = branch_id_param
      AND MONTH(b.bill_date) = month_param
      AND YEAR(b.bill_date) = year_param;
    
    RETURN total_service;
END//

DELIMITER ;
