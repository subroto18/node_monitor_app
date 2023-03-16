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

const {hash,JSON_PARSE,createToken,setCookie} = require('../../helpers/utilities')

// app object  - module scaffolding

const handler = {};

handler.registerHandler = (requestProperties,callback) => {

    const requestMethod = ['post'];

    if(requestMethod.indexOf(requestProperties.method)!==-1){
        handler._register[requestProperties.method](requestProperties,callback);
    }else{
        callback(405,{
            'message':"Method not allowed"
        });
    
    } 
}


handler._register = {};


handler._register.post = (requestProperties,callback) =>{

    const firstName = typeof(requestProperties.body.firstName)==="string" && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName:false;

    const lastName = typeof(requestProperties.body.lastName)==="string" && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName:false;


    const phone = typeof(requestProperties.body.phone)==="number" && requestProperties.body.phone.toString().length>=10 ? requestProperties.body.phone:false;


    const password = typeof(requestProperties.body.password)==="string" && requestProperties.body.password.trim().length>5 ? requestProperties.body.password:false;

    const toAggrement = typeof(requestProperties.body.toAggrement)==="boolean"  ? requestProperties.body.toAggrement:false;

    if(firstName && lastName && phone && password && toAggrement ){


        // make sure that the user data is not there in data file

        // first parameter is folder name
        // second parameter is file name

      read('users',phone,(err,data)=>{
          if(err){

            const userObj =  {
                firstName,
                lastName,
                phone,
                toAggrement,
                password:hash(password)
            }


            create('users',phone,userObj,(error)=>{
                if(!error){
                    callback(200,{
                        message:'user has been created successfully'
                    })
                }else{
                    callback(500,{
                        'message':'Server error'
                    })
                }
            })

          }else{
            callback(500,{
                'message':'Server error'
            })
          }
      })

    }else{
        callback(400,{
            'message':'Error in request body'
        })
    }


 }



// export handler

module.exports = handler;


