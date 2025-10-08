import db from '../db/connection.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Ensure branch-based filtering: only show stats for the staff's branch
        const branchId = req.user?.branch_id;
        if (!branchId) return res.status(400).json({ error: 'Branch information missing in token' });

        // Fetch total number of all service requests for this branch
        const [totalRequests] = await db.query(
            'SELECT COUNT(*) AS total FROM service_request WHERE branch_id = ?',
            [branchId]
        );

        // fetch number of completed services for this branch
        const [completedServices] = await db.query(
            'SELECT COUNT(*) AS completed FROM service_request WHERE status = "completed" AND branch_id = ?',
            [branchId]
        );

        // fetch number of pending services for this branch
        const [pendingServices] = await db.query(
            'SELECT COUNT(*) AS pending FROM service_request WHERE status = "pending" AND branch_id = ?',
            [branchId]
        );

        // fetch number of cancelled services for this branch
        const [cancelledServices] = await db.query(
            'SELECT COUNT(*) AS cancelled FROM service_request WHERE status = "cancelled" AND branch_id = ?',
            [branchId]
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