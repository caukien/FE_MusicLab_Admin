import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}user/register`, values);
      if (response != null) {
        notification.success({
          message: "Đăng ký thành công",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
          placement: "topRight",
          duration: 3,
        });
        navigate("/login");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <Card className="login-card">
          <Form
            name="register"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            style={{
              maxWidth: 360,
            }}
            onFinish={handleRegister}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>

            <Form.Item>
              <p style={{ textAlign: "center", color: "white" }}>
                Đã có tài khoản?{" "}
                <a
                  onClick={() => navigate("/login")}
                  style={{ color: "#1890ff" }}
                >
                  Đăng nhập
                </a>
              </p>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
