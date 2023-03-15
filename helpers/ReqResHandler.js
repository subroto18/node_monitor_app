/* 
  
 Title : Uptime Monitoring Appliction
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// app object  - module scaffolding

const url = require("url");
const {StringDecoder} = require("string_decoder");
const routes = require('../routes');
const decoder = new StringDecoder('utf-8');
const {JSON_PARSE} = require('../helpers/utilities')

const {notFoundHandler} = require("../handlers/routeHandler/notFoundHandler");

const {create,read,update} = require("../lib/data")

const responseHandler = {};

// configuration


// handle request response

responseHandler.handleResRes = (req, res) => {


      // request handling
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;


    const decoder = new StringDecoder('utf-8');
    let realData = '';


    const requestProperties = {
      parsedUrl,
      path,
      trimmedPath,
      method,
      queryStringObject,
      headersObject,
      realData
  };


    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;


  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
});

req.on('end', () => {
    realData += decoder.end();
    requestProperties.body = JSON_PARSE(realData);
    // utilitis

     chosenHandler(requestProperties, (statusCode, payload) => {
       statusCode = typeof statusCode === 'number' ? statusCode : 500;
       payload = typeof payload === 'object' ? payload : {};

       const payloadString = JSON.stringify(payload);

      // return the final response
       res.setHeader('Content-Type','application/json')
       res.writeHead(statusCode);
       res.end(payloadString);
  });

    // response handle

});

};

// starting server

module.exports =  responseHandler;
