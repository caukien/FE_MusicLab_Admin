import axios from "axios";
import { useState, useEffect } from "react";
import {
  getToken,
  getUserIdFromToken,
  hasAccess,
  isTokenExpired,
} from "../../utils/auth";
import {
  Button,
  message,
  Pagination,
  Space,
  Spin,
  Table,
  Image,
  Modal,
  notification,
  List,
  Avatar,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddAlbumModal from "./AddAlbumModal";
import EditAlbumModal from "./EditAlbum";
import { useNavigate } from "react-router-dom";

const token = getToken();
const API_URL = import.meta.env.VITE_API_URL;
const userId = getUserIdFromToken();

const AlbumTable = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [isAddAlbumVisible, setIsAddAlbumVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token && isTokenExpired() && !hasAccess(["admin", "producer"])) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(
        `${API_URL}album/GetAllByUserId/${userId}`
      );
      setAlbums(response.data);
      setPagination((prev) => ({ ...prev, total: response.data.length }));
    } catch (error) {
      message.error("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleEdit = (record) => {
    setEditingAlbum(record);
    // navigate(`/edit/${record.id}`);
    setIsModalVisible(true);
    setSelectedAlbumId(record.id);
  };

  const handleDelete = (albumId, albumName) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the album: ${albumName}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}album/${albumId}`);
          notification.success({
            message: "Success",
            description: `The album "${albumName}" was deleted successfully.`,
          });
          fetchAlbums(); // Refresh the table after deletion
        } catch (error) {
          notification.error({
            message: "Error",
            description: `Failed to delete the album "${albumName}".`,
          });
        }
      },
    });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleAddAlbum = () => {
    setIsAddAlbumVisible(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      render: (text, record, index) =>
        pagination.current * pagination.pageSize -
        pagination.pageSize +
        index +
        1,
    },
    {
      title: "Album Image",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (text, record) => (
        <Image
          src={record.image || "https://via.placeholder.com/50"}
          width={100}
          height={100}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "Songs",
      dataIndex: "songs",
      key: "songs",
      width: "30%",
      render: (songs) => (
        <List
          dataSource={songs}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.image} />}
                title={item.name}
                // description={item.email}
              />
            </List.Item>
          )}
        />
      ),
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
            onClick={() => handleEdit(record)}
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
            onClick={handleAddAlbum}
            className="mb-5"
          >
            Add Album
          </Button>
          <Table
            columns={columns}
            dataSource={albums}
            pagination={false}
            onChange={handleTableChange}
            rowKey="id"
          />
          <Pagination
            {...pagination}
            showSizeChanger
            onShowSizeChange={(current, pageSize) =>
              setPagination({ ...pagination, pageSize })
            }
            onChange={(page) => setPagination({ ...pagination, current: page })}
            style={{ marginTop: "20px", textAlign: "right" }}
          />
        </>
      )}
      {isModalVisible && (
        <EditAlbumModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          albumData={editingAlbum}
          refreshAlbums={fetchAlbums}
          albumId={selectedAlbumId}
        />
      )}
      {isAddAlbumVisible && (
        <AddAlbumModal
          visible={isAddAlbumVisible}
          onClose={() => setIsAddAlbumVisible(false)}
          refreshAlbums={fetchAlbums}
        />
      )}
    </>
  );
};

export default AlbumTable;