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
        //client.GetCustomerByEmail
        //client.GetCustomerMin
        client.GetCustomerByID(args, function(err1, result) {
          //console.log('GetCustomerByIDResult');
          
          if(!result.GetCustomerByIDResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetCustomerByIDResult);
          }
        }); 
      }
  });
}

/**
var get_customer_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    customerID: 4000005013918610,
    conceptID: 1
}
 */

 /*
 {
  Addresses: {
     CC_ADDRESS: [[Object],[Object],[Object]]
  },
  CRT_BYUSER: 'Web',
  CRT_DATE: 2019-06-05T08:39:20.000Z,
  CUST_CARDNUMBER: '',
  CUST_CLASSID: '4',
  CUST_COMPANY: '',
  CUST_COMPANYUN: '',
  CUST_CORPID: '513918610',
  CUST_DATEADDED: 0000-12-31T17:17:56.000Z,
  CUST_DATEOFBIRHT: 2006-06-03T17:00:00.000Z,
  CUST_DEPENDENTS: '0',
  CUST_EMAIL: 'RAoXYv5ALQkZPCpOkExtlJYKp2dvLb@1112oneuser.com',
  CUST_FIRSTNAME: 'Dev',
  CUST_FIRSTNAMEUN: '',
  CUST_GENDER: 'None',
  CUST_ID: '4000005013918610',
  CUST_LASTNAME: 'Storetest',
  CUST_LASTNAMEUN: '',
  CUST_MARITALSTATUS: 'None',
  CUST_MIDNAME: '',
  CUST_MIDNAMEUN: '',
  CUST_NATID: '1',
  CUST_NOTIFICATION_MOBILE: '',
  CUST_OCCUPATION: '',
  CUST_OCCUPATIONUN: '',
  CUST_PHONEAREACODE: '95',
  CUST_PHONECOUNTRYCODE: '',
  CUST_PHONEEXTENSTION: '',
  CUST_PHONELOOKUP: '959517171',
  CUST_PHONENUMBER: '9517171',
  CUST_PHONETYPE: 2,
  CUST_PREFERRED_LANGUAGE: 'T',
  CUST_TITLE: '9',
  CUST_USERDATA1: '',
  CUST_USERDATA1UN: '',
  CUST_USERDATA2: '',
  CUST_USERDATA2UN: '',
  PASSWORD: '123456',
  Settings: null,
  UPT_BYUSER: 'Web',
  UPT_DATE: 2019-08-26T08:20:33.000Z,
  USERNAME: 'raoxyv5alqkzpcpokextljykp2dvlb@1112oneuser.com',
  WCUST_ACTIVE_DATE: 2019-06-05T08:39:20.000Z,
  WCUST_FIRSTNAME: 'Dev',
  WCUST_HASHEDPASSWORD: '',
  WCUST_LASTNAME: 'Storetest',
  WCUST_MIDNAME: '',
  WCUST_OFFER1: 1,
  WCUST_OFFER2: 1,
  WCUST_STATUS: 4,
  WCUST_TOKEN: '',
  WCUST_TOKEN_DATE: 0000-12-31T17:17:56.000Z,
  WEB_CRT_BY: 'Web',
  WEB_CRT_DATE: 2019-06-05T08:39:20.000Z,
  WEB_UPT_BY: 'Web',
  WEB_UPT_DATE: 2019-06-05T08:39:20.000Z 
}
*/