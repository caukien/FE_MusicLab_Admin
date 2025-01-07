import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Avatar,
  notification,
} from "antd";
import ImgCrop from "antd-img-crop";
import { CloudUploadOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  getToken,
  getUserIdFromToken,
  hasAccess,
  isTokenExpired,
} from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [userId, setUserId] = useState(getUserIdFromToken());
  // const userId = getUserIdFromToken();

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token && isTokenExpired() && !hasAccess(["producer"])) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (token) {
      setUserId(getUserIdFromToken());
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}user/${userId}`);
      const userData = response.data;

      form.setFieldsValue({
        name: userData.name,
        country: userData.country,
      });

      setAvatarUrl(userData.image);
      setUsername(userData.username);
    } catch (error) {
      message.error("Failed to load user profile");
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("name", values.name);
      formData.append("country", values.country);

      if (values.password) {
        formData.append("password", values.password);
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.put(`${API_URL}user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notification.success({
        message: "Success",
        description: `Updated successfully.`,
      });
      setIsEditing(false);
      form.resetFields(["password", "confirmPassword"]);
      fetchUserProfile();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-10 max-w-[800px]">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          size={200}
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
        />
        {isEditing && (
          <ImgCrop rotationSlider>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleAvatarChange}
              showUploadList={false}
              disabled={!isEditing}
            >
              <Button icon={<CloudUploadOutlined />} style={{ marginLeft: 16 }}>
                Change Avatar
              </Button>
            </Upload>
          </ImgCrop>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ name: "", country: "" }}
        size="large"
      >
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: false,
              message: "Please enter your new password",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter new password"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: false,
              message: "Please confirm your new password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm new password"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter name" disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: "Please enter your country" }]}
        >
          <Input placeholder="Enter country" disabled={!isEditing} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleEdit}
            style={{ marginRight: "8px" }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
