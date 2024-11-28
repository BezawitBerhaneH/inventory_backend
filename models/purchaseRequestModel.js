const db = require('./db'); // Database connection

const purchaseRequestModel = {
    // Fetch all purchase requests
    getAllRequests: (callback) => {
      const sql = `SELECT pr.requestID, pr.itemDetails, pr.quantity, pr.deliveryRequirements, pr.status, 
                          pr.requestDate, sa.name AS requestedBy
                   FROM purchaseRequest pr
                   JOIN systemadmin sa ON pr.requestedBy = sa.userID`; // Use userID to link the system admin
      db.query(sql, callback);
    },
  
    // Approve a purchase request
    approveRequest: (requestID, callback) => {
      const sql = `UPDATE purchaseRequest SET status = 'Approved' WHERE requestID = ?`;
      db.query(sql, [requestID], callback);
    },
  
    // Decline a purchase request
    declineRequest: (requestID, callback) => {
      const sql = `UPDATE purchaseRequest SET status = 'Declined' WHERE requestID = ?`;
      db.query(sql, [requestID], callback);
    }
  };
  
  module.exports = purchaseRequestModel;