var path = require('path');
var logger = require('./../../common/logging/winston')(__filename);
const uuidv4 = require('uuid/v4');
const series = require('async/series');
const waterfall = require('async/waterfall');
const each = require('async/each');

const express   = require('express');
const axios = require('axios');
const moment = require('moment');
const APIError = require('../../common/APIError');
const APIResponse = require('../../common/APIResponse');
const jwt  =  require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "secretMinorFood";
const Joi = require('joi');
const func = require('./function');
const helper = require('./../../common/helper');
const router = express.Router();
var myCache = require('../../common/nodeCache');
var mysqldb = require('../../common/mysql-client');

//SDK Service
const GetArea = require('../../service/geo/getArea');
const IsCustomerUserNameOrEmailUsed = require('../../service/profile/IsCustomerUserNameOrEmailUsed');
const RegisterCustomer = require('../../service/profile/registerCustomer');
const ActiveCustomerAccount = require('../../service/profile/ActiveCustomerAccount');
const GetCustomerByID = require('../../service/profile/getCustomerByID');
const RegisterAddress = require('../../service/profile/registerAddress');
const GetCustomerAddresses = require('../../service/profile/getCustomerAddresses');
const UpdateOrder = require('../../service/updateOrder');
const GetStore = require('../../service/geo/getStore');
const GetOrderDetails = require('../../service/order/getOrderDetails');
const {entry_status ,entry_type} = require('./enums');


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
              //logger.info('Token decoded :');
              //logger.info(decoded);
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
 * Get store
 */
router.get('/store', async (req, res) => {
  GetStore({
    licenseCode: process.env.LICENSECODE,
    requestID: uuidv4(),
    language: 'En',
    storeID: req.query.id
  },function(err,sdkResponse){
    if(err){
      logger.info('error at /area '+err);
      res.status(404).json((new APIError('Could not find the area',404,true)).returnJson());
    }
    res.status(200).json(new APIResponse('getArea' ,200 ,sdkResponse ));
  })
});

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
            res.status(200).json(new APIResponse('geocode',200,store1112));
          }catch(err){
            logger.info(err.message);
            res.status(404).json((new APIError('Could not find a store',404,true)).returnJson());
          }
        })
        .catch((err) => {
          logger.info(err.message);
          res.status(404).json((new APIError('Could not find a store',404,true)).returnJson());
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
      res.status(200).json(new APIResponse('getStoreAreaZone' ,200,storesArea));
    }catch(err){
      logger.info(err.message);
      res.status(404).json((new APIError('Could not find any area and zone',404,true)).returnJson());
    }
  });

/**
 * Get store area list
 */
router.get('/store_area_zone', async (req, res) => {
  res.status(200).json(new APIResponse('getStoreAreaZone' ,200,myCache.get("stores_area")));
});

/**
 * Get discount
 * 
 */
router.get('/discounts', async (req, res) => {
  let web_comp = myCache.get("web_comp");
  let return_comp = web_comp.map(comp => {
    return {
      discount_id: comp["comp_id"],
      discount_name: comp["name"]
    };
  });
  res.status(200).json(new APIResponse('getDiscount' ,200 , return_comp));
})

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
        logger.info('error at /area '+err);
        res.status(400).json((new APIError('Could not find the area',404,true)).returnJson());
    }
    
    //logger.info(myCache.keys());
    let web_city = myCache.get("web_cities").filter(web =>{
      return String(web["city_id"]) === String(sdkResponse["AREA_CITYID"])
    });
    logger.info('web_city :');
    logger.info(web_city);

    let web_province = myCache.get("web_provinces").filter(web =>{
      return String(web["province_id"]) === String(sdkResponse["AREA_PROVINCEID"])
    });
    logger.info('web_province :');
    logger.info(web_province);

    let web_distrinct = myCache.get("web_districts").filter(web =>{
      return String(web["distinct_id"]) === String(sdkResponse["AREA_DEF_DISTRICTID"])
    });
    logger.info('web_distrinct :');
    logger.info(web_distrinct);

    let web_street = myCache.get("web_streets").filter(web =>{
      return String(web["street_id"]) === String(sdkResponse["AREA_DEF_STREETID"])
    });
    logger.info('web_street :');
    logger.info(web_street);

    res.status(200).json(new APIResponse('getArea' ,200 , {
      "AREA_ID": sdkResponse["AREA_ID"],
      "AREA_NAME": sdkResponse["AREA_NAME"],
      "AREA_PROVINCEID" : sdkResponse["AREA_PROVINCEID"],
      "AREA_PROVINCE_NAME" : web_province.length > 0 ? web_province[0]["province_name_thai"] : -1,
      "AREA_CITYID" : sdkResponse["AREA_CITYID"],
      "AREA_CITY_NAME" : web_city[0]["city_name_thai"],
      "AREA_DISTRICTID" : sdkResponse["AREA_DEF_DISTRICTID"],
      "AREA_DISTRICT_NAME" : web_distrinct.length > 0 ? web_distrinct[0]["distinct_thai"] : -1,
      "AREA_STREETID" : sdkResponse["AREA_DEF_STREETID"],
      "AREA_STREET_NAME" : web_province.length > 0  ? web_street[0]["street_name"] : -1,
    }));
  });
});


/**
 * Register new customer
 * 
 */
router.post('/registercustomer', (req, res) => {
  try{
    let bodyData = req.body;
    
    //to do : validate json

    let email = bodyData.email;               //not emptry string that will be error
    let password = bodyData.password;
    let first_name = bodyData.first_name;
    let last_name = bodyData.last_name;
    let phone_number = bodyData.phone_number;
    let facebook_uid = bodyData.facebook_uid;
    let offer = Boolean(bodyData.offer)?1:0;
    let gender = bodyData.gender;  //Male/Female/None

    //password will use 15 digits of facebook_uid
    //else then pad from password
    //if(helper.isNullEmptry(facebook_uid)){
    //  password = password.padEnd(15, '.');
    //}
    
    let phatform = req.headers["x-phatform"]; //sdk
    let channel  = req.headers["x-channel"]; //web or mobile
    let lang     = req.headers["x-language"].toUpperCase();
    let dateOfBirth = moment();
    gender = gender === 'male'? 'Male':'None';
    gender = gender === 'female'? 'Female':'None';
    const offer1 = offer;
    const offer2 = offer;

    let phoneType = phone_number.length === 10 ? 2 : 1;
    let areaCode = phone_number.length === 10 ? phone_number.substring(1,3) : phone_number.substring(1,2);
    let phone = phone_number.length === 10 ? phone_number.substring(3) : phone_number.substring(2);

    //to do :check exist customer on db
    
    let sdmEmailMap =  uuidv4() + '@burgerking.co.th'; //'9987654321'
    logger.info('Will create :');
    logger.info(sdmEmailMap);
    logger.info(password);
    
    let request = {
      licenseCode: process.env.LICENSECODE,
      requestID: uuidv4(),
      language: 'Th',
      customerUserNameOrEmail: sdmEmailMap
    }

    IsCustomerUserNameOrEmailUsed(request,function(err,sdkResponse){
      if(err){
          logger.info('error at /regiscustomer '+err);
          res.status(500).json((new APIError('Customer value is invalid',500,true)).returnJson());
      }
      if(sdkResponse === 'NOT_FOUND'){
        logger.info('Can be create new customer');
        //Creaate a new customer
        let sdkCreatedDate = moment().format("YYYY-MM-DDTHH:mm:ss");
        let createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let customer = {
          // Addresses: {
          //   CC_ADDRESS:[]
          // },
          'q13:CUST_CLASSID': 4,
          'q13:CUST_DATEOFBIRHT': sdkCreatedDate,
          'q13:CUST_DEPENDENTS': 0,
          'q13:CUST_EMAIL': sdmEmailMap,
          'q13:CUST_FIRSTNAME': first_name,
          'q13:CUST_GENDER': 'Male',//gender,
          'q13:CUST_LASTNAME': last_name,
          'q13:CUST_MARITALSTATUS': 'None',
          'q13:CUST_NATID': 1,
          'q13:CUST_PHONEAREACODE': areaCode,
          'q13:CUST_PHONENUMBER': phone,
          'q13:CUST_PHONETYPE': phoneType,
          'q13:CUST_PREFERRED_LANGUAGE': lang,         
          'q13:CUST_TITLE': 9,
          'q13:PASSWORD': password,
          'q13:USERNAME': sdmEmailMap,
          'q13:WCUST_FIRSTNAME': first_name,
          'q13:WCUST_LASTNAME': last_name,
          'q13:WCUST_OFFER1': offer1,
          'q13:WCUST_OFFER2': offer2,
          'q13:WCUST_STATUS': 1 //Pending = 1 ,Active =2
        }
        logger.info({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'Th',
          customer: customer
        })
        waterfall([
          function(callback){
            RegisterCustomer({
              'tns:licenseCode': process.env.LICENSECODE,
              'tns:requestID': uuidv4(),
              'tns:language': 'Th',
              'tns:customer': customer
            },function(err,sdkResponse){
              if(err){
                logger.info('RegisterCustomer error :' +err);
                logger.info(sdkResponse);
                callback(err,null);
              }
              logger.info('Webservice result RegisterCustomer :');
              logger.info(sdkResponse);
              callback(null,sdkResponse);
            });
            
          },
          function(regisCustomer,callback){
            //To do : save custeomer to db
            logger.info('To do save to db');
            mysqldb((err,connection) => {
              if(err){
                  logger.info('[Connecttion database error] '+err)
                  callback(err,null);
              }

              logger.info('[INSERT Customer data] '+ regisCustomer["CUST_ID"])
              var custData  = {
                customerID: regisCustomer["CUST_ID"],
                corpID: regisCustomer["CUST_CORPID"],
                webcustomerID: regisCustomer["CUST_ID"],
                sdmEmailMap: regisCustomer["CUST_EMAIL"],
                email: regisCustomer["CUST_EMAIL"],
                username: regisCustomer["USERNAME"],
                password: regisCustomer["PASSWORD"],
                firstname: regisCustomer["WCUST_FIRSTNAME"],
                lastname: regisCustomer["WCUST_LASTNAME"],
                gender: regisCustomer["CUST_GENDER"],
                dateOfBirth: createdDate,
                martialStatus: regisCustomer["CUST_MARITALSTATUS"],
                nationalityID: regisCustomer["CUST_NATID"],
                preferedLang: regisCustomer["CUST_PREFERRED_LANGUAGE"],
                phoneType: regisCustomer["CUST_PHONETYPE"],
                phoneLookup: regisCustomer["CUST_PHONELOOKUP"],
                phoneNumber: regisCustomer["CUST_PHONETYPE"],
                status: regisCustomer["WCUST_STATUS"],
                offer1: regisCustomer["WCUST_OFFER1"],
                offer2: regisCustomer["WCUST_OFFER2"],
                channel: channel,
                phatform: phatform,
                active: 1,
                sitegroup: 'SG_BK'
              };
              connection.query('INSERT into customers SET ?', custData ,function (error, results, fields){
                  if (error) {
                      logger.info('[Insert database error] '+error);
                      callback(error,null);
                  };
                  connection.release()
                  callback(null,regisCustomer);
              });
            });
          },
          function(regisCustomer,callback){
            if(regisCustomer["CUST_ID"]){
              ActiveCustomerAccount({
                licenseCode: process.env.LICENSECODE,
                requestID: uuidv4(),
                language: 'Th',
                customerID: regisCustomer["CUST_ID"],
                conceptID: 2
              },function(err,sdkResponse){
                if(err){
                  logger.info('ActiveCustomerAccount error :' +err);
                  callback(err,null);
                }

                logger.info('Webservice result ActiveCustomerAccount :');
                logger.info(sdkResponse);

                //To do : token
                let userToken = jwt.sign({
                   CUST_ID:  regisCustomer["CUST_ID"] ,
                   CUST_EMAI: regisCustomer["CUST_EMAIL"],
                   USERNAME: regisCustomer["USERNAME"],
                   PASSWORD: regisCustomer["PASSWORD"],
                   CUST_CORPID: regisCustomer["CUST_CORPID"]
                  }, SECRET_KEY);
                callback(null,userToken);
              });
            }
          }
        ],function(err,userToken){
            if(err){
              res.json((new APIError('Error on create '+err,500,true)).returnJson());
            }
            if(userToken.length > 0){ 
              jwt.verify(userToken, SECRET_KEY, (err, decoded) => {
                res.json(new APIResponse('registercustomer' ,200,{
                  customer_id : decoded["CUST_ID"],
                  register_id : decoded["CUST_CORPID"],
                  token: userToken
                }));
                logger.info(userToken);
              }) 
            }
        })
      }else{
        res.status(500).json((new APIError('Customer is exists',500,true)).returnJson());
      }

    })


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
 * Get customer from db
 * return 
 * {
    "code": "get_registercustomer",
    "message": 200,
    "results": {
        "customer_id": "4000005013919267",
        "register_id": "513919267",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDVVNUX0lEIjoiNDAwMDAwNTAxMzkxOTI2NyIsIkNVU1RfRU1BSSI6IjZhMmQ3MGMxLWNjMmUtNDk4Ni05YjY4LTM3NzJlNzFlNzQxOEBidXJnZXJraW5nLmNvLnRoIiwiVVNFUk5BTUUiOiI2YTJkNzBjMS1jYzJlLTQ5ODYtOWI2OC0zNzcyZTcxZTc0MThAYnVyZ2Vya2luZy5jby50aCIsIlBBU1NXT1JEIjoic2RrMTgiLCJDVVNUX0NPUlBJRCI6IjUxMzkxOTI2NyIsImlhdCI6MTU3MTIyMTk5NH0.JzXKbDas-U_rHobXQUe7T-gW1JYYIn-AjmqCLIXW0Xs"
    }
}
*/
router.get('/customer', (req ,res) => {
  GetCustomerByID({
    licenseCode: process.env.LICENSECODE,
    requestID: uuidv4(),
    language: 'En',
    customerID: req.query.id, //BK_TH
    conceptID: 2
  },function(err,sdkResponse){
    if(err){
        logger.info('error at /customer '+err);
        res.status(404),json((new APIError('Could not find the customer',404,true)).returnJson());
    }

    let userToken = jwt.sign({
      CUST_ID:  sdkResponse["CUST_ID"] ,
      CUST_EMAI: sdkResponse["CUST_EMAIL"],
      USERNAME: sdkResponse["USERNAME"],
      PASSWORD: sdkResponse["PASSWORD"],
      CUST_CORPID: sdkResponse["CUST_CORPID"]
     }, SECRET_KEY);

    res.status(200).json(new APIResponse('getCustomer' ,200 , {
      "register_id": sdkResponse["CUST_CORPID"],
      "customer_id": sdkResponse["CUST_ID"],
      "create_date" : sdkResponse["CRT_DATE"],
      'cust_token' : userToken
    }));
  });
})


/**
 * Get address from db
 * return 
 * {
    "code": "get_registeraddress",
    "message": 200,
    "results": {
        "customer_id": "4000005013919267",
        "register_id": "513919267",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDVVNUX0lEIjoiNDAwMDAwNTAxMzkxOTI2NyIsIkNVU1RfRU1BSSI6IjZhMmQ3MGMxLWNjMmUtNDk4Ni05YjY4LTM3NzJlNzFlNzQxOEBidXJnZXJraW5nLmNvLnRoIiwiVVNFUk5BTUUiOiI2YTJkNzBjMS1jYzJlLTQ5ODYtOWI2OC0zNzcyZTcxZTc0MThAYnVyZ2Vya2luZy5jby50aCIsIlBBU1NXT1JEIjoic2RrMTgiLCJDVVNUX0NPUlBJRCI6IjUxMzkxOTI2NyIsImlhdCI6MTU3MTIyMTk5NH0.JzXKbDas-U_rHobXQUe7T-gW1JYYIn-AjmqCLIXW0Xs"
    }
}
*/
router.post('/search/address', (req ,res) => {
  var bodyData = req.body;
  let cusToken = bodyData.cust_token;
  let address_name = bodyData.address_name;

  decodeCustoken(cusToken,SECRET_KEY)
  .then(decoded => {
    let decodedToken = decoded[0];
    if(!helper.isNullEmptry(decodedToken.error)){
      return res.status(500).json((new APIError('Error /address : '+decodedToken.error.message,500,true)).returnJson());
    }else{
      let customer = decodedToken.customer;
      GetCustomerAddresses({
        licenseCode: process.env.LICENSECODE,
        requestID: uuidv4(),
        language: 'En',
        customerUserName: customer["USERNAME"],
        customerPassword: customer["PASSWORD"],
        conceptID: 2,
        from: 1,
        to: 1000
      },function(err,sdkResponse){
        if(err){
          logger.info('Error SDK GetCustomerAddress : '+err);
          return res.status(500).json((new APIError('Error /address : could not find address name'.message,500,true)).returnJson());
        }

        if(sdkResponse["CC_ADDRESS"]){
          logger.info('found addresses to set a object');
          let address = [...sdkResponse["CC_ADDRESS"]];
          let addressFound = address.filter(addr => {
            logger.info(addr["WADDR_NAME"]);
            return String(addr["WADDR_NAME"]) === String(address_name) && !String(addr["WADDR_NAME"]).includes('[WEB DELETE]');
          })
          if(addressFound.length > 0){
            let addr = addressFound[0]
            let store_id = '';
            let area_id = addr["ADDR_AREAID"];
            let address_id = addr["ADDR_ID"]
            logger.info('find address_id '+addr);
            mysqldb((err,connection) => {
              if(err){
                  logger.info('[Connecttion database error] '+err)
                  return res.status(500).json((new APIError('Error /address : could not find address name'.message,500,true)).returnJson());
              }else{
                connection.query('SELECT storeID from address where addressID = ?', [address_id] ,function (error, results, fields){
                  if (error) {
                      logger.info('[Select database error] '+error);
                      return res.status(500).json((new APIError('Error /address : could not find address name'.message,500,true)).returnJson());
                  };
                  logger.info(results);
                  if(results.length > 0){
                    let row = results[0];
                    store_id = row.storeID;
                  }
                  connection.release()
                  res.status(200).json(new APIResponse('getAddress' ,200 , {
                    address_id : address_id,
                    store_id : store_id,
                    area_id : area_id
                  }));
                });
              }
            });
          
          }else{
            //No found
            return res.status(500).json((new APIError('Error /address : could not find address name'.message,500,true)).returnJson());
          }
        }
      });
    }
  })
  .catch(err =>{
    logger.info('[Catch error] '+err)
    return res.status(500).json((new APIError('Error /address : could not find address name'.message,500,true)).returnJson());
  })
})

/**
 * Register Address
 * 
 */
router.post('/registeraddress', (req, res) => {
  try{
    var bodyData = req.body;
    //to do : validate json

        //let errAddress = func.errAddress(customer);
        // if(!errAddress.err){
        //   res.json(new APIResponse('ok success' ,200,errAddress.msg));

        // }else{
        //   res.status(400).json((new APIError('Bad request object is missing : '+errAddress.msg,400,true)).returnJson());
        // }

    let cusToken = bodyData.cust_token;
    let address_name = bodyData.address_name;
    let build_name = bodyData.build_name;
    let build_number = bodyData.build_number;
    let floor = bodyData.floor;
    let room_number = bodyData.room_number;
    let near = bodyData.near;
    let street = bodyData.street;
    let subdistrict = bodyData.subdistrict;
    let distict = bodyData.distict;
    let province = bodyData.province;
    let postcode = bodyData.postcode;
    let route_direction = bodyData.route_direction;
    let is_default = bodyData.is_default;
    let store_name = bodyData.store_name;
    let store_id = bodyData.store_id;
    let area_id = bodyData.area_id;
    let lat = bodyData.lat;
    let lng = bodyData.lng;
    
    let web_city = myCache.get("web_cities").filter((web) => {
      return String(web.city_name) === String(province) || String(web.city_name_thai) === String(province);
    })

    let web_district = myCache.get("web_districts").filter((web) => {
      return String(web.distinct_name).includes(String(subdistrict)) || String(web.distinct_thai).includes(String(subdistrict));
    })

    let phatform = req.headers["x-phatform"]; //sdk
    let channel  = req.headers["x-channel"]; //web or mobile
    let lang     = req.headers["x-language"].toUpperCase();
   
    waterfall([
      //Step :: 1 => decode to customer object
      function(callback){
        jwt.verify(cusToken, SECRET_KEY, (err, decoded) => {
          if(err){
            return res.status(401).json((new APIError('Token is not valid : '+err.message,401,true)).returnJson());
            callback(err,null);
          }
          let customer = {...decoded};
          //Object.assign(customer,{...decoded});
          callback(null,customer);
        })
      },
      //Step :: 2 ==> lookup customer 
      function(requestCustomer,callback){
        logger.info('Get customer by id');
        GetCustomerByID({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'En',
          customerID: requestCustomer["CUST_ID"],
          conceptID: 2
        },function(err,sdkResponse){
            if(err){
                logger.info('Error GetCustomerByID : '+err);
                callback(err,null);
            }
            if(sdkResponse["CUST_ID"]){
              let customer = {...sdkResponse};
              callback(null,customer);
            }
        });
      },
      function(customer,callback){
          logger.info('register address to order ');
          let sketch = 'อาคาร/หมู่บ้าน: '+ helper.isNullEmptry(build_name)?'-':build_name +
          'เลขที่: '+ helper.isNullEmptry(build_number)?'-':build_number +
          'ชั้น: '+ helper.isNullEmptry(floor)?'-':floor +
          'หมายเลขห้อง: '+ helper.isNullEmptry(room_number)?'-':room_number +
          'จุดสังเกตที่ใกล้ที่สุด: '+ helper.isNullEmptry(near)?'-':near +
          'ถนน/ซอย: '+ helper.isNullEmptry(street)?'-':street +
          'ตำบล/แขวง: '+ helper.isNullEmptry(subdistrict)?'-': subdistrict +
          'อำเภอ/เขต: ' + helper.isNullEmptry(distict)?'-': distict +
          'จังหวัด: ' + helper.isNullEmptry(province)?'-' : province +
          'รหัสไปรณีย์: ' + helper.isNullEmptry(postcode)?'-' : postcode +
          'จังหวัด: ' + helper.isNullEmptry(route_direction)?'-' : route_direction ;
          
          let desc = helper.isNullEmptry(build_name)?'':build_name +',' +
          helper.isNullEmptry(build_number)?'':build_number +',' +
          helper.isNullEmptry(floor)?'':floor +',' +
          helper.isNullEmptry(room_number)?'':room_number +',' +
          helper.isNullEmptry(near)?'':near +',' +
          helper.isNullEmptry(street)?'':street +',' +
          helper.isNullEmptry(subdistrict)?'':subdistrict +',' +
          helper.isNullEmptry(distict)?'':distict +',' +
          helper.isNullEmptry(province)?'':province ;

          let cc_address_store_details = {
            'q16:ADDRS_CARDNUMBER': '',
            'q16:ADDRS_CONCEPTID': 2, //BK
            'q16:ADDRS_CUSTID': customer["CUST_ID"],
            'q16:ADDRS_SKETCH': '',
            'q16:ADDRS_STRID': -1,
            'q16:ADDRS_ZONEID': -1
          }             

          let cc_customer_phone = {
            'q16:PHONE_ADDRID': -1,
            'q16:PHONE_AREACODE': customer["CUST_PHONEAREACODE"],
            'q16:PHONE_CUSTID': customer["CUST_ID"],
            'q16:PHONE_EXT': '',
            'q16:PHONE_ISDEFAULT': 'T',
            'q16:PHONE_LOOKUP': customer["CUST_PHONELOOKUP"],
            'q16:PHONE_NUMBER': customer["CUST_PHONENUMBER"],
            'q16:PHONE_TYPE': customer["CUST_PHONETYPE"]
          }

          let cc_address = {
            'q16:ADDR_AREAID': area_id,
            'q16:ADDR_BLDGNAME': build_name,
            'q16:ADDR_BLDGNUM': build_number,
            'q16:ADDR_CITYID': helper.isNullEmptry(web_city["city_id"])?'-1':web_city["city_id"] ,
            'q16:ADDR_CLASSID': '4',
            'q16:ADDR_COUNTRYID': '1',
            'q16:ADDR_COUNTY': 'ไทย' ,
            'q16:ADDR_CUSTID': customer["CUST_ID"],
            'q16:ADDR_DESC': desc,
            'q16:ADDR_DISTRICTID': helper.isNullEmptry(web_district["distinct_id"])?'-1':web_district["distinct_id"],
            'q16:ADDR_FLATNUM': room_number,
            'q16:ADDR_FLOOR': floor,
            'q16:ADDR_LANGUAGE_PREFERENCE': 'Th',
            'q16:ADDR_MAPCODE': { 
              'q16:X': 0 ,
              'q16:Y': 0
            },
            'q16:ADDR_PHONEAREACODE': customer["CUST_PHONEAREACODE"],
            'q16:ADDR_PHONELOOKUP': customer["CUST_PHONELOOKUP"],
            'q16:ADDR_PHONENUMBER': customer["CUST_PHONENUMBER"],
            'q16:ADDR_PHONETYPE': customer["CUST_PHONETYPE"],
            'q16:ADDR_POSTALCODE': postcode,
            'q16:ADDR_PROVINCEID': helper.isNullEmptry(web_city["province_id"])?'-1':web_city["province_id"] ,
            'q16:ADDR_SKETCH': sketch,             
            'q16:ADDR_STREETID': '-1',
            'q16:Details': [cc_address_store_details],              
            'q16:Phones': [cc_customer_phone] ,             
            'q16:WADDR_AREAID': area_id,
            'q16:WADDR_BUILD_NAME': build_name,
            'q16:WADDR_BUILD_NUM': build_number,
            'q16:WADDR_BUILD_TYPE': '4',
            'q16:WADDR_CITYID': helper.isNullEmptry(web_city["city_id"])?'-1':web_city["city_id"] ,
            'q16:WADDR_CONCEPTID': '2',
            'q16:WADDR_COUNTRYID': '1',
            'q16:WADDR_DESC': desc,
            'q16:WADDR_DIRECTIONS': route_direction,
            'q16:WADDR_DISTRICTID': helper.isNullEmptry(web_district["distinct_id"])?'-1':web_district["distinct_id"],
            'q16:WADDR_DISTRICT_TEXT': helper.isNullEmptry(web_district["distinct_id"])?distict:web_district["distinct_thai"],
            'q16:WADDR_NAME': address_name,
            'q16:WADDR_POSTAL_CODE': postcode,
            'q16:WADDR_PROVINCEID': helper.isNullEmptry(web_city["province_id"])?'-1':web_city["province_id"] ,
            'q16:WADDR_STATUS':  '2',
            'q16:WADDR_STREET_TEXT': street,
            'q16:WADDR_SUBDISTRICT_TEXT': subdistrict,
            'q16:WADDR_TYPE': '1',
          }
          logger.info('RegisterAddress to sdk');
          RegisterAddress({
            'tns:licenseCode': process.env.LICENSECODE,
            'tns:requestID': uuidv4(),
            'tns:language': 'En',
            'tns:customerUserName': customer["USERNAME"],
            'tns:customerPassword': customer["PASSWORD"], //hash in db
            'tns:customerRegistrationID': customer["CUST_CORPID"],
            'tns:address': cc_address
          },function(err,sdkResponse){
            if(err){
              logger.info('Error RegisterAddress : '+err);
              callback(err,null);
            }
            if(!helper.isNullEmptry(sdkResponse["ADDR_CUSTID"])){
              let address = {...sdkResponse};
              
              //To do : save address
              mysqldb((err,connection) => {
                if(err){
                    logger.info('[Connecttion database error] '+err)
                    callback(err,null);
                }
  
                logger.info('[INSERT Address data] '+ address["ADDR_ID"])
                var addressData  = {
                  webcustomerID: address["ADDR_CUSTID"],
                  customerID: address["ADDR_CUSTID"],
                  addressID: address["ADDR_ID"],
                  storeID: store_id,
                  addressName: address["WADDR_NAME"],
                  provinceID: address["WADDR_PROVINCEID"],
                  cityID: address["WADDR_CITYID"],
                  distinctID: address["WADDR_DISTRICTID"],
                  streetID: address["WADDR_STREETID"],
                  areaID: address["WADDR_AREAID"],
                  roomNo: address["ADDR_FLATNUM"],
                  buildNo: address["WADDR_BUILD_NUM"],
                  buildName: address["WADDR_BUILD_NAME"],
                  floor: address["ADDR_FLOOR"],
                  street: address["WADDR_STREET_TEXT"],
                  district: address["WADDR_DISTRICT_TEXT"],
                  subdistrict: address["WADDR_SUBDISTRICT_TEXT"],
                  postCode: address["WADDR_POSTAL_CODE"],
                  areaText: address["WADDR_AREA_TEXT"],
                  direction: address["WADDR_DIRECTIONS"],
                  lat: lat,
                  lng: lng,
                  status: address["WADDR_STATUS"],
                  isDefault: is_default,
                  active: 1,
                  channel: channel,
                  phatform: phatform
                };
                connection.query('INSERT into address SET ?', addressData ,function (error, results, fields){
                    if (error) {
                        logger.info('[Insert database error] '+error);
                        callback(error,null);
                    };
                    connection.release()
                    callback(null,sdkResponse);
                });
              });
            }
          });

      }
    ],function(err,jsonReturn){
      if(err){
        res.status(500).json((new APIError('Error customer address : '+err,500,true)).returnJson());
      }
      if(jsonReturn["ADDR_ID"]){
        res.status(200).json(new APIResponse('registeraddress' ,200,{
          address_id : jsonReturn["ADDR_ID"],
          create_date : jsonReturn["CRT_DATE"]
        }));
      }else{
        res.status(500).json((new APIError('Error customer address : '+'can not create address',500,true)).returnJson());
      }     
    });

  }catch(err){
    return res.status(500).json((new APIError('Method post data error : '+err.stack,500,true)).returnJson());
  }
});


/**
 * Create Order Process
 * 
 */
const decodeCustoken = async function(cusToken,SECRET_KEY){
  return await Promise.all([jwt.verify(cusToken, SECRET_KEY, (err, decoded) => {
    if(err){
      return new Promise.resolve({
        error: err,
        customer: null
      });
    }
    return new Promise.resolve({
      error: null,
      customer: {...decoded}
    });
  })
])

}

router.post('/createorder', (req, res) => {
  try{
    var bodyData = req.body;
    //To do : validate request
    //shipping_method only 'delivery'
 
    let cusToken = bodyData.cust_token;
    let order_method = bodyData.order_method;
    let shipping_method = bodyData.shipping_method;
    let address_id = bodyData.address_id;
    let store_id = bodyData.store_id;
    let store_name = '';      //wait value from getStore
    let area_id = '';        //wait value from address object
    let web_city = '';        //wait
    let web_province = '';    //wait
    let web_distrinct = '';   //wait
    let web_street = '';      //wait
    let entries = bodyData.entries;
    let gross_total = bodyData.gross_total;
    let discounts = bodyData.discounts;
    let discount_total = bodyData.discount_total;
    let service_change = bodyData.service_change;
    let payment_amount = bodyData.payment_amount;
    
    let check_subtotal = (Number(gross_total) - Number(discount_total)).toFixed(2);
    let check_total = (Number(check_subtotal) + Number(service_change)).toFixed(2);
    let check_change = (Number(payment_amount)- Number(check_total)).toFixed(2);

    let phatform = req.headers["x-phatform"]; //sdk
    let channel  = req.headers["x-channel"]; //web or mobile
    let lang     = req.headers["x-language"].toUpperCase();

    waterfall([
       //Step :: 1 => check store_id
       function(callback){
        logger.info('[Step1] GetStore->store_id'); 
        GetStore({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'En',
          storeID: store_id
        },function(err,sdkResponse){
          if(err){
            logger.info('Error SDK GetStore : '+err);
            return callback(err,null);
          }
          if(sdkResponse["ResultCode"]){
            if(String(sdkResponse["ResultCode"]).includes('No_Store_Found')){
              logger.info('Error SDK GetStore : '+sdkResponse["ResultCode"]);
              return callback(sdkResponse["ResultCode"],null);
            }  
          }
          //No update store address
          //No check payment with card

          if(sdkResponse["STR_ID"]){
            //logger.info(sdkResponse);
            //logger.info(Boolean(sdkResponse["STR_ISACTIVE"]));
            if(helper.isNullEmptry(sdkResponse["STR_ISACTIVE"]) || !Boolean(sdkResponse["STR_ISACTIVE"]) ){
              return callback('ขออภัย สถานที่ของคุณอยู่นอกเขตพื้นที่จัดส่ง',null);
            }

            logger.info('found store : '+sdkResponse["STR_NAME"]);
            store_name = sdkResponse["STR_NAME"];
            switch(sdkResponse["STR_STATUS"])
            {
              case '0':
              case '1':
                callback(null,'store_is_avaiable');
                break;
              case '2':
                callback('ขออภัย ขณะนี้เป็นเวลาปิดให้บริการจัดส่ง',null);
                break;
              case '3':
                callback('ขออภัย สถานที่ของคุณอยู่นอกเขตพื้นที่จัดส่ง',null);
                break;
              default:
                callback(null,'store_is_avaiable');
                break;
            }
          }         
        })
      },
      //Step :: 2 => decode token to customer object
      function(store_ok,callback){
        logger.info('[Step2] CustToken->decode'); 
        decodeCustoken(cusToken,SECRET_KEY)
        .then(decoded => {
          let decodedToken = decoded[0];
          if(!helper.isNullEmptry(decodedToken.error)){
            return callback(decodedToken.error.message,null);
          }else{
            logger.info('decoded : '+decodedToken.customer); 
            logger.info('ordering method : '+order_method);
            if(order_method === 'future'){
              //To do check order date and last order date
  
            }else{
              logger.info((new Date()).getHours());
              if(parseInt((new Date()).getHours()) < 9  && (true || 'check blacklist'.length > 0) ){
                logger.info('Order - Check Store: Check Store Open at 10 AM.');
                return callback('ขออภัย ขณะนี้เป็นเวลาปิดให้บริการจัดส่ง',null);
              }
            }
            return callback(null,decodedToken.customer);
          }
        })
        .catch(err => {
          logger.info('[Decode token catch] '+ err);
          return res.status(401).json((new APIError('Token is not valid : '+err,401,true)).returnJson());
        })
      },
      //Step :: 3 ==> lookup customer 
      function(requestCustomer,callback){
        logger.info('[Step3] GetCustomerByID->cust_id'); 
        logger.info('GET customer with cust_id = '+requestCustomer["CUST_ID"]);
        GetCustomerByID({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'En',
          customerID: requestCustomer["CUST_ID"],
          conceptID: 2
        },function(err,sdkResponse){
            if(err){
                logger.info('Error SDK GetCustomerByID : '+err);
                callback(err,null);
            }
            if(sdkResponse["CUST_ID"]){
              logger.info('found customer to set a object');
              let customer = {...sdkResponse};
              callback(null,customer);
            }
        });
      },
      //Step :: 4 check customer address is [WEB DELETE]
      function(customer,callback){
        logger.info('[Step4] GetCustomerAddresses->username,password'); 
        logger.info('GET customer address ,username = '+customer["USERNAME"]);
        GetCustomerAddresses({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'En',
          customerUserName: customer["USERNAME"],
          customerPassword: customer["PASSWORD"],
          conceptID: 2,
          from: 1,
          to: 1000
        },function(err,sdkResponse){
          if(err){
            logger.info('Error SDK GetCustomerAddress : '+err);
            callback(err,null);
          }
          let ordering_phoneNumber = '';
          if(sdkResponse["CC_ADDRESS"]){
            logger.info('found addresses to set a object');
            let address = [...sdkResponse["CC_ADDRESS"]];
            let addressFound = address.filter(addr => {
              //return true;
              return String(addr["ADDR_ID"]) === String(address_id) && !String(addr["WADDR_NAME"]).includes('[WEB DELETE]');
            })
            //logger.info('[found] address no. : '+addressFound.length);
            //logger.info(addressFound);

            if(addressFound.length === 0){
              logger.info('Do not find address with addr_id '+address_id + ' or address was deleted.');
              callback('Customer address does not exist or deleted',null);
            }else{
              let addr = addressFound[0]
              area_id = addr["ADDR_AREAID"];
              logger.info('Set area_id : '+ area_id);

              //Check phone number
              if(shipping_method === 'delivery'){
                logger.info('To do delivery information');
                if(helper.isNullEmptry(addr["ADDR_PHONELOOKUP"]) ){   //|| helper.isNullEmptry(addr["CUST_PHONELOOKUP"])
                  callback('Customer phone does not exist',null);
                }else{
                  ordering_phoneNumber = String(0) + (!helper.isNullEmptry(addr["ADDR_PHONELOOKUP"]) ? String(addr["ADDR_PHONELOOKUP"]) : '') ;  //String(addr["CUST_PHONELOOKUP"]);
                  logger.info('retreive ordering_phoneNumber : ' + ordering_phoneNumber);

                  callback(null,customer);
                }
              }
            }
          }
        });
      },   
      //Step :: 5 get city ,distinct   
      function(customer,callback){
        logger.info('[Step5] GetArea->area_id'); 
        GetArea({
          licenseCode: process.env.LICENSECODE,
          requestID: uuidv4(),
          language: 'Th',
          areaID: area_id //BK_TH
        },function(err,sdkResponse){
          if(err){
              logger.info('Error SDK GetArea : '+err);
              res.json((new APIError('Could not find the area',404,true)).returnJson());
          }
          
          web_city = String(sdkResponse["AREA_CITYID"]);
          web_province = String(sdkResponse["AREA_PROVINCEID"]);
          web_distrinct = String(sdkResponse["AREA_DEF_DISTRICTID"]);
          web_street = String(sdkResponse["AREA_DEF_STREETID"]);

          // web_city = myCache.get("web_cities").filter(web =>{
          //   return String(web["city_id"]) === String(sdkResponse["AREA_CITYID"])
          // })[0]["city_id"];
      
          // web_province = myCache.get("web_provinces").filter(web =>{
          //   return String(web["province_id"]) === String(sdkResponse["AREA_PROVINCEID"])
          // })[0]["province_id"];
      
          // let web_distrinct_list = myCache.get("web_districts").filter(web =>{
          //   return String(web["distinct_id"]) === String(sdkResponse["AREA_DEF_DISTRICTID"])
          // });
          
          // web_distrinct = web_distrinct_list.length > 0 ? web_distrinct_list[0]["distinct_id"] : -1;
      
          // web_street = myCache.get("web_streets").filter(web =>{
          //   return String(web["street_id"]) === String(sdkResponse["AREA_DEF_STREETID"])
          // })[0]["street_id"];

          logger.info('web_city : '+web_city);
          logger.info('web_province : '+web_province);
          logger.info('web_distrinct : '+web_distrinct);
          logger.info('web_street : '+web_street);
          callback(null,customer);
        });
      },
      //Step :: 6 create order
      function(customer,callback){   //'customer,'
        logger.info('[Step6] Create_order'); 
        let sdk_entries = [];
         
        let delivery_burger = {
          'q176:CEntry':{
            'q176:Category': -1,
            'q176:DiscountPrice': 0,
            'q176:Entries': '',
            'q176:ItemID': 6001,
            'q176:Level': 1,
            'q176:LongName': 'Delivery Burger',
            'q176:ModCode': entry_status.NONE,
            'q176:Name': 'Delivery Burger',
            'q176:OrdrMode': 'OM_SAVED',
            'q176:Price': 0,
            'q176:ShortName': 'Delivery Burger',
            'q176:Status': entry_status.NOTAPPLIED,
            'q176:Type': entry_type.ITEM,
            'q176:Weight': 0
          }
        }
         //Check item order ,Entries
         each(entries,function(entry,cb){
          let sdk_entry_detail = {
            'q176:Category': -1,
            'q176:DiscountPrice': 0,
            'q176:Entries': [],//delivery_burger,
            'q176:ItemID': entry.item_id,
            'q176:Level': entry.level,
            'q176:LongName': entry.long_name,
            'q176:ModCode': entry_status.WITH,
            'q176:Name': entry.name,
            'q176:OrdrMode': 'OM_SAVED',
            'q176:Price': entry.price,
            'q176:ShortName': entry.short_name,
            'q176:Status': entry_status.NOTAPPLIED,
            'q176:Type': entry_type.ITEM,
            'q176:Weight': entry.weight
          }
          let sdk_entry = {
            'q176:CEntry' : sdk_entry_detail    
          };
          sdk_entries.push({...sdk_entry});
          cb();
         },function(err){
          if(err){
            logger.info('Error while mapping each entries : '+err);
          }else{
            logger.info('Completed mapping entries : ');
            //logger.info(sdk_entries);

            let create_order = {
              'q176:AddressID': address_id,
              'q176:AreaID': area_id,
              'q176:AuthReq': 0,
              'q176:AuthReqReason': 0,
              'q176:AuthReqRemarks': '',
              'q176:AuthTime': '0001-01-01T00:00:00',
              'q176:BackupStoreID': -1,
              'q176:Change': check_change,
              'q176:CityID': web_city,
              'q176:Comps': '', 
              'q176:ConceptID': 2,
              'q176:CountryID': 1,
              'q176:CreateBy': phatform + ' - ' + 'burgerking '+channel ,
              'q176:CustomerID': customer["CUST_ID"],
              'q176:DiscountTotal': Number(discount_total).toFixed(2),
              'q176:Discounts': '', 
              'q176:DistrictID': web_distrinct,
              'q176:DriverID': 0,
              'q176:DriverName': '',
              'q176:DueTime': '0001-01-01T00:00:00',
              'q176:Entries': sdk_entries,
              'q176:FirstSendTime': '0001-01-01T00:00:00',
              'q176:GrossTotal': gross_total,
              'q176:IsAuth': store_id === -1 ? 0 : 1,
              'q176:IsExternal': 0,
              'q176:LastSendTime': '0001-01-01T00:00:00',
              'q176:Note': '',
              'q176:OrderMode': shipping_method === 'delivery' ? 1 : 2,
              'q176:OrderName': 'Burgerking - '+ channel +' customer booking '+customer["WCUST_FIRSTNAME"],
              'q176:OrderType': order_method === 'now' ? 0 : 1,
              'q176:PromiseTime': 0,
              'q176:ProvinceID': web_province,
              'q176:RejectReason': 0,
              'q176:SalesAmount': check_total,
              'q176:ServiceCharge': service_change,
              'q176:Source': 2,
              'q176:Status': 0,
              'q176:StatusTime': '0001-01-01T00:00:00',
              'q176:StoreDOB': '',
              'q176:StoreDueTime': '0001-01-01T00:00:00',
              'q176:StoreID': store_id,
              'q176:StoreName': store_name,
              'q176:StoreNumber': store_name,
              'q176:StoreOrderMode': 0,
              'q176:StreetID': web_street,
              'q176:SubTotal': check_subtotal,
              'q176:SuspendReason': 0,
              'q176:Total': check_total,
              'q176:ValidateStore': 0,
              'q176:VoidReason': 0,
              'q176:ZoneID': -1
            }

            let update_order = {
              'tns:licenseCode': process.env.LICENSECODE,
              'tns:requestID': uuidv4(),
              'tns:language': 'Th',
              'tns:conceptID': 2,
              'tns:order': create_order,
              'tns:autoApprove': true,
              'tns:useBackupStoreIfAvailable': false,
              'tns:orderNotes1': '',
              'tns:orderNotes2': '',
              'tns:creditCardPaymentbool': false,
              'tns:isSuspended': false
            }
            logger.info('Createorder -> '+JSON.stringify(update_order));
            UpdateOrder(update_order,function(err,sdkResponse){
              if(err){
                  logger.info('Error sdk UpdateOrder : '+err);
              }
              logger.info('Completed create order');
              logger.info(sdkResponse);
              
              if(!helper.isNullEmptry(sdkResponse) && Number(sdkResponse) > 0){
                let order_id = sdkResponse;

                mysqldb((err,connection) => {
                  if(err){
                      logger.info('[Connecttion database error] '+err)
                      callback(err,null);
                  }
    
                  logger.info('[INSERT Order data] '+ sdkResponse)
                  var orderData  = {
                    orderID: sdkResponse,
                    channel: channel,	
                    addressID: address_id,
                    areaID:	area_id,	
                    storeID: store_id,	
                    storeName: store_name,	
                    storeNumber: store_id,	
                    orderMode:  2 ,//shipping_method === 'delivery' ? '1' : '2' ,	
                    orderName: 'Burgerking - '+ channel +' customer booking '+customer["WCUST_FIRSTNAME"],
                    orderType: order_method === 'now' ? '0' : '1',
                    //tranDate:	CURRENT_TIMESTAMP(),	
                    dueDate: null,	
                    customerID:	customer["CUST_ID"],
                    grossTotal: gross_total	,
                    discountTotal: Number(discount_total).toFixed(2),	
                    refID: '',	
                    transactionBy:	'',	
                    //createdDate: CURRENT_TIMESTAMP(),
                    json:	JSON.stringify(update_order),	
                    site:	store_id,
                    status:	'0',	
                    entries: JSON.stringify(entries),
                    cookingFinishTime: null,	
                    pickupFinishTime: null,	
                    cancelTime: null
                  };
                  connection.query('INSERT into orders SET ?', orderData ,function (error, results, fields){
                      if (error) {
                          logger.info('[Insert database error] '+error);
                          callback(error,null);
                      };
                      connection.release()
                      callback(null,sdkResponse)
                  });
                });
                
              }
            });
          }
         });
      }
    ],function(err,jsonReturn){
      if(err){
        logger.info('[waterfall] error');
        res.json((new APIError('Error rest api /createorder  : '+err,500,true)).returnJson());
      }else{
        res.json(new APIResponse('createorder' ,200,{
          order_id : jsonReturn
        }));
      }
      
    });
    
    
    /*
    let order = {
      'web:AddressID': address_id,
      'web:AreaID': aread_id,
      'web:AuthReq': 0,
      //'web:AuthReqReason':'',
      //'web:AuthTime':'',
      'web:BackupStoreID': -1,
      //'web:Balance': 0,
      'web:Change': check_change,
      //'web:CheckNumber': '',
      'web:CityID': web_city,
      'web:Comps': [],
      'web:ConceptID': 2,
      'web:CountryID': 1,
      'web:CreateBy': phatform + ' - ' + 'burgerking '+channel ,
      'web:CustomerID': customer["CUST_ID"],
      //'web:DOB': '',
      //'web:DateOfTrans': '',
      'web:DiscountTotal': discount_total.toFixed(2),
      'web:Discounts': [],
      'web:DistrictID': web_distrinct,
      //'web:DriverID': '',
      //'web:DriverName': '',
      //'web:DueTime': '',
      'web:Entries': [],
      //'web:ExtendedAttributes': [],
      'web:GrossTotal': gross_total,
      'web:IsAuth': store_id === -1 ? 0 : 1,
      //'web:IsExternal': '',
      'web:Note': [],
      'web:OrderMode': shipping_method === 'delivery' ? 1 : 2,
      'web:OrderName': 'Burgerking - '+ channel +' customer booking '+customer["WCUST_FIRSTNAME"],
      'web:OrderType': shipping_method === 'now' ? 0 : 1,
      //'web:Payments': [],
      //'web:PromiseTime': '',
      'web:ProvinceID': web_province,
      //'web:Remarks': '',
      'web:SalesAmount': check_total,
      'web:ServiceCharge': service_change,
      'web:Source': 2,
      'web:Status': 0,
      //'web:StoreDOB': '',
      //'web:StoreDueTime': '',
      'web:StoreID': store_id,
      'web:StoreName': store_name,
      'web:StoreNumber': store_name,
      //'web:StoreOrderMode': '',
      //'web:StoreWebName': '',
      'web:StreetID': web_street,
      'web:SubTotal': check_subtotal,
      'web:Total': check_total,
      //'web:ValidateStore': '',
      'web:ZoneID': -1
    }


    let c_check = {
      ConceptID: '2',
      StoreID: 'store_id',
      StoreNumber: 'store_num',
      StoreName: 'Unspecified',
      OrderMode: '2', //3; //walkin
      OrderType: 'order_method',
      CustomerID: 'token.cust_id',
      AddressID: 'cust_address_id',
      CountryID: '1',
      ProvinceID: 'ADDR_PROVINCEID',
      CityID: 'ADDR_CITYID',
      AreaID: 'ADDR_AREAID',
      DistrictID: 'ADDR_DISTRICTID',
      StreetID: 'ADDR_STREETID',
      ZoneID: '-1',
      Source: '2',
      Status: '0',
      GrossTotal: 'Check gross total',
      DiscountTotal: 'discount total',
      SubTotal: 'SubTotal',
      ServiceCharge: '',
      Total: 'check total',
      SalesAmount: 'sale amount',
      Change: 'check change',
      IsAuth: '1',
      AuthReq: '0',
      Entries: [],
      Comps: [],
      Discounts: [],
      CreateBy: 'BKWEB',
      OrderName: 'order_id',
      BackupStoreID: '-1',
    }
    */

      // let errCheckout = func.errCheckout(checkout);

      // if(!errCheckout.err){
      //   res.json(new APIResponse('ok success' ,200,errCheckout.msg));

      // }else{
      //   res.status(400).json((new APIError('Bad request object is missing : '+errCheckout.msg,400,true)).returnJson());
      // }
  }catch(err){
    return res.status(500).json((new APIError('Method post data error : '+err.stack,500,true)).returnJson());
  }

});

router.get('/orderdetails', (req,res) => {
  GetOrderDetails({
    licenseCode: process.env.LICENSECODE,
    requestID: uuidv4(),
    language: 'En',
    conceptID: 2,
    orderID: req.query.id
  },function(err,sdkResponse){
    if(err){
        logger.info('error at /orderdetails '+err);
        res.status(404),json((new APIError('Could not find order',404,true)).returnJson());
    }
    res.status(200).json(new APIResponse('getOrderDetails' ,200 , {
      "order_status": sdkResponse["Status"],
      "order_status_datetime": sdkResponse["StatusTime"],
      "order_transaction_date" : sdkResponse["StoreDOB"],
      "order_delivering_duetime" : sdkResponse["StoreDueTime"],
      "order_store_id" : sdkResponse["StoreID"],
      "order_store_name" : sdkResponse["StoreName"]
    }));
  });
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
    //     //                               logger.info('GetArea error '+err);
    //     //                           }
    //     //                           logger.info(i++);
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
  //       logger.info('err '+err);
  //   }
  //   let stores = sdkResponse["CC_STORE_AREA"].map( store => {
  //     return {
  //       store_id : store["STR_ID"],
  //       area_id : store["STR_AREAID"],
  //       zone_id : store["STR_DEF_ZONEID"]
  //     }
  //   });

  //  logger.info('GetStoresAreaList => output '+stores.length);
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
    //         logger.info('err '+err1);
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
