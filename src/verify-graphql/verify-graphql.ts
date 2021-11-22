import Shopify from "@shopify/shopify-api";
import { HttpResponseError } from '@shopify/shopify-api/dist/error';

const CHECK_OAUTH_SUCCESS = `
{
  shop {
    name
  }
}`;

export default function verifyGQLRequest({ isOnline, returnHeader }) {
  return async (req, res, next) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      isOnline
    );

    let shop = req.query.shop;

    if (session && shop && session.shop !== shop) {
      // The current request is for a different shop. Redirect immediately
      res.redirect(`/auth?shop=${shop}`);
    }

    if (session?.isActive()) {
      try {
        // make a request to make sure oauth has succeeded, retry otherwise
        const client = new Shopify.Clients.Graphql(
          session.shop,
          session.accessToken
        );
        await client.query({ data: CHECK_OAUTH_SUCCESS });

        await next();
        return;
      } catch (e) {
        if (e instanceof HttpResponseError && e.code == 401) {
          // We only want to catch 401s here, anything else should bubble up
        } else {
          throw e;
        }
      }
    }

    if (returnHeader) {
      if (!shop) {
        if (session) {
          shop = session.shop;
        } else if (Shopify.Context.IS_EMBEDDED_APP) {
          const authHeader = req.headers.authorization;
          const matches = authHeader?.match(/Bearer (.*)/);
          if (matches) {
            const payload = Shopify.Utils.decodeSessionToken(matches[1]);
            shop = payload.dest.replace("https://", "");
          }
        }
      }

      res.statusCode = 403;
      res.setHeader("X-Shopify-API-Request-Failure-Reauthorize", "1");
      res.setHeader(
        "X-Shopify-API-Request-Failure-Reauthorize-Url",
        `/auth?shop=${shop}`
      );
    } else {
      res.redirect(`/auth?shop=${shop}`);
    }
  };
}