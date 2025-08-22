import React, { useState } from "react";
import { Avatar, Dropdown, Button, Drawer, Badge, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

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
        <Link to="/profile" className="flex items-center gap-2 px-1 py-2">
          <UserOutlined /> Profile
        </Link>
      ),
    },
    {
      key: "change-password",
      label: (
        <Link
          to="/change-password"
          className="flex items-center gap-2 px-1 py-2"
        >
          <SettingOutlined /> Change Password
        </Link>
      ),
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

          {/* Right section */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Badge
              count={10}
              size="small"
              className="cursor-pointer p-2 rounded-full border border-gray-400 bg-white hover:text-blue-500 transition-colors"
            >
              <BellOutlined
                className="text-2xl"
                onClick={() => setDrawerVisible(true)}
              />
            </Badge>

            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="w-48"
            >
              <Avatar
                icon={<UserOutlined className="" />}
                size="large"
                className="cursor-pointer border border-white hover:opacity-80 transition-opacity"
              />
            </Dropdown>
          </div>
        </div>
      </div>

      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4">
          <p>No new notifications</p>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
