import Shopify from '@shopify/shopify-api';

export const EXPRES_USER_AGENT_PREFIX = 'Express Shopify Auth';

export default function setUserAgent() {
  if (!Shopify.Context.USER_AGENT_PREFIX) {
    Shopify.Context.USER_AGENT_PREFIX = EXPRES_USER_AGENT_PREFIX;
  } else if (!Shopify.Context.USER_AGENT_PREFIX.includes(EXPRES_USER_AGENT_PREFIX)) {
    Shopify.Context.USER_AGENT_PREFIX = `${Shopify.Context.USER_AGENT_PREFIX} | ${EXPRES_USER_AGENT_PREFIX}`;
  }
}