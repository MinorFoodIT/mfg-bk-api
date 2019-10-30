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
        client.GetWebAddressTypeList(args, function(err1, result) {
          console.log('GetWebAddressTypeList');
          
          if(!result.GetWebAddressTypeListResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetWebAddressTypeListResult);
          }
        });  
      }
  });
}

/**
var get_comp_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En'
}
 */

 /*
{ CC_WEB_ADDRESS_TYPE:
   [ { CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       TYPE_ADDR_CLASSID: '4',
       TYPE_CUST_CLASSID: '4',
       TYPE_ID: '2',
       TYPE_NAME: 'Office',
       TYPE_NAMEUN: 'ออฟฟิศ',
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z },
     { CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       TYPE_ADDR_CLASSID: '4',
       TYPE_CUST_CLASSID: '4',
       TYPE_ID: '3',
       TYPE_NAME: 'Other',
       TYPE_NAMEUN: 'อื่นๆ',
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z },
     { CRT_BY: 'narase_sa',
       CRT_DATE: 2012-06-01T17:00:00.000Z,
       TYPE_ADDR_CLASSID: '-1',
       TYPE_CUST_CLASSID: '-1',
       TYPE_ID: '-1',
       TYPE_NAME: 'Undefined',
       TYPE_NAMEUN: 'ไม่สามารถระบุ',
       UPT_BY: 'narase_sa',
       UPT_DATE: 2012-06-01T17:00:00.000Z },
     { CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       TYPE_ADDR_CLASSID: '4',
       TYPE_CUST_CLASSID: '4',
       TYPE_ID: '1',
       TYPE_NAME: 'Home',
       TYPE_NAMEUN: 'บ้าน',
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z } ] }
*/