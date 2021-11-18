
   import { Request } from 'express';
import createTopLevelRedirect from './create-top-level-redirect';

import {TOP_LEVEL_OAUTH_COOKIE_NAME} from './index';

export default function createTopLevelOAuthRedirect(
  apiKey: string,
  path: string,
) {
  const redirect = createTopLevelRedirect(apiKey, path);

  return function topLevelOAuthRedirect(req: Request) {
    req.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '1', getCookieOptions(req));
    redirect(req);
  };
}