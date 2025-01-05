import React, { useState, useEffect, useRef } from 'react'; // Import React and hooks for managing state and side effects
import axios from 'axios'; // Import axios for making HTTP requests
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik for form handling
import Breadcrumbs from '@mui/material/Breadcrumbs'; // Import Breadcrumbs component from Material UI
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon from Material UI
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import ExpandMore icon from Material UI
import { emphasize, styled } from '@mui/material/styles'; // Import Material UI's styled and emphasize utilities
import Chip from '@mui/material/Chip'; // Import Chip component from Material UI
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component from Material UI
import Select from '@mui/material/Select'; // Import Select component from Material UI
import { API_URL } from '../../apiUrl'; // Import API URL from a local file
import { useLocation, Link } from 'react-router-dom'; 
import { getSessionKeyFromCookie } from '../../utils/utils'; // Import utility function for session key
import Swal from 'sweetalert2'; 
import * as Io5Icons from 'react-icons/io5';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 
const transformKey = (key) => {
  const cleanedKey = key.replace('_', ' ');
  return cleanedKey.replace(/\b\w/g, (char) => char.toUpperCase());
};

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

const capitalizeLabel = (label) => {
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


const Add = () => {
  const [formFields, setFormFields] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [categoryVal, setCategoryVal] = useState('');
  const [subCatVal, setSubCatVal] = useState('');
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegments2 = location.pathname.split('/');
  const value = pathSegments2[1];
  const [notification, setNotification] = useState(null);
  const fileInputRefs = useRef({});
  const [error, setError] = useState([]);
  const SessionKey = getSessionKeyFromCookie('session_key');
  const [isCodeView, setIsCodeView] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const quillRef = useRef(null);
  useEffect(() => {
   
    const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/insert/customusers/`,{
            headers: {
              Authorization: `${SessionKey}`,
            },} );
  
          const data = response.data || {};
          const getFallbackValue = (key, value) => {
            if (value === null || value === undefined) {
              if (Array.isArray(value)) return []; 
              if (typeof value === 'object') return {}; 
              if (typeof value === 'boolean') return false; 
              if (typeof value === 'string') return ''; 
              if (typeof value === 'number') return 0; 
              return null; 
            }
            return value; 
          };
      
          const formData = getFallbackValue('form', data.form);
          
          if (formData) {
            const parsedData = parseFormData(formData);
            setFormFields(parsedData.fields);
            setInitialValues(parsedData.initialValues);
          }
      
        } catch (error) {
          console.error('Error fetching form data:', error);
         
        }
      };
      
      fetchData(); 
  }, [value]);

  const parseFormData = (formHtml) => {
    const formData = { fields: [], initialValues: {} };

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(formHtml, 'text/html');
        const inputElements = doc.querySelectorAll('input, select, textarea, button, fieldset, label, optgroup, option, datalist');

        if (inputElements.length === 0) {
            console.warn("No form elements found in the HTML.");
            return formData;
        }

        inputElements.forEach((element) => {
            if (!element.name || !['input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) {
                return;
            }

            const name = element.name;
            const placeholder = element.getAttribute('placeholder');
            const label = placeholder || name;
            const formattedLabel = capitalizeLabel(label);
            const field = {
                name,
                type: element.type,
                label: formattedLabel,
                options: [],
            };

            if (element.tagName.toLowerCase() === 'select') {
                const options = Array.from(element.options).map(option => ({
                    value: option.value,
                    label: option.label,
                }));
                field.options = options;
            }

            // Handle checkbox and radio inputs
            if (element.type === 'checkbox' || element.type === 'radio') {
                field.checked = element.checked;
            }

            formData.fields.push(field);

            // Safely handle the value based on element type
            if (element.type === 'date') {
                formData.initialValues[name] = element.value ? new Date(element.value).toISOString().split('T')[0] : '';
            } else if (element.type === 'select-one' || element.type === 'select-multiple') {
                formData.initialValues[name] = element.value || '';
            } else if (element.type === 'checkbox' || element.type === 'radio') {
                formData.initialValues[name] = element.checked ? element.value : ''; // Handle checked state
            } else {
                formData.initialValues[name] = element.value || ''; // Fallback to empty string if value is missing
            }
        });

    } catch (error) {
        console.error('Error parsing form data:', error);
    }

    return formData;
};

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

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0]; // Get the selected file
    setFieldValue(event.target.name, file); // Set the file in Formik's state
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    const formData = new FormData();
    for (const key in values) {
      if (values[key] instanceof File) {
        // Append file object if it's a file
        formData.append(key, values[key]);
      } else {

        formData.append(key, values[key]);
      }
    }

    try {
      const response = await axios.post(`${API_URL}/api/insert/customusers/`, formData, {
        headers: {
          'Authorization': `${SessionKey}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.errors) {
        Swal.fire({
          icon: 'success',
          title: 'Form submitted successfully!',
          text: 'Your data has been successfully submitted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        
        resetForm();
        

        Object.values(fileInputRefs.current).forEach((input) => {
          if (input) input.value = null;
        });

        // Refetch the form data
        fetchData();
        setError({});
      } else {
        const errorMessages = Object.entries(response.data.errors).map(
            ([field, message]) => {
              return `<li><strong>${capitalizeLabel(field)}:</strong> ${message}</li>`;
            }
          ).join(''); 
          
          
          Swal.fire({
            icon: 'error',
            title: 'Form submission failed!',
            html: `
              <div class="alert alert-danger" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 15px; background-color: #f8d7da; color: #721c24;">
                <ul class="list-unstyled mb-0">
                  ${errorMessages}
                </ul>
              </div>`, // Display error messages in a styled alert box with list
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
          
          // Set errors to be displayed in the form
          setError(response.data.errors);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setNotification({
          type: 'alert-danger',
          message: 'An error occurred while submitting the form.',
        });
      }
    } finally {
      setSubmitting(false);
    }

    // Clear notification after 2 seconds
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };
  const RichTextEditor = ({ value, onChange }) => {
    const [isCodeView, setIsCodeView] = useState(false);
    const quillRef = useRef(null);
  
    const handleCodeViewToggle = () => {
      setIsCodeView(!isCodeView);
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        if (isCodeView) {
          quill.clipboard.dangerouslyPasteHTML(value || '');
        } else {
          const editorContent = quill.root.innerHTML;
          onChange(editorContent); 
        }
      }
    };
  
    const handleEditorChange = (content) => {
      if (!isCodeView) {
        onChange(content); 
      }
    };
  
    return (
      <div>
        <p
          onClick={handleCodeViewToggle}
          className="btn ml-0 p-0"
        >
          {isCodeView ? <Io5Icons.IoClose size={30} /> : <Io5Icons.IoCodeSlash size={30} />}
        </p>
        {isCodeView ? (
          <ReactQuill
          ref={quillRef}
          value={value || ''} 
          onChange={handleEditorChange} 
          placeholder="Write something here..."
          style={{ height: '200px' }}
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }],
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ script: 'sub' }, { script: 'super' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              ['link', 'video'],
              ['clean'],
            ],
          }}
        />
        ) : (
          <textarea
            className="form-control"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)} // Ensure onChange updates parent component
            style={{ height: '200px' }}
          />
          
        )}
      </div>
    );
  };
  
  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
        <h5 className="mb-0 text-center text-md-left">{capitalizeLabel(value)} Form</h5>
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

      <Formik
  initialValues={initialValues || {}}
  onSubmit={handleFormSubmit}
>
  {({ values, handleChange, handleSubmit, setFieldValue }) => (
    <Form className="form" onSubmit={handleSubmit}>
      <div className="card p-4 mt-0">
        {formFields.map((field, index) => {
          const customFormGroupClass = field.type === 'checkbox' ? 'form-check mb-3' : 'form-group';
          const customInputClass = field.type === 'checkbox' ? 'form-check-input-custom' : 'form-control';
          const customLabelClass = field.type === 'checkbox' ? 'form-check-label-custom' : 'form-label';
          
          return (
            <div className={`${customFormGroupClass}`} key={index}>
              {/* Apply custom label class conditionally */}
              {/* <label className={customLabelClass} htmlFor={field.name}>
                {field.label}
              </label> */}

              {/* Handle different input types dynamically */}
              {field.type === 'select-one' || field.type === 'select-multiple' ? (
                <Field
                  as="select"
                  id={field.name}
                  name={field.name}
                  className={`form-control ${customInputClass}`}
                  multiple={field.type === 'select-multiple'}
                  value={values[field.name] || []}
                  onChange={handleChange}
                >
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              ) : field.type === 'checkbox' ? (
                <>
                  <Field
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    className={`form-check-input ${customInputClass}`}
                    checked={values[field.name]}
                    onChange={() => setFieldValue(field.name, !values[field.name])}
                  />
                  <label className={`form-check-label ${customLabelClass}`} htmlFor={field.name}>
                    {field.label}
                  </label>
                  </>
              ) : 
              field.type === 'password' ? (
                <>
                  <Field
                    type={passwordVisible ? 'text' : 'password'} 
                    id={field.name}
                    name={field.name}
                    className={`form-control ${customInputClass}`}
                    placeholder={field.label}
                    value={values[field.name] || ''}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                  >
                    {passwordVisible ? 'Hide' : 'Show'}
                  </button>
                </>
              ) :
              field.type === 'date' ? (
                <Field
                  type="date"
                  name={field.name}
                  className={`form-control ${customInputClass}`}
                  value={values[field.name] || ''}
                  onChange={handleChange}
                />
              ) : field.type === 'file' ? (
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  className={`form-control ${customInputClass}`}
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  ref={(el) => (fileInputRefs.current[field.name] = el)}
                />
              ) : (
                <Field
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  className={`form-control ${customInputClass}`}
                  placeholder={field.label}
                  value={values[field.name] || ''}
                  onChange={handleChange}
                />
              )}
              <ErrorMessage name={field.name} component="div" className="error" />
            </div>
          );
        })}
        <div className="form-group">
          <button type="submit" className="btn btn-danger">
            Submit
          </button>
        </div>
      </div>
    </Form>
  )}
</Formik>


    </div>
  );
};

export default Add;
