import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/image.png';
import patern from '../../assets/images/image.png';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Cookies from 'js-cookie';
import googleIcon from '../../assets/images/image.png';
import { IoMdHome } from "react-icons/io";
import axios from 'axios'; 
import { API_URL } from '../../apiUrl';
const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpSuccess, setOtpSuccess] = useState(false);
    const navigate = useNavigate();
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const context = useContext(MyContext);

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, [context]);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/register/`, {
                name: username,
                email: email,
                password1: password,
                password2: password,
                mobile: mobile
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                setSuccess(true);
                setOtpSent(true);
            } else {
                setError(response.data.errors);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors || error.response.data || 'Error signing up. Please try again.');
            } else {
                setError('Error signing up. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOtpError(null);

        try {
            const response = await axios.post(`${API_URL}/api/verify-otp/`, {
                email: email,
                otp: otp
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                setOtpSuccess(true);  
                setTimeout(() => {
                    navigate('/login');  
                }, 3000);
            } else {
                setOtpError(response.data.errors);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setOtpError(error.response.data.errors || error.response.data || 'Error verifying OTP. Please try again.');
            } else {
                setOtpError('Error verifying OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return; 
        setLoading(true);
        setOtpError(null);

        try {
            const response = await axios.post(`${API_URL}/api/resend-otp/`, {
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                alert('OTP has been resent');
                setResendCooldown(60); 
            } else {
                setOtpError(response.data.errors);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setOtpError(error.response.data.errors || error.response.data || 'Error resending OTP. Please try again.');
            } else {
                setOtpError('Error resending OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <img src={patern} className='loginPatern' />
            <section className="loginSection signUpSection">
                <div className='row'>
                    <div className='col-md-6 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>NGos <span className='text-sky'>Management</span> Software</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                        <div className='w-100 mt-4'>
                            <Link to={'/'}> 
                                <Button className="btn-blue btn-lg btn-big"><IoMdHome/> Go To Home</Button>
                            </Link>
                        </div>
                    </div>

                    <div className='col-md-6 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" />
                                <h5 className='font-weight-bold'>Register a new account</h5>
                            </div>
                            {error && (
                                <div className="alert alert-danger">
                                    {typeof error === 'object' ? Object.values(error).map((err, index) => (
                                        <p key={index}>{err}</p>
                                    )) : <p>{error}</p>}
                                </div>
                            )}
                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={handleSubmit}>
                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input 
                                            type='email' 
                                            className='form-control' 
                                            placeholder='Enter your email' 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            onFocus={() => focusInput(1)} 
                                            onBlur={() => setInputIndex(null)} 
                                        />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input 
                                            type={isShowPassword ? 'text' : 'password'} 
                                            className='form-control' 
                                            placeholder='Enter your password' 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            onFocus={() => focusInput(2)} 
                                            onBlur={() => setInputIndex(null)} 
                                        />
                                        <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input 
                                            type={isShowConfirmPassword ? 'text' : 'password'} 
                                            className='form-control' 
                                            placeholder='Confirm your password' 
                                            value={confirmPassword} 
                                            onChange={(e) => setConfirmPassword(e.target.value)} 
                                            onFocus={() => focusInput(3)} 
                                            onBlur={() => setInputIndex(null)} 
                                        />
                                        <span className='toggleShowPassword' onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                            {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input 
                                            type='text' 
                                            className='form-control' 
                                            placeholder='Enter your mobile number' 
                                            value={mobile} 
                                            onChange={(e) => setMobile(e.target.value)} 
                                            onFocus={() => focusInput(4)} 
                                            onBlur={() => setInputIndex(null)} 
                                        />
                                    </div>

                                    <FormControlLabel control={<Checkbox />} label="I agree to the Terms & Conditions" />

                                    <div className='form-group'>
                                        <Button type="submit" className="btn-blue btn-lg w-100 btn-big">Sign Up</Button>
                                    </div>

                                </form>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SignUp;
