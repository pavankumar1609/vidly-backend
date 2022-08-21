const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.bool(),
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
module.exports.customerSchema = customerSchema;
