// import { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   Upload,
//   Button,
//   message,
//   List,
//   Avatar,
// } from "antd";
// import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import PropTypes from "prop-types";
// import debounce from "lodash/debounce";
// import { getUserIdFromToken } from "../../utils/auth";

// const { Option } = Select;

// const AddAlbumModal = ({ visible, onClose, refreshAlbums }) => {
//   const [form] = Form.useForm();
//   const [songs, setSongs] = useState([]);
//   const [songsInAlbum, setSongsInAlbum] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fileList, setFileList] = useState([]);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const userId = getUserIdFromToken();

//   useEffect(() => {
//     if (visible) {
//       // Fetch all songs by user ID when the modal is opened
//       axios
//         .get(`${API_URL}song/GetAllByUserId/${userId}`)
//         .then((response) => setSongs(response.data))
//         .catch(() => message.error("Failed to load songs"));
//     }
//   }, [visible, API_URL, userId]);

//   // Debounced search function
//   const searchSongs = debounce((search) => {
//     axios
//       .get(`${API_URL}song/search/${search}`)
//       .then((response) => setSongs(response.data))
//       .catch(() => message.error("Failed to search songs"));
//   }, 300);

//   const handleSongSearch = (value) => {
//     if (value) {
//       searchSongs(value);
//     } else {
//       // Load all songs by user ID if the input is cleared
//       axios
//         .get(`${API_URL}song/GetAllByUserId/${userId}`)
//         .then((response) => setSongs(response.data))
//         .catch(() => message.error("Failed to load songs"));
//     }
//   };

//   const handleAddSongToAlbum = (song) => {
//     if (!songsInAlbum.find((s) => s.id === song.id)) {
//       setSongsInAlbum([...songsInAlbum, song]);
//     }
//   };

//   const handleRemoveSongFromAlbum = (songId) => {
//     setSongsInAlbum(songsInAlbum.filter((song) => song.id !== songId));
//   };

//   const handleOk = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();
//       formData.append("name", values.name);
//       songsInAlbum.forEach((song) => {
//         formData.append("songIds[]", song.id);
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append("image", fileList[0].originFileObj);
//       }

//       await axios.post(`${API_URL}album`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       message.success("Album created successfully.");
//       onClose();
//       refreshAlbums();
//     } catch (error) {
//       message.error("Failed to create the album");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Add Album"
//       okText="Save"
//       onCancel={onClose}
//       onOk={handleOk}
//       confirmLoading={loading}
//       afterClose={() => form.resetFields()}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="name"
//           label="Album Name"
//           rules={[{ required: true, message: "Please enter the album name" }]}
//         >
//           <Input placeholder="Enter album name" />
//         </Form.Item>

//         <Form.Item
//           name="songs"
//           label="Songs"
//           rules={[
//             { required: true, message: "Please select at least one song" },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Search songs to add"
//             onDropdownVisibleChange={() => {
//               axios
//                 .get(`${API_URL}song/GetAllByUserId/${userId}`)
//                 .then((response) => setSongs(response.data))
//                 .catch(() => message.error("Failed to load songs"));
//             }}
//             onSearch={handleSongSearch}
//             filterOption={false} // Disable built-in filtering to use custom search
//             showSearch
//             allowClear
//           >
//             {songs.map((song) => (
//               <Option
//                 key={song.id}
//                 value={song.id}
//                 disabled={songsInAlbum.some((s) => s.id === song.id)}
//                 onClick={() => handleAddSongToAlbum(song)}
//               >
//                 {song.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Current Songs in Album">
//           <List
//             dataSource={songsInAlbum}
//             renderItem={(item) => (
//               <List.Item
//                 key={item.id}
//                 actions={[
//                   <Button
//                     key="delete"
//                     type="text"
//                     icon={<DeleteOutlined />}
//                     onClick={() => handleRemoveSongFromAlbum(item.id)}
//                   />,
//                 ]}
//               >
//                 <List.Item.Meta
//                   avatar={<Avatar src={item.image} />}
//                   title={item.name}
//                 />
//               </List.Item>
//             )}
//           />
//         </Form.Item>

//         <Form.Item
//           name="upload"
//           label="Upload Album Image"
//           valuePropName="file"
//           extra="Upload a new image for the album"
//         >
//           <Upload
//             listType="picture"
//             maxCount={1}
//             fileList={fileList}
//             onRemove={() => setFileList([])}
//             beforeUpload={() => false} // Prevent auto-upload
//             onChange={handleChange}
//           >
//             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// // Define PropTypes for the component
// AddAlbumModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   refreshAlbums: PropTypes.func.isRequired,
// };

// export default AddAlbumModal;

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
  const [fileList, setFileList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (visible) {
      fetchUserSongs("");
    }
  }, [visible, API_URL, userId]);

  const fetchUserSongs = debounce((search) => {
    axios
      .get(`${API_URL}song/GetAllByUserId/${userId}?search=${search}`)
      .then((response) => setSongs(response.data))
      .catch(() => message.error("Failed to load songs"));
  }, 300);

  const handleSongSearch = (value) => {
    setSearchValue(value);
    fetchUserSongs(value);
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
        description: `Added successfully.`,
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
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchUserSongs("");
              }
            }}
            value={searchValue}
            filterOption={false}
            showSearch
            allowClear
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
