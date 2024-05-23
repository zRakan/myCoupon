const HTTP_CODES = {
    "INPUT_ERROR": 400,
    "AUTHORIZATION": 401,
    "NOT_ADMIN": 403,
    "NOT_FOUND": 404
}

export default {
    "INVALID_DATA": function(res) { return res.status(HTTP_CODES['INPUT_ERROR']).send({ status: "error", message: "Invalid data" }) },

    "USER_NOT_FOUND": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "اسم مستخدم/كلمة مرور خاطئة" }) },
    
    "COUPON_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", mesasge: "لم يتم العثور على كوبون الخصم" }) },
    "STORE_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", mesasge: "لم يتم العثور على المتجر" })},

    "USERNAME_IS_TAKEN": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "اسم مستخدم غير مُتّاح" })},
    "EMAIL_IS_TAKEN": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "إيميل غير مُتّاح" })},
}