import { Menu } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePayment, MdLeaderboard, MdOutlineCategory } from "react-icons/md";
import { FaBuildingFlag } from "react-icons/fa6";
import { RiProductHuntLine } from "react-icons/ri";

import { SlBadge } from "react-icons/sl";

// import { signOutAdmin } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/user-management") return ["2"];
    if (path === "/administrators") return ["3"];
    if (path === "/products") return ["products"];
    if (path === "/categories") return ["categories"];
    if (path === "/agents") return ["agents"];
    return ["1"];
  };

  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <FaUsers />,
      label: <Link to="/user-management">User Management</Link>,
    },
    // {
    //   key: "3",
    //   icon: <FaBuildingFlag />,
    //   label: <Link to="/administrators">Administrators</Link>,
    // },
    {
      key: "products",
      icon: <RiProductHuntLine />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "categories",
      icon: <MdOutlineCategory />,
      label: <Link to="/categories">Categories</Link>,
    },
    {
      key: "agents",
      icon: <FaBuildingFlag />,
      label: <Link to="/agents">Agents</Link>,
    },



    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
        // theme="dark"
      />
    </div>
  );
};

export default Sidebar;
