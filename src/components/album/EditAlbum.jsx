// import { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   Upload,
//   Button,
//   message,
//   Image,
//   notification,
//   List,
//   Avatar,
// } from "antd";
// import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import PropTypes from "prop-types";
// import debounce from "lodash/debounce";
// import { getUserIdFromToken } from "../../utils/auth";

// const { Option } = Select;

// const EditAlbumModal = ({
//   visible,
//   onClose,
//   albumData,
//   refreshAlbums,
//   albumId,
// }) => {
//   const [form] = Form.useForm();
//   const [allSongs, setAllSongs] = useState([]);
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fileList, setFileList] = useState([]);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const userId = getUserIdFromToken();

//   useEffect(() => {
//     // Set form values with the current album data when the modal is opened
//     if (albumData) {
//       form.setFieldsValue({
//         name: albumData.name,
//       });
//       setSelectedSongs(albumData.songs.map((song) => song.id));
//     }
//   }, [albumData, form]);

//   useEffect(() => {
//     // Fetch all songs by userId when the modal is opened
//     if (visible) {
//       axios
//         .get(`${API_URL}song/GetAllByUserId/${userId}`)
//         .then((response) => setAllSongs(response.data))
//         .catch(() => message.error("Failed to load songs"));
//     }
//   }, [visible, API_URL, userId]);

//   const handleSongSearch = debounce((search) => {
//     axios
//       .get(`${API_URL}song/search/${search}`)
//       .then((response) => setAllSongs(response.data))
//       .catch(() => message.error("Failed to search songs"));
//   }, 300);

//   const handleOk = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();
//       formData.append("name", values.name);
//       values.songs.forEach((songId) => {
//         formData.append("songIds[]", songId);
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append("image", fileList[0].originFileObj);
//       }

//       await axios.put(`${API_URL}album/${albumId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       notification.success({
//         message: "Success",
//         description: `Album updated successfully.`,
//       });
//       onClose();
//       refreshAlbums();
//     } catch (error) {
//       notification.error({
//         message: "Error",
//         description: "Failed to update the album",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   const removeSongFromAlbum = (songId) => {
//     setSelectedSongs((prevSongs) => prevSongs.filter((id) => id !== songId));
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Edit Album"
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
//             placeholder="Search and select songs"
//             onSearch={handleSongSearch}
//             filterOption={false}
//             allowClear
//           >
//             {allSongs.map((song) => (
//               <Option
//                 key={song.id}
//                 value={song.id}
//                 disabled={selectedSongs.includes(song.id)}
//               >
//                 {song.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="upload"
//           label="Upload Album Image"
//           extra="Upload a new image to replace the current one"
//         >
//           <Upload
//             listType="picture"
//             maxCount={1}
//             fileList={fileList}
//             onRemove={() => setFileList([])}
//             beforeUpload={() => false}
//             onChange={handleChange}
//           >
//             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//           </Upload>
//         </Form.Item>

//         {albumData && albumData.image && (
//           <Form.Item label="Current Image">
//             <Image
//               src={albumData.image}
//               alt="Current album"
//               style={{ width: "100px" }}
//             />
//           </Form.Item>
//         )}

//         <List
//           dataSource={albumData?.songs || []}
//           renderItem={(song) => (
//             <List.Item
//               key={song.id}
//               // actions={[
//               //   <Button
//               //     key={`remove-${song.id}`}
//               //     icon={<DeleteOutlined />}
//               //     onClick={() => removeSongFromAlbum(song.id)}
//               //     danger
//               //     type="text"
//               //   />,
//               // ]}
//             >
//               <List.Item.Meta
//                 avatar={<Avatar src={song.image} />}
//                 title={song.name}
//               />
//             </List.Item>
//           )}
//         />
//       </Form>
//     </Modal>
//   );
// };

// EditAlbumModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   albumData: PropTypes.object,
//   refreshAlbums: PropTypes.func.isRequired,
//   albumId: PropTypes.string.isRequired,
// };

// export default EditAlbumModal;

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Image,
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

const EditAlbumModal = ({
  visible,
  onClose,
  albumData,
  refreshAlbums,
  albumId,
}) => {
  const [form] = Form.useForm();
  const [songs, setSongs] = useState([]);
  const [songsInAlbum, setSongsInAlbum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (albumData) {
      form.setFieldsValue({
        name: albumData.name,
        // other fields if needed
      });

      // Set the existing songs in the album
      setSongsInAlbum(albumData.songs);
    }
  }, [albumData, form]);

  const fetchUserSongs = debounce((search) => {
    axios
      .get(`${API_URL}song/GetAllByUserId/${userId}?search=${search}`)
      .then((response) => setSongs(response.data))
      .catch(() => message.error("Failed to load songs"));
  }, 300);

  const handleSongSearch = (value) => {
    fetchUserSongs(value);
  };

  const handleAddSongToAlbum = (song) => {
    if (!songsInAlbum.find((s) => s.id === song.id)) {
      setSongsInAlbum((prev) => [...prev, song]);
    }
  };

  const handleRemoveSongFromAlbum = (songId) => {
    setSongsInAlbum((prev) => prev.filter((song) => song.id !== songId));
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      songsInAlbum.forEach((song) => {
        formData.append("songIds[]", song.id);
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.put(`${API_URL}album/${albumId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notification.success({
        message: "Success",
        description: `Updated successfully.`,
      });
      onClose();
      refreshAlbums();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update the song",
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
      title="Edit Album"
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

        <Form.Item label="Search and Add Songs">
          <Select
            showSearch
            placeholder="Search for songs to add"
            onSearch={handleSongSearch}
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchUserSongs("");
              }
            }}
            onSelect={(value) => {
              const selectedSong = songs.find((song) => song.id === value);
              handleAddSongToAlbum(selectedSong);
            }}
            filterOption={false}
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

        <Form.Item label="Songs in Album">
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
          extra="Upload a new image to replace the current one"
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

        {albumData && albumData.image && (
          <Form.Item label="Current Image">
            <Image
              src={albumData.image}
              alt="Current album"
              style={{ width: "100px" }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

// Define PropTypes for the component
EditAlbumModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  albumData: PropTypes.object,
  refreshAlbums: PropTypes.func.isRequired,
  albumId: PropTypes.string.isRequired,
};

export default EditAlbumModal;
