var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var myIndex = require('./routes/index');
var databaseQueryHandler = require('./routes/database/dbQueryHandler');
const { expect } = require('chai');
const assert = require('assert').strict;

describe("Tests for food truck finder", function() {
    after(function() {
        databaseQueryHandler.endDatabaseConnection();
    });
    it("Should fail for null parameters", function() {
        const expectedError = new Error("parameters long/lat/radius cannot be null.");

        databaseQueryHandler.findFoodTrucksByCoordinates(null, null, null).catch(error => {
            assert.notStrictEqual(error, expectedError);
        });
    });
    it("Should return food truck locations for given longitude, latitude and radius", async function() {
        var response = await databaseQueryHandler.findFoodTrucksByCoordinates(-122.391265350599, 37.7638112772906, 1000);
        assert.strictEqual(response.features.length, 51);
    });
    it("Should return 0 locations for non existing longiude and latitude", async function() {
        var response = await databaseQueryHandler.findFoodTrucksByCoordinates(-1, 3, 1000);
        assert.strictEqual(response.features, null);
    });
    it("Should return 4 locations for applicant name 'Bob'",  async function() {
        var response =  await databaseQueryHandler.findFoodTrucksByApplicant("Bob");
        assert.strictEqual(response.features.length, 4);
        expect(response.features[0].properties.applicant).to.exist;
        expect(response.features[0].properties.applicant.includes("Bob")).to.equal(true);
    });
    it("Should return 12 locations for food item 'pita'",  async function() {
        var response =  await databaseQueryHandler.findFoodTrucksByFoodItem("pita");
        assert.strictEqual(response.features.length, 12);
        expect(response.features[0].properties.fooditems).to.exist;
        expect(response.features[0].properties.fooditems.includes("pita")).to.equal(true);
    });
});