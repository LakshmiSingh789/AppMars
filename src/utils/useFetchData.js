import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../apiUrl';
import { fetchAuthenticationData, getSessionKeyFromCookie } from './utils';

export const useFetchData = (pathValue) => {
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(null);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isImage, setIsImage] = useState(false);

  const sessionKey = getSessionKeyFromCookie('session_key');

  const getData = async () => {
    try {
      const data = await fetchAuthenticationData(sessionKey);
      if (data) setIsSuperuser(data.is_superuser);
    } catch (error) {
      console.error('Error fetching authentication data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [sessionKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          isSuperuser
            ? `${API_URL}/api/list/customusers/`
            : `${API_URL}/api/data_api/${pathValue}/`,
          {
            headers: { Authorization: sessionKey },
          }
        );

        if (response.data?.data) {
          setItems(response.data.data);
          if (!isSuperuser) {
            setIsTemplate(pathValue === 'resolution');
            setIsVolunteer(pathValue === 'volunteer');
            setIsStaff(pathValue === 'staff');
            setIsImage(pathValue === 'imageupload');
          }
        } else {
          setNotification({
            type: 'alert-danger',
            message: 'No items found.',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({
          type: 'alert-danger',
          message: 'An error occurred while fetching data.',
        });
      }
    };

    if (isSuperuser !== null) fetchData();
  }, [pathValue, isSuperuser, sessionKey]);

  return { items, notification, isTemplate, isStaff, isVolunteer, isImage, setItems, setNotification };
};
