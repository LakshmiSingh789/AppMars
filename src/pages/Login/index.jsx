import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../../assets/images/image.png';
import patern from '../../assets/images/image.png';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from '../../apiUrl';
import googleIcon from '../../assets/images/image.png';
import Cookies from 'js-cookie';
const Login = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const context = useContext(MyContext);
    const [csrfToken, setCsrfToken] = useState('');
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaResponse, setCaptchaResponse] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    useEffect(() => {
        return () => {
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/csrf/`)
            .then(response => {
                const csrfToken = response.data.csrfToken;
                setCsrfToken(csrfToken);
            })
            .catch(error => {
                console.error('Error retrieving CSRF token:', error);
            });

        fetchCaptcha();

        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 1) {
                    fetchCaptcha();
                    return 60;
                } else {
                    return prevCountdown - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchCaptcha = () => {
        setLoading(true);
        axios.get(`${API_URL}/api/captcha/`)
            .then(response => {
                const key = response.data.key;
                localStorage.setItem('Key', key);
                setCaptchaImage(response.data.captcha_image);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error retrieving CAPTCHA:', error);
                setError('Error retrieving CAPTCHA. Please try again.');
            });
    };

    const Key = localStorage.getItem('Key');
    const headers = {
        'Authorization': `${Key}`
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    
        const data = new FormData();
        data.append('email', username);
        data.append('password', password);
        data.append('custom_captcha', captchaResponse);
        data.append('csrfmiddlewaretoken', csrfToken);
    
        const headers = {
            'Authorization': localStorage.getItem('Key'),
            'X-CSRFToken': csrfToken,  
        };
    
        axios.post(`${API_URL}/api/login/`, data, { headers })
            .then(response => {
                const get_msg = response.data;
                if (get_msg.error_message) {
                    setLoading(false);
                    setError(get_msg.error_message);
                } else {
                    Cookies.set('session_key', get_msg.session_key, {
                        expires: 7,
                        path: '/',
                        sameSite: 'Strict',
                        secure: true,
                    });
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/dashboard/');
                    }, 0);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error("Login Error:", error); 
                if (error.response) {
                    setError(error.response.data.error_message || 'An unexpected error occurred.');
                } else if (error.request) {
                    setError('No response received from the server. Please check your network connection.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            });
    };
    
    
    const isSubmitDisabled = !username || !password; 

    return (
        <>
            <img src={patern} className='loginPatern' alt="background pattern" />
            <section className="loginSection">
                <div className="loginBox container">
                    <div className='logo text-center'>
                        <img src={Logo} width="60px" alt="Logo" />
                        <h5 className='font-weight-bold'>Login Panel</h5>
                    </div>
                    {error && (
  <div className="alert alert-danger p-3 text-center" role="alert">
    {error}
  </div>
)}

                    <div className='wrapper mt-3 card border mb-0'>
                        <form onSubmit={handleSubmit}>
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input
                                    type={isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <div className="d-flex justify-content-center mb-3">
                                    <img src={`data:image/png;base64,${captchaImage}`} alt="CAPTCHA" className="img-fluid" />
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="custom_captcha"
                                    placeholder="CAPTCHA"
                                    value={captchaResponse}
                                    onChange={(e) => setCaptchaResponse(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <Button  variant="contained" className=" btn-lg w-100 btn-big" color= { `${isSubmitDisabled ? 'error' : 'primary'}`}
                                 sx={{
                                    backgroundColor: isSubmitDisabled ? 'gray' : '',
                                    '&.Mui-disabled': {
                                        backgroundColor: 'gray',
                                    }
                                }}
                                 type="submit" disabled={isSubmitDisabled}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </div>

                            <div className='form-group text-center mb-0'>
                                <Link to={'/forgot-password'} className="link">FORGOT PASSWORD</Link>
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='line'></span>
                                </div>
                            </div>
                        </form>
                        <div className='footer mt-0'>
                        <span className='text-center'>
                            Don't have an account?
                            <Link to={'/signUp'} className='link color ml-2'>Register</Link>
                        </span>
                    </div>
                    </div>

                    
                </div>
            </section>
        </>
    );
}

export default Login;
