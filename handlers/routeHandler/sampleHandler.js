/* 
  
 Title : Sample handler 
 Description: catching the data from request 
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// dependencies

// app object  - module scaffolding

const handler = {};

handler.sampleHandler = (requestProperties,callback) => {

    callback(200,{
        'message':"sample request "
    });

}

// export handler

module.exports = handler;


