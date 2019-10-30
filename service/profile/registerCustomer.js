const configEnv = require('dotenv').config()
var soap = require('soap');
var url = process.env.SDK_URL;

module.exports = function(args,cb) {
  soap.createClient(url ,{
    rejectUnauthorized: false,
    strictSSL: false,
    returnFault: true,
    disableCache: true
  }, function(err, client) {
      if(err){
        console.log(err);
      }else{
        //console.log(client.describe());
        //client.GetCustomerByEmail
        //client.GetCustomerMin
        client.RegisterCustomer(args, function(err1, result ,rawResponse, soapHeader, rawRequest) {
          console.log('RegisterCustomerResult');
          //console.log(rawRequest);
          if(!result.RegisterCustomerResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.RegisterCustomerResult);
          }
        },{postProcess: function(_xml) {
          return _xml.replace('xxxxxx', '');
        }});  
      }
  });
}

