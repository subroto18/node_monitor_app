/* 
  
 Title : Inital file
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

const server = require('./lib/server')
const workers = require('./lib/workers')

// app object  - module scaffolding

const app = {};


// create server



app.init  = () =>{
  // start the server
  server.init()
  // start the worker
  workers.init();
}

app.init();

// handle request response



// starting server

module.exports = app;
