--@block
SHOW 

--@block
CREATE TABLE Branch (
  branch_id TINYINT AUTO_INCREMENT,
  branch_name VARCHAR(25) NOT NULL,
  address VARCHAR(75) NOT NULL,
  city VARCHAR(25) NOT NULL,
  contact_number CHAR(10) NOT NULL,
  PRIMARY KEY (branch_id)
);


CREATE TABLE Staff_User (
  username VARCHAR(20),
  password VARCHAR(255), -- Increased for hashed passwords
  official_role VARCHAR(20) NOT NULL,
  branch_id TINYINT NOT NULL,
  PRIMARY KEY (username),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);


CREATE TABLE staff_logs (
  log_id INT AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  action VARCHAR(50), -- Increased size for more descriptive actions
  PRIMARY KEY (log_id),
  FOREIGN KEY (username) REFERENCES Staff_User(username)
);


CREATE TABLE Guest (
  guest_id SMALLINT AUTO_INCREMENT,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(15), -- Increased for international numbers
  address VARCHAR(75),
  passport_number VARCHAR(25) UNIQUE,
  country_of_residence VARCHAR(25),
  date_of_birth DATE,
  PRIMARY KEY (guest_id)
);


CREATE TABLE Guest_User (
  username VARCHAR(20),
  password VARCHAR(255), -- Increased for hashed passwords
  guest_id SMALLINT NOT NULL,
  PRIMARY KEY (username),
  FOREIGN KEY (guest_id) REFERENCES Guest(guest_id)
);


CREATE TABLE RoomType (
  type_name VARCHAR(20),
  base_price NUMERIC(9,2) NOT NULL, 
  amenities TEXT, 
  PRIMARY KEY (type_name)
);


CREATE TABLE Room (
  room_number SMALLINT,
  current_status VARCHAR(20) DEFAULT 'Available',
  room_type VARCHAR(20) NOT NULL,
  branch_id TINYINT NOT NULL,
  PRIMARY KEY (room_number),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
  FOREIGN KEY (room_type) REFERENCES RoomType(type_name)
);

CREATE TABLE Booking (
  booking_id SMALLINT AUTO_INCREMENT,
  guest_id SMALLINT NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  branch_id TINYINT NOT NULL, 
  number_of_rooms TINYINT NOT NULL,
  number_of_pax TINYINT NOT NULL,
  status VARCHAR(20) DEFAULT 'Confirmed',
  PRIMARY KEY (booking_id),
  FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Update Booking table to add the missing foreign key
--@block
ALTER TABLE booking 
ADD COLUMN bill_id SMALLINT,
ADD FOREIGN KEY (bill_id) REFERENCES Bill(bill_id);



--@block
CREATE TABLE Booked_Room (
  room_number SMALLINT,
  booking_id SMALLINT,
  branch_id TINYINT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Booked',
  PRIMARY KEY (room_number, booking_id),
  FOREIGN KEY (room_number) REFERENCES Room(room_number),
  FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
  CONSTRAINT chk_checkout_after_checkin CHECK (check_out > check_in)
);


CREATE TABLE Bill (
  bill_id SMALLINT AUTO_INCREMENT,
  bill_date DATE DEFAULT (CURRENT_DATE),
  booking_id SMALLINT NOT NULL,
  room_total NUMERIC(11,2) DEFAULT 0,
  service_total NUMERIC(11,2) DEFAULT 0,
  sub_total NUMERIC(11,2) GENERATED ALWAYS AS (room_total + service_total) STORED,
  tax_amount NUMERIC(11,2) DEFAULT 0,
  grand_total NUMERIC(11,2) GENERATED ALWAYS AS (sub_total + tax_amount) STORED,
  due_amount NUMERIC(11,2) DEFAULT 0,
  bill_status VARCHAR(10) DEFAULT 'Pending',
  PRIMARY KEY (bill_id),
  FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);




CREATE TABLE Payment (
  payment_reference SMALLINT AUTO_INCREMENT,
  bill_id SMALLINT NOT NULL,
  payment_method VARCHAR(20), 
  paid_amount NUMERIC(11,2) NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (payment_reference),
  FOREIGN KEY (bill_id) REFERENCES Bill(bill_id)
);


CREATE TABLE Service (
  service_type VARCHAR(20),
  unit_quantity_charges NUMERIC(7,2) NOT NULL,
  branch_id TINYINT NOT NULL,
  availability VARCHAR(10) DEFAULT 'Available',
  PRIMARY KEY (service_type, branch_id),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);


CREATE TABLE Service_Request (
  service_request_id SMALLINT AUTO_INCREMENT,
  request_type VARCHAR(20) NOT NULL,
  date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  booking_id SMALLINT NOT NULL,
  room_number SMALLINT NOT NULL,
  status VARCHAR(15) DEFAULT 'Pending',
  quantity SMALLINT DEFAULT 1,
  branch_id TINYINT NOT NULL, 
  PRIMARY KEY (service_request_id),
  FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
  FOREIGN KEY (room_number) REFERENCES Room(room_number),
  FOREIGN KEY (request_type, branch_id) REFERENCES Service(service_type, branch_id)
);


CREATE TABLE Discount (
  discount_id TINYINT AUTO_INCREMENT,
  percentage TINYINT NOT NULL, 
  branch_id TINYINT NOT NULL,
  room_type VARCHAR(20),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  PRIMARY KEY (discount_id),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
  FOREIGN KEY (room_type) REFERENCES RoomType(type_name),
  CONSTRAINT chk_discount_dates CHECK (end_date > start_date),
  CONSTRAINT chk_percentage CHECK (percentage BETWEEN 1 AND 100)
);


CREATE TABLE Taxes_and_Charges ( 
  revision_date DATE,
  latest_tax_percentage TINYINT NOT NULL, 
  latest_surcharge_percentage TINYINT NOT NULL, 
  PRIMARY KEY (revision_date),
  CONSTRAINT chk_tax CHECK (latest_tax_percentage BETWEEN 0 AND 100),
  CONSTRAINT chk_surcharge CHECK (latest_surcharge_percentage BETWEEN 0 AND 100)
);

--@block
SELECT * FROM service;

--@block
SELECT * FROM Branch;
SELECT * FROM Staff_User;
SELECT * FROM staff_logs;
SELECT * FROM Guest;
SELECT * FROM Guest_User;
SELECT * FROM RoomType;
SELECT * FROM Room;
SELECT * FROM Booking;
SELECT * FROM Booked_Room;
SELECT * FROM Bill;
SELECT * FROM Payment;
SELECT * FROM Service;
SELECT * FROM Service_Request;
SELECT * FROM Discount;
SELECT * FROM Taxes_and_Charges;

--accidentally added incorrect data type for service table's availability column
--@block
ALTER TABLE service
MODIFY availability VARCHAR(12) DEFAULT 'Available';
--@block
-- Branch
INSERT INTO Branch (branch_id, branch_name, address, city, contact_number) VALUES (1, 'Central', '123 Main St', 'Metropolis', '0123456789');
INSERT INTO Branch (branch_id, branch_name, address, city, contact_number) VALUES (2, 'Airport', '456 Sky Rd', 'Airtown', '0987654321');
INSERT INTO Branch (branch_id, branch_name, address, city, contact_number) VALUES (3, 'Beachside', '789 Ocean Ave', 'Seaville', '0112233445');

--@block
-- Staff_User
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES ('john_doe', 'hashedpass1', 'Manager', 1);
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES ('jane_smith', 'hashedpass2', 'Receptionist', 2);
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES ('bob_brown', 'hashedpass3', 'Cleaner', 3);

--@block
-- staff_logs
INSERT INTO staff_logs (log_id, username, timestamp, action) VALUES (1, 'john_doe', '2025-09-11 09:00:00', 'Login');
INSERT INTO staff_logs (log_id, username, timestamp, action) VALUES (2, 'jane_smith', '2025-09-11 10:00:00', 'Check-in Guest');
INSERT INTO staff_logs (log_id, username, timestamp, action) VALUES (3, 'bob_brown', '2025-09-11 11:00:00', 'Room Cleaned');

--@block
-- Guest
INSERT INTO Guest (guest_id, first_name, last_name, email, phone_number, address, passport_number, country_of_residence, date_of_birth) VALUES (1, 'Alice', 'Wonder', 'alice@example.com', '0771234567', '1 Wonderland', 'P123456', 'Wonderland', '1990-01-01');
INSERT INTO Guest (guest_id, first_name, last_name, email, phone_number, address, passport_number, country_of_residence, date_of_birth) VALUES (2, 'Bob', 'Builder', 'bob@example.com', '0777654321', '2 Builder St', 'P654321', 'Buildland', '1985-05-05');
INSERT INTO Guest (guest_id, first_name, last_name, email, phone_number, address, passport_number, country_of_residence, date_of_birth) VALUES (3, 'Charlie', 'Chocolate', 'charlie@example.com', '0771122334', '3 Chocolate Ave', 'P112233', 'Chocoland', '2000-12-12');

--@block
-- Guest_User
INSERT INTO Guest_User (username, password, guest_id) VALUES ('alicew', 'guestpass1', 1);
INSERT INTO Guest_User (username, password, guest_id) VALUES ('bobb', 'guestpass2', 2);
INSERT INTO Guest_User (username, password, guest_id) VALUES ('charliec', 'guestpass3', 3);

--@block
-- RoomType
INSERT INTO RoomType (type_name, base_price, amenities) VALUES ('Single', 100.00, 'Bed, TV, WiFi');
INSERT INTO RoomType (type_name, base_price, amenities) VALUES ('Double', 150.00, '2 Beds, TV, WiFi, Mini Bar');
INSERT INTO RoomType (type_name, base_price, amenities) VALUES ('Suite', 300.00, 'King Bed, TV, WiFi, Mini Bar, Jacuzzi');

--@block
-- Room
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES (101, 'Available', 'Single', 1);
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES (102, 'Occupied', 'Double', 2);
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES (201, 'Available', 'Suite', 3);

--@block
-- Booking
INSERT INTO Booking (booking_id, guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES (1, 1, '2025-09-10', 1, 1, 1, 'Confirmed');
INSERT INTO Booking (booking_id, guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES (2, 2, '2025-09-11', 2, 2, 3, 'Pending');
INSERT INTO Booking (booking_id, guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES (3, 3, '2025-09-12', 3, 1, 2, 'Cancelled');

--@block
-- Booked_Room
INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES (101, 1, 1, '2025-09-12', '2025-09-15', 'Booked');
INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES (102, 2, 2, '2025-09-13', '2025-09-16', 'Booked');
INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES (201, 3, 3, '2025-09-14', '2025-09-17', 'Cancelled');

--@block
-- Bill
INSERT INTO Bill (bill_id, bill_date, booking_id, room_total, service_total, tax_amount, due_amount, bill_status) VALUES (1, '2025-09-15', 1, 300.00, 50.00, 35.00, 0.00, 'Paid');
INSERT INTO Bill (bill_id, bill_date, booking_id, room_total, service_total, tax_amount, due_amount, bill_status) VALUES (2, '2025-09-16', 2, 450.00, 100.00, 55.00, 50.00, 'Pending');
INSERT INTO Bill (bill_id, bill_date, booking_id, room_total, service_total, tax_amount, due_amount, bill_status) VALUES (3, '2025-09-17', 3, 0.00, 0.00, 0.00, 0.00, 'Cancelled');

--@block
-- Payment
INSERT INTO Payment (payment_reference, bill_id, payment_method, paid_amount, payment_date) VALUES (1, 1, 'Credit Card', 385.00, '2025-09-15 12:00:00');
INSERT INTO Payment (payment_reference, bill_id, payment_method, paid_amount, payment_date) VALUES (2, 2, 'Cash', 505.00, '2025-09-16 13:00:00');
INSERT INTO Payment (payment_reference, bill_id, payment_method, paid_amount, payment_date) VALUES (3, 3, 'None', 0.00, '2025-09-17 14:00:00');

--@block
-- Service
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Laundry', 10.00, 1, 'Available');
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Room Service', 20.00, 2, 'Available');
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Spa', 50.00, 3, 'Unavailable');

--@block
-- Service_Request
INSERT INTO Service_Request (service_request_id, request_type, date_time, booking_id, room_number, status, quantity, branch_id) VALUES (1, 'Laundry', '2025-09-13 09:00:00', 1, 101, 'Completed', 2, 1);
INSERT INTO Service_Request (service_request_id, request_type, date_time, booking_id, room_number, status, quantity, branch_id) VALUES (2, 'Room Service', '2025-09-14 10:00:00', 2, 102, 'Pending', 1, 2);
INSERT INTO Service_Request (service_request_id, request_type, date_time, booking_id, room_number, status, quantity, branch_id) VALUES (3, 'Spa', '2025-09-15 11:00:00', 3, 201, 'Cancelled', 1, 3);

--@block
-- Discount
INSERT INTO Discount (discount_id, percentage, branch_id, room_type, start_date, end_date) VALUES (1, 10, 1, 'Single', '2025-09-01', '2025-09-30');
INSERT INTO Discount (discount_id, percentage, branch_id, room_type, start_date, end_date) VALUES (2, 15, 2, 'Double', '2025-09-05', '2025-09-20');
INSERT INTO Discount (discount_id, percentage, branch_id, room_type, start_date, end_date) VALUES (3, 20, 3, 'Suite', '2025-09-10', '2025-09-25');

--@block
-- Taxes_and_Charges
INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES ('2025-09-01', 10, 5);
INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES ('2025-09-10', 12, 6);
INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES ('2025-09-20', 15, 7);

--@block
SELECT * FROM staff_user;

--@block
SELECT * FROM service;

--@block
SELECT * FROM service_request;

--@block
UPDATE service_request
SET status = 'cancelled'
WHERE service_request_id = 3;

--@block
SELECT * FROM bill;


--@block
-- adding a trigger to update bill's service_total when there
CREATE TRIGGER update_bill_after_service_completed
AFTER UPDATE ON Service_Request
FOR EACH ROW
UPDATE Bill b
SET b.service_total = b.service_total + (
  SELECT COALESCE(s.unit_quantity_charges * NEW.quantity, 0)
  FROM service s 
  WHERE s.service_type = NEW.request_type 
  AND s.branch_id = NEW.branch_id
  LIMIT 1
)
WHERE b.booking_id = NEW.booking_id
AND NEW.status = 'completed' 
AND OLD.status != 'completed';

--@block
SELECT * FROM staff_user;

--@block
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES ('pamoth', '5616', 'Service', 1);

--@block
use skynestpamoth;

--@block
SELECT * FROM service_request;

--@block
SELECT * FROM guest;

--@block
-- Add Spa service to branch 1
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) 
VALUES ('Spa', 50.00, 1, 'Available');

-- Then add the service request
INSERT INTO Service_Request (request_type, booking_id, room_number, branch_id)
VALUES ('Spa', 1, 101, 1);

--@block
UPDATE Service_Request
SET status = 'Pending'
WHERE service_request_id = 1;

--@block
SELECT * FROM staff_user;

--@block
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES ('shakya', '1234', 'Manager', 1);

--@block
SELECT * FROM service_request;

--@block
CREATE INDEX idx_service_request_branch_status 
ON service_request (branch_id, status);

CREATE INDEX idx_service_request_branch_date 
ON service_request (branch_id, date_time);

--@block
SELECT * FROM Branch;

--@block
SELECT * FROM taxes_and_charges;

--@block
-- Add more services to branch 1
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Gym', 15.00, 1, 'Available');
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Breakfast', 25.00, 1, 'Available');
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES ('Airport Shuttle', 40.00, 1, 'Available');

--adding more dummy data
-- Add more dummy data for testing

--@block
-- Add more branches for better testing
INSERT INTO Branch (branch_id, branch_name, address, city, contact_number) VALUES 
(4, 'Downtown', '321 Business Ave', 'Capital City', '0555123456'),
(5, 'Resort', '654 Paradise Blvd', 'Beach Town', '0666789012');

--@block
-- Add more staff users across different branches
INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES 
('mike_manager', 'hash123', 'Manager', 2),
('sara_front', 'hash456', 'Front Desk', 1),
('tom_service', 'hash789', 'Service Staff', 1),
('lisa_clean', 'hash321', 'Housekeeping', 2),
('david_maint', 'hash654', 'Maintenance', 3),
('anna_manager', 'hash987', 'Manager', 4),
('peter_staff', 'hash147', 'Service Staff', 5);

--@block
-- Add more guests for realistic data
INSERT INTO Guest (first_name, last_name, email, phone_number, address, passport_number, country_of_residence, date_of_birth) VALUES 
('Emma', 'Johnson', 'emma.j@email.com', '0771234890', '10 Oak Street', 'P789012', 'USA', '1988-03-15'),
('Lucas', 'Garcia', 'lucas.g@email.com', '0772345901', '20 Pine Avenue', 'P890123', 'Spain', '1992-07-22'),
('Sophia', 'Miller', 'sophia.m@email.com', '0773456012', '30 Maple Road', 'P901234', 'Canada', '1987-11-08'),
('Oliver', 'Davis', 'oliver.d@email.com', '0774567123', '40 Cedar Lane', 'P012345', 'Australia', '1995-02-28'),
('Isabella', 'Wilson', 'isabella.w@email.com', '0775678234', '50 Birch Drive', 'P123450', 'UK', '1990-09-12'),
('James', 'Taylor', 'james.t@email.com', '0776789345', '60 Elm Circle', 'P234501', 'France', '1983-12-03'),
('Mia', 'Anderson', 'mia.a@email.com', '0777890456', '70 Ash Street', 'P345012', 'Germany', '1991-06-17'),
('William', 'Thomas', 'william.t@email.com', '0778901567', '80 Willow Way', 'P456123', 'Italy', '1989-04-25');

--@block
-- Add more room types
INSERT INTO RoomType (type_name, base_price, amenities) VALUES 
('Deluxe', 200.00, 'King Bed, TV, WiFi, Mini Bar, City View'),
('Executive', 350.00, 'King Bed, TV, WiFi, Mini Bar, Workspace, Lounge Access'),
('Presidential', 500.00, 'Multiple Rooms, TV, WiFi, Full Kitchen, Butler Service');

--@block
-- Add more rooms across branches
INSERT INTO Room (room_number, current_status, room_type, branch_id) VALUES 
(103, 'Available', 'Deluxe', 1),
(104, 'Occupied', 'Single', 1),
(105, 'Maintenance', 'Double', 1),
(202, 'Available', 'Executive', 2),
(203, 'Occupied', 'Deluxe', 2),
(204, 'Available', 'Single', 2),
(301, 'Available', 'Presidential', 3),
(302, 'Occupied', 'Executive', 3),
(303, 'Available', 'Deluxe', 3),
(401, 'Available', 'Suite', 1),
(402, 'Occupied', 'Double', 1),
(501, 'Available', 'Presidential', 2),
(502, 'Available', 'Executive', 2);

--@block
-- Add more bookings with varied dates for testing date filtering
INSERT INTO Booking (guest_id, booking_date, branch_id, number_of_rooms, number_of_pax, status) VALUES 
(4, '2024-12-01 14:30:00', 1, 1, 2, 'Confirmed'),
(5, '2024-12-15 16:45:00', 2, 2, 4, 'Confirmed'),
(6, '2024-11-20 10:15:00', 1, 1, 1, 'Completed'),
(7, '2024-11-05 12:00:00', 3, 3, 6, 'Confirmed'),
(8, '2024-10-25 09:30:00', 1, 1, 2, 'Completed'),
(1, '2024-10-10 11:20:00', 2, 2, 3, 'Confirmed'),
(2, '2024-09-28 15:10:00', 1, 1, 1, 'Completed'),
(3, '2024-09-15 13:45:00', 3, 1, 2, 'Cancelled'),
(4, '2024-08-30 17:00:00', 1, 2, 4, 'Completed'),
(5, '2024-08-12 08:30:00', 2, 1, 2, 'Completed');

--@block
-- Add more booked rooms
INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status) VALUES 
(103, 4, 1, '2024-12-05', '2024-12-08', 'Booked'),
(202, 5, 2, '2024-12-20', '2024-12-25', 'Booked'),
(104, 6, 1, '2024-11-25', '2024-11-28', 'Completed'),
(301, 7, 3, '2024-11-10', '2024-11-15', 'Booked'),
(105, 8, 1, '2024-10-28', '2024-10-31', 'Completed'),
(203, 9, 2, '2024-10-15', '2024-10-18', 'Booked'),
(401, 10, 1, '2024-10-01', '2024-10-05', 'Completed'),
(302, 11, 3, '2024-09-20', '2024-09-23', 'Completed'),
(402, 12, 1, '2024-09-05', '2024-09-08', 'Cancelled'),
(501, 13, 2, '2024-08-15', '2024-08-20', 'Completed');

--@block
-- Add more bills
INSERT INTO Bill (booking_id, room_total, service_total, tax_amount, due_amount, bill_status) VALUES 
(4, 600.00, 0.00, 60.00, 660.00, 'Pending'),
(5, 1400.00, 75.00, 147.50, 0.00, 'Paid'),
(6, 200.00, 30.00, 23.00, 0.00, 'Paid'),
(7, 900.00, 150.00, 105.00, 1155.00, 'Pending'),
(8, 200.00, 45.00, 24.50, 0.00, 'Paid'),
(9, 300.00, 60.00, 36.00, 0.00, 'Paid'),
(10, 200.00, 25.00, 22.50, 0.00, 'Paid'),
(11, 300.00, 80.00, 38.00, 0.00, 'Paid'),
(12, 300.00, 0.00, 30.00, 0.00, 'Cancelled'),
(13, 350.00, 120.00, 47.00, 0.00, 'Paid');

--@block
-- Add more services across all branches
INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) VALUES 
-- Branch 1 services
('Room Cleaning', 20.00, 1, 'Available'),
('Concierge', 30.00, 1, 'Available'),
('Valet Parking', 25.00, 1, 'Available'),
('Pet Care', 35.00, 1, 'Available'),

-- Branch 2 services
('Laundry', 12.00, 2, 'Available'),
('Spa', 60.00, 2, 'Available'),
('Gym', 18.00, 2, 'Available'),
('Restaurant', 45.00, 2, 'Available'),
('Car Rental', 80.00, 2, 'Available'),

-- Branch 3 services
('Room Cleaning', 18.00, 3, 'Available'),
('Laundry', 15.00, 3, 'Available'),
('Massage', 70.00, 3, 'Available'),
('Tour Guide', 100.00, 3, 'Available'),
('Equipment Rental', 50.00, 3, 'Available');

--@block
-- Add many service requests with varied dates and statuses for testing
INSERT INTO Service_Request (request_type, date_time, booking_id, room_number, status, quantity, branch_id) VALUES 
-- Recent pending services (Branch 1)
('Laundry', '2024-12-09 10:30:00', 4, 103, 'Pending', 2, 1),
('Room Cleaning', '2024-12-09 14:15:00', 4, 103, 'Pending', 1, 1),
('Breakfast', '2024-12-09 08:00:00', 4, 103, 'Completed', 2, 1),
('Concierge', '2024-12-08 16:20:00', 4, 103, 'Pending', 1, 1),

-- Branch 2 services
('Room Service', '2024-12-08 19:30:00', 5, 202, 'Pending', 1, 2),
('Laundry', '2024-12-07 09:45:00', 5, 202, 'Completed', 3, 2),
('Spa', '2024-12-07 15:00:00', 5, 202, 'Completed', 1, 2),
('Gym', '2024-12-06 07:30:00', 5, 202, 'Completed', 2, 2),

-- Branch 1 - November services
('Room Cleaning', '2024-11-27 10:00:00', 6, 104, 'Completed', 1, 1),
('Laundry', '2024-11-26 14:30:00', 6, 104, 'Completed', 2, 1),
('Airport Shuttle', '2024-11-25 06:00:00', 6, 104, 'Completed', 1, 1),

-- Branch 3 - November services  
('Room Cleaning', '2024-11-12 11:00:00', 7, 301, 'Completed', 3, 3),
('Massage', '2024-11-13 16:00:00', 7, 301, 'Completed', 2, 3),
('Tour Guide', '2024-11-14 09:00:00', 7, 301, 'Completed', 1, 3),
('Equipment Rental', '2024-11-14 12:00:00', 7, 301, 'Pending', 1, 3),

-- Branch 1 - October services
('Breakfast', '2024-10-29 08:30:00', 8, 105, 'Completed', 2, 1),
('Room Cleaning', '2024-10-30 10:45:00', 8, 105, 'Completed', 1, 1),
('Valet Parking', '2024-10-28 18:00:00', 8, 105, 'Completed', 1, 1),

-- Branch 2 - October services
('Restaurant', '2024-10-16 19:30:00', 9, 203, 'Completed', 2, 2),
('Car Rental', '2024-10-17 09:00:00', 9, 203, 'Completed', 1, 2),
('Spa', '2024-10-17 14:00:00', 9, 203, 'Completed', 1, 2),

-- Branch 1 - October services  
('Pet Care', '2024-10-02 12:00:00', 10, 401, 'Completed', 1, 1),
('Concierge', '2024-10-03 15:30:00', 10, 401, 'Completed', 1, 1),

-- Branch 3 - September services
('Laundry', '2024-09-21 11:30:00', 11, 302, 'Completed', 2, 3),
('Room Cleaning', '2024-09-22 10:00:00', 11, 302, 'Completed', 1, 3),
('Massage', '2024-09-22 16:00:00', 11, 302, 'Completed', 1, 3),

-- Branch 1 - September services
('Gym', '2024-09-06 07:00:00', 12, 402, 'Cancelled', 1, 1),
('Laundry', '2024-09-06 14:00:00', 12, 402, 'Cancelled', 1, 1),

-- Branch 2 - August services
('Room Service', '2024-08-16 20:00:00', 13, 501, 'Completed', 3, 2),
('Spa', '2024-08-17 10:00:00', 13, 501, 'Completed', 2, 2),
('Restaurant', '2024-08-18 19:00:00', 13, 501, 'Completed', 2, 2),
('Car Rental', '2024-08-19 08:00:00', 13, 501, 'Completed', 1, 2);

--@block
-- Add more payments
INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES 
(5, 'Credit Card', 1622.50, '2024-12-20 15:30:00'),
(6, 'Cash', 253.00, '2024-11-28 11:00:00'),
(8, 'Credit Card', 269.50, '2024-10-31 14:20:00'),
(9, 'Debit Card', 396.00, '2024-10-18 16:45:00'),
(10, 'Credit Card', 247.50, '2024-10-05 12:30:00'),
(11, 'Cash', 418.00, '2024-09-23 10:15:00'),
(13, 'Credit Card', 517.00, '2024-08-20 13:45:00');

--@block
-- Add more discounts
INSERT INTO Discount (percentage, branch_id, room_type, start_date, end_date) VALUES 
(25, 1, 'Deluxe', '2024-12-01', '2024-12-31'),
(30, 2, 'Executive', '2024-11-15', '2024-12-15'),
(20, 3, 'Presidential', '2024-10-01', '2024-11-30'),
(15, 1, 'Suite', '2024-09-01', '2024-09-30'),
(12, 2, 'Single', '2024-08-01', '2024-08-31');

--@block
-- Add more tax revisions
INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES 
('2024-08-01', 8, 4),
('2024-10-01', 10, 5),
('2024-12-01', 12, 6);

--@block
-- Add staff logs for activity tracking
INSERT INTO staff_logs (username, timestamp, action) VALUES 
('pamoth', '2024-12-09 09:15:00', 'Login'),
('pamoth', '2024-12-09 09:20:00', 'Viewed Due Services'),
('pamoth', '2024-12-09 10:35:00', 'Completed Service Request #5'),
('sara_front', '2024-12-09 08:30:00', 'Login'),
('sara_front', '2024-12-09 08:45:00', 'Checked-in Guest'),
('tom_service', '2024-12-09 11:00:00', 'Login'),
('tom_service', '2024-12-09 11:15:00', 'Updated Service Status'),
('mike_manager', '2024-12-08 09:00:00', 'Login'),
('mike_manager', '2024-12-08 09:30:00', 'Reviewed Service History'),
('lisa_clean', '2024-12-08 10:00:00', 'Completed Room Cleaning');

--@block
-- Verify the data
SELECT 'Branch Count' as Table_Name, COUNT(*) as Count FROM Branch
UNION ALL
SELECT 'Staff Users', COUNT(*) FROM Staff_User
UNION ALL  
SELECT 'Guests', COUNT(*) FROM Guest
UNION ALL
SELECT 'Rooms', COUNT(*) FROM Room
UNION ALL
SELECT 'Bookings', COUNT(*) FROM Booking
UNION ALL
SELECT 'Service Requests', COUNT(*) FROM Service_Request
UNION ALL
SELECT 'Services', COUNT(*) FROM Service
UNION ALL
SELECT 'Bills', COUNT(*) FROM Bill;

--@block
-- Check service requests by status and branch for testing filters
SELECT 
    branch_id,
    status,
    COUNT(*) as count,
    MIN(DATE(date_time)) as earliest_date,
    MAX(DATE(date_time)) as latest_date
FROM Service_Request 
GROUP BY branch_id, status 
ORDER BY branch_id, status;

--@block
-- Check service requests by service type for testing filters
SELECT 
    request_type,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled
FROM Service_Request 
GROUP BY request_type 
ORDER BY count DESC;
