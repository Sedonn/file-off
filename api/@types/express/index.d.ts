import { Types } from 'mongoose';

import FileStorage from '../../Models/FileStorage';

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
    }

    interface Application {
      /** File storage. */
      $fileStorage: FileStorage;
    }
  }
}
