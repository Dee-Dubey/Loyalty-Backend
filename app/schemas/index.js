const Joi = require('joi');

const addCustomerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    category: Joi.string().min(1).required(),
    balance: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addMenuSchema = Joi.object({
    name: Joi.string().min(2).required(),
    amount: Joi.number().required(),
    stock: Joi.number().allow("").optional(),
    type: Joi.string().min(1).required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addOrderSchema = Joi.object({
    orders: Joi.array().required(),
    tableId: Joi.number().required(),
    orderId: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const mapRawMaterialSchema = Joi.object({
    rawMaterialId: Joi.number().required(),
    menuId: Joi.number().required(),
    quantity: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addRawMaterialSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    alertLimit: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addTableSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addTransactionSchema = Joi.object({
    orderId: Joi.number().required(),
    amount: Joi.number().required(),
    netAmount: Joi.number().required(),
    paidAmount: Joi.number().required(),
    discountAmount: Joi.number().required(),
    tableId: Joi.number().required(),
    mode: Joi.string().required(),
    customerId: Joi.number().allow(null).required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addUserSchema = Joi.object({
    username: Joi.number().required(),
    password: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const editCommonSchema = Joi.object({
    id: Joi.number().min(1).required(),
    field: Joi.string().min(1).required(),
    value: Joi.string().allow("").required(),
    target: Joi.string().min(1).required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const updateRawMaterialSchema = Joi.object({
    id: Joi.number().required(),
    quantity: Joi.number().required(),
    userId: Joi.number().required(),
    companyId: Joi.number().required()
});

const addTrackingSchema = Joi.object({
    shipment_remark: Joi.string().min(2).required(),
    location: Joi.string().min(2).required(),
    count: Joi.number().required(),
    lrnum: Joi.string().required(),
    mwn: Joi.string().required(),
    cl_uuid: Joi.string().required(),
    name: Joi.string().required(),
    package_type: Joi.string().required(),
    expected_delivery_date: Joi.string().required(),
    promised_delivery_date: Joi.string().required(),
    timestamp: Joi.number().required(),
    status: Joi.string().required()
});

module.exports = {
    addCustomerSchema, editCommonSchema, addMenuSchema, addOrderSchema, mapRawMaterialSchema,
    addRawMaterialSchema, addTableSchema, addTransactionSchema, addUserSchema, updateRawMaterialSchema, addTrackingSchema
}