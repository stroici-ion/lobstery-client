import axios from 'axios';
import { API_URL } from '../utils/consts';

export const fetchRegisterUser = async (params: Record<string, string>) => {
  return await axios.post(API_URL + '/api/register/', params);
};
