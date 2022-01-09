
import {Express} from "express-serve-static-core";
import { Session } from '@shopify/shopify-api/dist/auth/session';
  
  declare module "express-serve-static-core" {
    export interface Response {
      shopify: Session | undefined,
    }
  }