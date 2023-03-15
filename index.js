/* 
  
 Title : Uptime Monitoring Appliction
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// dependencies

const http = require("http");
const {handleResRes} = require('./helpers/ReqResHandler');
const environment = require('./helpers/environments');

// app object  - module scaffolding

const app = {};

// configuration

app.config = {
  PORT: environment.PORT,
};

// create server

app.createServer = () => {
  const server = http.createServer(app.handleResRes);
  server.listen(app.config.PORT, () => {
    console.log(`listening port ${app.config.PORT}...`);
  });
};


// handle request response

app.handleResRes = handleResRes

// starting server

app.createServer();
