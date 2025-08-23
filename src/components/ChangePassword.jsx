import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const ChangePassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Password values:", values);
        // 🔑 Call API here with values.oldPassword, values.newPassword
        setIsModalOpen(false);
        form.resetFields();
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
      <div
        onClick={showModal}
        className="flex items-center gap-2 px-1 py-2 cursor-pointer"
      >
        <SettingOutlined /> Change Password
      </div>

      <Modal
        title="Change Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="changePasswordForm">
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please enter your old password" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please enter a new password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePassword;
