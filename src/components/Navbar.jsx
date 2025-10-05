import React, { useState } from "react";
import { Avatar, Dropdown, Button, Drawer, Badge, Space, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";

const Navbar = ({ showDrawer }) => {
  const navigate = useNavigate();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <div className="!cursor-default">
          <div className="flex gap-1">
            <Avatar size={47} className="mt-[4px]" icon={<UserOutlined />} />
            <div>
              <h2>Shah Rukh Khan</h2>
              <p className="bg-[#006699] text-center text-[#FFF] px-3 rounded-full">
                Admin
              </p>
            </div>
          </div>

          <Divider className="!mb-[0px] !mt-[1px] !bg-gray-300 " />
        </div>
      ),
    },

    {
      key: "edit-profile",
      label: <EditProfile />,
    },
    {
      key: "change-password",
      label: <ChangePassword />,
    },
    {
      key: "logout",
      label: (
        <span
          onClick={handleSignOut}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  return (
    <header className="w-full text-[#FFFFFF] shadow-sm fixed top-0 z-50 py-[8px]">
      <div className=" mx-2 lg:ml-[30px] lg:mr-24 ">
        <div className="flex items-center justify-between h-16 ">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              type="text"
              className="md:hidden mr-2"
              icon={<MenuOutlined className="text-lg" />}
              onClick={showDrawer}
            />

            <Link
              to="/"
              className="text-4xl font-bold text-[#FE7400] whitespace-nowrap"
            >
              <img src={logoImage} alt="Logo" className="h-[30px]" />
            </Link>
          </div>

          <Dropdown
            menu={{ items: profileMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="w-64"
          >
            <Avatar
              icon={<UserOutlined className="" />}
              size="large"
              className="cursor-pointer border border-white hover:opacity-80 transition-opacity"
            />
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
