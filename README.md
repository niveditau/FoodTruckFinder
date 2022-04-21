# FoodTruckFinder
This is a node.js app to get the food truck locations.

I have delegated the querying for locations to the Postgres SQL geospatial database  via its  Postgres PostGIS extension. For displaying user interface it uses .pug layout files. For displaying food truck locations on the map it uses Open Street Maps. Express is used for handling HTTP requests. It uses Mocha Chai for unit and integration tests.
This project uses three tier architecture. First layer is the frontend that calls the API layer and API layer calls the database layer to query for the data. Following diagram describes the architecture of the app.

<img width="854" alt="Screen Shot 2021-06-06 at 6 28 40 PM" src="https://user-images.githubusercontent.com/2191681/120948466-1bc43f80-c6f7-11eb-9be1-6647546a37eb.png">

This architecture can be completely converted to a microservice based architecture by using containers. Postgres PostGIS is already running in a contaienr and the nodejs application can be containerized easily. We can then deploy the application in any cloud offering that supports containers such as kubernetes.

Supported queries:
1. User can query food truck locations by longitude, latitude and radius. Query will return the food truck locations within the given radius from the longitude and latitude.
2. User can query food truck locations by name. Query will return the food truck locations with matching name(applicant).
3. User can query food truck locations by food item. Query will return the food truck locations by matching food item.
