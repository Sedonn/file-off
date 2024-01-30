/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
    }
  }
}
