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
      client.GetCustomerAddresses(args, function(err1, result) {
            //console.log('GetCustomerAddressesResult');
            
            if(!result.GetCustomerAddressesResult){
              cb(err1,result.SDKResult);
            }else{
              cb(err1,result.GetCustomerAddressesResult);
            }
      });  
  });
}

/**
var get_customer_addr_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    lang: 'En',
    customerUserName: 'raoxyv5alqkzpcpokextljykp2dvlb@1112oneuser.com',
    customerPassword: '123456',
    conceptID: 1,
    from: 1,
    to: 1
}
 */

 /*
 { CC_ADDRESS:
   [ { ADDR_AREAID: '-1',
       ADDR_BLDGNAME: '',
       ADDR_BLDGNAMEUN: '',
       ADDR_BLDGNUM: '693 695',
       ADDR_CITYID: '1',
       ADDR_CLASSID: '4',
       ADDR_COUNTRYID: '1',
       ADDR_COUNTY: 'ไทย',
       ADDR_CUSTID: '4000005013918610',
       ADDR_DESC:
        '[WEB DELETE] 693 695,Sukhumvit,คลองตันเหนือ,วัฒนา,กรุงเทพมหานคร',
       ADDR_DISTRICTID: '3357',
       ADDR_FLATNUM: '',
       ADDR_FLOOR: '',
       ADDR_ID: '4000500017946962',
       ADDR_LANGUAGE_PREFERENCE: 'T',
       ADDR_MAPCODE: [Object],
       ADDR_PHONEAREACODE: '90',
       ADDR_PHONECOUNTRYCODE: '',
       ADDR_PHONEEXTENTION: '',
       ADDR_PHONELOOKUP: '900000000',
       ADDR_PHONENUMBER: '0000000',
       ADDR_PHONETYPE: 2,
       ADDR_POSTALCODE: '10110',
       ADDR_PROVINCEID: '1',
       ADDR_SKETCH:
        'อาคาร/หมู่บ้าน: -, เลขที่: 693 695, ชั้น: -, หมายเลขห้อง: -, จุดสังเกตที่ใกล้ที่สุด: -, ถนน/ซอย: Sukhumvit, ตำบล/แขวง: คลองตันเหนือ, อำเภอ/เขต: วัฒนา, จังหวัด: กรุงเทพมหานคร, รหัสไปรณีย์: 10110, การเดินทาง: oozou
',
       ADDR_SKETCHUN: '',
       ADDR_STREETID: '-1',
       CRT_BYUSER: 'Web',
       CRT_DATE: 2019-06-13T08:44:20.000Z,
       Phones: [Object],
       UPT_BYUSER: 'Web',
       WADDR_AREAID: '-1',
       WADDR_AREA_TEXT: '',
       WADDR_BUILD_NAME: '',
       WADDR_BUILD_NUM: '693 695',
       WADDR_BUILD_TYPE: '4',
       WADDR_CITYID: '10',
       WADDR_CONCEPTID: '1',
       WADDR_COUNTRYID: '1',
       WADDR_DESC: '693 695,Sukhumvit,คลองตันเหนือ,วัฒนา,กรุงเทพมหานคร',
       WADDR_DIRECTIONS: 'oozou',
       WADDR_DISTRICTID: '39',
       WADDR_DISTRICT_TEXT: 'วัฒนา',
       WADDR_NAME: '[WEB DELETE] 693 695',
       WADDR_NOTES: '',
       WADDR_POSTAL_CODE: '10110',
       WADDR_PROVINCEID: '1',
       WADDR_STATUS: 1,
       WADDR_STREETID: '0',
       WADDR_STREET_TEXT: 'Sukhumvit',
       WADDR_SUBDISTRICT_TEXT: 'คลองตันเหนือ',
       WADDR_TYPE: '1' } ] }
*/