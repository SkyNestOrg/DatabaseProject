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