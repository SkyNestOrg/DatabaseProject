import db from '../db/connection.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Fetch total number of all service requests
        const [totalRequests] = await db.query(
            'SELECT COUNT(*) AS total FROM service_request'
        );

        // fetch number of completed services
        const [completedServices] = await db.query(
            'SELECT COUNT(*) AS completed FROM service_request WHERE status = "completed"'
        );

        // fetch number of pending services
        const [pendingServices] = await db.query(
            'SELECT COUNT(*) AS pending FROM service_request WHERE status = "pending"'
        );

        // fetch number of cancelled services
        const [cancelledServices] = await db.query(
            'SELECT COUNT(*) AS cancelled FROM service_request WHERE status = "cancelled"'
        );
        
        res.status(200).json({
            totalRequests: totalRequests[0].total,
            completedServices: completedServices[0].completed,
            pendingServices: pendingServices[0].pending,
            cancelledServices: cancelledServices[0].cancelled
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};