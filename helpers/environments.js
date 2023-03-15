/* 
  
 Title : environment  
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:13.3.23
 
*/

// app object  - module scaffolding

const environment = {};


environment.staging = {
    PORT:3000,
    envName:'staging',
    secretKey:'mySecretKey'
}


environment.production = {
    PORT:5000,
    envName:'production',
    secretKey:'mySecretKey'
}


// determine which environment was passed 


const currentEnvironment  = typeof(process.env.NODE_ENV) ==='string' ? process.env.NODE_ENV : 'staging'


// export corresponsing environment object


const environmentToExport = typeof(environment[currentEnvironment])==='object' ? environment[currentEnvironment]: environment.staging

module.exports =  environmentToExport;
