type TUserFileMetaData = {
  mimetype: string;
  expireAt: string;
};

type TUserFile = {
  _id: string;
  uploadDate: string;
  filename: string;
  metadata: TUserFileMetaData;
};

type TUserUploadedFile = TUserFile & {
  receiver: TUserPreview;
};

type TUserDownloadableFile = TUserFile & {
  sender: TUserPreview;
};
