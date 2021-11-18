
import { Request } from 'express';
import createTopLevelRedirect from './create-top-level-redirect';

export default function createTopLevelOAuthRedirect(
  apiKey: string,
  path: string,
) {
  const redirect = createTopLevelRedirect(apiKey, path);

  return function topLevelOAuthRedirect(req: Request) {
    redirect(req);
  };
}