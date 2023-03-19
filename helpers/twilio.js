/* 
  
 Title : twilio notifacation  
 Description: importance utilitis function
 Author :Subroto chakraborty
 Date:18.3.23
 
*/

// dependencies

const https = require('https');
const querystring = require('querystring');
const {twilio} = require('../helpers/environments');


// app object  - module scaffolding

const twilio = {};

twilio.sendSms = (phone,msg,callback) =>{
    const userPhone = typeof(phone) ==='string' && phone.trim().length>=10 ? phone.trim() : false;
    const userMsg = typeof(msg) ==='string' && msg.trim().length>=10 ? msg.trim() : false;

    if(userPhone && userMsg){
        const payload = {
            From :twilio.fromPhone,
            To:`+91${userPhone}`,
            Body:userMsg
        }

        const stringifyPayload = querystring.stringify(payload);

                // configure the request details
                const requestDetails = {
                    hostname: 'api.twilio.com',
                    method: 'POST',
                    path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
                    auth: `${twilio.accountSid}:${twilio.authToken}`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };


        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();

    }else{
        callback('Invalid input')
    }
}


//  string to json convertion 


    



module.exports =  twilio;
