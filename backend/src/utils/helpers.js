export const formatResponse = (data, message = 'Success', status = 200) => {
  return {
    status,
    message,
    data,
  };
};

export const handleError = (error) => {
  console.error(error);
  return {
    status: 500,
    message: 'Internal Server Error',
  };
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};