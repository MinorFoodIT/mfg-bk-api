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
        client.GetStore(args, function(err1, result) {
          if(!result.GetStoreResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetStoreResult);
          }
        }); 
      }
  });
}

/**
var get_store_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    storeID: 1695
}
 */

 /*
{ STR_ADDRESS: '',
  STR_ADDRESSUN: '',
  STR_BACKUP_OWH_STATUS: '0',
  STR_BACKUP_STATUS: '0',
  STR_CALLCENTERNOTE: '',
  STR_CALLINAMOUNT: 0,
  STR_CALLINISFIXED: false,
  STR_CALLINMODE: true,
  STR_CONCEPTID: '3',
  STR_DELIVERYAMOUNT: 0,
  STR_DELIVERYISFIXED: false,
  STR_DELIVERYMODE: true,
  STR_DOB: '20190605',
  STR_ID: '1695',
  STR_ISACTIVE: true,
  STR_MAP_LINK: '',
  STR_MENU_ID: '2',
  STR_NAME: 'SW SF Petchakasem',
  STR_NAMEUN: '',
  STR_NUM: '576015',
  STR_PHONE1: '02-809-3199',
  STR_PHONE2: '',
  STR_PRIMARY_BACKUP: '-1',
  STR_PROMISETIME: '0',
  STR_SDM_NAME: 'SW SF Petchakasem',
  STR_SDM_NAMEUN: '',
  STR_SECONDARY1_BACKUP: '-1',
  STR_SECONDARY2_BACKUP: '-1',
  STR_STARTUP_SCREEN: 20,
  STR_STATUS: 0,
  STR_STORENOTE: '',
  STR_TIMEDIFFERENCE: '-2',
  STR_USE_BACKUP_FLAG: '0',
  STR_WALKINAMOUNT: 0,
  STR_WALKINISFIXED: false,
  STR_WALKINMODE: false,
  STR_WEB_NOTE: '',
  STR_WH_ENDTIME: 2011-08-18T13:00:59.000Z,
  STR_WH_NEXT_DAY: '0',
  STR_WH_STARTTIME: 2011-08-18T02:00:00.000Z }
*/