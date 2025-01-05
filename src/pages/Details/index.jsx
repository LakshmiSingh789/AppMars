import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik'; 
import Breadcrumbs from '@mui/material/Breadcrumbs'; 
import HomeIcon from '@mui/icons-material/Home'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import { emphasize, styled } from '@mui/material/styles'; 
import Chip from '@mui/material/Chip'; 
import MenuItem from '@mui/material/MenuItem'; 
import Select from '@mui/material/Select'; 
import { API_URL } from '../../apiUrl'; 
import { useLocation, Link } from 'react-router-dom';
import { getSessionKeyFromCookie,fetchAuthenticationData } from '../../utils/utils'; 
import Swal from 'sweetalert2';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useFetchData } from '../../utils/useFetchData';
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });
const capitalize = (label) => {
    return label
    .replace(/_/g, ' ') 
    .toUpperCase();
  };
const capitalizeLabel = (label) => {
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const List = () => {
  // const [items, setItems] = useState([]);
  // const [notification, setNotification] = useState(null);
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegmen = location.pathname.split('/');
  const value = pathSegmen[1];
  const pathValue = location.pathname.split('/')[1];
  const { items, notification, isTemplate, isStaff, isVolunteer, isImage, setItems } = useFetchData(pathValue);
  
  // const [is_superuser, setNGO] = useState(null);
  // const [is_template, setTemplate] = useState(false);
  // const [is_staff, setStaff] = useState(false);
  // const [is_volunteer, setVolunteer] = useState(false);
  // const [is_image, setImage] = useState(false);

  // const SessionKey = getSessionKeyFromCookie('session_key');
  // const getData = async () => {
  //   try {
  //     const DataGet = await fetchAuthenticationData(SessionKey);
  //     if (DataGet) {
  //       setNGO(DataGet.is_superuser);
  //     } else {
  //       console.error('No data returned from fetchAuthenticationData');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error); 
  //   }
  // };
  // getData();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!value || !SessionKey) {
  //       setNotification({
  //         type: 'alert-danger',
  //         message: 'Missing required values for fetching data.',
  //       });
  //       return;  // If value or SessionKey is missing, don't make the API request.
  //     }
  
  //     try {
  //       let response;
  //       if (is_superuser) {
  //         response = await axios.get(`${API_URL}/api/list/${value}/`, {
  //           headers: {
  //             Authorization: `${SessionKey}`,
  //           },
  //         });
  //       } else {
  //         response = await axios.get(`${API_URL}/api/data_api/${value}/`, {
  //           headers: {
  //             Authorization: `${SessionKey}`,
  //           },
  //         });
  //         setTemplate(value === 'resolution');
  //         setVolunteer(value === 'volunteer');
  //         setStaff(value === 'staff');
  //         setImage(value === 'imageupload');
  //       }
  
  //       if (response.data && response.data.data) {
  //         setItems(response.data.data);
  //       } else {
  //         setNotification({
  //           type: 'alert-danger',
  //           message: 'No items found.',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setNotification({
  //         type: 'alert-danger',
  //         message: 'An error occurred while fetching data.',
  //       });
  //     }
  //   };
  
  //   fetchData();
  // }, [value, is_superuser, SessionKey]); // Make sure to re-trigger when these dependencies change
  

 


// console.log(is_template)
//   useEffect(() => {
//     console.log('Items:', items); 
//   }, [items]);

  const generateBreadcrumbs = () => {
    return pathSegments.map((segment, index) => {
      const link = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return (
        <StyledBreadcrumb
          key={index}
          component={Link}
          to={link}
          label={capitalizeLabel(segment)}
          deleteIcon={index === pathSegments.length - 1 ? <ExpandMoreIcon /> : null}
        />
      );
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/delete/${value}/${id}/`, {
        headers: {
          'Authorization': `${SessionKey}`,
        },
        
      });
      if (response.data.message) {
        Swal.fire({
          icon: 'success',
          title: 'Item deleted successfully!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });

        setItems(items.filter(item => item.id !== id));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error deleting item!',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error deleting item!',
        text: 'An error occurred while deleting the item.',
      });
    }
  };

  const columns = items.length > 0 ? Object.keys(items[0]) : [];
  function isImageURL(url) {
    return typeof url === 'string' && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  }
  
  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
        <h5 className="mb-0 text-center text-md-left">{capitalizeLabel(pathValue)} List</h5>
        <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-start align-items-center align-items-md-center ml-md-auto">
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
      <StyledBreadcrumb 
        component={Link} 
        to="/" 
        label="Dashboard" 
        icon={<HomeIcon fontSize="small" />} 
      />
      {generateBreadcrumbs()}
    </Breadcrumbs>
        </div>
      </div>

      {notification && (
        <div className={`alert ${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <div className="card shadow border-0 p-3 mt-4">
  <div className="table-responsive mt-3" style={{ overflowX: 'auto' }}>
    <table className="table table-bordered table-striped v-align">
      <thead className="thead-dark">
        <tr>
          {columns.map((col) => (
            <th key={col} style={{ width: '300px', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
              {capitalize(col)}
            </th>
          ))}
          <th style={{ width: '100px', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
  {items.length === 0 ? (
    <tr>
      <td colSpan={columns.length + 1} className="text-center">
        No items found
      </td>
    </tr>
  ) : (
    items.map((item) => (
      <tr key={item.id}>
        {columns.map((col) => (
          <td
            key={col}
            style={{ width: '300px', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
          >
            {isImageURL(item[col]) ? (
              <div className="d-flex flex-row align-items-start">
                <img src={item[col]} alt="Item" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                {isImage && (
                  <div className="d-flex flex-column align-items-end ml-3">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `<img src="${item[col]}" alt="Item" />`
                        )
                      }
                      className="btn btn-link btn-sm mt-1"
                    >
                      Copy Image HTML
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(item[col])
                      }
                      className="btn btn-link btn-sm mt-1"
                    >
                      Copy Image URL
                    </button>
                  </div>
                )}
              </div>
            ) : (
              item[col]
            )}
          </td>
        ))}
        <td>
          <div className="actions d-flex align-items-center">
            {isTemplate ? (
              <Link
                to={`/resolutionworkplace/${item.id}/`}
                className="btn btn-info btn-sm nowrap"
                style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}
              >
                Work Place
              </Link>
            ) : isStaff ? (
              <>
                <Link
                  to={`/downloads/${item.id}/`}
                  className="btn btn-info btn-sm nowrap mr-2"
                  style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                >
                  Print ID
                </Link>
                <Link to={`/${pathValue}/edit/${item.id}`} className="btn btn-warning btn-sm">
                  <FaPencilAlt />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger btn-sm ml-2 d-flex justify-content-center align-items-center"
                >
                  <MdDelete size={36} />
                </button>
              </>
            ) : isVolunteer ? (
              <>
                <Link
                  to={`/downloadv/${item.id}/`}
                  className="btn btn-info btn-sm nowrap mr-2"
                  style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                >
                  Print ID
                </Link>
                <Link to={`/${pathValue}/edit/${item.id}`} className="btn btn-warning btn-sm mr-2">
                  <FaPencilAlt />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger btn-sm ml-2 d-flex justify-content-center align-items-center"
                >
                  <MdDelete size={36} />
                </button>
              </>
            ) : (
              <>
                <Link to={`/${pathValue}/edit/${item.id}`} className="btn btn-warning btn-sm mr-2">
                  <FaPencilAlt />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger btn-sm ml-2 d-flex justify-content-center align-items-center"
                >
                  <MdDelete size={36} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

    </table>
  </div>
</div>


    </div>
  );
};

export default List;
