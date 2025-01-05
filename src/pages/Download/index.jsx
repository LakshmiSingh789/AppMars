import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { getSessionKeyFromCookie,fetchAuthenticationData } from '../../utils/utils';
import { API_URL } from '../../apiUrl';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useLocation, Link, useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from '../../assets/images/image.png';
import { useNavigate } from 'react-router-dom';
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: backgroundColor,
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: backgroundColor,
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
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [isProfile, setProfile] = useState(null);
    const SessionKey = getSessionKeyFromCookie("session_key");
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pathSegmen = location.pathname.split('/');
    const value = pathSegmen[1];
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/api/download/${value}/${id}/`, {
                    headers: { Authorization: `${SessionKey}` },
                });
                console.log(response.data)
                setData(response.data);
            } catch (error) {
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, SessionKey]);
    useEffect(() => {
             const getData = async () => {
                 try {
                     const DataGet = await fetchAuthenticationData(SessionKey);
                     setProfile(DataGet);
                 } catch (error) {
                     console.error('Error fetching data:', error);
                 }
             };
     
             if (SessionKey) {
                 getData();
             } else {
                 navigate('/login');
             }
         }, [SessionKey, navigate])
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
    const handlePrintPDF = () => {
        const element = document.getElementById("id-card");
        const options = {
            margin: [10, 10, 10, 10],
            filename: 'id_card.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().set(options).from(element).save();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
                <h5 className="mb-0 text-center text-md-left">ID Card</h5>
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
            {data && (
  <div className="card shadow border-0 p-3 mt-4">
    <div
      id="id-card"
      style={{
        borderRadius: '8px',
        maxWidth: '100%',
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        color: '#000',
      }}
    >
      <div
        style={{
          backgroundColor: '#ff5c5c',
          padding: '5px 0',
          color: 'white',
          fontSize: '13px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '2px',
          borderTop: '2px dashed',
          display:'flex',
          justifyContent:'space-around',

        }}
      >
      <span>Identity Card</span>
      <span>Identity Card</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '2px dashed',
          borderBottom: '2px dashed',
          borderRight: '2px dashed',
          maxHeight: 'auto',
          padding: '0',
          width: '100%',
          gap: '10px',
        }}
      >
        <div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'left',
              gap: '20px',
            }}
          >
            <div style={{ width: '35%',textAlign:'left',marginLeft:'5px' }}>
              {/* <img
                src={`data:image/png;base64,${data.qr_code}`}
                alt="QR Code"
                style={{ width: '120px', height: '120px' }}
              /> */}
              <img
                src={`${isProfile.image || ''}`}
                alt="QR Code"
                className='border rounded-sm m-0 p-0'
                style={{ width: '120px', height: '90px' }}
              />
            </div>
            <div
              style={{
                width: '65%',
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              <p style={{ margin: '2px', padding: '0px', color: '#000' }}>
                <strong>NGO : </strong> {isProfile.name || ''}
              </p>
              <p style={{ margin: '2px', padding: '0px', color: '#000' }}>
              <strong>Address : </strong> {isProfile.address}
              </p>
            </div>
          </div>
          {/* Watermarked Section */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              padding: '3px 6px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url('${Logo}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                opacity: 0.1,
                zIndex: 1,
              }}
            ></div>
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#000',
                
              }}
            >
              <p style={{ margin: '2px', padding: '0px',}}>
                <strong>Name : </strong> {data.name}
              </p>
              
              <p style={{ margin: '2px', padding: '0px' }}>
                <strong>Father Name : </strong> {data.father_name}
              </p>
              <p style={{ margin: '2px', padding: '0px' }}>
                <strong>Mobile No. : </strong> {data.mobile_number}
              </p>
              <p style={{ margin: '2px', padding: '0px' }}>
                <strong>Address : </strong> {data.address}
              </p>
               <img
                src={`data:image/png;base64,${data.image}`}
                alt="QR Code"
                style={{ width: '80px', height: '80px' ,position: 'absolute', top:'0',right:'0',}}
              />
            </div>
          </div>
        </div>
        <div
        style={{
          borderLeft: '2px dashed #000',
          maxHeight: 'auto',
          alignSelf: 'stretch',
        }}
      ></div>
        <div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'left',
              gap: '20px',
            }}
          >
            <div style={{ width: '35%',textAlign:'left' }}>
              <img
                src={`data:image/png;base64,${data.qr_code}`}
                alt="QR Code"
                style={{ width: '120px', height: '120px',color: '#000' }}
              />
            </div>
            <div
              style={{
                width: '65%',
                fontSize: '11px',
                textAlign: 'left',
                alignItems:'center', display:'flex', flexDirection:'column',marginTop:'8px',
              }}
            >
              <p style={{  margin:'0',padding: '0px', color: '#000',fontSize:'18px' }}>
                <strong> {isProfile.name} </strong>
              </p>
              <p style={{ margin:'0', padding: '0px', color: '#000',fontSize:'10px' }}>
                {isProfile.address} 
              </p>
              <p style={{ margin:'0', padding: '0px', color: '#000',fontSize:'10px' }}>
                {isProfile.contact_number} 
              </p>
            </div>
          </div>
          {/* Watermarked Section */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              padding: '3px 6px',
              textAlign: 'left',
              border:'1px solid #000',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url('${Logo}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                opacity: 0.1,
                zIndex: 1,
              }}
            ></div>
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#000',
                fontSize:'9px',
                margin:'0px',
              }}
            >
              <p style={{ marginTop: '3px', padding: '0px',color: '#000',fontSize:'9px',lineHeight:'1', }}>
              <strong> 1. </strong>The ID card is issued by the NGO solely for the purpose of identifying its staff, volunteers, or members
              </p>
              <p style={{ marginTop: '3px', padding: '0px', color: '#000',fontSize:'9px', lineHeight:'1',}}>
              <strong> 2. </strong>The ID card is non-transferable and must be used only by the person to whom it is issued.
              </p>
              <p style={{ marginTop: '3px', padding: '0px', color: '#000',fontSize:'9px', lineHeight:'1', }}>
              <strong> 3. </strong> Expired ID cards are not valid and must be surrendered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="form-group mt-3 text-center">
      <button className="btn btn-primary" onClick={handlePrintPDF}>
        Download as PDF
      </button>
    </div>
  </div>
)}

        </div>
    );
};

export default Add;
