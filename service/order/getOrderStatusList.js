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
      client.GetOrderStatusList(args, function(err1, result) {
            console.log('GetOrderStatusList');
            
            if(!result.GetOrderStatusListResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetOrderStatusListResult);
            }
      });  
  });
}

/**
var get_order_sts_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En'
}
 */

 /*
 {
   CC_ORDER_STATUS:
   [
    { ODRSTS_CODE: '100',
       ODRSTS_ID: '23',
       ODRSTS_NAME: 'Future',
       ORDSTS_CAN_ADD: 1,
       ORDSTS_CAN_ADD_TIMEOUT: -1,
       ORDSTS_CAN_CANCEL: 1,
       ORDSTS_CAN_CANCEL_TIMEOUT: -1,
       ORDSTS_CAN_DELETE: 1,
       ORDSTS_CAN_DELETE_TIMEOUT: -1,
       ORDSTS_CAN_MODIFY: 1,
       ORDSTS_CAN_MODIFY_TIMEOUT: -1,
       ORDSTS_CAN_REORDER: 0,
       ORDSTS_CAN_REORDER_TIMEOUT: 0,
       ORDSTS_EXCEPTION: 10,
       ORDSTS_WARNING: 5 } ] }
*/