/* 
  
 Title : checks handler 
 Description: catching the data from request 
 Author :Subroto chakraborty
 Date:17.3.23
 
*/

// dependencies

const {read,create, update} = require("../../lib/data");
const data = require("../../lib/data");
// const data = require("../../lib/data");
const storage = require('node-sessionstorage')

const {hash,JSON_PARSE,checkAuthorization,createUniqueId, createToken} = require('../../helpers/utilities');
const {max_checks} = require('../../helpers/environments')

// app object  - module scaffolding

const handler = {};

handler.checksHandler = (requestProperties,callback) => {

    const requestMethod = ['post','get','put','patch','delete'];

    if(requestMethod.indexOf(requestProperties.method)!==-1){
        handler._checks[requestProperties.method](requestProperties,callback);
    }else{
        callback(405,{
            'message':"Method not allowed"
        });
    
    }

   
}

handler._checks = {};

handler._checks.get = (requestProperties,callback) =>{

   let auth  = checkAuthorization(requestProperties);
   let userPhone = storage.getItem('phone')!==undefined ? storage.getItem('phone'):false;


    if(auth && userPhone){
        
        const id = typeof(requestProperties.queryStringObject.id)==="string" ? requestProperties.queryStringObject.id:false;
    
        if(id){

            read('checks',userPhone,(err,data)=>{
                if(!err && data){
                    const n_data = {...JSON_PARSE(data)}
                    if(n_data.id===id){
                        callback(200,{
                            n_data
                        });
                    }else{
                        callback(404,{
                            'message':'Invalid checksId'
                        }); 
                    }
                }else{
                    callback(404,{
                        'message':'Invalid checksId'
                    });  
                }
            })
    
            
        }else{
            callback(404,{
                'message':'Invalid checksId'
            });
        
        }
    }else{
        callback(403,{
            'message':'Unauthorized!'
        });
    
    }

  
}

handler._checks.post = (requestProperties,callback) =>{

    const protocol = typeof(requestProperties.body.protocol)==="string" && ['http','https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol:false;

    const url = typeof(requestProperties.body.url)==="string" && requestProperties.body.url.trim().length>0 ? requestProperties.body.url:false;


    const method = typeof(requestProperties.body.method)==="string" && ['get','post','put','delete'].indexOf(requestProperties.body.method) > -1  ? requestProperties.body.method:false;


    const successCodes = typeof(requestProperties.body.successCodes)==="object" &&
     requestProperties.body.successCodes instanceof Array   ? requestProperties.body.successCodes:false;

    const timeoutSeconds = typeof(requestProperties.body.timeoutSeconds)==="number"  && 
    requestProperties.body.timeoutSeconds %1 ===0 && requestProperties.body.timeoutSeconds >=1 && requestProperties.body.timeoutSeconds <=5 ?  requestProperties.body.timeoutSeconds:false;

    if(protocol && url && method && successCodes && timeoutSeconds ){

        // check user is authenticate or not 
        // if user authenticate then it will return user phone number

        let authPhone  = checkAuthorization(requestProperties);

        if(authPhone){

       // make sure that the user data is not there in data file

        // first parameter is folder name
        // second parameter is file name


        let token = requestProperties.headersObject.authorization;
    
        read('users',authPhone,(err,data)=>{

        if(!err && data ){

            let userObject = JSON_PARSE(data);
            let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [] ;

            if(userChecks.length < max_checks){
                const checkId = createUniqueId(authPhone);
                const checkObj = {
                    id:checkId,
                    phone:authPhone,
                    protocol:protocol,
                    url:url,
                    method:method,
                    successCodes:successCodes,
                    timeoutSeconds:timeoutSeconds
                    
                }

               create('checks',token,checkObj,(error)=>{
                if(!error){
                    
                    userObject.checks = userChecks,
                    userObject.checks.push(checkId);

                    update('users',authPhone,userObject,(err4)=>{
                       if(!err4){
                        callback(200,{
                            message:'user checks been created successfully'
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
                callback(401,{
                    'message':'User checks has already excced the limit'
                })
            }
   
        }else{
          callback(500,{
              'message':'Server error'
          })
        }
    })


        }else{
            callback(403,{
                'message':'Unauthorized!'
            });
        }

    }else{
        callback(400,{
            'message':'Varidation  error'
        })
    }


 }

 handler._checks.put = (requestProperties,callback) =>{

    const protocol = typeof(requestProperties.body.protocol)==="string" && ['http','https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol:false;

    const url = typeof(requestProperties.body.url)==="string" && requestProperties.body.url.trim().length>0 ? requestProperties.body.url:false;


    const method = typeof(requestProperties.body.method)==="string" && ['get','post','put','delete'].indexOf(requestProperties.body.method) > -1  ? requestProperties.body.method:false;


    const successCodes = typeof(requestProperties.body.successCodes)==="object" &&
     requestProperties.body.successCodes instanceof Array   ? requestProperties.body.successCodes:false;

    const timeoutSeconds = typeof(requestProperties.body.timeoutSeconds)==="number"  && 
    requestProperties.body.timeoutSeconds %1 ===0 && requestProperties.body.timeoutSeconds >=1 && requestProperties.body.timeoutSeconds <=5 ?  requestProperties.body.timeoutSeconds:false;


    const id = typeof(requestProperties.body.id)==="string"   ?  requestProperties.body.id:false;

    let authPhone  = checkAuthorization(requestProperties);

    if(authPhone){

        // make sure that the user data is not there in data file

        // first parameter is folder name
        // second parameter is file name


        let token = requestProperties.headersObject.authorization;

        
        
        if(id || timeoutSeconds || successCodes || method || url || protocol ){

            read('checks',token,(err,checkData)=>{



                if(!err && checkData){

                    const c_data = {...JSON_PARSE(checkData)}

                    if(c_data.id===id){

                        if(timeoutSeconds){
                            c_data.timeoutSeconds = timeoutSeconds
                        }
                        if(successCodes){
                            c_data.successCodes = successCodes;
                        }
    
                        if(method){
                            c_data.method = method
                        }

                        if(url){
                            c_data.url = url
                        }
                        if(protocol){
                            c_data.protocol = protocol
                        }
          
                      data.update('checks',token,c_data,(error)=>{
                          if(!error){
                              callback(200,{
                                  message:'checks list has been updated successfully'
                              })
                          }else{
                              callback(500,{
                                  'message':'Server error'
                              })
                          }
                      })
                    }else{
                        callback(500,{
                            'message':'checks id not found'
                        })
                    }

                }else{
                  callback(500,{
                      'message':'Server error'
                  })
                }
            })

        }


    }else{
        callback(400,{
            'message':'Unauthorized!'
        })
    }



 }

 handler._checks.patch = (requestProperties,callback) =>{
 }

 handler._checks.delete = (requestProperties,callback) =>{
    
    const id = typeof(requestProperties.body.id)==="string"   ?  requestProperties.body.id:false;

    let authPhone  = checkAuthorization(requestProperties);

    if(authPhone){

        let token = requestProperties.headersObject.authorization;


         read('checks',token,(err,checkData)=>{
            if(!err && checkData){

                let chObj = JSON_PARSE(checkData);
                if(chObj.id==id){
                    data.delete('checks',token,(error,data)=>{
                        if(!error){
      
      
                          read('users',authPhone,(err,data=>{
                              if(!err && data){
                              let userObject = JSON_PARSE(data);
      
                              const index = userObject.checks.indexOf(id)
      
                              if(index>-1){// only splice array when item is found
                                userObject.checks.splice(index,1) // 2nd parameter means remove one item only
                              }

                              update('users',authPhone,userObject,(err,updateData)=>{
                                  if(!err){
                                    callback(200,{
                                        message:'checks list has been deleted successfully'
                                    })
                                  }
                              })
      
                              
                              }
                          }))
      
      
    
                           
                        }else{
                            callback(500,{
                                'message':'Server error'
                            })
                        }
                    })
                }else{
                    callback(200,{
                        message:'checks id not found'
                    })
                }
        
            
  
            }else{
              callback(500,{
                  'message':'Server error'
              })
            }
        })
         

    }else{
        callback(401,{
            'message':'Unauthorized!'
        })
    }
 }

// export handler

module.exports = handler;


