/* 
  
 Title : Uptime Monitoring Appliction
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// dependencies

const http = require("http");
const {handleResRes} = require('../helpers/ReqResHandler');
const environment = require('../helpers/environments');

// app object  - module scaffolding

const server = {};

// configuration

server.config = {
  PORT: environment.PORT,
};

// create server

server.createServer = () => {
  const createServer = http.createServer(server.handleResRes);
  createServer.listen(server.config.PORT, () => {
    console.log(`listening port ${server.config.PORT}...`);
  });
};



server.init = () =>{
  // handle request response
  server.handleResRes = handleResRes
  // starting server
  server.createServer();
}


module.exports = server;


