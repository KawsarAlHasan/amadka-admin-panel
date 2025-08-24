import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const CheckCode = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (values.otp === "12345") {
        // Example verification
        message.success("OTP verified successfully!");
        navigate("/set-new-password");
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("New OTP sent to your email!");
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4 bg-[#e6f0f5]">
      <div className=" p-8 shadow-lg rounded-lg   w-[530px]">
        <img src={logo} alt="Logo" className=" mx-auto pb-4" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We sent a reset link to contact@dscode...com. Enter the 5-digit code
            from the email.
          </p>
        </div>

        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please input the OTP!",
              },
              {
                pattern: /^[0-9]{5}$/,
                message: "Please enter a valid 5-digit code",
              },
            ]}
            className="mb-6 text-center"
          >
            <Input.OTP
              length={5}
              formatter={(str) => str.toUpperCase()}
              inputType="number"
              inputStyle={{
                width: 50,
                height: 50,
                fontSize: 18,
                margin: "0 4px",
                textAlign: "center",
              }}
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-12 font-semibold text-lg my-main-button custom-primary-btn"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Didn't receive the email?{" "}
              <Button
                type="link"
                loading={resendLoading}
                onClick={handleResend}
                className="p-0 font-medium"
              >
                Resend
              </Button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckCode;
