import React, { useState, useEffect } from 'react';
import { getSessionKeyFromCookie } from '../../utils/utils';
import Breadcrumbs from '@mui/material/Breadcrumbs'; // Import Breadcrumbs component from Material UI
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon from Material UI
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import ExpandMore icon from Material UI
import { emphasize, styled } from '@mui/material/styles'; // Import Material UI's styled and emphasize utilities
import Chip from '@mui/material/Chip'; // Import Chip component from Material UI
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component from Material UI
import Select from '@mui/material/Select'; // Import Select component from Material UI
import { API_URL } from '../../apiUrl'; // Import API URL from a local file
import { useLocation, Link } from 'react-router-dom'; // Import React Router's useLocation and Link components // Import utility function for session key
import Swal from 'sweetalert2'; 
import * as Io5Icons from 'react-icons/io5';
import ReactQuill from 'react-quill';
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
const ProjectVolunteerForm = () => {
    const [projectId, setProjectId] = useState('');
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [selectedStaffMembers, setSelectedStaffMembers] = useState([]);
    const [userId, setUserId] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [projects, setProjects] = useState([]);
    const [volunteerList, setVolunteerList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const SessionKey = getSessionKeyFromCookie('session_key');
    const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSegments2 = location.pathname.split('/');
  const value = pathSegments2[1];
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/form_data/');
                const result = await response.json();

                if (response.ok) {
                    setProjects(result.projects);
                    setVolunteerList(result.volunteers);
                    setStaffList(result.staff_members);
                } else {
                    setResponseMessage('Failed to fetch form data');
                }
            } catch (error) {
                setResponseMessage('Error fetching form data: ' + error.message);
            }
        };

        fetchFormData();
    }, []);

    const handleVolunteerChange = (e) => {
        const { value, checked } = e.target;
        setSelectedVolunteers((prev) =>
            checked ? [...prev, value] : prev.filter((id) => id !== value)
        );
    };

    const handleStaffChange = (e) => {
        const { value, checked } = e.target;
        setSelectedStaffMembers((prev) =>
            checked ? [...prev, value] : prev.filter((id) => id !== value)
        );
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for the API request
        const data = {
            project: projectId,
            volunteers: selectedVolunteers, // Send selected volunteers
            staff_members: selectedStaffMembers, // Send selected staff members
            user: userId,
        };

        try {
            const response = await fetch('http://localhost:8000/api/project_volunteers/', {
                method: 'POST',
                headers: {
                    Authorization: SessionKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setResponseMessage(result.message || 'Project Volunteer created successfully!');
            } else {
                setResponseMessage(result.error || 'Something went wrong!');
            }
        } catch (error) {
            setResponseMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="right-content w-100">
      <div className="card shadow border-0 w-100 d-flex flex-column flex-md-row p-4 res-col">
        <h5 className="mb-0 text-center text-md-left">Project Form</h5>
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
            
      <form onSubmit={handleSubmit} className="form shadow rounded border border-secondary">
  <div className="card p-4 mt-0 mb-0">
    <div className="form-group">
      <label>Select Project</label>
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        required
        className="form-control shadow rounded border border-secondary"
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>

    <div className="row mt-4">
      <div className="col-md-6">
        <div className="mt-3 mb-3">Volunteers:</div>
        <div className="form-check pl-1">
          {volunteerList.map((volunteer) => (
            <div key={volunteer.id} className="form-check form-check-custom">
              <input
                type="checkbox"
                value={volunteer.id}
                onChange={handleVolunteerChange}
                className="form-check-input shadow rounded border border-secondary"
                id={`volunteer-${volunteer.id}`}
              />
              <label className="form-check-label" htmlFor={`volunteer-${volunteer.id}`}>
                {volunteer.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="col-md-6">
        <div className="mt-3 mb-3">Staff Members:</div>
        <div className="form-check pl-1">
          {staffList.map((staff) => (
            <div key={staff.id} className="form-check form-check-custom">
              <input
                type="checkbox"
                value={staff.id}
                onChange={handleStaffChange}
                className="form-check-input shadow rounded border border-secondary"
                id={`staff-${staff.id}`}
              />
              <label className="form-check-label" htmlFor={`staff-${staff.id}`}>
                {staff.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="form-group mt-4">
      <button type="submit" className="btn btn-danger shadow rounded border border-secondary">
        Submit
      </button>
    </div>
  </div>
</form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default ProjectVolunteerForm;
