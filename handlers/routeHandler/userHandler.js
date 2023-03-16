/* 
  
 Title : user handler 
 Description: catching the data from request 
 Author :Subroto chakraborty
 Date:14.3.23
 
*/

// dependencies



const {read,create} = require("../../lib/data");
const data = require("../../lib/data");
// const data = require("../../lib/data");

const {hash,JSON_PARSE,checkAuthorization} = require('../../helpers/utilities')

// app object  - module scaffolding

const handler = {};

handler.userHandler = (requestProperties,callback) => {

    const requestMethod = ['post','get','put','patch','delete'];

    if(requestMethod.indexOf(requestProperties.method)!==-1){
        handler._users[requestProperties.method](requestProperties,callback);
    }else{
        callback(405,{
            'message':"Method not allowed"
        });
    
    }

   
}

handler._users = {};

handler._users.get = (requestProperties,callback) =>{


   let auth  = checkAuthorization(requestProperties);

    if(auth){
        const phone = typeof(requestProperties.queryStringObject.phone)==="string" && 
        requestProperties.queryStringObject.phone.trim().length>=10 ? requestProperties.queryStringObject.phone:false;
    
        if(phone){
            let phone = requestProperties.queryStringObject.phone;
    
            read('users',phone,(err,user)=>{
                const n_user = {...JSON_PARSE(user)}
                if(!err && user){
                    delete n_user.password;
                    callback(200,n_user);
                }else{
                    callback(404,{
                        'message':'user not found'
                    });  
                }
            })
    
            
        }else{
            callback(404,{
                'message':'user not found'
            });
        
        }
    }else{
        callback(403,{
            'message':'Unauthorized!'
        });
    
    }

  
}


handler._users.post = (requestProperties,callback) =>{

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

 handler._users.put = (requestProperties,callback) =>{

    const firstName = typeof(requestProperties.body.firstName)==="string" && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName:false;

    const lastName = typeof(requestProperties.body.lastName)==="string" && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName:false;


    const phone = typeof(requestProperties.body.phone)==="number" && requestProperties.body.phone.toString().length>=10 ? requestProperties.body.phone:false;


    const password = typeof(requestProperties.body.password)==="string" && requestProperties.body.password.trim().length>5 ? requestProperties.body.password:false;


    if(phone){

        // make sure that the user data is not there in data file

        // first parameter is folder name
        // second parameter is file name


        if(firstName || lastName || password){

            read('users',phone,(err,userData)=>{

                const u_data = {...JSON_PARSE(userData)}

                if(!err && userData){
            
                    if(firstName){
                        u_data.firstName = firstName
                    }
                    if(password){
                        u_data.password = hash(password)
                    }

                    if(lastName){
                        u_data.lastName = lastName
                    }
      

                    console.log(u_data,'u_data');

               
                  data.update('users',phone,u_data,(error)=>{
                      if(!error){
                          callback(200,{
                              message:'user has been updated successfully'
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

        }


    }else{
        callback(400,{
            'message':'User not found!'
        })
    }



 }

 handler._users.patch = (requestProperties,callback) =>{
   
 }

 handler._users.delete = (requestProperties,callback) =>{
    
    const phone = typeof(requestProperties.body.phone)==="number" && requestProperties.body.phone.toString().length>=10 ? requestProperties.body.phone:false;

    if(phone){
   
        read('users',phone,(err,userData)=>{

        
            if(!err && userData){
        
              data.delete('users',phone,(error,data)=>{
                  if(!error){
                      callback(200,{
                          message:'user has been deleted successfully'
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
        callback(404,{
            'message':'User not found!'
        })
    }
 }

// export handler

module.exports = handler;


