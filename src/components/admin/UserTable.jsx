import { useState, useEffect } from "react";
import { Table, message, Spin, Button } from "antd";
import axios from "axios";
import { getToken, hasAccess, isTokenExpired } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import EditUserModal from "./EditUserModal";
import { EditOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token || isTokenExpired() || !hasAccess(["admin"])) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

  const fetchUsers = async (pageNumber = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}user?PageNumber=${pageNumber}&PageSize=${pageSize}`
      );
      const { totalPages, currentPage, songs: users } = response.data;

      setUsers(users);
      setPagination({
        current: currentPage,
        pageSize,
        total: totalPages * pageSize,
      });
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers(1);
    }
  }, [token]);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const handleEditClick = async (userId) => {
    setButtonLoading(true);
    try {
      const response = await axios.get(`${API_URL}user/${userId}`);
      setSelectedUser(response.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to load user details");
    } finally {
      setButtonLoading(false); // Tắt trạng thái loading cho button khi hoàn tất
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "10%",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text) => text || "N/A",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "20%",
      render: (text) => text || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      render: (text) => text,
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (text, record) => (
        <Button
          icon={<EditOutlined />}
          disabled={buttonLoading}
          onClick={() => handleEditClick(record.id)}
        >
          Edit
        </Button>
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
        <Table
          columns={columns}
          dataSource={users}
          pagination={{
            current: pagination.current,
            total: pagination.total,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          rowKey="id"
        />
      )}
      <EditUserModal
        visible={isModalVisible}
        user={selectedUser}
        onCancel={handleModalCancel}
        onRoleChange={fetchUsers}
        pagination={pagination}
      />
    </>
  );
};

export default UserTable;
