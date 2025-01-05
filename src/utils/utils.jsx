import axios from 'axios';
import { API_URL } from '../apiUrl';
export const getSessionKeyFromCookie = (cookieName) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
};
export const fetchAuthenticationData = async (sessionKey) => {
  if (!sessionKey) {
    return null;
  }
  const headers = {
    'Authorization': `${sessionKey}`,
  };
  try {
    const response = await axios.get(`${API_URL}/api/check/authentication/`, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useAuthentication = () => {
  const sessionKey = getSessionKeyFromCookie('session_key');

  const checkAuthentication = async () => {
    try {
      const authData = await fetchAuthenticationData(sessionKey);
      if (authData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {

      return false;
    }
  };

  return { checkAuthentication };
};


