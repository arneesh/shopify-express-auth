

import VerifyRequest from "./verify-request";
// import VerifyShop from "./verify-shop";
export  default VerifyRequest ;

// module.exports.verifyOAUTH = async function (query, apiSecret, hmac) {
//     const map = Object.assign({}, query);
//     delete map["hmac"];
//     const message = querystring.stringify(map);
//     const generatedHash = crypto
//       .createHmac("sha256", apiSecret)
//       .update(message)
//       .digest("hex");
  
//     return generatedHash === hmac ? true : false;
//   };