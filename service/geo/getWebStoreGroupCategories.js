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
        client.GetWebStoreGroupCategories(args, function(err1, result) {
          console.log('GetWebStoreGroupCategories');
          
          if(!result.GetWebStoreGroupCategoriesResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetWebStoreGroupCategoriesResult);
          }
        }); 
      }
  });
}

/**
var get_comp_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 2
}
 */

 /*
{ CC_WEB_BUILD_TYPE:
   [ { BTYPE_ID: '2',
       BTYPE_NAME: 'Hospital',
       BTYPE_NAMEUN: 'โรงพยาบาล',
       CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z },
     { BTYPE_ID: '3',
       BTYPE_NAME: 'School',
       BTYPE_NAMEUN: 'โรงเรียน',
       CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z },
     { BTYPE_ID: '4',
       BTYPE_NAME: 'Villa',
       BTYPE_NAMEUN: 'หมู่บ้าน',
       CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z },
     { BTYPE_ID: '0',
       BTYPE_NAME: '',
       BTYPE_NAMEUN: '',
       CRT_BY: 'sys',
       CRT_DATE: 2012-05-19T17:00:00.000Z,
       UPT_BY: 'sys',
       UPT_DATE: 2012-05-19T17:00:00.000Z },
     { BTYPE_ID: '1',
       BTYPE_NAME: 'Flat',
       BTYPE_NAMEUN: 'แฟลต',
       CRT_BY: 'Abdulkarim',
       CRT_DATE: 2012-05-06T17:00:00.000Z,
       UPT_BY: 'Abdulkarim',
       UPT_DATE: 2012-05-06T17:00:00.000Z } ] }
*/