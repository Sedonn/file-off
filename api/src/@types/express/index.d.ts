import { Types } from 'mongoose';

import FileStorage from '../../Models/FileStorage';

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
    }

    interface Application {
      $fileStorage: FileStorage;
    }
  }
}
