import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
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
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegmen = location.pathname.split('/');
  const value = pathSegmen[1];
  const SessionKey = getSessionKeyFromCookie("session_key");
  console.log(SessionKey)
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
        const response = await axios.get(`${API_URL}/api/template/${value}/`, {
          headers: { Authorization: `${SessionKey}` },
        });
        console.log(response)
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, SessionKey]);

  // const handlePrintPDF = () => {
  //   const loadImageAsBase64 = (url) =>
  //     new Promise((resolve, reject) => {
  //       const img = new Image();
  //       img.crossOrigin = 'Anonymous'; // Handle cross-origin images
  //       img.src = url;
  
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  
  //         const ctx = canvas.getContext('2d');
  //         ctx.drawImage(img, 0, 0);
  
  //         const base64Image = canvas.toDataURL('image/jpeg'); // Convert to base64
  //         resolve(base64Image);
  //       };
  
  //       img.onerror = () => {
  //         reject(new Error(`Failed to load image: ${url}`));
  //       };
  //     });
  
  //   Promise.all([
  //     loadImageAsBase64(data?.header_image),
  //     loadImageAsBase64(data?.footer_image),
  //   ])
  //     .then(([headerBase64, footerBase64]) => {
  //       const element = document.createElement('div');
  
  //       // Add only the content (no header or footer) to the element
  //       element.innerHTML = `
  //         <div id="pdf-content" style="font-family: Arial, sans-serif; font-size: 12px;">
  //           <div style="padding: 40px 20px; min-height: 842px;"> 
  //             ${text}
  //           </div>
  //         </div>
  //       `;
  
  //       const options = {
  //         margin: [40, 10, 40, 10], // Adjusted margins to make space for header/footer
  //         filename: 'resolution.pdf',
  //         pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  //         image: { type: 'jpeg', quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  //       };
  
  //       html2pdf()
  //         .set(options)
  //         .from(element)
  //         .toPdf()
  //         .get('pdf')
  //         .then((pdf) => {
  //           const totalPages = pdf.internal.getNumberOfPages();
  
  //           for (let i = 1; i <= totalPages; i++) {
  //             pdf.setPage(i);
  //             pdf.addImage(headerBase64, 'JPEG', 0, 0, 220, 30); 
  //             pdf.addImage(footerBase64, 'JPEG', 10, 275, 220, 10); 
  
  //             pdf.setFontSize(10); 
  //   const pageMarginBottom = 15; 
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const xPosition = pageWidth / 2; // Center horizontally
  //   const yPosition = pageHeight - pageMarginBottom;
  //             pdf.text(`Page ${i} of ${totalPages}`, xPosition, yPosition, { align: 'center' });
  //           }
  //         })
  //         .save();
  //     })
  //     .catch((error) => {
  //       console.error('Error generating PDF:', error.message);
  //     });
  // };
  
  
  
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      {/* {data && (
        <div className='card shadow border-0 p-3 mt-4'>
          <ReactQuill value={text} onChange={setText} />
          <div className="form-group mt-3">
            <button className="btn btn-danger" onClick={handlePrintPDF}>Print as PDF
            </button>
          </div>
          
        </div>
      )} */}
    </div>
    
  );
};

export default Add;
