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
      client.GetWebStreetsList(args, function(err1, result) {
            //console.log('GetWebStreetsList');
            
            if(!result.GetWebStreetsListResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetWebStreetsListResult);
            }
      });  
  });
}

/**
var get_comp_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    countryID: ''
    provinceID: ''
    cityID: ''
}
 */

 /*
{ CC_WEB_STREET:
   [ { STRET_ACTIVE: 1,
       STRET_CNTID: '1',
       STRET_CTYID: '1023',
       STRET_ID: '300935',
       STRET_NAME: 'ซ.มาบยายเลีย 24',
       STRET_NAMEUN: '',
       STRET_PROVINCEID: '1003' },] }
*/