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
        client.GetWebDistrictsList(args, function(err1, result) {   
          if(!result.GetWebDistrictsListResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetWebDistrictsListResult);
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
    countryID: ''
    provinceID: ''
    cityID: ''
    text: ''
    searchType: ''  //0 means ‘Contains’, 1 means ‘Exact’
}
 */

 /*
{ CC_WEB_DISTRICT:
   [  { DIS_ACTIVE: 1,
       DIS_CITYID: '1037',
       DIS_COUNTRYID: '1',
       DIS_ID: '10004',
       DIS_NAME: 'Chon Phrai - Mueang',
       DIS_NAMEUN: 'ต.ชอนไพร อ.เมือง',
       DIS_PROVINCEID: '1' },] }
*/