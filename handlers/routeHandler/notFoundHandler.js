/* 
  
 Title : 404 handler 
 Description: show 404 when page not found 
 Author :Subroto chakraborty
 Date:11.3.23
 
*/

// dependencies

// app object  - module scaffolding

const handler = {};

handler.notFoundHandler = (requestProperties,callback) => {
    callback(404,{
        'message':"Page not found "
    });
}

// export handler

module.exports = handler;


