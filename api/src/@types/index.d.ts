import { Types } from 'mongoose';

/** Data that stores in the app JWT tokens. */
type TJWTPayload = {
  id: string;
};

/** Base user type. */
type TUser = {
  _id: Types.ObjectId;
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

/** User data that is sent to the client. */
type TUserPreview = Pick<TUser, 'login'>;

/** Base user file metadata type. */
type TUserFileMetaData = {
  mimetype: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  expireAt: Date;
};

/** User file metadata that is send to the client. */
type TUserFileMetaDataPreview = Pick<TUserFileMetaData, 'expireAt' | 'mimetype'>;

/** Base user file type. */
type TUserFile<M = TUserFileMetaData> = {
  _id: Types.ObjectId;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  metadata: M;
};

/** User file data that is send to the client. */
type TUserFilePreview<M = TUserFileMetaDataPreview> = Omit<TUserFile<M>, 'length' | 'chunkSize'>;

/** File uploaded by the user. */
type TUserUploadedFile = TUserFilePreview & {
  receiver: TUserPreview;
};

/** File that the user can download. */
type TUserDownloadableFile = TUserFilePreview & {
  sender: TUserPreview;
};

/** Known error codes that occur during file data operations. */
type TFileErrorCode =
  | 'RECEIVER_NOT_FOUND'
  | 'RECEIVER_EMPTY'
  | 'EXPIRE_PERIOD_EMPTY'
  | 'EXPIRE_PERIOD_INVALID'
  | 'SENDER_EQUALS_RECEIVER'
  | 'DUPLICATE_FILE'
  | 'FILE_EMPTY'
  | 'FILE_NOT_FOUND'
  | 'FILE_ID_EMPTY'
  | 'FILE_ID_CORRUPTED'
  | 'FILE_UPLOAD_FAILED'
  | 'FILE_DOWNLOAD_FAILED'
  | 'FILE_DELETE_FAILED';

/** Known error codes that occur during user data operations. */
type TUserErrorCode =
  | 'DUPLICATE_LOGIN'
  | 'DUPLICATE_EMAIL'
  | 'NAME_EMPTY'
  | 'SURNAME_EMPTY'
  | 'LOGIN_EMPTY'
  | 'EMAIL_EMPTY'
  | 'EMAIL_INVALID'
  | 'PASSWORD_EMPTY'
  | 'PASSWORD_SHORT'
  | 'REGISTER_FAILED'
  | 'AUTHORIZATION_FAILED';

/** All known error codes. */
type TAPIErrorCode = TFileErrorCode | TUserErrorCode | 'UNKNOWN_ERROR';

type ErrorResponse = {
  errorCode: TAPIErrorCode[];
};

/** File retention period type. */
type ExpirePeriod = 'year' | 'month' | 'week';

/** Methods which are calculating the end date of file storage. */
type ExpirePeriods = {
  [period in ExpirePeriod]: (date: Date) => Date;
};
