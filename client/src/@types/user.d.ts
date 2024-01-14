type TUser = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

/** The user data for login. */
type TUserCredentials = Pick<TUser, 'login' | 'password'> & {
  remember: boolean;
};

/** The user preview information. */
type TUserPreview = Pick<TUser, 'login'>;
