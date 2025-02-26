const fs = require('fs');
const YAML = require('yaml');

//load input file
const file = fs.readFileSync('./config.yaml', 'utf8');

//use yaml module to parse as js object
const obj = YAML.parse(file);

var results = [];

function runTest()
{
    //run first time immediately
    obj.forEach(endpoint => {
        fetchData(endpoint);
        });

    //use set interval to run ever 15s
    setInterval(() => {
           obj.forEach(endpoint => {
    fetchData(endpoint);
    });
    }, 15000);
 
}

async function fetchData(endpoint) {
    try {
      //gets start time
      let start = performance.now();
      
      //use fetch to initiate request, uses provided data if they exist, otherwise uses defaults
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body
      });
      let end = performance.now();
      //calculate time spent on request to get latency
      let time = end - start;
      
      //result obj to old current run
      var result = {"status": response.status, "latency": time};

      //set healthcheck result depending on latency and return code
      if(result.status >= 200 && result.status < 300 && result.latency < 500)
      {
        result.hc = "UP";
      }
      else
      {
        result.hc = "DOWN";
      }

      if(results[endpoint.url])
      {
        results[endpoint.url].push(result);
        calculatePercentage(results[endpoint.url], endpoint.url);
      }
      else
      {
        results[endpoint.url] = [];
        results[endpoint.url].push(result);
        calculatePercentage(results[endpoint.url], endpoint.url);
      }
      
      //log the current run result
      console.log(result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

  //print % availability for the endpoint url
  function calculatePercentage(obj, url)
  {
    let size = obj.length;
    let totalUp = 0;
    obj.forEach(run => {
        if (run.hc == 'UP')
            totalUp ++;
    });
    console.log(url + " has " + parseInt(100 * (totalUp / size)) +  "% availability (" + totalUp + "/" + size + ")");
  }

runTest();