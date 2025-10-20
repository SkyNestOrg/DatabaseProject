import db from "../../db.js";
import {
  SERVICE_STATUS,
  SERVICE_TYPES,
} from "./serviceOfficeConstants/constants.js";

export const updateServiceStatus = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(id))
    return res.status(400).json({ message: "Invalid service request ID" });

  // to use atomic transactions (all or nothing)
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [requests] = await connection.query(
      "SELECT * FROM service_request WHERE service_request_id = ?",
      [id]
    );
    console.log("requests is this :", requests);

    if (requests.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Service Request not found" });
    }

    const request = requests[0];

    // Security: ensure the staff's branch matches the service request's branch
    const staffBranchId = req.user?.branch_id;
    if (!staffBranchId) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Branch information missing in token" });
    }

    if (request.branch_id !== staffBranchId) {
      await connection.rollback();
      return res.status(403).json({
        message: "Not authorized to modify requests from other branches",
      });
    }

    // getting service price
    const [services] = await connection.query(
      "SELECT unit_quantity_charges FROM service WHERE service_type = ? AND branch_id = ?",
      [request.request_type, request.branch_id]
    );

    if (services.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Service type not found" });
    }

    const service = services[0];
    console.log("service is this :", service);

    const serviceCharge =
      (service.unit_quantity_charges || 0) * request.quantity;
    console.log("Service Charge:", serviceCharge);

    // if service is already completed
    if (request.status === SERVICE_STATUS.COMPLETED) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Service Request is already completed" });
    }

    // updating service request status to completed
    // The database trigger will automatically update the bill
    await connection.query(
      `UPDATE service_request
            SET status = ?
            WHERE service_request_id = ? AND status != ?`,
      [SERVICE_STATUS.COMPLETED, id, SERVICE_STATUS.COMPLETED]
    );

    // Check if the update actually happened (prevents race conditions)
    const [updatedRows] = await connection.query(
      "SELECT ROW_COUNT() as affected_rows"
    );

    if (updatedRows[0].affected_rows === 0) {
      await connection.rollback();
      return res.status(400).json({
        message:
          "Service Request is already completed or was updated by another process",
      });
    }

    await connection.commit();
    console.log(
      "Service charge will be added to bill by trigger:",
      serviceCharge
    );
    res.json({
      message: "Service Request status updated to completed",
      costadded: serviceCharge,
    });
  } catch (error) {
    console.log("Error Updating Service Status:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};
// Note: The actual bill update is handled by a database trigger for data integrity
// This ensures that even if multiple updates occur, the bill remains consistent
// and accurate without relying solely on application logic.
