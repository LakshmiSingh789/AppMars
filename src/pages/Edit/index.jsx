import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { API_URL } from '../../apiUrl';
import { useLocation, Link, useParams } from 'react-router-dom';
import { getSessionKeyFromCookie } from '../../utils/utils';
import Swal from 'sweetalert2';
import * as Io5Icons from 'react-icons/io5';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const capitalizeLabel = (label) =>
  label
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const Edit = () => {
  const [formFields, setFormFields] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [isCodeView, setIsCodeView] = useState(false); // Rich Editor toggle
  const location = useLocation();
  const { id } = useParams();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegmen = location.pathname.split('/');
  const value = pathSegmen[1];
  const SessionKey = getSessionKeyFromCookie('session_key');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/edit/${value}/${id}/`);
        if (response.data?.form) {
          const parsedData = parseFormData(response.data.form);
          setFormFields(parsedData.fields);
          setInitialValues(parsedData.initialValues);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchData();
  }, [value, id]);

  const generateBreadcrumbs = () =>
    pathSegments.map((segment, index) => {
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

    const parseFormData = (formHtml) => {
      const formData = { fields: [], initialValues: {} };
      const parser = new DOMParser();
      const doc = parser.parseFromString(formHtml, 'text/html');
      const inputElements = doc.querySelectorAll('input, select, textarea');
    
      inputElements.forEach((element) => {
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
    
        if (field.type === 'select-one' || field.type === 'select-multiple') {
          const options = Array.from(element.options).map((option) => ({
            value: option.value,
            label: option.label,
          }));
          field.options = options;
        }
    
        formData.fields.push(field);
    
        if (field.type === 'file' && element.getAttribute('data-src')) {
          // Handle preloaded images
          formData.initialValues[name] = element.getAttribute('data-src'); // Backend must provide the full URL or a relative path
        } else if (field.type === 'date') {
          formData.initialValues[name] = element.value ? new Date(element.value).toISOString().split('T')[0] : '';
        } else if (field.type === 'checkbox') {
          formData.initialValues[name] = element.checked;
        } else {
          formData.initialValues[name] = element.value || '';
        }
      });
    
      return formData;
    };
    

    const handleFileChange = (event, setFieldValue, fieldName) => {
      const file = event.target.files[0];
      setFieldValue(fieldName, file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    const clearFile = (fieldName, setFieldValue) => {
      setFieldValue(fieldName, ''); // Clear the file input
      setPreviewImages((prev) => ({ ...prev, [fieldName]: null }));
    };
    
    

  


  const handleFormSubmit = async (values, { setSubmitting, resetForm  }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    try {
      const response = await axios.post(`${API_URL}/api/edit/${value}/${id}/`, formData, {
        headers: {
          Authorization: SessionKey,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.errors) {
        Swal.fire('Success', 'Form submitted successfully!', 'success');
        
        setInitialValues(values);
        resetForm();
        
      } else {
        Swal.fire('Error', 'Failed to submit form. Please check your inputs.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred while submitting the form.', 'error');
    } finally {
      setSubmitting(false);
    }
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

      <Formik initialValues={initialValues} onSubmit={handleFormSubmit} enableReinitialize>
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <div className="card p-4 mt-3">
            {formFields.map((field, index) => (
  <div
    className={field.type === 'checkbox' ? 'form-check mb-3' : 'form-group'}
    key={index}
  >
    {field.type === 'checkbox' ? (
      <>
        <Field
          type="checkbox"
          name={field.name}
          className="form-check-input"
          id={field.name}
        />
        <label
          className="form-check-label"
          htmlFor={field.name}
          style={{ marginLeft: '8px' }} // Adjust spacing if needed
        >
          {field.label}
        </label>
      </>
    ) : (
      <>
        <label htmlFor={field.name}>{field.label}</label>
        {field.type === 'select-one' ? (
          <Field as="select" name={field.name} className="form-control">
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        ) : field.type === 'textarea' ? (
          <>
            <div className="editor-toggle">
              <Io5Icons.IoCodeSlash
                size={30}
                onClick={() => setIsCodeView((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              />
            </div>
            {isCodeView ? (
              <ReactQuill
                value={values[field.name] || ''}
                onChange={(content) => setFieldValue(field.name, content)}
              />
            ) : (
              <textarea
                className="form-control"
                value={values[field.name] || ''}
                onChange={(e) => setFieldValue(field.name, e.target.value)}
              />
            )}
          </>
        ) : field.type === 'date' ? (
          <Field
            type="date"
            name={field.name}
            className="form-control"
            value={values[field.name] || ''}
            onChange={handleChange}
          />
        ) : field.type === 'file' ? (
          <>
            <input
              type="file"
              name={field.name}
              className="form-control"
              onChange={(e) => handleFileChange(e, setFieldValue, field.name)}
            />
            {previewImages[field.name] || values[field.name] ? (
              <div>
                <img
                  src={previewImages[field.name] || `${API_URL}/${values[field.name]}`}
                  alt="Preview"
                  style={{ marginTop: 10, maxWidth: 200 }}
                />
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={() => clearFile(field.name, setFieldValue)}
                >
                  Clear
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <Field type={field.type} name={field.name} className="form-control" />
        )}
      </>
    )}
    <ErrorMessage name={field.name} component="div" className="text-danger" />
  </div>
))}

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

export default Edit;
