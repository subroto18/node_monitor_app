/* 
  
 Title : Utilities  
 Description: importance utilitis function
 Author :Subroto chakraborty
 Date:14.3.23
 
*/

// dependencies

let crypto = require('crypto');
const environmentToExport  = require('../helpers/environments');

// app object  - module scaffolding

const utilitis = {};



//  string to json convertion 


utilitis.JSON_PARSE = function(string){
    let data;
    try{
        data =  JSON.parse(string);
    }catch{
        data = {};
    }

    return data;

}
     
utilitis.hash = function (str){
    if(typeof str==='string' && str.length>0){
        const hash = crypto.createHash('sha256', environmentToExport.secretKey)
                   // updating data
                   .update(str)
                   // Encoding to be used
                   .digest('hex');
 
// Displays output
    return hash;
    }
}

utilitis.createToken = function (phone){
     let randomString = "abcdef123456asdaw2dads";
     let token = "";
      for(let i = 0 ;i<10;i++){
        token += randomString[Math.floor(Math.random() * 15)];
     }
     return token;

}

  


utilitis.checkAuthorization = function (requestProperties){
    const list = {};

     const cookieHeader = requestProperties?.headersObject?.cookie;
     const tokenHeader = requestProperties?.headersObject?.authorization;

    if (!cookieHeader){
       return false;
    }else{
        cookieHeader.split(`;`).forEach(function(cookie) {
            let [ name, ...rest] = cookie.split(`=`);
            name = name?.trim();
            if (!name) return;
            const value = rest.join(`=`).trim();
            if (!value) return;
            list[name] = decodeURIComponent(value);
        });

        if(list['token']){
            return list['token']===tokenHeader ? true:false  ;
        }else{
            return false;
        }
    
    }

}







module.exports =  utilitis;
