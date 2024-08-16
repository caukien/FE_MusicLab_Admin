import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, hasAccess, isTokenExpired, setToken } from "../utils/auth";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const token = getToken();

  useEffect(() => {
    // Check if the token is valid and user has access
    if (token && !isTokenExpired() && hasAccess(["admin", "producer"])) {
      navigate("/home");
    }
  }, [navigate, token]);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}user/login`, values);
      const token = response.data;
      setToken(token);
      if (hasAccess(["admin", "producer"])) {
        navigate("/home");
      } else {
        setError("You do not have permission to access this page.");
      }
      // navigate("/home");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <Card className="login-card">
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            style={{
              maxWidth: 360,
            }}
            onFinish={handleLogin}
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
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
