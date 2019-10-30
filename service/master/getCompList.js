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
        client.GetCompList(args, function(err1, result) {
          console.log('GetCompList');
          
          if(!result.GetCompListResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetCompListResult);
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
    conceptID: 1,
    menuTemplateID: 7
}
 */

 /*
{ CComp:
    [  { Active: false,
       Amount: 0,
       CheckName: '<CSC LZ-DISC 25%',
       CompID: 1038,
       Comp_AllowPriorForCheck: true,
       Comp_AllowPriorForTable: true,
       Comp_AllowSubseqForCheck: true,
       Comp_AllowSubseqForTable: true,
       Comp_ItemsEligible: true,
       CustomUnit: '',
       EligibleItems: 114,
       EnterAmount: 0,
       EnterName: '',
       EnterPercent: 0,
       EnterUnit: '0',
       Entries: null,
       FixedAmount: 0,
       HasEntries: false,
       ID: '-1',
       Location: [Object],
       MaxPerCheck: 1,
       MaxPerTable: 1,
       MaximumAmount: 99999,
       MustEnterAmount: false,
       MustEnterName: false,
       MustEnterPercent: false,
       MustEnterUnit: false,
       MustSelectItems: false,
       Name: '<CSC LZ-DISC 25%',
       PercentOff: 0.25,
       Position: 0,
       Promo_AllowPriorForCheck: true,
       Promo_AllowPriorForTable: true,
       Promo_AllowSubseqForCheck: true,
       Promo_AllowSubseqForTable: true,
       Promo_ItemsEligible: true,
       Selected: false,
       Status: '0' }
    ]
}
*/