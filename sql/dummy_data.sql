-- Comprehensive Dummy Data for Hotel Management System
-- This includes test data for all tables with realistic scenarios

-- Clear existing data (in reverse order of dependencies)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM Payment;
DELETE FROM Service_Request;
DELETE FROM Booked_Room;
DELETE FROM Bill;
DELETE FROM Booking;
DELETE FROM Guest_User;
DELETE FROM Guest;
DELETE FROM Service;
DELETE FROM Discount;
DELETE FROM Room;
DELETE FROM staff_logs;
DELETE FROM Staff_User;
DELETE FROM RoomType;
DELETE FROM Taxes_and_Charges;
DELETE FROM Branch;
ALTER TABLE Payment AUTO_INCREMENT = 1;
ALTER TABLE Service_Request AUTO_INCREMENT = 1;
ALTER TABLE Bill AUTO_INCREMENT = 1;
ALTER TABLE Booking AUTO_INCREMENT = 1;
ALTER TABLE Guest AUTO_INCREMENT = 1;
ALTER TABLE Discount AUTO_INCREMENT = 1;
ALTER TABLE staff_logs AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- BRANCH DATA (Already exists from production)
-- ========================================
INSERT INTO Branch (branch_id, branch_name, address, city, contact_number) VALUES
(1, 'SkyNest Urban', '123 Main Street, Fort', 'Colombo', '0112345678'),
(2, 'SkyNest Coast', '456 Beach Road, Unawatuna', 'Galle', '0912345678'),
(3, 'SkyNest Hills', '789 Mountain View, Bahirawakanda', 'Kandy', '0812345678');

-- ========================================
-- ROOM TYPE DATA (Already exists from production)
-- ========================================
INSERT INTO RoomType (type_name, base_price, amenities, capacity) VALUES
('Single', 5000.00, 'Single bed, AC, TV, WiFi, Mini-fridge', 1),
('Double', 8000.00, 'Queen bed, AC, TV, WiFi, Mini-fridge, Work desk', 2),
('Deluxe', 12000.00, 'King bed, AC, Smart TV, WiFi, Mini-bar, Balcony, Premium toiletries', 4),
('Suite', 20000.00, 'King bed, Living area, AC, Smart TV, WiFi, Full bar, Jacuzzi, Premium amenities', 4),
('Budget', 3500.00, 'Single bed, Fan, Basic amenities', 5);

-- ========================================
-- TAXES AND CHARGES (Already exists from production)
-- ========================================
INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES
('2024-01-01', 12, 5),
('2025-01-01', 15, 5);

-- ========================================
-- STAFF USERS (Already exists from production)
-- ========================================
-- Password: 123456 (hashed with bcrypt)
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES
('SO001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 1),
('SO002', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 2),
('SO003', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'serviceoffice-user', 3),
('FO001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 1),
('FO002', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 2),
('FO003', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'frontoffice-user', 3),
('MN001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'management-user', 1),
('AD001', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 'admin-user', 1);

-- ========================================
-- ROOMS (Already exists from production)
-- ========================================
-- Branch 1 - Colombo (Rooms 101-110)
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES
(101, 'Available', 'Single', 1),
(102, 'Available', 'Single', 1),
(103, 'Available', 'Double', 1),
(104, 'Available', 'Double', 1),
(105, 'Available', 'Deluxe', 1),
(106, 'Available', 'Deluxe', 1),
(107, 'Available', 'Suite', 1),
(108, 'Available', 'Suite', 1),
(109, 'Available', 'Budget', 1),
(110, 'Available', 'Budget', 1);

-- Branch 2 - Galle (Rooms 201-210)
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES
(201, 'Available', 'Single', 2),
(202, 'Available', 'Single', 2),
(203, 'Available', 'Double', 2),
(204, 'Available', 'Double', 2),
(205, 'Available', 'Deluxe', 2),
(206, 'Available', 'Deluxe', 2),
(207, 'Available', 'Suite', 2),
(208, 'Available', 'Suite', 2),
(209, 'Available', 'Budget', 2),
(210, 'Available', 'Budget', 2);

-- Branch 3 - Kandy (Rooms 301-310)
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES
(301, 'Available', 'Single', 3),
(302, 'Available', 'Single', 3),
(303, 'Available', 'Double', 3),
(304, 'Available', 'Double', 3),
(305, 'Available', 'Deluxe', 3),
(306, 'Available', 'Deluxe', 3),
(307, 'Available', 'Suite', 3),
(308, 'Available', 'Suite', 3),
(309, 'Available', 'Budget', 3),
(310, 'Available', 'Budget', 3);

-- ========================================
-- SERVICES (Already exists from production)
-- ========================================
-- Branch 1 Services
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES
('Laundry', 500.00, 1, 'Available'),
('Room Service - Breakfast', 1500.00, 1, 'Available'),
('Room Service - Lunch', 2000.00, 1, 'Available'),
('Room Service - Dinner', 2500.00, 1, 'Available'),
('Airport Pickup', 3000.00, 1, 'Available'),
('Airport Drop', 2500.00, 1, 'Available'),
('Extra Bed', 1000.00, 1, 'Available'),
('Late Checkout', 2000.00, 1, 'Available'),
('City Tour', 5000.00, 1, 'Available'),
('Spa Treatment', 4000.00, 1, 'Available'),
('Premium WiFi', 500.00, 1, 'Available'),
('Parking', 300.00, 1, 'Available');

-- Branch 2 Services (Galle - Beach resort)
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES
('Laundry', 500.00, 2, 'Available'),
('Room Service - Breakfast', 1500.00, 2, 'Available'),
('Room Service - Lunch', 2000.00, 2, 'Available'),
('Room Service - Dinner', 2500.00, 2, 'Available'),
('Beach Activities', 3500.00, 2, 'Available'),
('Snorkeling Equipment', 2000.00, 2, 'Available'),
('Diving Session', 8000.00, 2, 'Available'),
('Extra Bed', 1000.00, 2, 'Available'),
('Late Checkout', 2000.00, 2, 'Available'),
('Spa Treatment', 4000.00, 2, 'Available'),
('Premium WiFi', 500.00, 2, 'Available');

-- Branch 3 Services (Kandy - Hill country)
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES
('Laundry', 500.00, 3, 'Available'),
('Room Service - Breakfast', 1500.00, 3, 'Available'),
('Room Service - Lunch', 2000.00, 3, 'Available'),
('Room Service - Dinner', 2500.00, 3, 'Available'),
('Temple Tour', 4000.00, 3, 'Available'),
('Tea Plantation Visit', 5000.00, 3, 'Available'),
('Traditional Dance Show', 3000.00, 3, 'Available'),
('Extra Bed', 1000.00, 3, 'Available'),
('Late Checkout', 2000.00, 3, 'Available'),
('Spa Treatment', 4000.00, 3, 'Available'),
('Premium WiFi', 500.00, 3, 'Available');

-- ========================================
-- GUEST DATA (NEW DUMMY DATA)
-- ========================================
INSERT INTO Guest (guest_id, first_name, last_name, email, phone_number, address, passport_number, country_of_residence, date_of_birth) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Maple Street, New York', 'US12345678', 'United States', '1985-03-15'),
(2, 'Emma', 'Wilson', 'emma.wilson@email.com', '+44-20-5550102', '456 Oxford Road, London', 'GB87654321', 'United Kingdom', '1990-07-22'),
(3, 'Akira', 'Tanaka', 'akira.tanaka@email.com', '+81-3-5550103', '789 Shibuya, Tokyo', 'JP11223344', 'Japan', '1988-11-30'),
(4, 'Sophie', 'Martin', 'sophie.martin@email.com', '+33-1-5550104', '321 Rue de Paris, Lyon', 'FR99887766', 'France', '1992-05-18'),
(5, 'Raj', 'Patel', 'raj.patel@email.com', '+91-22-5550105', '654 MG Road, Mumbai', 'IN55443322', 'India', '1987-09-08'),
(6, 'Liam', 'Brown', 'liam.brown@email.com', '+61-2-5550106', '987 Harbour Bridge, Sydney', 'AU77665544', 'Australia', '1995-01-12'),
(7, 'Maria', 'Garcia', 'maria.garcia@email.com', '+34-91-5550107', '159 La Rambla, Barcelona', 'ES33221100', 'Spain', '1989-12-25'),
(8, 'Hans', 'Mueller', 'hans.mueller@email.com', '+49-30-5550108', '753 Berlin Street, Munich', 'DE44556677', 'Germany', '1983-04-07'),
(9, 'Olivia', 'Chen', 'olivia.chen@email.com', '+86-10-5550109', '951 Nanjing Road, Shanghai', 'CN88990011', 'China', '1991-08-19'),
(10, 'Lucas', 'Silva', 'lucas.silva@email.com', '+55-11-5550110', '357 Copacabana, Rio de Janeiro', 'BR22334455', 'Brazil', '1986-06-14'),
(11, 'Priya', 'Fernando', 'priya.fernando@email.com', '+94-11-5550111', '12 Galle Road, Colombo', NULL, 'Sri Lanka', '1993-02-28'),
(12, 'David', 'Lee', 'david.lee@email.com', '+82-2-5550112', '246 Gangnam, Seoul', 'KR66778899', 'South Korea', '1984-10-03');

-- ========================================
-- GUEST USERS (NEW DUMMY DATA)
-- ========================================
-- Password: guest123 (hashed with bcrypt)
INSERT INTO Guest_User (username, password, guest_id) VALUES
('john_smith', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 1),
('emma_wilson', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 2),
('akira_tanaka', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 3),
('sophie_martin', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 4),
('raj_patel', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 5),
('liam_brown', '$2a$12$wO7zUDW2gFRu34poUSa.q.5T2eqgAOVQxkFik59aSz.kqV9vIL2h.', 6);

-- ========================================
-- DISCOUNTS (NEW DUMMY DATA)
-- ========================================
INSERT INTO Discount (discount_id, percentage, branch_id, room_type, start_date, end_date) VALUES
(1, 15, 1, 'Single', '2025-01-01', '2025-01-31'),
(2, 20, 1, 'Double', '2025-02-01', '2025-02-14'),
(3, 25, 2, 'Deluxe', '2025-03-01', '2025-03-31'),
(4, 30, 3, 'Suite', '2025-04-01', '2025-04-30'),
(5, 10, 1, 'Budget', '2025-05-01', '2025-05-31'),
(6, 15, 2, 'Single', '2025-06-01', '2025-06-30');

-- ========================================
-- BOOKINGS (NEW DUMMY DATA)
-- ========================================
INSERT INTO Booking (booking_id, guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES
(1, 1, '2025-10-01 10:30:00', 1, 1, 2, 'Confirmed'),
(2, 2, '2025-10-02 14:15:00', 1, 2, 4, 'Confirmed'),
(3, 3, '2025-10-03 09:45:00', 2, 1, 2, 'Confirmed'),
(4, 4, '2025-10-04 16:20:00', 2, 1, 3, 'Confirmed'),
(5, 5, '2025-10-05 11:00:00', 3, 2, 5, 'Confirmed'),
(6, 6, '2025-10-06 13:30:00', 1, 1, 1, 'Confirmed'),
(7, 7, '2025-10-07 10:00:00', 3, 1, 2, 'Confirmed'),
(8, 8, '2025-10-08 15:45:00', 2, 2, 4, 'Confirmed'),
(9, 9, '2025-10-09 08:30:00', 1, 1, 3, 'CheckedIn'),
(10, 10, '2025-10-10 12:00:00', 3, 1, 2, 'CheckedIn'),
(11, 11, '2025-10-11 14:30:00', 1, 1, 2, 'CheckedIn'),
(12, 12, '2025-10-12 10:15:00', 2, 2, 4, 'CheckedIn');

-- ========================================
-- BOOKED ROOMS (NEW DUMMY DATA)
-- ========================================
INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES
-- Booking 1: John Smith - Single room
(101, 1, 1, '2025-10-15', '2025-10-18', 'Booked'),
-- Booking 2: Emma Wilson - 2 Double rooms
(103, 2, 1, '2025-10-16', '2025-10-20', 'Booked'),
(104, 2, 1, '2025-10-16', '2025-10-20', 'Booked'),
-- Booking 3: Akira Tanaka - Deluxe room
(205, 3, 2, '2025-10-17', '2025-10-22', 'Booked'),
-- Booking 4: Sophie Martin - Suite
(207, 4, 2, '2025-10-18', '2025-10-21', 'Booked'),
-- Booking 5: Raj Patel - 2 Budget rooms
(309, 5, 3, '2025-10-19', '2025-10-25', 'Booked'),
(310, 5, 3, '2025-10-19', '2025-10-25', 'Booked'),
-- Booking 6: Liam Brown - Single room
(102, 6, 1, '2025-10-20', '2025-10-23', 'Booked'),
-- Booking 7: Maria Garcia - Double room
(303, 7, 3, '2025-10-21', '2025-10-24', 'Booked'),
-- Booking 8: Hans Mueller - 2 Deluxe rooms
(105, 8, 2, '2025-10-22', '2025-10-26', 'Booked'),
(106, 8, 2, '2025-10-22', '2025-10-26', 'Booked'),
-- Booking 9: Olivia Chen - Suite (Checked In)
(107, 9, 1, '2025-10-15', '2025-10-19', 'CheckedIn'),
-- Booking 10: Lucas Silva - Deluxe (Checked In)
(305, 10, 3, '2025-10-16', '2025-10-20', 'CheckedIn'),
-- Booking 11: Priya Fernando - Double (Checked In)
(104, 11, 1, '2025-10-17', '2025-10-21', 'CheckedIn'),
-- Booking 12: David Lee - 2 Single rooms (Checked In)
(201, 12, 2, '2025-10-17', '2025-10-22', 'CheckedIn'),
(202, 12, 2, '2025-10-17', '2025-10-22', 'CheckedIn');

-- ========================================
-- BILLS (NEW DUMMY DATA)
-- ========================================
INSERT INTO Bill (bill_id, bill_date, booking_id, room_total, service_total, tax_amount, due_amount, bill_status) VALUES
(1, '2025-10-15', 1, 15000.00, 0.00, 2250.00, 17250.00, 'Pending'),
(2, '2025-10-16', 2, 64000.00, 0.00, 9600.00, 73600.00, 'Pending'),
(3, '2025-10-17', 3, 60000.00, 0.00, 9000.00, 69000.00, 'Pending'),
(4, '2025-10-18', 4, 60000.00, 0.00, 9000.00, 69000.00, 'Pending'),
(5, '2025-10-19', 5, 42000.00, 0.00, 6300.00, 48300.00, 'Pending'),
(6, '2025-10-20', 6, 15000.00, 0.00, 2250.00, 17250.00, 'Pending'),
(7, '2025-10-21', 7, 24000.00, 0.00, 3600.00, 27600.00, 'Pending'),
(8, '2025-10-22', 8, 96000.00, 0.00, 14400.00, 110400.00, 'Pending'),
(9, '2025-10-15', 9, 80000.00, 5500.00, 12825.00, 98325.00, 'Pending'),
(10, '2025-10-16', 10, 48000.00, 2000.00, 7500.00, 57500.00, 'Pending'),
(11, '2025-10-17', 11, 32000.00, 3000.00, 5250.00, 40250.00, 'Pending'),
(12, '2025-10-17', 12, 50000.00, 4500.00, 8175.00, 62675.00, 'Pending');

-- Update Booking table with bill_id references
UPDATE Booking SET bill_id = 1 WHERE booking_id = 1;
UPDATE Booking SET bill_id = 2 WHERE booking_id = 2;
UPDATE Booking SET bill_id = 3 WHERE booking_id = 3;
UPDATE Booking SET bill_id = 4 WHERE booking_id = 4;
UPDATE Booking SET bill_id = 5 WHERE booking_id = 5;
UPDATE Booking SET bill_id = 6 WHERE booking_id = 6;
UPDATE Booking SET bill_id = 7 WHERE booking_id = 7;
UPDATE Booking SET bill_id = 8 WHERE booking_id = 8;
UPDATE Booking SET bill_id = 9 WHERE booking_id = 9;
UPDATE Booking SET bill_id = 10 WHERE booking_id = 10;
UPDATE Booking SET bill_id = 11 WHERE booking_id = 11;
UPDATE Booking SET bill_id = 12 WHERE booking_id = 12;

-- ========================================
-- SERVICE REQUESTS (NEW DUMMY DATA)
-- ========================================
-- For checked-in guests (Bookings 9, 10, 11, 12)
INSERT INTO Service_Request (service_request_id, request_type, date_time, booking_id, room_number, status, quantity, branch_id) VALUES
-- Booking 9: Olivia Chen (Suite 107)
(1, 'Room Service - Breakfast', '2025-10-15 08:00:00', 9, 107, 'Completed', 2, 1),
(2, 'Laundry', '2025-10-15 10:00:00', 9, 107, 'Completed', 1, 1),
(3, 'Spa Treatment', '2025-10-16 14:00:00', 9, 107, 'Pending', 1, 1),
-- Booking 10: Lucas Silva (Deluxe 305)
(4, 'Room Service - Dinner', '2025-10-16 19:00:00', 10, 305, 'Completed', 2, 3),
(5, 'Temple Tour', '2025-10-17 09:00:00', 10, 305, 'Pending', 2, 3),
-- Booking 11: Priya Fernando (Double 104)
(6, 'Room Service - Breakfast', '2025-10-17 07:30:00', 11, 104, 'Completed', 2, 1),
(7, 'City Tour', '2025-10-17 10:00:00', 11, 104, 'Pending', 2, 1),
-- Booking 12: David Lee (Singles 201, 202)
(8, 'Room Service - Lunch', '2025-10-17 12:00:00', 12, 201, 'Completed', 2, 2),
(9, 'Beach Activities', '2025-10-17 15:00:00', 12, 201, 'Pending', 2, 2),
(10, 'Laundry', '2025-10-18 09:00:00', 12, 202, 'Completed', 1, 2);

-- ========================================
-- PAYMENTS (NEW DUMMY DATA)
-- ========================================
INSERT INTO Payment (payment_reference, bill_id, payment_method, paid_amount, payment_date) VALUES
-- Partial payments for some bills
(1, 9, 'Credit Card', 50000.00, '2025-10-15 16:00:00'),
(2, 10, 'Cash', 30000.00, '2025-10-16 18:00:00'),
(3, 11, 'Credit Card', 20000.00, '2025-10-17 14:30:00'),
(4, 12, 'Debit Card', 30000.00, '2025-10-17 20:00:00');

-- Update due amounts for bills with payments
UPDATE Bill SET due_amount = 48325.00 WHERE bill_id = 9;
UPDATE Bill SET due_amount = 27500.00 WHERE bill_id = 10;
UPDATE Bill SET due_amount = 20250.00 WHERE bill_id = 11;
UPDATE Bill SET due_amount = 32675.00 WHERE bill_id = 12;

-- ========================================
-- STAFF LOGS (NEW DUMMY DATA)
-- ========================================
INSERT INTO staff_logs (log_id, username, timestamp, action) VALUES
(1, 'FO001', '2025-10-15 10:00:00', 'Checked in booking #9'),
(2, 'FO003', '2025-10-16 11:00:00', 'Checked in booking #10'),
(3, 'FO001', '2025-10-17 12:00:00', 'Checked in booking #11'),
(4, 'FO002', '2025-10-17 13:00:00', 'Checked in booking #12'),
(5, 'SO001', '2025-10-15 08:30:00', 'Created service request #1'),
(6, 'SO001', '2025-10-15 10:30:00', 'Created service request #2'),
(7, 'SO001', '2025-10-15 11:00:00', 'Completed service request #1'),
(8, 'SO001', '2025-10-15 15:00:00', 'Completed service request #2'),
(9, 'SO003', '2025-10-16 19:30:00', 'Created service request #4'),
(10, 'SO003', '2025-10-16 21:00:00', 'Completed service request #4'),
(11, 'SO001', '2025-10-17 08:00:00', 'Created service request #6'),
(12, 'SO001', '2025-10-17 09:00:00', 'Completed service request #6'),
(13, 'SO002', '2025-10-17 12:30:00', 'Created service request #8'),
(14, 'SO002', '2025-10-17 14:00:00', 'Completed service request #8'),
(15, 'SO002', '2025-10-18 10:00:00', 'Created service request #10'),
(16, 'SO002', '2025-10-18 11:30:00', 'Completed service request #10');

-- ========================================
-- DATA SUMMARY
-- ========================================
-- Total Branches: 3
-- Total Room Types: 5
-- Total Rooms: 30 (10 per branch)
-- Total Services: 34 (varying by branch)
-- Total Staff Users: 8
-- Total Guests: 12
-- Total Guest Users: 6
-- Total Bookings: 12 (8 confirmed, 4 checked-in)
-- Total Booked Rooms: 15
-- Total Bills: 12
-- Total Service Requests: 10 (6 completed, 4 pending)
-- Total Payments: 4
-- Total Discounts: 6
-- Total Staff Logs: 16
-- ========================================

SELECT 'Dummy data inserted successfully!' AS Status;
