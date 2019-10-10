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
      //console.log(client);
      client.GetArea(args, function(err1, result) {
            console.log('GetArea');
            
            if(!result.GetAreaResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetAreaResult);
            }
      });  
  });
}

/**
var get_store_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 1695
}

{
    "AREA_ALT_NAME": "",
    "AREA_ALT_NAMEUN": "",
    "AREA_CITYID": "1",
    "AREA_CODE": "",
    "AREA_COUNTRYID": "-1",
    "AREA_DEF_DISTRICTID": "2319",
    "AREA_DEF_STREETID": "5974",
    "AREA_DESC": "",
    "AREA_DESCUN": "",
    "AREA_ID": "17611",
    "AREA_NAME": "สวนหลวง ร.9",
    "AREA_NAMEUN": "",
    "AREA_PROVINCEID": "1"
}
 */
