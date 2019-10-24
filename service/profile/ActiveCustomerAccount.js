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
      }

      client.ActiveCustomerAccount(args, function(err1, result) {
            //console.log('ActiveCustomerAccount');
            
            if(!result.ActiveCustomerAccountResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.ActiveCustomerAccountResult);
            }
      });  
  });
}

