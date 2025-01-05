import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import Chip from '@mui/material/Chip';
import html2pdf from 'html2pdf.js';
import { getSessionKeyFromCookie } from '../../utils/utils';
import { API_URL } from '../../apiUrl';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Styled Breadcrumb Component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
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

// Helper to Capitalize Labels
const capitalizeLabel = (label) =>
  label
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const Add = () => {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setProject] = useState({});
  const [volunteers, setVolunteers] = useState([]);
  const [receives, setReceives] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const SessionKey = getSessionKeyFromCookie('session_key');

  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Breadcrumbs Generator
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
        const response = await axios.get(`${API_URL}/api/gen/`, {
          headers: { Authorization: `${SessionKey}` },
        });

        if (response.data) {
          setProject(response.data.project || {});
          setBeneficiaries(response.data.beneficiaries || []);
          setExpenses(response.data.expenses || []);
          setReceives(response.data.receives || []);
          // Extract volunteers from nested structure
          const allVolunteers = response.data.volunteers.map((volunteerData) => volunteerData.volunteers).flat();
          setVolunteers(allVolunteers || []);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [SessionKey]);

  const handlePrintPDF = () => {
    // Logic for generating PDF (optional)
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  const totalReceives = receives.reduce((sum, receive) => sum + parseFloat(receive.amount || 0), 0);
  const totalBeneficiaries = beneficiaries.length;
  const totalVolunteers = volunteers.length;
  const totalProjectCost = data?.cost || 0;
  const remainingAmount = totalReceives - totalExpenses;
  const isProjectCompleted = remainingAmount <= 0;

  // Dynamically generate columns for tables based on data structure
  const getColumns = (dataArray) => (dataArray.length > 0 ? Object.keys(dataArray[0]) : []);

  const columns = getColumns(expenses);  // Use expenses columns for the first table
  const beneficiaryColumns = getColumns(beneficiaries); // Use beneficiaries columns for the second table
  const volunteerColumns = getColumns(volunteers); // Use volunteers columns for the third table
  const receiveColumns = getColumns(receives); // Use receives columns for the fourth table

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
        <h5 className="mb-0 text-center text-md-left">Project Details</h5>
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

      <div style={{ marginBottom: '30px' }} className='card shadow border-0 p-3 mt-4'>

        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
          <h6 style={{ marginBottom: '15px !important',fontWeight:'900', }}>Expenses</h6>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{  }}>
                {columns.map((col) => (
                  <th key={col} style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
                    {capitalizeLabel(col)}
                  </th>
                ))}
                
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">No items found</td>
                </tr>
              ) : (
                expenses.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col} style={{ padding: '8px', border: '1px solid #ddd',whiteSpace:'nowrap' }}>
                        {item[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Beneficiaries Table */}
        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <h6 style={{ marginBottom: '15px !important',fontWeight:'900', }}>Beneficiaries</h6>
          <table style={{ width: '100%', borderCollapse: 'collapse',whiteSpace:'nowrap' }}>
            <thead>
              <tr style={{  }}>
                {beneficiaryColumns.map((col) => (
                  <th key={col} style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                    {capitalizeLabel(col)}
                  </th>
                ))}
                
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={beneficiaryColumns.length + 1} className="text-center">No items found</td>
                </tr>
              ) : (
                beneficiaries.map((item) => (
                  <tr key={item.id}>
                    {beneficiaryColumns.map((col) => (
                      <td key={col} style={{ padding: '8px', border: '1px solid #ddd',whiteSpace:'nowrap' }}>
                        {item[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Volunteers Table */}
        <div style={{ overflowX: 'auto', marginBottom: '30px', }}>
        <h6 style={{ marginBottom: '15px !important',fontWeight:'900', }}>Volunteers</h6>
          <table style={{ width: '100%', borderCollapse: 'collapse',whiteSpace:'nowrap' }}>
            <thead>
              <tr style={{  }}>
                {volunteerColumns.map((col) => (
                  <th key={col} style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                    {capitalizeLabel(col)}
                  </th>
                ))}
                
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={volunteerColumns.length + 1} className="text-center">No items found</td>
                </tr>
              ) : (
                volunteers.map((item) => (
                  <tr key={item.id}>
                    {volunteerColumns.map((col) => (
                      <td key={col} style={{ padding: '8px', border: '1px solid #ddd',whiteSpace:'nowrap' }}>
                        {item[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Receives Table */}
        <div style={{ overflowX: 'auto', marginBottom: '30px', }}>
        <h6 style={{ marginBottom: '15px !important',fontWeight:'900', }}>Receives</h6>
          <table style={{ width: '100%', borderCollapse: 'collapse',whiteSpace:'nowrap' }}>
            <thead>
              <tr style={{  }}>
                {receiveColumns.map((col) => (
                  <th key={col} style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                    {capitalizeLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receives.length === 0 ? (
                <tr>
                  <td colSpan={receiveColumns.length} className="text-center">No items found</td>
                </tr>
              ) : (
                receives.map((item) => (
                  <tr key={item.id}>
                    {receiveColumns.map((col) => (
                      <td key={col} style={{ padding: '8px', border: '1px solid #ddd',whiteSpace:'nowrap' }}>
                        {item[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
  <h6 style={{ marginBottom: '15px', fontWeight: '900' }}>Project Summary</h6>
  <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
    <thead>
      <tr>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Start Date</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>End Date</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Funding Type</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Man Power</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Beneficiaries</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Receives</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Expenses</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Remaining Amount</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Total Project Cost</th>
        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Project Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.start_date}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.end_date}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.funding_type}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{totalVolunteers}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{totalBeneficiaries}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{totalReceives.toFixed(2)}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{totalExpenses.toFixed(2)}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{remainingAmount.toFixed(2)}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{totalProjectCost}</td>
        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
          {isProjectCompleted ? 'Completed' : 'Ongoing'}
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>
    </div>
  );
};

export default Add;
