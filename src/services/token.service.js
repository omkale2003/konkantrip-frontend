const TOKEN_KEY = "access_token";

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (!token) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const hasToken = () => {
  return Boolean(getToken());
};

export {
  getToken,
  setToken,
  removeToken,
  hasToken,
};

export default {
  getToken,
  setToken,
  removeToken,
  hasToken,
};