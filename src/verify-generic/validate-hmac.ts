import * as querystring from 'querystring';

import { createHmac } from 'crypto';

export default function validateHmac(
  query: any,
  hmac: string,
  apiSecret: string
) {

const map = Object.assign({}, query);
    delete map["hmac"];
    const message = querystring.stringify(map);
    const generatedHash = createHmac("sha256", apiSecret)
      .update(message)
      .digest("hex");
  
    return generatedHash === hmac ? true : false;
}
