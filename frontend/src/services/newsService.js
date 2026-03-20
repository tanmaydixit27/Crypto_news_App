import axios from 'axios';
import { API_BASE_URL } from '../config/backend';

export const getLatestNews = async (token) => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/news/latest`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
