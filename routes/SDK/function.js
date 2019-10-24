const Joi = require('joi');
const APIError = require('../../common/APIError');
const APIResponse = require('../../common/APIResponse');
/**
 * Functions
 * 
*/
const errCheckout = (checkout) => {
    const schema = Joi.object({
      OrderMethod: Joi.string().valid(['now','future']),
      OrderDateTime: Joi.string().required(),
      PaymentMethod: Joi.string().valid(['bk']).required(),
      ShippingMethod: Joi.string().valid(['delivery','takeout']).required(),
      AddressID: Joi.number().required(),
      StoreID: Joi.number().required(),
      CouponCode: [Joi.string(),Joi.number()],
      Platform: Joi.string().valid(['web']).required(),
      Language: Joi.string().valid(['en','th']).required(),
      Total: Joi.number() ,//precision(),
      PayAmount: Joi.number() , //.precision(),
      OrderNote: Joi.string().allow('',null),
      TaxReceipt: Joi.boolean(),
      TaxNumber: Joi.number(),
      TaxBranch: Joi.string().allow('',null),
      TaxCompanyName: Joi.string().allow('',null),
      TaxCustomerAddress: Joi.string().allow('',null),
      Cart: Joi.array(),
      StrCart: Joi.array(),
      PaymentNote: Joi.string().allow('',null),
      PaymentUserID: Joi.string().allow('',null),  //"BKWebID",
      PaymentID: Joi.string().allow('',null) ,     //"card122345",
      UserAgent: Joi.string().allow('',null)       //"bank"
    });
    const { error, value: validCheckout } = Joi.validate(checkout,schema);
      if (error) {
        //throw new Error(`checkout error: ${error.message}`);
        return {err: true ,msg: error.message}; 
      }else{
        return {err:false, msg: validCheckout};
      }
  }

  module.exports = {errCheckout};