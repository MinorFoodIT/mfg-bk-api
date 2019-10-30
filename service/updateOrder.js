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
        client.UpdateOrder(args, function(err1, result ,rawResponse, soapHeader, rawRequest) {
          // console.log('UpdateOrder');
          // console.log(args);
          // console.log(rawRequest);
          // console.log(result);
          if(!result.UpdateOrderResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.UpdateOrderResult);
          }     
        },{postProcess: function(_xml) {
          return _xml.replace('</q176:Entries><q176:Entries>', '');
        }}); 
      }
  });
}

/**
var get_active_check_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    customerID: 4000005013918610,      //Dev storetest
    addressID: 4000500017946818,      
    conceptID: 1,
    numberOfOrders: 2
}
 */

 /*
{ 
  AddressID: '4000500017946818',
  AreaID: '53702',
  AuthBy: 'Web',
  AuthReq: 1,
  AuthReqReason: '18',
  AuthReqRemarks: '',
  AuthReqRemarksUn: '',
  AuthTime: 2019-09-17T07:09:02.000Z,
  BackupStoreID: '-1',
  Balance: 0,
  CancelBy: '',
  CancelTime: 0000-12-31T17:17:56.000Z,
  Change: 50,
  CheckNumber: 0,
  CityID: '1001',
  Comps: null,
  ConceptID: '1',
  CountryID: '1',
  CreateBy: 'Web',
  CreateTime: 2019-09-17T07:09:01.000Z,
  CustomerID: '4000005013918610',
  DOB: '20190605',
  DateOfTrans: 2019-09-17T07:09:02.000Z,
  DiscountTotal: 0,
  Discounts: null,
  DistrictID: '50107',
  DriverID: -1,
  DriverName: '',
  DueTime: 2019-09-17T07:39:01.000Z,
  Entries: { CEntry: [ [Object] ] },
  ExtendedAttributes: null,
  ExternalStatus: 1,
  FirstSendTime: 2019-09-17T07:09:01.000Z,
  GrossTotal: 0,
  IsAuth: 1,
  IsExternal: 1,
  LastSendTime: 2019-09-17T07:09:02.000Z,
  Notes: { CNote: [ [Object], [Object] ] },
  OrderID: '40098405',
  OrderMode: 1,
  OrderName: '',
  OrderType: 0,
  OriginalStoreID: '-1',
  OverridePromiseTime: '30',
  Payments: { CC_ORDER_PAYMENT: [ [Object] ] },
  PromiseTime: '30',
  ProvinceID: '1',
  RejectReason: '-1',
  Remarks: '',
  SalesAmount: 50,
  ServiceCharge: 50,
  Source: '2',
  Status: 0,
  StatusTime: 2019-09-17T07:09:01.000Z,
  StoreDOB: '20190917',
  StoreDueTime: 2019-09-17T07:39:03.000Z,
  StoreID: '1450',
  StoreName: 'PZ-LAB-DEV @AVANI',
  StoreNumber: '201997',
  StoreOrderMode: 1,
  StoreWebName: '',
  StoreWebNameUN: '',
  StreetID: '-1',
  SubTotal: 0,
  SuspendReason: '-1',
  Total: 50,
  UpdateBy: 'Web',
  UpdateTime: 2019-09-17T07:09:01.000Z,
  ValidateStore: 1,
  VoidReason: '-1',
  ZoneID: '-1' 
}
*/

/*
{ CEntry:
   [ { AskDesc: 'F',
       AskPrice: 'F',
       Category: '-1',
       CheckID: '0',
       CreateBy: 'Web',
       CreateTime: '2019-09-17T14:09:01',
       DateOfTrans: '2019-09-17T14:09:01',
       DiscountPrice: 0,
       DueTime: '9000-01-01T00:00:00',
       Entries: null,
       ID: '275492078',
       IsSpecialMessage: false,
       ItemID: 991112,
       Level: 0,
       LongName: '*** 1112 delivery ***',
       LongnameUn: null,
       ModCode: 'WITH',
       ModgroupID: -1,
       Name: '*** 1112 delivery ***',
       OrderID: '-1',
       OrdrMode: 'OM_SAVED',
       Price: 0,
       RemarksUn: null,
       ShortName: '*** 1112 delivery ***',
       ShortnameUn: null,
       Status: 'PENDING',
       StoreEntryID: '-2',
       TransBy: 'Web',
       TransTime: '2019-09-17T14:09:01',
       Type: 'ITEM',
       UpdateBy: 'Web',
       UpdateTime: '2019-09-17T14:09:01',
       VoidReason: '0',
       Weight: '0' } ] 
  }
*/

/*
{ CC_ORDER_PAYMENT:
   [ { CRT_BYUSER: 'Web',
       CRT_DATE: 2019-09-17T07:09:02.000Z,
       PAY_AMOUNT: 50,
       PAY_CREDITCARD_CCV: '000',
       PAY_CREDITCARD_EXPIREDATE: 0000-12-31T17:17:56.000Z,
       PAY_CREDITCARD_HOLDERNAME: '1112Delivery',
       PAY_CREDITCARD_NUMBER: '0000-0000-0000-0000',
       PAY_ID: '3302891',
       PAY_ORDRID: '40098405',
       PAY_REF_COUNTRY: '',
       PAY_REF_GATEWAY: 'CASH1112DL',
       PAY_REF_IP: '0.0.0.0',
       PAY_REF_NO: '40098404',
       PAY_STATUS: 1,
       PAY_STORE_TENDERID: 251,
       PAY_SUB_TYPE: 4,
       PAY_TYPE: 2,
       UPT_BYUSER: 'Web',
       UPT_DATE: 2019-09-17T07:09:02.000Z } ] }
*/

/*
{ CNote:
   [ { NT_DOB: '20190605',
       NT_FREE_TEXT:
        'Order via 1112delivery - website(201997 - PZ-LAB-DEV @AVANI)\nPromise: 2019-09-17 15:08:58\nSummary ID: 40098404\nRemark:',
       NT_ID: '24688505',
       NT_MANDATORY: 1,
       NT_NOTEID: '16',
       NT_NOTE_GROUPID: '15',
       NT_ORDERID: '40098405',
       NT_SOURCE: 2 },
     { NT_DOB: '20190605',
       NT_FREE_TEXT: 'Internet\\n***********',
       NT_ID: '24688506',
       NT_MANDATORY: 1,
       NT_NOTEID: '16',
       NT_NOTE_GROUPID: '15',
       NT_ORDERID: '40098405',
       NT_SOURCE: 2 } ] }

*/