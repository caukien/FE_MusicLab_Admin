import { useState, useEffect } from "react";
import {
  Table,
  message,
  Spin,
  Button,
  Space,
  Modal,
  notification,
  Input,
  Form,
} from "antd";
import axios from "axios";
import { getToken, hasAccess, isTokenExpired } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL;

const GenreTable = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null); // For edit
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token || isTokenExpired() || !hasAccess(["admin"])) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}genre`);
      setGenres(response.data);
    } catch (error) {
      message.error("Failed to load genres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGenres();
    }
  }, [token]);

  const handleDelete = (genreId, genreName) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete "${genreName}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}genre/${genreId}`);
          notification.success({
            message: "Success",
            description: `"${genreName}" was deleted successfully.`,
          });
          fetchGenres();
        } catch (error) {
          notification.error({
            message: "Error",
            description: `Failed to delete "${genreName}".`,
          });
        }
      },
    });
  };

  const showModal = (genre = null) => {
    setCurrentGenre(genre);
    setIsModalVisible(true);
    form.setFieldsValue({ name: genre ? genre.name : "" });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = async () => {
    setModalLoading(true);
    try {
      const values = await form.validateFields();
      if (currentGenre) {
        // Edit genre
        await axios.put(`${API_URL}genre/${currentGenre.id}`, values);
        notification.success({
          message: "Success",
          description: `"${values.name}" was updated successfully.`,
        });
      } else {
        // Add new genre
        await axios.post(`${API_URL}genre`, values);
        notification.success({
          message: "Success",
          description: `"${values.name}" was added successfully.`,
        });
      }
      fetchGenres();
      handleModalCancel();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to save genre.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Genre Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="danger"
            onClick={() => handleDelete(record.id, record.name)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="!items-center !justify-center flex">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="mb-5"
            onClick={() => showModal()}
          >
            Add New Genre
          </Button>
          <Table columns={columns} dataSource={genres} rowKey="id" />
        </>
      )}

      {/* Genre Modal */}
      <Modal
        title={currentGenre ? "Edit Genre" : "Add New Genre"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Genre Name"
            name="name"
            rules={[
              { required: true, message: "Please enter a genre name." },
              { max: 50, message: "Genre name cannot exceed 50 characters." },
            ]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GenreTable;
