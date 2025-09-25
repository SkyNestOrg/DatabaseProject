import db from '../db/connection.js';
import { SERVICE_STATUS, SERVICE_TYPES } from '../constants.js';

export const getDueService = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
            sr.service_request_id,
            sr.request_type,
            sr.status,
            sr.room_number,
            g.first_name,
            g.last_name
            FROM service_request sr
            JOIN booking b ON sr.booking_id = b.booking_id
            JOIN guest g ON b.guest_id = g.guest_id
            WHERE sr.status = ?`,
            [SERVICE_STATUS.PENDING]
        );
        res.json(rows);
    }
    catch (error) {
        console.log("Error Fetching Due Services:", error);
        res.status(500).json({ message: "Server Error"});
    }
};

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
            return res.status(404).json({message: "Service Request not found"});
        }

        const request = requests[0];

        // getting service price
        const [services] = await connection.query(
            "SELECT unit_quantity_charges FROM service WHERE service_type = ? AND branch_id = ?",
            [request.request_type, request.branch_id]
        );

        if (services.length === 0) {
            await connection.rollback();
            return res.status(404).json({message: "Service type not found"});
        }

        const service = services[0];
        console.log("service is this :", service);

        const serviceCharge = service.unit_quantity_charges * request.quantity;
        console.log("Service Charge:", serviceCharge);

        // if service is already completed
        if (request.status === SERVICE_STATUS.COMPLETED) {
            await connection.rollback();
            return res.status(400).json({message: "Service Request is already completed"});
        }

        // updating service request status to completed
        await connection.query(
            `UPDATE service_request
            SET status = ?
            WHERE service_request_id = ?`,
            [SERVICE_STATUS.COMPLETED, id]
        );

        // inserting into billing table
        // never try to touch a generated column manually (grand total)
        // mysql will automatically calculate it for me
        await connection.query(
            `UPDATE bill b
             JOIN booking bk ON b.bill_id = bk.bill_id
             SET b.service_total = b.service_total + ?
             WHERE bk.booking_id = ?`,
             [serviceCharge, request.booking_id]
        );

        await connection.commit();

        res.json({
            message: "Service Request status updated to completed",
            costadded: serviceCharge
        });

    }
    catch (error) {
        console.log("Error Updating Service Status:", error);
        res.status(500).json({ message: "Server Error" });
    }
    finally {
        connection.release();
    }
};