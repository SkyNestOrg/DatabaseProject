import db from "../../db.js";

// GET /service-types - Get unique service types for the logged-in staff's branch (for filters)
export const getServiceTypes = async (req, res) => {
  console.log("GET /service-types received for branch:", req.user.branch_id);

  try {
    const [rows] = await db.query(
      `SELECT DISTINCT service_type 
       FROM service 
       WHERE branch_id = ? 
       ORDER BY service_type`,
      [req.user.branch_id]
    );

    // Extract just the service type strings into an array
    const serviceTypes = rows.map(row => row.service_type);

    res.status(200).json({
      success: true,
      message: "Service types retrieved successfully",
      serviceTypes: serviceTypes,
      branch_id: req.user.branch_id,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving service types",
      error: err.message,
    });
  }
};

// GET /services - Get all services for the logged-in staff's branch
export const getServices = async (req, res) => {
  console.log("GET /services received for branch:", req.user.branch_id);

  try {
    const [rows] = await db.query(
      `SELECT service_type, unit_quantity_charges, availability 
       FROM service 
       WHERE branch_id = ? 
       ORDER BY service_type`,
      [req.user.branch_id]
    );

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      services: rows,
      branch_id: req.user.branch_id,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving services",
      error: err.message,
    });
  }
};

// POST /services - Add a new service to the branch
export const addService = async (req, res) => {
  console.log("POST /services received:", req.body);

  const {
    service_type,
    unit_quantity_charges,
    availability = "Available",
  } = req.body;

  // Validate input
  if (!service_type || !unit_quantity_charges) {
    return res.status(400).json({
      success: false,
      message: "Service type and unit quantity charges are required",
    });
  }

  if (unit_quantity_charges <= 0) {
    return res.status(400).json({
      success: false,
      message: "Unit quantity charges must be a positive number",
    });
  }

  try {
    // Check if service already exists for this branch
    const [existing] = await db.query(
      "SELECT service_type FROM Service WHERE service_type = ? AND branch_id = ?",
      [service_type, req.user.branch_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Service already exists for this branch",
      });
    }

    // Add new service
    await db.query(
      `INSERT INTO Service (service_type, unit_quantity_charges, branch_id, availability) 
       VALUES (?, ?, ?, ?)`,
      [service_type, unit_quantity_charges, req.user.branch_id, availability]
    );

    // Log the action
    await db.query("INSERT INTO staff_logs (username, action) VALUES (?, ?)", [
      req.user.username,
      `Added new service: ${service_type}`,
    ]);

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service: {
        service_type,
        unit_quantity_charges,
        availability,
        branch_id: req.user.branch_id,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding service",
      error: err.message,
    });
  }
};

// PUT /services/:serviceType - Update an existing service
export const updateService = async (req, res) => {
  console.log("PUT /services received:", req.params.serviceType, req.body);

  const { serviceType } = req.params;
  const { unit_quantity_charges, availability } = req.body;

  // Validate input
  if (!unit_quantity_charges && !availability) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field (unit_quantity_charges or availability) is required",
    });
  }

  if (unit_quantity_charges && unit_quantity_charges <= 0) {
    return res.status(400).json({
      success: false,
      message: "Unit quantity charges must be a positive number",
    });
  }

  try {
    // Check if service exists for this branch
    const [existing] = await db.query(
      "SELECT service_type FROM Service WHERE service_type = ? AND branch_id = ?",
      [serviceType, req.user.branch_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found for this branch",
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (unit_quantity_charges) {
      updateFields.push("unit_quantity_charges = ?");
      updateValues.push(unit_quantity_charges);
    }

    if (availability) {
      updateFields.push("availability = ?");
      updateValues.push(availability);
    }

    updateValues.push(serviceType, req.user.branch_id);

    const updateQuery = `
      UPDATE Service 
      SET ${updateFields.join(", ")} 
      WHERE service_type = ? AND branch_id = ?
    `;

    await db.query(updateQuery, updateValues);

    // Log the action
    await db.query("INSERT INTO staff_logs (username, action) VALUES (?, ?)", [
      req.user.username,
      `Updated service: ${serviceType}`,
    ]);

    // Get updated service
    const [updated] = await db.query(
      "SELECT service_type, unit_quantity_charges, availability FROM Service WHERE service_type = ? AND branch_id = ?",
      [serviceType, req.user.branch_id]
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updated[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating service",
      error: err.message,
    });
  }
};

// DELETE /services/:serviceType - Delete a service (soft delete by setting availability to 'Unavailable')
export const deleteService = async (req, res) => {
  console.log("DELETE /services received:", req.params.serviceType);

  const { serviceType } = req.params;

  try {
    // Check if service exists for this branch
    const [existing] = await db.query(
      "SELECT service_type FROM Service WHERE service_type = ? AND branch_id = ?",
      [serviceType, req.user.branch_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found for this branch",
      });
    }

    // Soft delete by setting availability to 'Unavailable'
    await db.query(
      "UPDATE Service SET availability = 'Unavailable' WHERE service_type = ? AND branch_id = ?",
      [serviceType, req.user.branch_id]
    );

    // Log the action
    await db.query("INSERT INTO staff_logs (username, action) VALUES (?, ?)", [
      req.user.username,
      `Disabled service: ${serviceType}`,
    ]);

    res.status(200).json({
      success: true,
      message: "Service disabled successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while disabling service",
      error: err.message,
    });
  }
};
