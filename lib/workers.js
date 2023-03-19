/* 
  
 Title : Uptime Monitoring Appliction
 Description: A RESTFUL api to monitor up or down time of user defined links
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

const data = require("./data");
const {JSON_PARSE} = require('../helpers/utilities')
const url = require('url');
const http = require('http');
const https = require('https');
// dependencies


// app object  - module scaffolding

const worker = {};

// configuration


// create server



// lookup all the checks

worker.gatherAllChecks = () =>{

    data.list('checks',(err,fileNames)=>{

      if(!err && fileNames && fileNames.length>0){
        fileNames.forEach(check=>{
            data.read('checks',check,(error,OriginalCheckData)=>{
                if(!error && OriginalCheckData){
                    worker.validateCheckData(JSON_PARSE(OriginalCheckData));
                }else{
                    console.log('Error: reading one of the check data');
                }
        
            })
        })
      }else{
          console.log('Error: could not find any checks to process!');
      }
    })

    //get all the checks

}

// validate individual check data
worker.validateCheckData = (OriginalCheckData) =>{
    let originalCheckData = OriginalCheckData;

   if(originalCheckData && originalCheckData.id){

       originalCheckData.state = typeof(originalCheckData.state)==='string' && ['up','down'].indexOf(originalCheckData.state)> -1 ? originalCheckData.state : 'down';
       originalCheckData.lastChecked = typeof(originalCheckData.lastChecked)==='number' && originalCheckData.lastChecked > 0    ? originalCheckData.lastChecked : false;

       // pass to the next process
      worker.performCheck(originalCheckData);

   }else{
       console.log('Error :  check was invalid or not properly formatted! ');
   }
}



worker.performCheck = (OriginalCheckData) =>{
    // parse the hostname & full url from original data

    const parseUrl = url.parse(`${OriginalCheckData.protocol}://${OriginalCheckData.url}`,true)
    const hostName = parseUrl.hostname;
    const {path} = parseUrl;
    
    // construct the request

    const requestDetails = {
        protocol :`${OriginalCheckData.protocol}`,
        hostName:hostName,
        method:OriginalCheckData.method.toUpperCase(),
        path,
        timeout:OriginalCheckData.timeoutSeconds *1000
    }



    // mark the outcome has not beenn sent yet



  
    const protocolToUse = OriginalCheckData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;
        // update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outcomeSent) {
            worker.processCheckOutcome(OriginalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });


    console.log(req);



//     req.on('error',(e) =>{
//      console.log(e)

//      checkOutCome = {
//          error:true,
//          value:e
//      }

//      if(!outcomeSent){
//         worker.processCheckOutcome(OriginalCheckData,checkOutCome)
//     }
//     })

//     req.on('timeout',(e)=>{
       
//      checkOutCome = {
//         error:true,
//         value:'timeOut'
//     }

//     if(!outcomeSent){
//        worker.processCheckOutcome(OriginalCheckData,checkOutCome)
//    }
//     })
//     req.end()
}


worker.processCheckOutcome = (originalCheckData,checkOutCome) =>{
    let state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) >-1 ? 'up' : 'down';

    let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true :false;

    newCheckData.state  = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk

    data.update('checks',newCheckData.id,newCheckData,(err)=>{
        if(!err){

            if(alertWanted){
       // send the checkdtaa to next process
       worker.alertUserToStateChange(newCheckData)
            }

     

        }else{
            console.log('Error trying to save check data of one of the checks!');
        }
    })
}


worker.alertUserToStateChange =  (originalCheckData,checkOutCome) =>{
    // inplement the twilio here..

    console.log('sending msg as state has send');
}


// looping the worker

worker.loop = () =>{
    setInterval(()=>{
        worker.gatherAllChecks();
    },1000*60)
}


worker.init = () =>{
  // execute all the checks
  worker.gatherAllChecks();

  // call the loop 

 // worker.loop();

  console.log('worker in running.....');
}


module.exports = worker;


