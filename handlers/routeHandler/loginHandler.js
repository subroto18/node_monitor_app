/* 
  
 Title : registration handler 
 Description: catching the data from request 
 Author :Subroto chakraborty
 Date:16.3.23
 
*/

// dependencies

const {read,create} = require("../../lib/data");
const data = require("../../lib/data");
// const data = require("../../lib/data");

const storage = require('node-sessionstorage')

const {hash,JSON_PARSE,createToken,setCookie} = require('../../helpers/utilities')

// app object  - module scaffolding

const handler = {};

handler.loginHandler = (requestProperties,callback) => {

    const requestMethod = ['post'];

    if(requestMethod.indexOf(requestProperties.method)!==-1){
        handler._login[requestProperties.method](requestProperties,callback);
    }else{
        callback(405,{
            'message':"Method not allowed"
        });
    
    } 
}


handler._login = {};


handler._login.post = (requestProperties,callback) =>{

 
    const phone = typeof(requestProperties.body.phone)==="number" && requestProperties.body.phone.toString().length>=10 ? requestProperties.body.phone:false;

    const password = typeof(requestProperties.body.password)==="string" && requestProperties.body.password.trim().length>5 ? requestProperties.body.password:false;

    if(phone &&  password ){

        // make sure that the user data is not there in data file
        // first parameter is folder name
        // second parameter is file name

        read('users',phone,(err,user)=>{
            const n_user = {...JSON_PARSE(user)}
            if(!err && user){
                if(n_user.password===hash(password)){
                    callback(200,{
                        'message':'Authorized',
                    });  
                }else{
                    callback(403,{
                        'message':'Unauthorized'
                    }); 
                }

            }else{
                callback(403,{
                    'message':'Unauthorized'
                });  
            }
        })

    }else{
        callback(403,{
            'message':'phone  not found'
        })
    }


}



// export handler

module.exports = handler;


