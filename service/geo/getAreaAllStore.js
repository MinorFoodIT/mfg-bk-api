const configEnv = require('dotenv').config()
var soap = require('soap');
var url = process.env.SDK_URL;
const uuidv4 = require('uuid/v4');

module.exports = function(stores,cb) {
  soap.createClient(url ,{
    rejectUnauthorized: false,
    strictSSL: false
  }, function(err, client) {
      if(err){
        console.log(err);
      }else{
        cb(err,stores.map( async store => {
         console.log('map => '+store["area_id"] );
         
         return await client.GetArea({
                licenseCode: process.env.LICENSECODE,
                requestID: uuidv4(),
                language: 'En',
                areaID: store["area_id"]
              }, function(err1, result) {
                //console.log('return map => '+store["area_id"] );
                //console.log(result);
                if(result.GetAreaResult){
                  return store;
                }else{
                  return { 
                    store_id : store["store_id"],
                    area_id : store["area_id"],
                    area_name : area["AREA_NAME"],
                    zone_id : store["zone_id"],
                    distinct_id : area["AREA_DEF_DISTRICTID"],
                    street_id : area["AREA_DEF_STREETID"],
                    province_id : area["AREA_PROVINCEID"],
                    city_id : area["AREA_CITYID"],
                    country_id : area["AREA_COUNTRYID"],
                  }
                }
              });
          }))
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
