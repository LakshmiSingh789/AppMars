import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

const toTitleCase = (str) => {
    return str
        .toLowerCase()
        .replace(/\b(\w)/g, (match) => match.toUpperCase());
};

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
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

const ProductUpload = () => {
    const location = useLocation();
    const [categoryVal, setCategoryVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);
    const [productRams, setProductRAMS] = useState([]);

    const getBreadcrumbs = () => {
        const pathnames = window.location.pathname.split('/').filter((x) => x);
        let breadcrumbs = [];
        let path = '/';
    
        pathnames.forEach((value, index) => {
            path += value + '/';
            breadcrumbs.push({
                label: toTitleCase(value.replace(/-/g, ' ')),  // Convert to title case
                to: path,
            });
        });
    
        return breadcrumbs;
    };
    

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Reports</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component={Link}
                            to="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        {getBreadcrumbs().map((breadcrumb, index) => (
                            <StyledBreadcrumb
                                key={index}
                                component={Link}
                                to={breadcrumb.to}
                                label={breadcrumb.label}
                                deleteIcon={index === getBreadcrumbs().length - 1 ? <ExpandMoreIcon /> : null}
                            />
                        ))}
                    </Breadcrumbs>
                </div>
                <form className="form">
                    {/* Your form content here */}
                </form>
            </div>
        </>
    );
};

export default ProductUpload;
