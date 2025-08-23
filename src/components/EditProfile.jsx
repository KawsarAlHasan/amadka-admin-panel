import React, { useState } from "react";
import { Modal, Form, Input, Upload, Avatar, Button } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const EditProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const demoUser = {
    name: "Admin User",
    role: "Administrator",
    email: "admin@example.com",
    profilePic:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRUDxcKm4nKzGwY1qigTc_8aGO-64Y2-YlFNrFPd5UTxlYhunLECNU8kv_lenJSFrK3moUagDjvyfzaOpsK686FGp6piSwnzJEM7whhmh8",
  };

  const showModal = () => {
    form.setFieldsValue(demoUser);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Updated Profile:", values);
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      {/* Profile Menu Item */}
      <div
        onClick={showModal}
        className="flex items-center gap-2 px-1 py-2 cursor-pointer"
      >
        <UserOutlined /> Profile
      </div>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <div className="flex justify-center mb-4">
          <Avatar size={80} src={demoUser.profilePic} icon={<UserOutlined />} />
        </div>

        <Form form={form} layout="vertical" name="editProfileForm">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Profile Picture" name="profilePic">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload New Picture</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditProfile;
