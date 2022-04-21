var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var myIndex = require('./routes/index');
var databaseQueryHandler = require('./routes/database/dbQueryHandler');
const assert = require('assert').strict;

describe("Unit test", function() {
    after(function() {
        databaseQueryHandler.endDatabaseConnection();
    });
    it("paramter checking", function() {
        const expectedError = new Error("parameters long/lat/radius cannot be null.");

        databaseQueryHandler.findFoodTrucksByCoordinates(null, null, null).catch(error => {
            assert.notStrictEqual(error, expectedError);
        });
    });
    it("Should return food truck locations", async function() {
        var response = await databaseQueryHandler.findFoodTrucksByCoordinates(-122.391265350599, 37.7638112772906, 1000);
        assert.strictEqual(response.features.length, 51);
    });
    it("Should return 0 locations for non existing longiude and latitude", async function() {
        var response = await databaseQueryHandler.findFoodTrucksByCoordinates(-1, 3, 1000);
        assert.strictEqual(response.features, null);
    });
    it("Should return 7 locations for non existing longiude and latitude",  async function() {
        var response =  await databaseQueryHandler.findFoodTrucksByApplicant("grill");
        assert.strictEqual(response.features.length, 7);
    });
    it("Should return 12 locations for non existing longiude and latitude",  async function() {
        var response =  await databaseQueryHandler.findFoodTrucksByFoodItem("pita");
        assert.strictEqual(response.features.length, 12);
    });
});