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
        client.GetProvincesList(args, function(err1, result) {
          if(!result.GetProvincesListResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetProvincesListResult);
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
{ CC_PROVINCE:
   [ { PRO_CNTID: '-1',
       PRO_CODE: '',
       PRO_ID: '-1',
       PRO_NAME: 'Unspecified',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1',
       PRO_NAME: 'ภาคกลาง',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1001',
       PRO_NAME: 'ภาคตะวันตก',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1002',
       PRO_NAME: 'ภาคเหนือ',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1003',
       PRO_NAME: 'ภาคตะวันออก',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1004',
       PRO_NAME: 'ภาคตะวันออกเฉียงเหนือ',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '1',
       PRO_CODE: '',
       PRO_ID: '1005',
       PRO_NAME: 'ภาคใต้',
       PRO_NAMEUN: '' },
     { PRO_CNTID: '4',
       PRO_CODE: '',
       PRO_ID: '1007',
       PRO_NAME: 'Center-Male',
       PRO_NAMEUN: '' } ] }
*/