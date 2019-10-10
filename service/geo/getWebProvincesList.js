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
      client.GetWebProvincesList(args, function(err1, result) {
            //console.log('GetWebProvincesList');
            
            if(!result.GetWebProvincesListResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetWebProvincesListResult);
            }
      });  
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
{ CC_WEB_PROVINCE:
   [ { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1004',
       PRO_NAME: 'North Eastern',
       PRO_NAMEUN: 'ภาคตะวันออกเฉียงเหนือ' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1003',
       PRO_NAME: 'Eastern',
       PRO_NAMEUN: 'ภาคตะวันออก' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1002',
       PRO_NAME: 'Northern',
       PRO_NAMEUN: 'ภาคเหนือ' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1001',
       PRO_NAME: 'Western',
       PRO_NAMEUN: 'ภาคตะวันตก' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1',
       PRO_NAME: 'Central',
       PRO_NAMEUN: 'ภาคกลาง' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '-1',
       PRO_ID: '-1',
       PRO_NAME: 'Unspecified',
       PRO_NAMEUN: '' },
     { PRO_ACTIVE: 1,
       PRO_CNTID: '1',
       PRO_ID: '1005',
       PRO_NAME: 'Southern',
       PRO_NAMEUN: 'ภาคใต้' } ] }
*/