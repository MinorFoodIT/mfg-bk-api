var path = require('path');
const uuidv4 = require('uuid/v4');
const express   = require('express');
const axios = require('axios');
const APIError = require('./../../common/APIError');
const APIResponse = require('./../../common/APIResponse');
const jwt  =  require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "secretMinorFood";
const Joi = require('joi');
const func = require('./function');
const router = express.Router();
var myCache = require('./../../common/nodeCache');

//SDK Service
//const GetStoresAreaList = require('../../service/geo/getStoresAreaList');
const GetArea = require('../../service/geo/getArea');
//const GetAreaAllStore = require('../../service/geo/getAreaAllStoretore');


//Check and verify token
let checktoken =  (req,res,next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase  
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  
  if (token) {  
    try{
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
              return res.status(401).json((new APIError('Token is not valid : '+err.message,401,true)).returnJson());
            } else {
              req.decoded = decoded;
              next();
            }
          });
    }catch(ex){
        return res.status(500).json((new APIError('JWT : '+ex,500,true)).returnJson());
    }  
  } else {
    return res.status(401).json((new APIError('Auth token is not supplied ',401,true)).returnJson());
  }
}

router.use(checktoken);


/**
 * Get a store and info
 */
/**
{
    "code": "geocode",
    "message": 200,
    "results": {
        "store_id": 2355,
        "store_number": 401049,
        "name_en": "BK Shell Romklao",
        "name_th": null,
        "open_time": "09:00:00",
        "closed_time": "00:00:00",
        "is_next_day": true,
        "status": 1,
        "status_name": "Open",
        "remark": "สายรุ้ง"
      }
}
 */
router.get('/store_assign/geocode', async (req, res) => {
  let lat = req.query.lat;
  let lng = req.query.lng;
  await axios.get('https://api-store.1112one.com/api/v1/store_assign/geocode?lat='+lat+'&lng='+lng)
        .then(async (resp) => {
          let data = resp.data;
          try{
            let store1112 = data["status"] === 404 ?[]:data["1112DL"]["brands"]["BK"];
            res.json(new APIResponse('geocode' ,200,store1112));
          }catch(err){
            console.log(err.message);
            res.json((new APIError('Could not find a store',404,true)).returnJson());
          }
        })
        .catch((err) => {
          console.log(err.message);
          res.json((new APIError('Could not find a store',404,true)).returnJson());
        })
});


/**
 * Get store area zone
 */
/*
        {
            "store_id": "2355",
            "area_id": "5015312",
            "zone_id": "54060"
        },
        {
            "store_id": "2355",
            "area_id": "44116",
            "zone_id": "54060"
        },
*/
router.get('/store_area_zone/store', async (req, res) => {
    let id = req.query.id;
    try{
      let cacheStoresArea = myCache.get("stores_area");
      let storesArea = cacheStoresArea.filter(area => {
        return String(area["store_id"]) === String(id);
      });
      res.json(new APIResponse('getStoreAreaZone' ,200,storesArea));
    }catch(err){
      console.log(err.message);
      res.json((new APIError('Could not find any area and zone',404,true)).returnJson());
    }
  });

/**
 * Get store area list
 */
router.get('/store_area_zone/all', async (req, res) => {
  res.json(new APIResponse('getStoreAreaZone' ,200,myCache.get("stores_area")));
});



/**
 * Get area 
 */
/* {
  "AREA_ALT_NAME": "",
  "AREA_ALT_NAMEUN": "",
  "AREA_CITYID": "1",
  "AREA_CODE": "",
  "AREA_COUNTRYID": "-1",
  "AREA_DEF_DISTRICTID": "3357",
  "AREA_DEF_STREETID": "1071",
  "AREA_DESC": "",
  "AREA_DESCUN": "",
  "AREA_ID": "8950",
  "AREA_NAME": "ห้างฟู้ดไลท์อ้อน",
  "AREA_NAMEUN": "",
  "AREA_PROVINCEID": "1"
} */
router.get('/area', async (req, res) => {
  var get_area_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: uuidv4(),
    language: 'En',
    areaID: req.query.id //BK_TH
  }
  GetArea(get_area_args,function(err,sdkResponse){
    if(err){
        console.log('error at /area '+err);
        res.json((new APIError('Could not find the area',404,true)).returnJson());
    }
    
    //console.log(myCache.keys());
    let web_city = myCache.get("web_cities").filter(web =>{
      return String(web["city_id"]) === String(sdkResponse["AREA_CITYID"])
    });
    console.log('web_city :');
    console.log(web_city);

    let web_province = myCache.get("web_provinces").filter(web =>{
      return String(web["province_id"]) === String(sdkResponse["AREA_PROVINCEID"])
    });
    console.log('web_province :');
    console.log(web_province);

    let web_distrinct = myCache.get("web_districts").filter(web =>{
      return String(web["distinct_id"]) === String(sdkResponse["AREA_DEF_DISTRICTID"])
    });
    console.log('web_distrinct :');
    console.log(web_distrinct);

    let web_street = myCache.get("web_streets").filter(web =>{
      return String(web["street_id"]) === String(sdkResponse["AREA_DEF_STREETID"])
    });
    console.log('web_street :');
    console.log(web_street);

    res.json(new APIResponse('getArea' ,200 , {
      "AREA_ID": sdkResponse["AREA_ID"],
      "AREA_NAME": sdkResponse["AREA_NAME"],
      "AREA_PROVINCEID" : sdkResponse["AREA_PROVINCEID"],
      "AREA_PROVINCE_NAME" : web_province[0]["province_name_thai"],
      "AREA_CITYID" : sdkResponse["AREA_CITYID"],
      "AREA_CITY_NAME" : web_city[0]["city_name_thai"],
      "AREA_DISTRICTID" : sdkResponse["AREA_DEF_DISTRICTID"],
      "AREA_DISTRICT_NAME" : web_distrinct[0]["distinct_thai"],
      "AREA_STREETID" : sdkResponse["AREA_DEF_STREETID"],
      "AREA_STREET_NAME" : web_street[0]["street_name"],
    }));
  });
});



/**
 * Register new customer
 * 
 */
router.post('/regiscustomer', (req, res) => {
  try{
    let bodyData = req.body;
    let customer = {
      Addresses: {
        CC_ADDRESS:[]
      }
    }
    let request = {
      licenseCode: process.env.LICENSECODE,
      requestID: uuidv4(),
      language: 'Th',
      customer: customer
    }


    // let errCustomer = func.errCustomer(customer);

    // if(!errCustomer.err){
    //   res.json(new APIResponse('ok success' ,200,errCustomer.msg));

    // }else{
    //   res.status(400).json((new APIError('Bad request object is missing : '+errCustomer.msg,400,true)).returnJson());
    // }
  }catch(err){
    return res.status(500).json((new APIError('Method post data error : '+err.stack,500,true)).returnJson());
  }
});


/**
 * Register Address
 * 
 */
router.post('/regisaddress', (req, res) => {
  try{
    var customer = req.body;
    var address = {
      licenseCode: process.env.LICENSECODE,
      requestID: uuidv4(),
      language: 'En',
      customerUserName: '',
      customerPassword: '', //hash in db
      customerRegistrationID: ''
    }


    //let errAddress = func.errAddress(customer);

    // if(!errAddress.err){
    //   res.json(new APIResponse('ok success' ,200,errAddress.msg));

    // }else{
    //   res.status(400).json((new APIError('Bad request object is missing : '+errAddress.msg,400,true)).returnJson());
    // }
  }catch(err){
    return res.status(500).json((new APIError('Method post data error : '+err.stack,500,true)).returnJson());
  }
});


/**
 * Checkout process
 * 
 */

router.post('/order/checkout', (req, res) => {
  try{
    var checkout = req.body;
    let errCheckout = func.errCheckout(checkout);

    if(!errCheckout.err){
      res.json(new APIResponse('ok success' ,200,errCheckout.msg));

    }else{
      res.status(400).json((new APIError('Bad request object is missing : '+errCheckout.msg,400,true)).returnJson());
    }
  }catch(err){
    return res.status(500).json((new APIError('Method post data error : '+err.stack,500,true)).returnJson());
  }

});

module.exports = router;

/** absolute url is /api/bot/<route path> */

// router.route('/webhook')
//     .post(
//         lineCtrl.middleware(config),
//         lineCtrl.handlePreErr,
//         lineCtrl.webhook
//         );

// router.route('/1112delivery/:brand')
//     /** POST /:brandId/:orderId - Create new order push message */
//     .post(orderCtrl.ordering);

// router.route('/1112delivery/:brand/:order/order')
//     .get(orderCtrl.findOrder);


/** Load user when API with userId route parameter is hit */
//router.param('userId', userCtrl.load);


    // await axios.get('https://api-store.1112one.com/api/v1/store_assign/geocode?lat='+lat+'&lng='+lng)
    // .then(async (resp) => {
    //   let data = resp.data;
      
    //   try{
     
    //     // let storesArea=[];
    //     // for(j=0; j<100; j++ ) {
    //     //   storesArea.push(storesArea1[j]);
    //     // } 

    //     // var i = 0; 
    //     // let storesInfo = await Promise.all(storesArea.map( async(area) => {
    //     //   return               await GetArea({
    //     //                           licenseCode: process.env.LICENSECODE,
    //     //                           requestID: '201909171328',
    //     //                           language: 'En',
    //     //                           areaID: area["area_id"]
    //     //                         },function(err,area_resp){
    //     //                           if(err){
    //     //                               console.log('GetArea error '+err);
    //     //                           }
    //     //                           console.log(i++);
    //     //                           return {...store1112, ...area ,...area_resp};
    //     //                         })
                  
    //     //   })
    //     // );

    //     res.json(storesArea);
    //   }catch(err){
    //     res.json(err);
    //   }
    // })
    // .catch((err) => {
    //   res.json([]);
    // }) 


  // var get_store_args = {
  //   licenseCode: process.env.LICENSECODE,
  //   requestID: '201909171328',
  //   language: 'En',
  //   conceptID: 2 //BK_TH
  // }
  // GetStoresAreaList(get_store_args,function(err,sdkResponse){
  //   if(err){
  //       console.log('err '+err);
  //   }
  //   let stores = sdkResponse["CC_STORE_AREA"].map( store => {
  //     return {
  //       store_id : store["STR_ID"],
  //       area_id : store["STR_AREAID"],
  //       zone_id : store["STR_DEF_ZONEID"]
  //     }
  //   });

  //  console.log('GetStoresAreaList => output '+stores.length);
  //  GetAreaAllStore(stores,function(err1,modifiedStores){
  //   res.json(modifiedStores);
  //  })
    

    // res.json(
    //   stores.map( store => {
    //   let area = GetArea({
    //     licenseCode: process.env.LICENSECODE,
    //     requestID: '201909171328',
    //     language: 'En',
    //     areaID: store["area_id"]
    //   },function(err,areaResp){
    //     if(err1){
    //         console.log('err '+err1);
    //     }
    //     return areaResp;
    //   });
      
    //   return {
    //     store_id : store["STR_ID"],
    //     area_id : store["STR_AREAID"],
    //     area_name : area["AREA_NAME"],
    //     zone_id : store["STR_DEF_ZONEID"],
    //     distinct_id : area["AREA_DEF_DISTRICTID"],
    //     street_id : area["AREA_DEF_STREETID"],
    //     province_id : area["AREA_PROVINCEID"],
    //     city_id : area["AREA_CITYID"],
    //     country_id : area["AREA_COUNTRYID"],
    //   }
    // })
    // );

  //});
