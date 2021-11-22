
import {loginAgainIfDifferentShop} from './login-again-if-different-shop';
import {Options, Routes} from './types';
import {DEFAULT_ACCESS_MODE} from '../auth';

export default function verifyRequest(givenOptions: Options = {}) {
  const {accessMode} = {
    accessMode: DEFAULT_ACCESS_MODE,
    ...givenOptions
  };
  const routes: Routes = {
    authRoute: '/auth',
    fallbackRoute: '/auth',
    ...givenOptions,
  };

  return loginAgainIfDifferentShop(routes, accessMode);
}