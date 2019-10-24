const uuidv4 = require('uuid/v4');
const myCache = require('./nodeCache');
const GetStoresAreaList = require('../service/geo/getStoresAreaList');
const GetProvincesList = require('./../service/geo/getProvincesList');
const GetCitiesList = require('./../service/geo/getCitiesList');
const GetWebAddresType = require('./../service/geo/getWebAddressType');
const GetWebBuildType  = require('./../service/geo/getWebBuildType');
const GetWebCountriesList = require('./../service/geo/getWebCountriesList');
const GetWebProvincesList = require('./../service/geo/getWebProvincesList');
const GetWebCitiesList = require('./../service/geo/getWebCitiesList');
const GetWebDistrictsList = require('./../service/geo/getWebDistrictsList');
const GetWebStreetsList = require('./../service/geo/getWebStreetsList');
const GetCompList = require('./../service/master/getCompList');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

let funcStores = () => {
     return new Promise(resolve => {
        var get_store_args = {
            licenseCode: process.env.LICENSECODE,
            requestID: uuidv4(),
            language: 'En',
            conceptID: 2 //BK_TH
         }
         console.log('Cache stores_area => start');
         GetStoresAreaList(get_store_args, function (err, sdkResponse) {
             if (err) {
                 console.log('GetStoresAreaList error ' + err);
             }
             let stores = sdkResponse["CC_STORE_AREA"].map(store => {
                 return {
                     store_id: store["STR_ID"],
                     area_id: store["STR_AREAID"],
                     zone_id: store["STR_DEF_ZONEID"]
                 };
             });
             myCache.set("stores_area",stores);
             console.log('Cache stores_area => finished');
             resolve('funcStores');
         })
     })
}

let funcCountries = async () => {

}

let funcProvinces = () => {
    return new Promise(resolve => {
        console.log('Cache provinces => start');
        GetProvincesList({
            licenseCode: process.env.LICENSECODE,
            requestID: uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetProvincesList error ' + err);
            }
            let provinces = sdkResponse["CC_PROVINCE"].map(store => {
                return {
                    province_id: store["PRO_ID"],
                    province_name: store["PRO_NAME"]
                };
            });
            myCache.set("provinces",provinces);
            //console.log(provinces);
            console.log('Cache provinces => finished');
            resolve('funcStores');
        })
    });
}

let funcCities =  () => {
    return new Promise(resolve => {
        console.log('Cache cities => start');
        GetCitiesList({
            licenseCode: process.env.LICENSECODE,
            requestID: uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetCitiesList error ' + err);
            }
            let cities = sdkResponse["CC_CITY"].map(store => {
                return {
                    city_id: store["CTY_ID"],
                    city_name: store["CTY_NAME"],
                    province_id: store["CTY_PROVINCEID"],
                };
            });
            myCache.set("cities",cities);
            //console.log(cities);
            console.log('Cache cities => finished');
            resolve('funcCities');
        })
    });
}

let funcWebBuildType =  () => {
    return new Promise(resolve => {
        console.log('Cache webBuildType => start');
        GetWebBuildType({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetWebBuildType error ' + err);
            }
            let buildType = sdkResponse["CC_WEB_BUILD_TYPE"].map(store => {
                return {
                    btype_id: store["BTYPE_ID"],
                    btype_name: store["BTYPE_NAME"],
                    btype_name_thai: store["BTYPE_NAMEUN"]
                };
            });
            myCache.set("web_build_type",buildType);
            //console.log(buildType);
            console.log('Cache webBuildType => finished');
            resolve('funcWebBuildType');
        })
    });
}

let funcWebAddressType = () => {
    return new Promise(resolve => {
        console.log('Cache webAddressType => start');
        GetWebAddresType({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetWebAddresType error ' + err);
            }
            let addressType = sdkResponse["CC_WEB_ADDRESS_TYPE"].map(store => {
                return {
                    type_id: store["TYPE_ID"],
                    type_name: store["TYPE_NAME"],
                    type_name_thai: store["TYPE_NAMEUN"],
                    type_addr_classid: store["TYPE_ADDR_CLASSID"],
                    type_cust_classid: store["TYPE_CUST_CLASSID"],
                };
            });
            myCache.set("web_address_type",addressType);
            //console.log(addressType);
            console.log('Cache webAddressType => finished');
            resolve('funcWebAddressType');
        })
    });
}

let funcWebCountries = () => {
    return new Promise(resolve => {
        console.log('Cache webcountries => start');
        GetWebCountriesList({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetWebCountriesList error ' + err);
            }
            let web_countries = sdkResponse["CC_WEB_COUNTRY"].map(store => {
                return {
                    country_id: store["CNT_ID"],
                    country_name: store["CNT_NAME"]
                };
            });
            myCache.set("web_countries",web_countries);
            //console.log(web_countries);
            console.log('Cache webcountries => finished');
            resolve('funcWebCountries');
        });
    });
}

let funcWebProvinces = () => {
    return new Promise(resolve => {
        console.log('Cache webprovinces => start');
        GetWebProvincesList({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En'
        },function (err, sdkResponse){
            if (err) {
                console.log('GetWebProvincesList error ' + err);
            }
            let web_provinces = sdkResponse["CC_WEB_PROVINCE"].map(store => {
                return {
                    province_id: store["PRO_ID"],
                    province_name: store["PRO_NAME"],
                    province_name_thai: store["PRO_NAMEUN"]
                };
            });
            myCache.set("web_provinces",web_provinces);
            //console.log(web_provinces);
            console.log('Cache webprovinces => finished');
            resolve('funcWebProvinces');
        });
    });
}
    

let funcWebCities = () => {
    return new Promise(resolve => {
        console.log('Cache webcities => start');
        GetWebCitiesList({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En'
        }, async function (err, sdkResponse){
            if (err) {
                console.log('GetWebCitiesList error ' + err);
            }
            let web_cities = sdkResponse["CC_WEB_CITY"].map(store => {
                return {
                    city_id: store["CTY_ID"],
                    city_name: store["CTY_NAME"],
                    city_name_thai: store["CTY_NAMEUN"],
                    province_id: store["CTY_PROVINCEID"]
                };
            });
            myCache.set("web_cities",web_cities);
            //console.log(web_cities.length);
            console.log('Cache webcities => finished');

            let doneToLoadDistricts = false;
            let doneToLoadStreets = false;
            //Load district
            console.log('Cache webDistricts=> start');
            let web_districts  = [];
            let loadingDistricts = async() => {
                return await Promise.all(
                    web_cities.map(web => {
                                return new Promise(resolve => {
                                    GetWebDistrictsList({
                                        licenseCode: process.env.LICENSECODE,
                                        requestID:  uuidv4(),
                                        language: 'En',
                                        countryID: 1,
                                        provinceID: web["province_id"],
                                        cityID: web["city_id"]
                                    },function (err, sdkResponse){
                                        if (err) {
                                            console.log('GetWebDistrictsList error ' + err);
                                        }
                                        web_districts = sdkResponse["CC_WEB_DISTRICT"].map(store => {
                                            return {
                                                distinct_id: store["DIS_ID"], 
                                                distinct_name: store["DIS_NAME"],
                                                distinct_thai: store["DIS_NAMEUN"],
                                                city_id: store["DIS_CITYID"],
                                            };
                                        });
                                        //console.log('Get WebDistricts => pushed');
                                        resolve('funcWebDistrictsList');
                                    });
                                }); 
                            }));
            }
           
            loadingDistricts().then(results =>{
                console.log('Cache webDistricts=> finished');
                myCache.set("web_districts",web_districts);
                
                doneToLoadDistricts = true;
                if(doneToLoadDistricts && doneToLoadStreets){
                    resolve('funcWebCities');
                }else{
                    console.log('waiting loadStreets()');
                }
            }).catch(err => {
                console.log(err);
            });


            //Load webStreets
            console.log('Cache webStreets=> start');
            let web_streets  = [];
            let loadStreets = async() => {
                //only one
                return await Promise.all([web_cities[0]].map(web => {
                            return new Promise(resolve => {
                                GetWebStreetsList({
                                    licenseCode: process.env.LICENSECODE,
                                    requestID:  uuidv4(),
                                    language: 'En',
                                    countryID: 1,
                                    provinceID: web["province_id"],
                                    cityID: web["city_id"]
                                },function (err, sdkResponse){
                                    if (err) {
                                        console.log('GetWebStreetsList error ' + err);
                                    }
                                    web_streets = sdkResponse["CC_WEB_STREET"].map(web => {
                                        return {
                                            street_id: web["STRET_ID"],
                                            street_name: web["STRET_NAME"]
                                        }
                                    })
                                    //console.log('Get WebStreets => pushed');
                                    resolve('funcWebStreetsList');
                                });
                            }); 
                        }));
                    }
                       
                loadStreets()
                    .then(results =>{
                        console.log('Cache webStreets=> finished');
                        myCache.set("web_streets",web_streets);
                        //console.log(myCache.get("web_streets"));
                        //console.log(myCache.get("web_streets")[1]);
                        doneToLoadStreets = true;
                        if( doneToLoadStreets && doneToLoadDistricts){
                            resolve('funcWebCities');
                        }else{
                            console.log('waiting loadingDistricts()');
                        }
                    }).catch(err => {
                        console.log(err);
                    });
        });
    });
}

let funcCompList = () => {
    return new Promise(resolve => {
        console.log('Cache comp => start');
        GetCompList({
            licenseCode: process.env.LICENSECODE,
            requestID:  uuidv4(),
            language: 'En',
            conceptID: 2,
            menuTemplateID: 10
        },function (err, sdkResponse){
            if (err) {
                console.log('GetCompList error ' + err);
            }
            let web_comp = sdkResponse["CComp"].map(store => {
                return {
                    comp_id: store["CompID"],
                    check_name: store["CheckName"],
                    name: store["Name"],
                    amount: store["Amount"],
                    percent_off: store["PercentOff"]
                };
            });

            web_comp = web_comp.filter(comp => {
                return String(comp["name"]) === String('Disc 50B')
            });
            myCache.set("web_comp",web_comp);
            console.log(web_comp);
            console.log('Cache comp => finished');
            resolve('funcCompList');
        });
    });
}

let loadingFirst = async() =>{
    console.log('[Cache] load '+new Date());
    return await Promise.all([
        //console.log('test')
        funcStores(),
        funcProvinces(),
        funcCities(),
        funcWebBuildType(),
        funcWebAddressType(),
        funcWebCountries(),
        funcWebProvinces(),
        funcWebCities(), //Include webDistrinct ,webstreet
        funcCompList()
    ]);
}

module.exports = loadingFirst();