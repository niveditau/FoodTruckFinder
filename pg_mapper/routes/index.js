var express = require('express');
var router = express.Router();
var databaseQueryHandler = require("./database/dbQueryHandler");

// read the credentials from the environment into the process
// to avoid checking them in as part of the code
require('dotenv').config(); 

/**
 * This function triggers a query to the query handler class
 * to search the food trucks by given longitude, latitude and radius
 * and renders the response data in the map in the UI
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function findTrucksByLocation (req, res, next) {
  // Make sure all the required query parameters are provided
  if(!req.query.lat || !req.query.long || !req.query.radius) {
    throw new Error("paramters lat, long and radius must be supplied to show the results");
  }

  var data = await databaseQueryHandler.findFoodTrucksByCoordinates(req.query.long, req.query.lat, req.query.radius)
  .catch(e => {
    throw e;
  });

  if (data.features) {
    res.render('map', {
      title: "San Francisco: Food truck finder", // Give a title to our page
      jsonData: data, // Pass data to the View
      lat: req.query.lat,
      long: req.query.long
    });
  } else {
    res.locals.message = "No food truck found matching location[" 
    + req.query.lat + ","
    + req.query.long + "]";
    res.render('nodata');
  }
}

/**
 * This function triggers a query to the query handler class
 * to search the food trucks by given applicant value
 * and renders the response data in the map in the UI
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function findTrucksByApplicant (req, res, next) {
  // Make sure all the required query parameters are provided
  if(!req.query.applicant) {
    throw new Error("paramter applicant must be supplied to show the results");
  }

  var data = await databaseQueryHandler.findFoodTrucksByApplicant(req.query.applicant)
    .catch(e => {
      throw e;
    });
  // We will need to pass lat and long to set the center of the map
  // Here we will use lat and long of one of the locations returned in query response
  var truckLocation = null;
  if (data.features && data.features.length > 0) {
    // pick the first item in the array
    truckLocation = data.features[0];

    res.render('map', {
      title: "San Francisco: Food truck finder", // Give a title to our page
      jsonData: data, // Pass data to the View
      lat: truckLocation.properties.latitude,
      long: truckLocation.properties.longitude
    });
  } else {
    res.locals.message = "No food truck found matching name " + req.query.applicant + ".";
    res.render('nodata');
  }
}

/**
 * This function triggers a query to the query handler class
 * to search the food trucks by given fooditem value
 * and renders the response data in the map in the UI
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function findTrucksByFoodItem (req, res, next) {
  // Make sure all the required query parameters are provided
  if(!req.query.fooditem) {
    throw new Error("paramter fooditem must be supplied to show the results");
  }

  var data = await databaseQueryHandler.findFoodTrucksByFoodItem(req.query.fooditem)
    .catch(e => {
      throw e;
    });
  // We will need to pass lat and long to set the center of the map
  // Here we will use lat and long of one of the locations returned in query response
  var truckLocation = null;
  if (data.features && data.features.length > 0) {
    // pick the first item in the array
    truckLocation = data.features[0];

    res.render('map', {
      title: "San Francisco: Food truck finder", // Give a title to our page
      jsonData: data, // Pass data to the View
      lat: truckLocation.properties.latitude,
      long: truckLocation.properties.longitude
    });
  } else {
    res.locals.message = "No food truck found matching food item " + req.query.fooditem + ".";
    res.render('nodata');
  }
}

/* Set the routes for different urls. */
router.get('/findtrucks/bylocation', async function(req, res, next) {
  await findTrucksByLocation(req, res, next).catch(e => {
    next(e);
  })
});

router.get('/findtrucks/byapplicant', async function(req, res, next) {
  await findTrucksByApplicant(req, res, next).catch(e => {
    next(e);
  })
});

router.get('/findtrucks/byfooditem', async function(req, res, next) {
  await findTrucksByFoodItem(req, res, next).catch(e => {
    next(e);
  })
});

module.exports = router;
