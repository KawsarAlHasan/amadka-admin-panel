import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const SetNewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const adminEmail = localStorage.getItem("email");
  const otp = localStorage.getItem("otp");

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true); // Start loading when submitting form
    try {
      const response = await API.post(
        "/admin-forgot-password/set-new-password",
        {
          email: adminEmail,
          otp: otp,
          password: values.password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        message.success("Set new password successful!", 1).then(() => {
          window.location.reload();
        });
        navigate("/");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to set new password."
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid password.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e6f0f5]">
      <div className="p-8 py-6 shadow-lg rounded-lg w-[530px] h-[620px]">
        <img src={logo} alt="Logo" className="  mx-auto pb-4" />

        <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
          Set a New Password
        </h2>
        <h6 className=" lg:mx-10 text-center text-[#4E4E4E] mb-6 text-[18px]">
          Create a new password. Ensure it differs from previous ones for
          security
        </h6>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* Password Field */}
          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">
              New Password:
            </label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your New Password!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                className="p-3 text-[16px]"
                placeholder="Enter your new password..."
              />
            </Form.Item>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">
              Confirm Password:
            </label>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                className="p-3 text-[16px] "
                placeholder="Confirm your password..."
              />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full py-6 text-[18px] font-semibold my-main-button custom-primary-btn"
                loading={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPassword;
