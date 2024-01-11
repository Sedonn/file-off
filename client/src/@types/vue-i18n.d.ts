/* eslint-disable @typescript-eslint/no-unused-vars */

import { DefineLocaleMessage } from 'vue-i18n';

type TFileErrorCode =
  | 'RECEIVER_NOT_FOUND'
  | 'RECEIVER_EMPTY'
  | 'EXPIRE_PERIOD_EMPTY'
  | 'EXPIRE_PERIOD_INVALID'
  | 'SENDER_EQUALS_RECEIVER'
  | 'DUPLICATE_FILE'
  | 'FILE_NOT_FOUND'
  | 'FILE_ID_EMPTY'
  | 'FILE_ID_CORRUPTED'
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
  | 'EMAIL_INVALID'
  | 'PASSWORD_EMPTY'
  | 'PASSWORD_SHORT'
  | 'REGISTER_FAILED'
  | 'AUTHORIZATION_FAILED';

type TAPIErrorCode = TFileErrorCode | TUserErrorCode | 'UNKNOWN_ERROR';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    APIErrors: Record<TAPIErrorCode, string>;

    validationErrors: {
      emptyField: string;
      emptyFileField: string;
    };

    notFoundPage: {
      title: string;
      returnBackLabel: string;
    };

    loginPage: {
      title: string;
      form: {
        loginLabel: string;
        passwordLabel: string;
        rememberLabel: string;
        submitButtonLabel: string;
      };
      registerMessage: {
        text: string;
        link: string;
      };
    };

    registerPage: {
      title: string;
      form: {
        nameLabel: string;
        surnameLabel: string;
        loginLabel: string;
        emailLabel: string;
        passwordLabel: string;
        confirmPasswordLabel: string;
        submitButtonLabel: string;
        errors: {
          passwordsMismatch: string;
        };
      };
    };
    registerCompleteDialog: {
      title: string;
      subtitle: string;
      description: string;
    };

    fileCard: {
      menu: {
        deleteOption: string;
      };
      uploadDateLabel: string;
      expireAtLabel: string;
      snackbar: {
        fileDeleted: string;
      };
    };

    userFilesPage: {
      title: string;
      emptyUploads: string;
      fileCard: {
        receiver: string;
      };
    };
    fileUploadDialog: {
      title: string;
      form: {
        fileLabel: string;
        receiverLabel: string;
        expirePeriod: {
          label: string;
          option: {
            week: string;
            month: string;
            year: string;
          };
        };
        submitButton: string;
      };
      snackbar: {
        fileUploaded: string;
      };
    };

    userDownloadsPage: {
      title: string;
      emptyDownloads: string;
      fileCard: {
        sender: string;
        actions: {
          download: string;
        };
      };
    };
  }
}
