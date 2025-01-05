
import { useContext, useState,useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/image.png';
import Swal from 'sweetalert2';
import axios from 'axios';
import Button from '@mui/material/Button';
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import SearchBox from "../SearchBox";
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { IoShieldHalfSharp } from "react-icons/io5";
import { ImUserTie } from "react-icons/im";
import { MyContext } from '../../App';
import { fetchAuthenticationData,getSessionKeyFromCookie } from '../../utils/utils';
import { API_URL } from '../../apiUrl';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);
    const context = useContext(MyContext)
    const [isProfile, setProfile] = useState(null);
    
     const SessionKey = getSessionKeyFromCookie('session_key');

     const navigate = useNavigate(); 

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
             // If no SessionKey, navigate to login page
             navigate('/login');
         }
     }, [SessionKey, navigate]);

  const handleLogout = async () => {
    console.log('clicked');
    try {
        const response = await axios.get(`${API_URL}/api/logout/`, {
            headers: {
                'Authorization': `${SessionKey}`
            }
        });
        
        if (response.status === 200) {
            Swal.fire({
                title: 'Success',
                text: 'Logout successful!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                Cookies.remove('session_key');
                Cookies.remove('user_auth');
                window.location.href = '/login'; 
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Logout failed!',
                icon: 'error',
                confirmButtonText: 'Retry'
            });
        }
    } catch (error) {
        console.error('Logout failed:', error);
        Swal.fire({
            title: 'Error',
            text: 'Logout failed. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry'
        });
    }
};

  
  
  const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true)
    }

    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false)
    }


    const changeTheme = () => {
        if (context.theme === "dark") {
            context.setTheme("light");
        }
        else {
            context.setTheme("dark");
        }
    }

    return (
        <>
        
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wraooer */}
                        <div className="col-sm-2 part1">
                            <Link to={'/'} className="d-flex align-items-center logo">
                                <img src={logo} />
                                <span className="ml-2">NGos</span>
                            </Link>
                        </div>
                        {
                            context.windowWidth > 992 &&
                            <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                                <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                    {
                                        context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                    }
                                </Button>
                                <SearchBox />
                            </div>
                        }
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle mr-3" onClick={changeTheme}>
                                <MdOutlineLightMode />
                            </Button>


                            <div className='dropdownWrapper position-relative'>
                                <Button className="rounded-circle mr-3"
                                    onClick={handleOpenotificationsDrop}><FaRegBell /></Button>

                                {
                                    context.windowWidth < 992 &&
                                    <Button className="rounded-circle mr-3"
                                        onClick={() => context.openNav()}
                                    ><IoMenu /></Button>
                                }
                                
                            </div>

                            {
                                context.isLogin !== true ?
                                    <Link to={'/login'}><Button className='btn-blue btn-lg btn-round'>Sign In</Button></Link>
                                    :

                                    <div className="myAccWrapper">
                                        <Button className="myAcc d-flex align-items-center"
                                            onClick={handleOpenMyAccDrop}
                                        >
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                {isProfile ? (
                                                    isProfile.image ? (
                                                        <img src={isProfile.image} alt="User Avatar" className="user-avatar" />
                                                    ) : (
                                                        <ImUserTie size={24}/>
                                                    )
                                                    ) : (
                                                    <p>Loading...</p>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="userInfo res-hide">
                                                <h4>{isProfile?.name ? isProfile.name : ''}</h4>
                                                <p className="mb-0" style={{textTransform:'lowercase'}}>{isProfile?.email ? isProfile.email : ''}</p>
                                            </div>

                                        </Button>

                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDrop}
                                            onClick={handleCloseMyAccDrop}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >

                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <PersonAdd fontSize="small" />
                                                </ListItemIcon>
                                                My Account
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <IoShieldHalfSharp />
                                                </ListItemIcon>
                                                Reset Password
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <ListItemIcon onClick={handleLogout}>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>


                                    </div>

                            }





                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;