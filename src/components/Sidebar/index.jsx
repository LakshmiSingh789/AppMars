import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { menuItems } from "../../constants";
import {FaAngleRight} from "react-icons/fa6";
import {IoMdLogOut,} from "react-icons/io";
import { MyContext } from "../../App";
import { getSessionKeyFromCookie, fetchAuthenticationData } from '../../utils/utils';
import { useFetchData } from "../../utils/useFetchData";

const Sidebar = () => {
  
  const [activeTab, setActiveTab] = useState(null);
  const [is_superuser, setNGO] = useState(null);
  const context = useContext(MyContext);
  const SessionKey = getSessionKeyFromCookie('session_key');
  const getData = async () => {
    try {
      const DataGet = await fetchAuthenticationData(SessionKey);
      if (DataGet) {
        setNGO(DataGet.is_superuser);
      } else {
        console.error('No data returned from fetchAuthenticationData');
      }
    } catch (error) {
      console.error('Error fetching data:', error); 
    }
  };
  
  getData();
  const toggleSubmenu = (id) => {
    setActiveTab(activeTab === id ? null : id);
  };
  const filteredMenuItems = menuItems.filter(item => {
    if (is_superuser) {
      return true; 
    }
    if (item.id === 12 || item.id === 13 || item.id === 9) {
      return false;
    }
    return true;
  });
  return (
    <div className="sidebar">
      <ul>
        {filteredMenuItems.map((item) => (
          <li key={item.id}>
            <Button
              className={`w-100 ${activeTab === item.id ? "active" : ""}`}
              onClick={() => toggleSubmenu(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.submenu && <span className="arrow"><FaAngleRight /></span>}
            </Button>
            {item.submenu && (
              <div
                className={`submenuWrapper ${activeTab === item.id ? "colapse" : "colapsed"}`}
              >
                <ul className="submenu">
                  {item.submenu.map((subitem, index) => (
                    <li key={index}>
                      <Link to={subitem.link} className="icon row">
                        <span className="m-1">{subitem.icon}</span>
                        <span>{subitem.label}</span>
                      </Link>
                      {subitem.submenu && (
                        <div className="childMenu">
                          <ul>
                            {subitem.submenu.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Link to={child.link} className="icon row">
                                  <span className="m-1">{child.icon}</span>
                                  <span>{child.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="logoutWrapper">
        <div className="logoutBox flex-column pt-5 pb-3">
          <Button variant="contained">
            <IoMdLogOut /> Logout
          </Button>
          <p className="mt-2">
          Support: +918770984358
          </p>
          <div className="contact-links d-flex flex-row gap-3 mt-3">
  <a
    href="tel:+918770984358"
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-primary rounded-0"
  >
    Call
  </a>

  <a
    href="https://wa.me/918770984358"
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-success rounded-0"
  >
    WhatsApp
  </a>

  <a
    href="mailto:your-email@example.com"
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-secondary rounded-0"
  >
    Email
  </a>
</div>

        </div>
      </div>
    </div>
    
  );
};

export default Sidebar;
