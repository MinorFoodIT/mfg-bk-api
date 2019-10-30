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
        client.GetActiveOrdersList(args, function(err1, result) {
          if(!result.GetActiveOrdersListResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetActiveOrdersListResult);
          }
        }); 
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
{ CCheck:
    [  { AddressID: '4000500017946818',
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
       Entries: null,
       ExternalStatus: 1,
       FirstSendTime: 2019-09-17T07:09:01.000Z,
       GrossTotal: 0,
       IsAuth: 1,
       IsExternal: 1,
       LastSendTime: 2019-09-17T07:09:02.000Z,
       OrderID: '40098405',
       OrderMode: 1,
       OrderName: '',
       OrderType: 0,
       OriginalStoreID: '-1',
       OverridePromiseTime: '30',
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
       ZoneID: '-1' }
    ]
}
*/