import backendInstance from './instance';

export const registerApi = async (payload) => {
  const { data } = await backendInstance.post('auth/register', payload);
  return data;
};

export const verifyUserApi = async (code) => {
  const { data } = await backendInstance.post('auth/verify', { code });
  return data;
};

export const loginUserApi = async (payload) => {
  const { data } = await backendInstance.post('auth/login', payload);
  backendInstance.defaults.headers['Authorization'] = `Bearer ${data.token}`;
  return data;
};

export const getCurrentApi = async (token) => {
  backendInstance.defaults.headers['Authorization'] = `Bearer ${token}`;

  try {
    const { data } = await backendInstance.get('auth/current');
    backendInstance.defaults.headers['Authorization'] = `Bearer ${data.token}`;
    return data;
  } catch (error) {
    delete backendInstance.defaults.headers['Authorization'];
    throw error;
  }
};

export const forgotPasswordApi = async (payload) => {
  const { data } = await backendInstance.post('auth/forgot-password', payload);
  return data;
};

export const logoutUserApi = async () => {
  const { data } = await backendInstance.post('auth/logout');
  delete backendInstance.defaults.headers['Authorization'];
  return data;
};
