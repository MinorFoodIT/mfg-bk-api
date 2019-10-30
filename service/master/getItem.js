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
        client.GetItem(args, function(err1, result) {
          //console.log('GetItemResult');
          
          if(!result.GetItemResult){
            cb(err1,result.SDKResult);
          }else{
            cb(err1,result.GetItemResult);
          }
        });  
      }
  });
}

/**
var get_item_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 1,
    menuTemplateID: 7, //PZEQ-NORMAL_WEB ONLY
    itemID: 870053
}
 */

 /*
{ Element_Type: 0,
  Elements: { CObject: [ [Object] ] },
  FromEvent: false,
  HasElements: true,
  ID: 870053,
  LongName: 'Crispy Thin Medium',
  MenuTemplateProperties: null,
  PizzaGroup: false,
  Price: 0,
  PriceLevelID: 0,
  PriceMethod: 0,
  Sequence: 0,
  ShortName: 'Crispy Medium',
  Weight: '1',
  AskDescription: false,
  AskPrice: false,
  BOHName: '',
  ChitName: 'Crispy Medium',
  Desc: '',
  DescUn: '',
  Event: false,
  Filter: '',
  FilterUn: '',
  ImageFileName: '',
  Name: 'Crispy Thin Medium',
  NameUn: 'พิซซ่าแป้งบางกรอบ(ถาดกลาง)',
  Nutrition: '',
  NutritionUn: '',
  OPrice: 0,
  Rank: -1,
  Recipe: '',
  RecipeUn: '',
  Style: '',
  Visible: 1 
}
*/