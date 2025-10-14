//  Guest
export class Guest {
  constructor({ guest_id, first_name, last_name, email, phone_number, address, passport_number, country_of_residence }) {
    this.guestId = guest_id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.phoneNumber = phone_number;
    this.address = address;
    this.passportNumber = passport_number;
    this.country = country_of_residence;
  }
}

//  Branch
export class Branch {
  constructor({ branch_id, branch_name, branch_address, branch_city, branch_contact }) {
    this.branchId = branch_id;
    this.name = branch_name;
    this.address = branch_address;
    this.city = branch_city;
    this.contact = branch_contact;
  }
}

//  Booking
export class Booking {
  constructor({ booking_id, booking_date }) {
    this.booking_id = booking_id;
    this.booking_date = booking_date;
  }
}

//  Room
export class Room {
  constructor({ room_number, room_type, base_price, check_in, check_out, nights, discount_percentage, base_charge, final_room_charge }) {
    this.room_number = room_number;
    this.room_type = room_type;
    this.base_price = base_price;
    this.check_in = check_in;
    this.check_out = check_out;
    this.nights = nights;
    this.discount_percentage = discount_percentage;
    this.base_charge = base_charge;
    this.final_room_charge = final_room_charge;
  }
}

//  Payment
export class Payment {
  constructor({ payment_reference, payment_method, paid_amount, payment_date, room_total, service_total, sub_total, tax_amount, grand_total, due_amount }) {
    this.payment_reference = payment_reference;
    this.payment_method = payment_method;
    this.paid_amount = paid_amount;
    this.payment_date = payment_date;
    this.room_total = room_total;
    this.service_total = service_total;
    this.sub_total = sub_total;
    this.tax_amount = tax_amount;
    this.grand_total = grand_total;
    this.due_amount = due_amount;
  }
}

//  Service
export class Service {
  constructor({ service_request_id, request_type, quantity, unit_quantity_charges, service_status, total_service_charge, date_time }) {
    this.service_request_id = service_request_id;
    this.request_type = request_type;
    this.quantity = quantity;
    this.unit_quantity_charges = unit_quantity_charges;
    this.service_status = service_status;
    this.total_service_charge = total_service_charge;
    this.date_time = date_time;
  }
}

//  Export all together
//module.exports = { Guest, Branch, Booking, Room, Service, Payment };
