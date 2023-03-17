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
const {registerHandler} = require('./handlers/routeHandler/registrationHandler');
const {loginHandler} = require('./handlers/routeHandler/loginHandler');
const {checksHandler} = require('./handlers/routeHandler/checksHandler');
// app object  - module scaffolding

const routes = { 
    'sample':sampleHandler,
    'user':userHandler,
    'register':registerHandler,
    'login':loginHandler,
    'checks':checksHandler,
}


module.exports = routes;