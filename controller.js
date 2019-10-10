/*
var args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En'
}
sysparameter(args,function(err,sdkResponse){
    console.log(sdkResponse);
});
*/

/*
var get_active_check_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    customerID: 4000005013918610,
    addressID: 4000500017946818,
    conceptID: 1,
    numberOfOrders: 2
}

GetActiveOrderList(get_active_check_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
var get_customer_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    customerID: 4000005013918610,
    conceptID: 1
}

GetCustomerByID(get_customer_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
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

GetCustomerAddresses(get_customer_addr_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
var get_item_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 1,
    menuTemplateID: 7, //PZEQ-NORMAL_WEB ONLY
    itemID: 870053
}

GetItem(get_item_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
var get_order_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    orderID: 40098405
}

GetOrderDetails(get_order_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
var get_order_sts_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En'
}

GetOrderStatusList(get_order_sts_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    //console.log(sdkResponse);
    console.log(Object.keys(sdkResponse));
});
*/

/*
var get_store_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    storeID: 1695
}

GetStore(get_store_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/

/*
var update_order_args = {
    licenseCode: process.env.LICENSECODE,
    requestID: '201909171328',
    language: 'En',
    conceptID: 1,
    order:{ 
        AddressID: '4000500017946818',
        AreaID: '53702',
        AuthBy: 'Web',
        AuthReq: 1,
        AuthReqReason: '18',
        AuthReqRemarks: '',
        AuthReqRemarksUn: '',
        AuthTime: '2019-09-18T16:09:02.000Z',
        BackupStoreID: '-1',
        Balance: 0,
        CancelBy: '',
        CancelTime: '0000-12-31T17:17:56.000Z',
        Change: 50,
        CheckNumber: 0,
        CityID: '1001',
        Comps: null, //[]
        ConceptID: '1',
        CountryID: '1',
        CreateBy: 'Web',
        CreateTime: '2019-09-18T16:09:01.000Z',
        CustomerID: '4000005013918610',
        DOB: '20190918',
        DateOfTrans: '2019-09-18T16:09:02.000Z',
        DiscountTotal: 0,
        Discounts: null, //[]
        DistrictID: '50107',
        DriverID: -1,
        DriverName: '',
        DueTime: '2019-09-18T16:39:01.000Z',
        Entries: { CEntry: [ 
                             {  AskDesc: 'F',
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
                                Weight: '0' 
                              } 
                            ] 
                },
        ExtendedAttributes: null, //[]
        ExternalStatus: 1,
        FirstSendTime: '2019-09-18T16:09:01.000Z',
        GrossTotal: 0,
        IsAuth: 1,
        IsExternal: 1,
        LastSendTime: '2019-09-18T16:09:02.000Z',
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
        StatusTime: '2019-09-16T16:09:01.000Z',
        StoreDOB: '20190917',
        StoreDueTime: '2019-09-16T16:39:03.000Z',
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
        UpdateTime: '2019-09-16T16:09:01.000Z',
        ValidateStore: 1,
        VoidReason: '-1',
        ZoneID: '-1' 
      },
    autoApprove: false,
    useBackupStoreIfAvailable: false,
    orderNotes1: '',
    orderNotes2: '',
    creditCardPaymentbool: false,
    isSuspended: false
}

UpdateOrder(update_order_args,function(err,sdkResponse){
    if(err){
        console.log('err '+err);
    }
    console.log(sdkResponse);
    //console.log(Object.keys(sdkResponse));
});
*/