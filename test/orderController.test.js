const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const supertest = require("supertest");
const { app } = require("../server"); // Assuming you have an express app
const PurchaseOrder = require("../models/PurchaseOrder");
const OrderController = require("../controllers/OrderController");

describe("Order Controller", function () {
  
  describe("GET /fetchOrdersForSupplier", function () {
    it("should fetch orders for a supplier", function (done) {
      const req = {
        user: { supplierID: 1 }, // Mock supplier ID
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Mock PurchaseOrder.findAll
      const findAllStub = sinon.stub(PurchaseOrder, "findAll").callsFake((query) => {
        return Promise.resolve([{ orderID: 1, supplierID: 1 }]);
      });

      OrderController.fetchOrdersForSupplier(req, res);

      // Verify response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: "Orders fetched successfully", orders: [{ orderID: 1, supplierID: 1 }] })).to.be.true;
        findAllStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });

    it("should return 400 if supplier ID is missing", function (done) {
      const req = { user: {} }; // No supplier ID
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      OrderController.fetchOrdersForSupplier(req, res);

      // Verify response
      setTimeout(() => {
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: "Supplier ID is required" })).to.be.true;
        done();
      }, 100);
    });
  });

  describe("GET /fetchOrdersForInspection", function () {
    it("should fetch orders for inspection if user is a quality inspector", function (done) {
      const req = { user: { role: "quality inspector" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Mock PurchaseOrder.findAll
      const findAllStub = sinon.stub(PurchaseOrder, "findAll").callsFake(() => Promise.resolve([{ orderID: 1, status: "confirmed", qualityInspectionStatus: "pending" }]));

      OrderController.fetchOrdersForInspection(req, res);

      // Verify response
      setTimeout(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: "Orders fetched for inspection", orders: [{ orderID: 1, status: "confirmed", qualityInspectionStatus: "pending" }] })).to.be.true;
        findAllStub.restore(); // Restore the stubbed method
        done();
      }, 100);
    });

    it("should return 403 if user is not a quality inspector", function (done) {
      const req = { user: { role: "admin" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      OrderController.fetchOrdersForInspection(req, res);

      // Verify response
      setTimeout(() => {
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: "Forbidden" })).to.be.true;
        done();
      }, 100);
    });
  });

  
  
});

