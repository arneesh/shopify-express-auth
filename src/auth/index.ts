import { Request, Response, NextFunction } from 'express';
import {OAuthStartOptions, AccessMode, } from '../types';
import createTopLevelOAuthRedirect from './create-top-level-oauth-redirect';
import setUserAgent from './set-user-agent';
import Shopify from '@shopify/shopify-api';

const DEFAULT_MYSHOPIFY_DOMAIN = 'myshopify.com';
export const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export default function createShopifyAuth(options: OAuthStartOptions) {
  const config = {
    prefix: '',
    myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
    accessMode: DEFAULT_ACCESS_MODE,
    ...options,
  };

  const {prefix} = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthCallbackPath = `${oAuthStartPath}/callback`;

  const inlineOAuthPath = `${prefix}/auth/inline`;
  const topLevelOAuthRedirect = createTopLevelOAuthRedirect(
    Shopify.Context.API_KEY,
    inlineOAuthPath,
  );

  setUserAgent();

  return async function shopifyAuth(req: Request, res: Response, next: NextFunction) {

    if (
      req.path === inlineOAuthPath) {
      const shop = req.query.shop;
      if (shop == null) {
        throw new Error(`${400}`)
      }

      const redirectUrl = await Shopify.Auth.beginAuth(
        req,
        res,
        (shop).toString(),
        oAuthCallbackPath,
        config.accessMode === 'online'
      );
      res.redirect(redirectUrl);
      return;
    }

    if (req.path === oAuthStartPath) {
      await topLevelOAuthRedirect(req);
      return;
    }

    if (req.path === oAuthCallbackPath) {
      try {
        const { shop, hmac, code, state, host, timestamp } = req.query;

        await Shopify.Auth.validateAuthCallback(req, res, {code: code, timestamp: timestamp, state: state, shop: shop, host: host, hmac: hmac });

        req.query.state.shopify = await Shopify.Utils.loadCurrentSession(req, res, config.accessMode === 'online');

        if (config.afterAuth) {
          await config.afterAuth(req, res);
        }
      }
      catch (e) {
        switch (true) {
          case (e instanceof Shopify.Errors.InvalidOAuthError):
            throw new Error(`${400} ${e.message}`)

          case (e instanceof Shopify.Errors.CookieNotFound):
          case (e instanceof Shopify.Errors.SessionNotFound):
            // This is likely because the OAuth session cookie expired before the merchant approved the request
            res.redirect(`${oAuthStartPath}?shop=${req.query.shop}`);
            break;
          default:
            throw new Error(`${400} ${e.message}`)
        }
      }
      return;
    }

    await next();
  };
}

export {default as Error} from './errors';