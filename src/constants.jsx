import { BsPersonWorkspace } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { GiCrescentStaff, GiExpense, GiProfit, GiReceiveMoney } from "react-icons/gi";
import { GoProject } from "react-icons/go";
import { ImFilePdf, ImInsertTemplate } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { LiaDonateSolid, LiaUserSecretSolid } from "react-icons/lia";
import { MdDashboard, MdOutlineImage, MdOutlineVolunteerActivism, MdWhatsapp } from "react-icons/md";
import { PiBank } from "react-icons/pi";
import { TbListDetails, TbMessage2Minus, TbMessages, TbStatusChange, TbTemplate } from "react-icons/tb";

export const menuItems = [
    {
      id: 0,
      label: "Dashboard",
      icon: <MdDashboard />,
      link: "/dashboard/",
    },
    {
      id: 1,
      label: "Projects",
      icon: <GoProject />,
      submenu: [
        { label: "Project", link: "#", icon: <LiaDonateSolid />, submenu: [
          { label: "Add Project", link: "/project/add", icon: <FaPlus /> },
          { label: "All Projects", link: "/project/list", icon: <TbListDetails /> },
        ] },
        { label: "Status", link: "#", icon: <TbStatusChange />, submenu: [
          { label: "Add Status", link: "/projectstatus/add", icon: <FaPlus /> },
          { label: "All Status", link: "/projectstatus/list", icon: <TbListDetails /> },
        ] },
      ],
      
    },
    {
      id: 2,
      label: "Beneficiaries",
      icon: <GiProfit />,
      submenu: [
        { label: "Add Beneficiary", link: "/beneficiary/add", icon: <FaPlus /> },
        { label: "All Beneficiaries", link: "/beneficiary/list", icon: <TbListDetails /> },
      ],
    },
    
    {
      id: 3,
      label: "Accounts",
      icon: <PiBank />,
      submenu: [
        { label: "Expense", link: "#", icon: <GiExpense />, submenu: [
          { label: "Add Expenses", link: "/expense/add", icon: <FaPlus /> },
          { label: "All Expense", link: "/expense/list", icon: <TbListDetails /> },
        ] },
        { label: "Receive", link: "#", icon: <GiReceiveMoney />, submenu: [
          { label: "Add Receive", link: "/receive/add", icon: <FaPlus /> },
          { label: "All Receives", link: "/receive/list", icon: <TbListDetails /> },
        ] },
      ],
    },
    {
      id: 4,
      label: "Volunteer",
      icon: <MdOutlineVolunteerActivism />,
      submenu: [
        { label: "Add Volunteer", link: "/volunteer/add", icon: <FaPlus /> },
        { label: "All Volunteers", link: "/volunteer/list", icon: <TbListDetails /> },
      ],
    },
    {
      id: 5,
      label: "Staff",
      icon: <GiCrescentStaff />,
      submenu: [
        { label: "Add Staff", link: "/staff/add", icon: <FaPlus /> },
        { label: "All Staff", link: "/staff/list", icon: <TbListDetails /> },
      ],
    },
    {
      id: 6,
      label: "Project Man Power",
      icon: <BsPersonWorkspace />,
      submenu: [
        { label: "Add Worker", link: "/projectpolunteers/add", icon: <FaPlus /> },
        { label: "All Worker", link: "/projectvolunteer/list", icon: <TbListDetails /> },
      ],
    },
    {
      id: 7,
      label: "Reports",
      icon: <ImFilePdf />,
      submenu: [
        { label: "Expenses Reports", link: "/report", icon: <GiExpense />},
        { label: "Receives Reports", link: "/Receives/reports", icon: <GiReceiveMoney />},
        { label: "Beneficiaries Reports", link: "/beneficiaries/reports", icon: <GiProfit />},
        { label: "Projects Report", link: "/projects/reports", icon: <GoProject />},
      ],
    },
    {
      id: 8,
      label: (
        <>
      Upload Image <span className="text-danger ml-2"></span>
      </>
      ),
      icon: <MdOutlineImage />,
      submenu: [
        { label: "Add Image", link: "/imageupload/add", icon: <FaPlus />},
        { label: "All Images", link: "/imageupload/list", icon: <TbListDetails />},
      ],
    },
    {
      id: 9,
      label: (
        <>
      Templates <span className="text-danger ml-2"></span>
      </>
      ),
      icon: <ImInsertTemplate size={18} />,
      submenu: [
        { label: "Add Template", link: "/template/add", icon: <FaPlus />},
        { label: "All Templates", link: "/template/list", icon: <TbListDetails />},
        { label: "Add Resolation", link: "/resolution/add", icon: <FaPlus />},
        { label: "All Resolations", link: "/resolution/list", icon: <TbListDetails />}
      ],
    },
    {
      id: 10,
      label: (
      <>
      Whatsapp <span className="text-danger ml-2">Rs.99</span>
      </>
      ),
      icon: <MdWhatsapp/>,
      submenu: [
        { label: "Add Contact", link: "/whatsapp/add", icon: <FaPlus />},
        { label: "All Contact", link: "/whatsapp/list", icon: <TbListDetails />},
        { label: "Send Message", link: "/whatsapp/send", icon: <TbMessages/>},
        { label: "All Messages", link: "/meessages/list", icon: <TbMessage2Minus/>},
      ],
    },
    
    {
      id: 11,
      label: (
        <>
      Resolation <span className="text-danger ml-2">Rs.99</span>
      </>
      ),
      icon: <TbTemplate />,
      submenu: [
        { label: "All Resolations", link: "/resolution/list", icon: <TbListDetails />},
      ],
    },
    {
      id: 12,
      label: "Users",
      icon: <LiaUserSecretSolid />,
      submenu: [
        { label: "Add User", link: "/user/add", icon: <FaPlus /> },
        { label: "All Users", link: "/user/list", icon: <TbListDetails /> },
      ],
    },
    {
      id: 13,
      label: "Settings",
      icon: <IoIosSettings />,
      link: "/",
    },
  ];

  export const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  };

  export const spinnerBorderStyle = {
    width: "3rem",
    height: "3rem",
    border: "0.4rem solid #e9ecef",
    borderTop: "0.4rem solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  export const visuallyHiddenStyle = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: "0",
  };