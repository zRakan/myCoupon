const HTTP_CODES = {
    "INPUT_ERROR": 400,
    "AUTHORIZATION": 401,
    "NOT_ADMIN": 403,
    "NOT_FOUND": 404
}

export default {
    "INVALID_DATA": function(res) { return res.status(HTTP_CODES['INPUT_ERROR']).send({ status: "error", message: "Invalid data" }) },

    "USER_NOT_FOUND": function(res) { return res.status(HTTP_CODES['AUTHORIZATION']).send({ status: "error", message: "Invalid Username/Password" }) },
    
    "COUPON_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", mesasge: "Coupon not found" }) },
    "STORE_NOT_FOUND": function(res) { return res.status(HTTP_CODES['NOT_FOUND']).send({ status: "error", mesasge: "Store not found" })},
}