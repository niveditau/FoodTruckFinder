/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require('pg')

/**
 * This class this responsible for establishing connection with database server
 * and running different queries on database and returning the response to the caller.
 */
class databaseQueryHandler {
    /** 
     * client variable will hold the Client object that will help with database calls.
     * This variable will be used for running queries on databse
    */
    static client = null;

    /**
     * This is the constructor for the class. It will initialize the Client instance and
     * establish the connection with the database.
     */
    static initializeClient() {
        // Setup connection
        var username = process.env.USERNAME; // sandbox username
        var password = process.env.PASSWORD; // read only privileges on our table
        var host = process.env.HOST; // host to eonnect to
        var database = process.env.DATABASE; // database name
        var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database; // Your Database Connection
        databaseQueryHandler.client = new Client(conString); // Initialize Client
        databaseQueryHandler.client.connect(); // Connect with the database
    }

    /**
     * This function runs the query on the database to get the food truck locations
     * by logitude, latitude and within given radious from the given coordinates.
     * @param {*} long 
     * @param {*} lat 
     * @param {*} radius 
     */
    static findFoodTrucksByCoordinates(long, lat, radius) {
        return new Promise((resolve, reject) => {
            if (!long || !lat || !radius) {
                reject(new Error("parameters long/lat/radius cannot be null."))
            }

            if (!databaseQueryHandler.client) {
                databaseQueryHandler.initializeClient();
            }

            // The postgres SQL query is parameterized to ensure that we don't hit SQL injection attacks. 
            // see parameters $1, $2 and $3 for long, lat and radius
            const queryString = "SELECT jsonb_build_object('type',     'FeatureCollection',  'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object ( 'type',       'Feature',  'id',         locationid,  'geometry',   ST_AsGeoJSON(foodtruck_geom)::jsonb,  'properties', to_jsonb(row) - 'gid' - 'geom' ) AS feature FROM (select * from foodtrucks WHERE ST_DWithin(foodtruck_geom::geography, ST_SetSRID(ST_MakePoint( $1, $2),4326)::geography, $3)) row) features";
            var data = null;
            var query = databaseQueryHandler.client.query(new Query(queryString, [long, lat, radius]));

            query.on("row", function (row, result) {
                result.addRow(row);
            });
            query.on("end", function (result) {
                data = result.rows[0].jsonb_build_object;
                return resolve(data);
            });
        });
    }

    /**
     * This function runs the query on database to find the food trucks
     * by applicant field value
     * @param {*} applicant 
     */
    static findFoodTrucksByApplicant(applicant) {
        return new Promise((resolve, reject) => {
            if (!applicant) {
                reject(new Error("parameters applicant cannot be null."))
            }

            if (!databaseQueryHandler.client) {
                databaseQueryHandler.initializeClient();
            }

            const queryString = "SELECT jsonb_build_object('type',     'FeatureCollection',  'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object ( 'type',       'Feature',  'id',         locationid,  'geometry',   ST_AsGeoJSON(foodtruck_geom)::jsonb,  'properties', to_jsonb(row) - 'gid' - 'geom' ) AS feature FROM (select * from foodtrucks where applicant ilike '%' || $1 || '%')row) features";
            var data = null;
            var query = databaseQueryHandler.client.query(new Query(queryString, [applicant]));

            query.on("row", function (row, result) {
                result.addRow(row);
            });
            query.on("end", function (result) {
                data = result.rows[0].jsonb_build_object;
                return resolve(data);
            });
        })
    }

    /**
     * This function runs the query on database to find the food trucks
     * by fooditems field value
     * @param {*} food 
     */
    static findFoodTrucksByFoodItem(food) {
        return new Promise((resolve, reject) => {
            if (!food) {
                reject(new Error("parameters applicant cannot be null."))
            }

            if (!databaseQueryHandler.client) {
                databaseQueryHandler.initializeClient();
            }

            const queryString = "SELECT jsonb_build_object('type',     'FeatureCollection',  'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object ( 'type',       'Feature',  'id',         locationid,  'geometry',   ST_AsGeoJSON(foodtruck_geom)::jsonb,  'properties', to_jsonb(row) - 'gid' - 'geom' ) AS feature FROM (select * from foodtrucks where fooditems ilike '%' || $1 || '%')row) features";
            var data = null;
            var query = databaseQueryHandler.client.query(new Query(queryString, [food]));

            query.on("row", function (row, result) {
                result.addRow(row);
            });
            query.on("end", function (result) {
                data = result.rows[0].jsonb_build_object;
                return resolve(data);
            });
        })
    }

    // End the database connection when done
    static endDatabaseConnection() {
        databaseQueryHandler.client.end();
    }

}

module.exports = databaseQueryHandler;