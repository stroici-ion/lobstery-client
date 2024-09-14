import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchRegisterUser = async (params: Record<string, string>) => {
  return await axios.post(apiUrl + '/api/register/', params);
};
