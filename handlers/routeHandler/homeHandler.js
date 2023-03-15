// module scafolding

const handler = {}

handler.homeHandler = (requestProperties,callback) => {
    callback(200,{
        message:'coming to home',
        'data':requestProperties
    })
}

module.exports = handler