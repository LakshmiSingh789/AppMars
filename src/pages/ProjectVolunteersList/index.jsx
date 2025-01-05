import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Chip from '@mui/material/Chip';
import html2pdf from 'html2pdf.js';
import { getSessionKeyFromCookie } from '../../utils/utils'; 
import { API_URL } from '../../apiUrl'; 
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button } from '@mui/material';

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

const Add = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [text, setText] = useState('');
  const [formData, setFormData] = useState({
    project: '',
    volunteers: '',
    staff_members: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Flag for edit mode

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegmen = location.pathname.split('/');
  const value = pathSegmen[1];
  const SessionKey = getSessionKeyFromCookie("session_key");

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/project_volunteers/`, {
          headers: { Authorization: `${SessionKey}` },
        });

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, SessionKey]);

  const handlePrintPDF = () => {
    const loadImageAsBase64 = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle cross-origin images
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const base64Image = canvas.toDataURL('image/jpeg'); // Convert to base64
          resolve(base64Image);
        };

        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
      });

    Promise.all([
      loadImageAsBase64(data?.header_image),
      loadImageAsBase64(data?.footer_image),
    ])
      .then(([headerBase64, footerBase64]) => {
        const element = document.createElement('div');

        element.innerHTML = `
          <div id="pdf-content" style="font-family: Arial, sans-serif; font-size: 12px;">
            <div style="padding: 40px 20px; min-height: 842px;"> 
              ${text}
            </div>
          </div>
        `;

        const options = {
          margin: [40, 10, 40, 10],
          filename: 'resolution.pdf',
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf()
          .set(options)
          .from(element)
          .toPdf()
          .get('pdf')
          .then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();

            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.addImage(headerBase64, 'JPEG', 10, 10, 190, 20);
              pdf.addImage(footerBase64, 'JPEG', 10, 275, 190, 15);

              pdf.setFontSize(10);
              const pageMarginBottom = 15;
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const xPosition = pageWidth / 2;
              const yPosition = pageHeight - pageMarginBottom;
              pdf.text(`Page ${i} of ${totalPages}`, xPosition, yPosition, { align: 'center' });
            }
          })
          .save();
      })
      .catch((error) => {
        console.error('Error generating PDF:', error.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/project_volunteers/`,
        formData,
        {
          headers: { Authorization: `${SessionKey}` },
        }
      );
      setData([...data, formData]); // Add new data to the state
      setFormData({ project: '', volunteers: '', staff_members: '' }); // Reset form
    } catch (error) {
      console.error('Error adding volunteer:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/project_volunteers/${formData.id}/`,
        formData,
        {
          headers: { Authorization: `${SessionKey}` },
        }
      );
      const updatedData = data.map((volunteer) =>
        volunteer.id === formData.id ? formData : volunteer
      );
      setData(updatedData);
      setIsEditing(false); // Exit edit mode
      setFormData({ project: '', volunteers: '', staff_members: '' }); // Reset form
    } catch (error) {
      console.error('Error editing volunteer:', error);
    }
  };

  const handleEditClick = (volunteer) => {
    setIsEditing(true);
    setFormData({
      id: volunteer.id,
      project: volunteer.project,
      volunteers: volunteer.volunteers.join(', '),
      staff_members: volunteer.staff_members.join(', '),
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error!</strong> {error}
      </div>
    );
  }

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
        <h5 className="mb-0 text-center text-md-left">Resolution Workplace</h5>
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

      {/* Form for adding/editing */}
      <form onSubmit={isEditing ? handleEdit : handleAdd}>
        <TextField
          label="Project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Volunteers (comma separated)"
          name="volunteers"
          value={formData.volunteers}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Staff Members (comma separated)"
          name="staff_members"
          value={formData.staff_members}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </form>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Project</strong></TableCell>
              <TableCell><strong>Volunteers</strong></TableCell>
              <TableCell><strong>Staff Members</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((volunteerData, index) => (
              <TableRow key={index}>
                <TableCell>{volunteerData.project}</TableCell>
                <TableCell>{volunteerData.volunteers.join(', ')}</TableCell>
                <TableCell>{volunteerData.staff_members.join(', ')}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(volunteerData)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Add;
