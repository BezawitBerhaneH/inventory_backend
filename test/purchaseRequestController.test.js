const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const supertest = require("supertest");
const { app } = require("../server"); // Assuming you have an express app
const purchaseRequestController = require("../controllers/purchaseRequestController");
const purchaseRequestModel = require("../models/purchaseRequestModel");
const { authMiddleware } = require("../controllers/LoginController");



describe("Purchase Request Controller", function () {

  describe("POST /createRequest", function () {
    it("should create a new purchase request for users of specific department", function (done) {
      const req = {
        body: {
          itemDetails: "Item 1",
          quantity: 10,
          deliveryRequirements: "Urgent",
        },
        user: { role: "department", userID: 1 }, // Mock authenticated user with role 'department'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Mock purchaseRequestModel.createRequest to simulate successful DB operation
      const createRequestStub = sinon.stub(purchaseRequestModel, "createRequest").callsFake((itemDetails, quantity, deliveryRequirements, requestedBy, callback) => {
        callback(null);
      });

      purchaseRequestController.createRequest[1](req, res); // Call the controller method

      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ message: "Purchase request created successfully" })).to.be.true;
        createRequestStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });

    it("should return 403 if the user is not from the allowed department", function (done) {
      const req = {
        body: {
          itemDetails: "Item 1",
          quantity: 10,
        },
        user: { role: "procurement officer", userID: 1 },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      purchaseRequestController.createRequest[1](req, res);

      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: "Forbidden" })).to.be.true;
        done();
      }, 100);
    });

    it("should return 400 if item details or quantity is missing", function (done) {
      const req = {
        body: {},
        user: { role: "department", userID: 1 },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      purchaseRequestController.createRequest[1](req, res);

      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: "Item details and quantity are required" })).to.be.true;
        done();
      }, 100);
    });
  });

  // You can create similar test cases for other methods like getAllRequests, approveRequest, etc.
  describe("GET /getAllRequests", function () {
    it("should return all purchase requests for procurement officers", function (done) {
      const req = {
        user: { role: "procurement officer" }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.getAllRequests to simulate successful DB operation
      const getAllRequestsStub = sinon.stub(purchaseRequestModel, "getAllRequests").callsFake((callback) => {
        callback(null, [{ requestID: 1, itemDetails: "Item 1" }]);
      });
  
      purchaseRequestController.getAllRequests[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ purchaseRequests: [{ requestID: 1, itemDetails: "Item 1" }] })).to.be.true;
        getAllRequestsStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });
  
    it("should return 403 if the user is not a procurement officer", function (done) {
      const req = {
        user: { role: "department" }, // Mock authenticated user with role 'department'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      purchaseRequestController.getAllRequests[1](req, res);
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: "Forbidden" })).to.be.true;
        done();
      }, 100);
    });
  });
  // moreeeeeeeeeeee
  describe("GET /getRequestsByDepartment", function () {
    it("should return purchase requests for the specific department", function (done) {
      const req = {
        user: { role: "department", userID: 1 }, // Mock authenticated user with role 'department'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.getRequestsByUser to simulate successful DB operation
      const getRequestsByUserStub = sinon.stub(purchaseRequestModel, "getRequestsByUser").callsFake((userID, callback) => {
        callback(null, [{ requestID: 1, itemDetails: "Item 1" }]);
      });
  
      purchaseRequestController.getRequestsByDepartment[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ departmentRequests: [{ requestID: 1, itemDetails: "Item 1" }] })).to.be.true;
        getRequestsByUserStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });
  
    it("should return 403 if the user is not from the department", function (done) {
      const req = {
        user: { role: "procurement officer", userID: 1 }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      purchaseRequestController.getRequestsByDepartment[1](req, res);
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: "Forbidden" })).to.be.true;
        done();
      }, 100);
    });
  });
  describe("POST /declineRequest", function () {
    it("should decline a purchase request for procurement officers", function (done) {
      const req = {
        body: {
          requestID: 1,
        },
        user: { role: "procurement officer" }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.declineRequest to simulate successful decline
      const declineRequestStub = sinon.stub(purchaseRequestModel, "declineRequest").callsFake((requestID, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      purchaseRequestController.declineRequest[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: "Request declined successfully" })).to.be.true;
        declineRequestStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });
  
    it("should return 404 if the request is not found", function (done) {
      const req = {
        body: {
          requestID: 999, // Non-existent requestID
        },
        user: { role: "procurement officer" }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.declineRequest to simulate no affected rows
      const declineRequestStub = sinon.stub(purchaseRequestModel, "declineRequest").callsFake((requestID, callback) => {
        callback(null, { affectedRows: 0 });
      });
  
      purchaseRequestController.declineRequest[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: "Request not found" })).to.be.true;
        declineRequestStub.restore();
        done();
      }, 100);
    });
  });
  describe("POST /approveRequest", function () {
    it("should approve a purchase request for procurement officers", function (done) {
      const req = {
        body: {
          requestID: 1,
        },
        user: { role: "procurement officer" }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.declineRequest to simulate successful decline
      const declineRequestStub = sinon.stub(purchaseRequestModel, "declineRequest").callsFake((requestID, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      purchaseRequestController.declineRequest[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: "Request declined successfully" })).to.be.true;
        declineRequestStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });
  
    it("should return 404 if the request is not found", function (done) {
      const req = {
        body: {
          requestID: 999, // Non-existent requestID
        },
        user: { role: "procurement officer" }, // Mock authenticated user with role 'procurement officer'
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock purchaseRequestModel.declineRequest to simulate no affected rows
      const declineRequestStub = sinon.stub(purchaseRequestModel, "declineRequest").callsFake((requestID, callback) => {
        callback(null, { affectedRows: 0 });
      });
  
      purchaseRequestController.declineRequest[1](req, res); // Call the controller method
  
      // Verify the response
      setTimeout(() => {
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: "Request not found" })).to.be.true;
        declineRequestStub.restore();
        done();
      }, 100);
    });
  });
  
  
});
