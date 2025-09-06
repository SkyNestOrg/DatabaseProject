-- insert data for tables

-- Insert Room data
INSERT INTO `Room` (`room_number`, `current_status`, `room_type`, `branch_id`) VALUES
-- Branch 1 Rooms
(101, 'Available', 'Single', 1),
(102, 'Available', 'Single', 1),
(103, 'Occupied', 'Double', 1),
(104, 'Available', 'Double', 1),
(105, 'Available', 'Deluxe', 1),
(106, 'Maintenance', 'Deluxe', 1),
(107, 'Available', 'Suite', 1),
(108, 'Occupied', 'Suite', 1),

-- Branch 2 Rooms
(201, 'Available', 'Single', 2),
(202, 'Occupied', 'Single', 2),
(203, 'Available', 'Double', 2),
(204, 'Available', 'Double', 2),
(205, 'Occupied', 'Deluxe', 2),
(206, 'Available', 'Deluxe', 2),
(207, 'Maintenance', 'Suite', 2),
(208, 'Available', 'Suite', 2),

-- Branch 3 Rooms
(301, 'Available', 'Single', 3),
(302, 'Available', 'Single', 3),
(303, 'Occupied', 'Double', 3),
(304, 'Available', 'Double', 3),
(305, 'Available', 'Deluxe', 3),
(306, 'Maintenance', 'Deluxe', 3),
(307, 'Available', 'Suite', 3),
(308, 'Occupied', 'Suite', 3);


--insert the required RoomType data
INSERT INTO `RoomType` (`type_name`, `base_price`, `amenities`) VALUES
('Single', 5000.00, 'Single bed, WiFi, AC, TV, Private bathroom'),
('Double', 7500.00, 'Double bed, WiFi, AC, TV, Private bathroom, Mini fridge'),
('Deluxe', 12000.00, 'King bed, WiFi, AC, Smart TV, Private bathroom, Mini fridge, Balcony'),
('Suite', 20000.00, 'King bed, WiFi, AC, Smart TV, Private bathroom, Mini fridge, Balcony, Living area, Kitchenette');


--branches
INSERT INTO `Branch` (`branch_id`, `branch_name`, `address`, `city`, `contact_number`) VALUES
(1, 'SkyNest Urban', '123 Galle Face', 'Colombo 01', '0112345678'),
(2, 'SkyNest Coast', '456 Galle Road', 'Galle', '0912345679'),
(3, 'SkyNest Hills', '789 Colombo Road', 'Kandy', '0812345680');