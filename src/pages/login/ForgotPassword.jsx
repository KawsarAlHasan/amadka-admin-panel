import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { API } from "../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for login button

  const onFinish = async (values) => {
    setLoading(true); // Start loading when submitting form
    try {
       const response = await API.post("/admin-forgot-password/send-reset-code", values);

      if (response.status === 200) {
        localStorage.setItem("email", values.email);
        message.success("Email sent successfully! Please check your email.");
        navigate("/check-code");
      }
     
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Forgot password failed."
      );
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e6f0f5]">
      <div className="p-8 py-16 shadow-lg rounded-lg w-[530px] h-[580px]">
        <div>
          <img src={logo} alt="Logo" className=" mx-auto pb-4" />

          <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
            Forget Password?
          </h2>
          <h6 className=" lg:mx-14 text-center text-[#4E4E4E] mb-6 text-[18px]">
            Please enter your email to continue
          </h6>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Email Field */}
            <div className="mb-4">
              <label className="text-[18px] text-[#222222] block mb-1">
                Email address:
              </label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  type="email"
                  className="p-3"
                  placeholder="Enter your email..."
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
                  {loading ? "Sending..." : "Send a Code"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
