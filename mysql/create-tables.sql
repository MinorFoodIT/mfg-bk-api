CREATE TABLE bkapi.sites (
	ID int(10) NOT NULL auto_increment,
	sitegroup varchar(25) NOT NULL,
	siteID varchar(25) NOT NULL,
	siteNumber varchar(25) NOT NULL,
	siteName varchar(400) NOT NULL,
	PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bkapi.orders (
	id bigint(19) NOT NULL auto_increment,
    channel varchar(100),
	addressID varchar(100),
	areaID varchar(100),
	storeID varchar(40),
	storeName varchar(255),
	storeNumber varchar(40),
	orderMode int(10),
	orderName varchar(255),
	orderType int(10),
	tranDate timestamp NULL DEFAULT NULL,
	dueDate timestamp NULL DEFAULT NULL,
	customerID varchar(100),
	grossTotal decimal(15,2),
	discountTotal decimal(15,2),
	refID varchar(100),
	transactionBy varchar(255),
	createdDate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	json longtext,
	site varchar(40),
	status varchar(10),
	entries longtext,
	cookingFinishTime timestamp NULL DEFAULT NULL,
	pickupFinishTime timestamp NULL DEFAULT NULL ,
	cancelTime timestamp NULL DEFAULT NULL,
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bkapi.customers (
	ID bigint(19) NOT NULL auto_increment,
    webcustomerID varchar(40),
    customerID varchar(40),
	username varchar(255),
	password varchar(100),
    active bit(1),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sitegroup varchar(25) NOT NULL,
	PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bkapi.address (
	ID bigint(19) NOT NULL auto_increment,
	webaddressID varchar(40),
    addressID varchar(40),
    address varchar(500),
	active binary(1),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;