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
        client.GetSystemParametersList(args, function(err1, result) {
          console.log('callback result');
         cb(err1,result.GetSystemParametersListResult);
        });  
      }
  });
}

/*
{ CC_SYSPARAMS:
    [ { PARM_CAPTION: '',
        PARM_DESC: '',
        PARM_ID: 'COUPON_LIST_HEADER',
        PARM_VALUE: 'คูปองที่ต้องเรียกเก็บ' }
    ]
}
*/