const configEnv = require('dotenv').config()
var soap = require('soap');
var url = process.env.SDK_URL;

module.exports = function(args,cb) {
  soap.createClient(url ,{
    rejectUnauthorized: false,
    strictSSL: false
  }, function(err, client) {
      if(err){
        console.log(err);
      }else{
        //client.GetCustomerByEmail
        //client.GetCustomerMin
        client.RegisterAddress(args, function(err1, result ,rawResponse, soapHeader, rawRequest) {
          console.log('RegisterAddressResult');
          
          if(!result.RegisterAddressResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.RegisterAddressResult);
          }
        });  
      }
  });
}

