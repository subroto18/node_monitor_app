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
const {JSON_PARSE,createToken} = require('../helpers/utilities')

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

       // if login success set a token in login cookie and send it to client also

        if(payload.message==='Authorized'){

          // make a token using users phone number
          const token = createToken(requestProperties.body.phone);
          // return the final response
          res.setHeader('Content-Type','application/json')
          res.writeHead(statusCode, { 
            'Set-Cookie':`token=${token}; expires=`+new Date(new Date().getTime()+86409000).toUTCString(),
          });

          // convert stringify data to json and put tokan then again convert into stringify

          let payloadData = JSON.parse(payloadString);
          payloadData.token = token;
          res.end(JSON.stringify(payloadData));

         }else{

             // return the final response
            res.setHeader('Content-Type','application/json')
            res.end(payloadString);
             
         }





   
  });

    // response handle

});

};

// starting server

module.exports =  responseHandler;
