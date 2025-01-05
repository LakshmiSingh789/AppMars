import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import { createContext, useEffect, useState, Suspense } from "react";
import { spinnerBorderStyle, spinnerStyle, visuallyHiddenStyle } from "./constants";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Products = React.lazy(() => import("./pages/Products"));
const Report = React.lazy(() => import("./pages/Report"));
const Add = React.lazy(() => import("./pages/Add"));
const Edit = React.lazy(() => import("./pages/Edit"));
const Details = React.lazy(() => import("./pages/Details"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Template = React.lazy(() => import("./pages/Template"));
const Download = React.lazy(() => import("./pages/Download"));
const UserList = React.lazy(() => import("./pages/UserList"));
const UserAdd = React.lazy(() => import("./pages/UserAdd"));
const ProjectVolunteers = React.lazy(() => import("./pages/ProjectVolunteers"));
const Header = React.lazy(() => import("./components/Header"));
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const ProjectVolunteersList = React.lazy(() => import("./pages/ProjectVolunteersList"));

const MyContext = createContext();

function Preloader() {

  return (
    <div style={spinnerStyle}>
      <div style={spinnerBorderStyle} role="status">
        <span style={visuallyHiddenStyle}>Loading...</span>
      </div>
    </div>
  );
}

const spinnerKeyframes = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = spinnerKeyframes;
document.head.appendChild(styleSheet);



function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Suspense fallback={<Preloader />}>

          {isHideSidebarAndHeader !== true && (
            <Suspense fallback={<Preloader />}>
              <Header />
            </Suspense>
          )}

          <div className="main d-flex">
            {isHideSidebarAndHeader !== true && (
              <>
                
                <Suspense fallback={<Preloader />}>
                  <div className={`sidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
                  <div
                    className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : ""} ${isOpenNav === true ? "open" : ""}`}
                  >
                    <Sidebar />
                  </div>
                </Suspense>
              </>
            )}

            <div className={`content ${isHideSidebarAndHeader === true && "full"} ${isToggleSidebar === true ? "toggle" : ""}`}>
            <Routes>
  <Route path="/" exact={true} element={<Dashboard />} />
  <Route path="/report" exact={true} element={<Report />} />
  <Route path="/login" exact={true} element={<Login />} />
  <Route path="/signUp" exact={true} element={<SignUp />} />
  <Route path="/products" exact={true} element={<Products />} />
  <Route path="/project/add" exact={true} element={<Add />} />
  <Route path="/project/edit/:id" exact={true} element={<Edit />} />
  <Route path="/receive/add" exact={true} element={<Add />} />
  <Route path="/receive/edit/:id" exact={true} element={<Edit />} />
  <Route path="/expense/add" exact={true} element={<Add />} />
  <Route path="/expense/edit/:id" exact={true} element={<Edit />} />
  <Route path="/beneficiary/add" exact={true} element={<Add />} />
  <Route path="/beneficiary/edit/:id" exact={true} element={<Edit />} />
  <Route path="/beneficiary/list" exact={true} element={<Details />} />
  <Route path="/volunteer/add" exact={true} element={<Add />} />
  <Route path="/volunteer/edit/:id" exact={true} element={<Edit />} />
  <Route path="/volunteer/list" exact={true} element={<Details />} />
  <Route path="/staff/add" exact={true} element={<Add />} />
  <Route path="/staff/edit/:id" exact={true} element={<Edit />} />
  <Route path="/staff/list" exact={true} element={<Details />} />
  <Route path="/template/add" exact={true} element={<Add />} />
  <Route path="/template/edit/:id" exact={true} element={<Edit />} />
  <Route path="/template/list" exact={true} element={<Details />} />
  <Route path="/imageupload/add" exact={true} element={<Add />} />
  <Route path="/imageupload/edit/:id" exact={true} element={<Edit />} />
  <Route path="/resolutionworkplace/:id" exact={true} element={<Template />} />
  <Route path="/downloadv/:id" exact={true} element={<Download />} />
  <Route path="/downloads/:id" exact={true} element={<Download />} />
  <Route path="/imageupload/list" exact={true} element={<Details />} />
  <Route path="/projectvolunteer/add" exact={true} element={<Add />} />
  <Route path="/projectvolunteer/edit/:id" exact={true} element={<Edit />} />
  <Route path="/projectvolunteer/list" exact={true} element={<Details />} />
  <Route path="/resolution/add" exact={true} element={<Add />} />
  <Route path="/resolution/list" exact={true} element={<Details />} />
  <Route path="/resolution/edit/:id" exact={true} element={<Edit />} />
  <Route path="/whatsapp/add" exact={true} element={<Add />} />
  <Route path="/whatsapp/edit/:id" exact={true} element={<Edit />} />
  <Route path="/whatsapp/list" exact={true} element={<Details />} />
  <Route path="/project/list" exact={true} element={<Details />} />
  <Route path="/projectstatus/add" exact={true} element={<Add />} />
  <Route path="/projectstatus/edit/:id" exact={true} element={<Edit />} />
  <Route path="/projectstatus/list" exact={true} element={<Details />} />
  <Route path="/receive/list" exact={true} element={<Details />} />
  <Route path="/expense/list" exact={true} element={<Details />} />
  <Route path="/projectpolunteers/add" exact={true} element={<ProjectVolunteers />} />
  <Route path="/projectpolunteers/list" exact={true} element={<ProjectVolunteersList />} />
  <Route path="/user/list" exact={true} element={<UserList />} />
  <Route path="/user/add" exact={true} element={<UserAdd />} />
</Routes>

            </div>
          </div>

          
        </Suspense>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
