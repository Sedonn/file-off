import { Types } from 'mongoose';

type TUser = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

type TUserPreview = Pick<TUser, 'login'>;

type TUserFileMetaData = {
  mimetype: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  expireAt: Date;
};

type TUserFileMetaDataPreview = Pick<TUserFileMetaData, 'expireAt' | 'mimetype'>;

type TUserFile<M = TUserFileMetaData> = {
  _id: Types.ObjectId;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  metadata: M;
};

type TUserFilePreview<M = TUserFileMetaDataPreview> = Omit<TUserFile<M>, 'length' | 'chunkSize'>;

type TUserUploadedFile = TUserFilePreview & {
  receiver: TUserPreview;
};

type TUserDownloadableFile = TUserFilePreview & {
  sender: TUserPreview;
};

type TFileErrorCode =
  | 'RECIEVER_NOT_FOUND'
  | 'RECIEVER_EMPTY'
  | 'EXPIRE_PERIOD_EMPTY'
  | 'EXPIRE_PERIOD_INVALID'
  | 'SENDER_EQUALS_RECEIVER'
  | 'DUPLICATE_FILE'
  | 'FILE_EMPTY'
  | 'FILE_NOT_FOUND'
  | 'FILD_ID_EMPTY'
  | 'FILD_ID_CORRUPTED'
  | 'FILE_UPLOAD_FAILED'
  | 'FILE_DOWNLOAD_FAILED'
  | 'FILE_DELETE_FAILED';

type TUserErrorCode =
  | 'DUPLICATE_LOGIN'
  | 'DUPLICATE_EMAIL'
  | 'NAME_EMPTY'
  | 'SURNAME_EMPTY'
  | 'LOGIN_EMPTY'
  | 'EMAIL_EMPTY'
  | 'EMAIL_IVALID'
  | 'PASSWORD_EMPTY'
  | 'PASSWORD_SHORT'
  | 'REGISTER_FAILED'
  | 'AUTHORIZATION_FAILED';

type TAPIErrorCode = TFileErrorCode | TUserErrorCode | 'UNKNOWN_ERROR';

type ErrorResponse = {
  errorCode: TAPIErrorCode[];
};

type ExpirePeriod = 'year' | 'month' | 'week';

type ExpirePeriods = {
  [period in ExpirePeriod]: (date: Date) => Date;
};
