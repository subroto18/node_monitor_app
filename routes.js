/* 

 Title : Uptime Monitoring Appliction
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// dependencies

const {sampleHandler} = require('./handlers/routeHandler/sampleHandler');
const {aboutHandler} = require('./handlers/routeHandler/aboutHandler');
const {userHandler} = require('./handlers/routeHandler/userHandler');


// app object  - module scaffolding

const routes = { 
    'sample':sampleHandler,
    'user':userHandler,
}


module.exports = routes;