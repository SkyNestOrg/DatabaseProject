import db from "../../db.js";
import {
  SERVICE_STATUS,
  SERVICE_TYPES,
} from "./serviceOfficeConstants/constants.js";

export const getServiceHistory = async (req, res) => {
  try {
    const branchId = req.user?.branch_id;
    if (!branchId) {
      return res
        .status(400)
        .json({ message: "Branch information missing in token" });
    }

    const { status, requestType, dateFrom, dateTo, limit, offset } = req.query;

    // pagination
    const resultLimit = parseInt(limit) || 20;
    const resultOffset = parseInt(offset) || 0;

    let sql = `
            SELECT
                sr.service_request_id,
                sr.request_type,
                sr.status,
                sr.room_number,
                sr.branch_id,
                g.first_name,
                g.last_name,
                sr.date_time,
                sr.quantity,
                COUNT(*) OVER() as total_count
            FROM service_request sr
            JOIN booking b ON sr.booking_id = b.booking_id
            JOIN guest g ON b.guest_id = g.guest_id
            WHERE sr.branch_id = ?`;

    const params = [branchId];

    //--- Filterings ---//

    // filtering with branch_id + status (indexed)
    if (status && status.trim() !== "") {
      sql += ` AND sr.status = ?`;
      params.push(status.trim());
    }
    // filtering with request type (NOT indexed)
    if (requestType && requestType.trim() !== "") {
      sql += ` AND sr.request_type = ?`;
      params.push(requestType.trim());
    }
    // filtering with date range (indexed)
    if (dateFrom && dateFrom.trim() !== "") {
      sql += ` AND sr.date_time >= ?`;
      params.push(`${dateFrom.trim()} 00:00:00`);
    }
    if (dateTo && dateTo.trim() !== "") {
      sql += ` AND sr.date_time <= ?`;
      params.push(`${dateTo.trim()} 23:59:59`);
    }
    // pagination
    sql += ` ORDER BY sr.date_time DESC LIMIT ? OFFSET ?`;
    params.push(resultLimit, resultOffset);

    console.log("Service History SQL:", sql);
    console.log("With parameters:", params);

    // Lets run the query
    const [rows] = await db.query(sql, params);
    console.log("Service History Results:", rows);

    // lets get total count for pagination
    const totalRecords = rows.length > 0 ? rows[0].total_count : 0;
    const totalPages = Math.ceil(totalRecords / resultLimit);
    const currentPage = Math.floor(resultOffset / resultLimit) + 1;
    console.log(
      `Total Records: ${totalRecords}, Total Pages: ${totalPages}, Current Page: ${currentPage}`
    );

    const cleanedRows = rows.map((row) => {
      const { total_count, ...cleanRow } = row;
      return cleanRow;
    });

    res.json({
      history: cleanedRows,
      totalRecords,
      limit: resultLimit,
      offset: resultOffset,
      filters: { status, requestType, dateFrom, dateTo },
    });
  } catch (error) {
    console.log("Error Fetching Service History:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
