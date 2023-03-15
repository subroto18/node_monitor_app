
//dependencies

// module scafolding

const handler = {}

handler.aboutHandler = (requestProperties,callback) => {
   callback(200,{
       message:"this is about page baby..."
   });
}

module.exports = handler;