import querystring from 'querystring';
import { Request } from 'express';
import redirectionPage from './redirection-page';

export default function createTopLevelRedirect(apiKey: string, path: string) {
  return function topLevelRedirect(req: Request) {
    const {host, query, params} = req;
    const {shop} = query;

    const queryString = querystring.stringify(params);

    req.body = redirectionPage({
      origin: shop,
      redirectTo: `https://${host}${path}?${queryString}`,
      apiKey,
    });
  };
}