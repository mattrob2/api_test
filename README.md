Simple straight forward api tester written in NodeJS.

Utilizes the fetch api to continously call urls defined in config.yaml every 15s.  If params such as headers or method are preset it uses the values otherwise uses fetch api defaults.

For the basic use case it is being assumed valid data is being used.  If this were to be expanded on for a more production style solution data validation would be done on the yaml data to make sure valid data was point input.

config2.yaml used for initial testing, free endpoint that echoes request data.  Used to validate request was using the expected headers etc.  


How to run:
-----------
Run index.js using nodejs.

- clone the repo or download the zip
- cd dir
- npm install
- node index.js
