import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  List,
  Avatar,
  notification,
  Spin,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import { getUserIdFromToken } from "../../utils/auth";

const { Option } = Select;

const AddAlbumModal = ({ visible, onClose, refreshAlbums }) => {
  const [form] = Form.useForm();
  const [songs, setSongs] = useState([]);
  const [songsInAlbum, setSongsInAlbum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadSong, setLoadSong] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (visible) {
      fetchUserSongs(searchValue, 1);
    }
  }, [visible, API_URL, userId]);

  const fetchUserSongs = debounce(async (search, page) => {
    setLoadSong(true);
    try {
      const pageSize = 5; // Adjust the page size as needed
      const response = await axios.get(
        `${API_URL}song/GetAllByUserId/${userId}?Search=${search}&PageNumber=${page}&PageSize=${pageSize}`
      );
      if (page === 1) {
        setSongs(response.data.songs);
      } else {
        setSongs((prev) => [...prev, ...response.data.songs]);
      }
      setHasMore(response.data.songs.length === pageSize);
    } catch {
      message.error("Failed to load songs");
    } finally {
      setLoadSong(false);
    }
  }, 500);

  const handleSongSearch = (value) => {
    setSearchValue(value);
    fetchUserSongs(value, 1);
  };

  const handleSelectChange = (selectedIds) => {
    const selectedSongs = songs.filter((song) => selectedIds.includes(song.id));
    setSongsInAlbum((prev) => [...prev, ...selectedSongs]);
    setSearchValue(""); // Reset search value
    setSongs([]); // Clear song list
  };

  const handleRemoveSongFromAlbum = (songId) => {
    setSongsInAlbum(songsInAlbum.filter((song) => song.id !== songId));
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("userIds", userId);
      formData.append("name", values.name);
      songsInAlbum.forEach((song) => {
        formData.append("songIds[]", song.id);
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.post(`${API_URL}album`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notification.success({
        message: "Success",
        description: "Added successfully.",
      });
      onClose();
      refreshAlbums();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add the album",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePopupScroll = (event) => {
    const { target } = event;
    if (
      hasMore &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      fetchUserSongs(searchValue, nextPage);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add Album"
      okText="Save"
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Album Name"
          rules={[{ required: true, message: "Please enter the album name" }]}
        >
          <Input placeholder="Enter album name" />
        </Form.Item>

        <Form.Item
          name="songs"
          label="Songs"
          rules={[
            { required: true, message: "Please select at least one song" },
          ]}
        >
          <Select
            placeholder="Search songs to add"
            onSearch={handleSongSearch}
            onChange={handleSelectChange}
            onPopupScroll={handlePopupScroll}
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchUserSongs(searchValue, 1);
              }
            }}
            value={searchValue}
            filterOption={false}
            showSearch
            allowClear
            notFoundContent={loadSong ? <Spin size="small" /> : null}
            listHeight={150}
          >
            {songs.map((song) => (
              <Option
                key={song.id}
                value={song.id}
                disabled={songsInAlbum.some((s) => s.id === song.id)}
              >
                {song.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Current Songs in Album">
          <List
            dataSource={songsInAlbum}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveSongFromAlbum(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={item.name}
                />
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Album Image"
          valuePropName="file"
          extra="Upload a new image for the album"
          rules={[
            {
              validator: async (_, file) => {
                if (!file || file.length === 0) {
                  return Promise.reject(
                    new Error("Please upload a album image")
                  );
                }
                const isImage =
                  file[0].type === "image/jpeg" || file[0].type === "image/png";
                if (!isImage) {
                  return Promise.reject(
                    new Error("Only JPG or PNG images are allowed")
                  );
                }
                if (file[0].size > 2 * 1024 * 1024) {
                  return Promise.reject(
                    new Error("Image must be smaller than 2MB")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onRemove={() => setFileList([])}
            beforeUpload={() => false} // Prevent auto-upload
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Define PropTypes for the component
AddAlbumModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshAlbums: PropTypes.func.isRequired,
};

export default AddAlbumModal;
