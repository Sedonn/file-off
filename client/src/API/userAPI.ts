import { APIService } from './APIService';

/** Login the user and get his token. */
export const loginUser = async (
  userCredentials: TUserCredentials,
): Promise<string> => {
  const { data } = await APIService.post<{ token: string }>(
    '/user/login',
    userCredentials,
  );

  return data.token;
};

export const registerUser = async (newUser: TUser) => {
  await APIService.post('/user/register', newUser);
};
