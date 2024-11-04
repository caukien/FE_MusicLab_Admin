import { useState, useEffect } from "react";
import {
  Table,
  Image,
  Space,
  Button,
  message,
  Modal,
  notification,
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import EditSongModal from "./EditSongModal";
import {
  getToken,
  getUserIdFromToken,
  hasAccess,
  isTokenExpired,
} from "../../utils/auth";
import AddSong from "./AddSongModal";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";

const API_URL = import.meta.env.VITE_API_URL;

const SongTable = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editingSong, setEditingSong] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [isAddSongVisible, setIsAddSongVisible] = useState(false);
  const [userId, setUserId] = useState(getUserIdFromToken());

  const [currentSongId, setCurrentSongId] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token || isTokenExpired() || !hasAccess(["admin", "producer"])) {
      navigate("/login");
    }
  }, [navigate, token]);

  const fetchSongs = async (pageNumber = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}song/GetAllByUserId/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`
      );
      const { totalPages, currentPage, songs } = response.data;
console.log(songs);

      setSongs(songs);
      setPagination({
        current: currentPage,
        pageSize,
        total: totalPages * pageSize,
      });
    } catch (error) {
      message.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setUserId(getUserIdFromToken());
      fetchSongs(1);
    }
  }, [token]);

  const handleEdit = (record) => {
    setEditingSong(record);
    setIsModalVisible(true);
    setSelectedSongId(record.id);
  };

  const handleDelete = (songId, songName) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the song: ${songName}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}song/${songId}`);
          notification.success({
            message: "Success",
            description: `The song "${songName}" was deleted successfully.`,
          });
          fetchSongs(pagination.current, pagination.pageSize); // Refresh the table after deletion
        } catch (error) {
          notification.error({
            message: "Error",
            description: `Failed to delete the song "${songName}".`,
          });
        }
      },
    });
  };

  const handleTableChange = (pagination) => {
    fetchSongs(pagination.current, pagination.pageSize);
  };

  const handleAddSong = () => {
    setIsAddSongVisible(true);
  };

  const handlePrevSong = () => {
    if (currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1;
      setCurrentSongId(songs[prevIndex].id);
      setCurrentSongIndex(prevIndex);
    }
  };

  const handleNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongId(songs[nextIndex].id);
      setCurrentSongIndex(nextIndex);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Song Image",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (text, record) => (
        <Image
          src={record.image || "https://via.placeholder.com/50"}
          width={100}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record, index) => (
        <a
          onClick={() => {
            setCurrentSongId(record.id);
            setCurrentSongIndex(index);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Stream",
      dataIndex: "count",
      key: "count",
      width: "15%",
      render: (text) => (
        <span>{text}</span> || "None"
      ),
    },
    {
      title: "Album",
      dataIndex: "album",
      key: "album",
      width: "20%",
      render: () => "None",
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
            onClick={handleAddSong}
            className="mb-5"
          >
            Add Song
          </Button>
          <Table
            columns={columns}
            dataSource={songs}
            pagination={{
              current: pagination.current,
              total: pagination.total,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            rowKey="id"
          />
        </>
      )}
      {isModalVisible && (
        <EditSongModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          songData={editingSong}
          refreshSongs={fetchSongs}
          songId={selectedSongId}
        />
      )}
      {isAddSongVisible && (
        <AddSong
          visible={isAddSongVisible}
          onClose={() => setIsAddSongVisible(false)}
          refreshSongs={fetchSongs}
        />
      )}
      {currentSongId && (
        <MusicPlayer
          songId={currentSongId}
          songs={songs}
          onPrev={handlePrevSong}
          onNext={handleNextSong}
        />
      )}
    </>
  );
};

export default SongTable;
