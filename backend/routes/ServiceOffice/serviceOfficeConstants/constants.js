// constants.js
// Centralized constants and enums for service office backend

export const SERVICE_STATUS = {
  PENDING: "Request Placed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const USER_ROLES = {
  MANAGER: "Manager",
  FRONTDESKOFFICER: "Front Desk Officer",
  SERVICEOFFICE: "serviceoffice-user",
  // Add more roles as needed
};

export const SERVICE_TYPES = {
  LAUNDRY: "Laundry",
  ROOM_SERVICE: "Room Service",
  SPA: "Spa",
  // Add more types as needed
};

export const JWT_HEADER = "authorization";

// Add more constants as needed for your project
