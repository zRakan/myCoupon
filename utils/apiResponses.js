const HTTP_CODES = {
    "OK": 200,
    "INPUT_ERROR": 400,
    "AUTHORIZATION": 401,
    "NOT_ADMIN": 403,
    "NOT_FOUND": 404
}

export default {
    "INVALID_DATA": function(res) { return res.status(HTTP_CODES['INPUT_ERROR']).send({ status: "error", message: "Invalid data" }) },

    "USER_NOT_FOUND": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "اسم مستخدم/كلمة مرور خاطئة" }) },
    
    "COUPON_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", message: "لم يتم العثور على كوبون الخصم" }) },
    "STORE_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", message: "لم يتم العثور على المتجر" })},

    "USERNAME_IS_TAKEN": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "اسم مستخدم غير مُتّاح" })},
    "EMAIL_IS_TAKEN": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "إيميل غير مُتّاح" })},

    "LOGIN_SUCCESS": function(res) { return res.status(HTTP_CODES['OK']).send({ status: 'success', message: "تم تسجيل الدخول بنجاح" }) },
    "LOGOUT_SUCCESS": function(res) { return res.status(HTTP_CODES['OK']).send({ status: 'success', message: "تم تسجيل الخروج بنجاح" }) },

    "COUPON_ADDED": function(res) { return res.status(HTTP_CODES['OK']).send({ status: 'success', message: "تم إضافة كوبون الخصم بنجاح" }) },
    "COUPON_ACCEPTED": function(res) { return res.status(HTTP_CODES['OK']).send({ status: 'success', message: "تم قبول كود الخصم بنجاح" }) }
}