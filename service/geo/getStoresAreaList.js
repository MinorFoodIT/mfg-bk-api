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
        if(client !== 'undefined'){
          client.GetStoresAreaList(args, function(err1, result) {
            console.log('GetStoresAreaList');
            
            if(!result.GetStoresAreaListResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetStoresAreaListResult);
            }
           });  
        }
      }
  });
}

/**
var get_store_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 1695
}

"CC_STORE_AREA": [
        {
            "STR_AREAID": "17611",
            "STR_CONCEPTID": "2",
            "STR_DEF_ZONEID": "52354",
            "STR_ID": "1532",
            "STR_ISDEFAULT": 1,
            "STR_MAP_LOCATION": ""
        },
        {
            "STR_AREAID": "17301",
            "STR_CONCEPTID": "2",
            "STR_DEF_ZONEID": "52353",
            "STR_ID": "1532",
            "STR_ISDEFAULT": 1,
            "STR_MAP_LOCATION": ""
        },
        {
            "STR_AREAID": "17043",
            "STR_CONCEPTID": "2",
            "STR_DEF_ZONEID": "52353",
            "STR_ID": "1532",
            "STR_ISDEFAULT": 1,
            "STR_MAP_LOCATION": ""
        },
      ]
 */
