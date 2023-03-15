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





module.exports =  utilitis;
