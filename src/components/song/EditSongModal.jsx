// import { useState, useEffect } from "react";
// import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import PropTypes from "prop-types";
// import debounce from "lodash/debounce";

// const { Option } = Select;

// const EditSongModal = ({ visible, onClose, songData, refreshSongs }) => {
//   const [form] = Form.useForm();
//   const [genres, setGenres] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const { id } = useParams(); // Get the song ID from the route
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch genres when the modal is opened
//     if (visible) {
//       axios
//         .get("https://localhost:5001/api/genre")
//         .then((response) => setGenres(response.data))
//         .catch(() => message.error("Failed to load genres"));
//     }
//   }, [visible]);

//   useEffect(() => {
//     // Set form values with the current song data when the modal is opened
//     if (songData) {
//       form.setFieldsValue({
//         name: songData.name,
//         genres: songData.genreIds,
//       });
//     }
//   }, [songData, form]);

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("genreIds", values.genres);

//       if (values.upload && values.upload.file) {
//         formData.append("image", values.upload.file.originFileObj);
//       }

//       await axios.put(`https://localhost:5001/api/song/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       message.success("Song updated successfully");
//       onClose();
//       refreshSongs();
//     } catch (error) {
//       message.error("Failed to update the song");
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Edit Song"
//       okText="Update"
//       onCancel={onClose}
//       onOk={handleOk}
//       afterClose={() => form.resetFields()}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="name"
//           label="Song Name"
//           rules={[{ required: true, message: "Please enter the song name" }]}
//         >
//           <Input placeholder="Enter song name" />
//         </Form.Item>

//         <Form.Item
//           name="genres"
//           label="Genres"
//           rules={[
//             { required: true, message: "Please select at least one genre" },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Select genres"
//             onDropdownVisibleChange={() => {
//               axios
//                 .get("https://localhost:5001/api/genre")
//                 .then((response) => setGenres(response.data))
//                 .catch(() => message.error("Failed to load genres"));
//             }}
//           >
//             {genres.map((genre) => (
//               <Option key={genre.id} value={genre.id}>
//                 {genre.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="upload"
//           label="Upload Song Image"
//           valuePropName="file"
//           extra="Upload a new image to replace the current one"
//         >
//           <Upload
//             listType="picture"
//             maxCount={1}
//             beforeUpload={() => false} // Prevent auto-upload
//             onChange={(info) => {
//               if (info.file.status === "uploading") {
//                 setUploading(true);
//               } else {
//                 setUploading(false);
//               }
//             }}
//           >
//             <Button icon={<UploadOutlined />} loading={uploading}>
//               Click to Upload
//             </Button>
//           </Upload>
//         </Form.Item>

//         {songData && songData.image && (
//           <Form.Item label="Current Image">
//             <img
//               src={songData.image}
//               alt="Current song"
//               style={{ width: "100px" }}
//             />
//           </Form.Item>
//         )}
//       </Form>
//     </Modal>
//   );
// };

// // Define PropTypes for the component
// EditSongModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   songData: PropTypes.object,
//   refreshSongs: PropTypes.func.isRequired,
// };

// // Default props
// EditSongModal.defaultProps = {
//   songData: null,
// };

// export default EditSongModal;

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
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";

const { Option } = Select;

const EditSongModal = ({
  visible,
  onClose,
  songData,
  refreshSongs,
  songId,
}) => {
  const [form] = Form.useForm();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [audioFileList, setAudioFileList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Set form values with the current song data when the modal is opened
    if (songData) {
      form.setFieldsValue({
        name: songData.name,
        genres: songData.genreIds, // Set the existing genres
      });
    }
  }, [songData, form]);

  useEffect(() => {
    // Fetch all genres when the modal is opened
    if (visible) {
      axios
        .get(`${API_URL}genre`)
        .then((response) => setGenres(response.data))
        .catch(() => message.error("Failed to load genres"));
    }
  }, [visible, API_URL]);

  // Debounced search function
  const searchGenres = debounce((search) => {
    axios
      .get(`${API_URL}genre/search/${search}`)
      .then((response) => setGenres(response.data))
      .catch(() => message.error("Failed to search genres"));
  }, 300);

  const handleGenreSearch = (value) => {
    if (value) {
      searchGenres(value);
    } else {
      // Load all genres if the input is cleared
      axios
        .get(`${API_URL}genre`)
        .then((response) => setGenres(response.data))
        .catch(() => message.error("Failed to load genres"));
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      // formData.append("genreIds", values.genres);
      values.genres.forEach((genreId) => {
        formData.append("genreIds[]", genreId);
      });

      // if (values.upload && values.upload.file) {
      //   formData.append("image", values.upload.file.originFileObj);
      // }
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (audioFileList.length > 0) {
        formData.append("link", audioFileList[0].originFileObj);
      }

      await axios.put(`${API_URL}song/${songId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notification.success({
        message: "Success",
        description: `Updated successfully.`,
      });
      onClose();
      refreshSongs();
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

  const handleAudioChange = ({ fileList: newFileList }) => {
    setAudioFileList(newFileList);
  };

  return (
    <Modal
      visible={visible}
      title="Edit Song"
      okText="Save"
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Song Name"
          rules={[{ required: true, message: "Please enter the song name" }]}
        >
          <Input placeholder="Enter song name" />
        </Form.Item>

        <Form.Item
          name="genres"
          label="Genres"
          rules={[
            { required: true, message: "Please select at least one genre" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select genres"
            onDropdownVisibleChange={() => {
              axios
                .get(`${API_URL}genre`)
                .then((response) => setGenres(response.data))
                .catch(() => message.error("Failed to load genres"));
            }}
            onSearch={handleGenreSearch}
            filterOption={false} // Disable built-in filtering to use custom search
            showSearch
            allowClear
          >
            {genres.map((genre) => (
              <Option key={genre.id} value={genre.id}>
                {genre.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Song Image"
          valuePropName="file"
          // getValueFromEvent={(e) => (Array.isArray(e) ? e : e.fileList)}
          extra="Upload a new image to replace the current one"
          rules={[
            {
              required: true,
              message: "Please select a image",
            },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onRemove={() => setFileList([])}
            // valuePropName="file"
            onChange={handleChange}
            // onChange={(info) => {
            //   if (info.file.status === "uploading") {
            //     setUploading(true);
            //   } else {
            //     setUploading(false);
            //   }
            // }}
            beforeUpload={(file) => {
              const isImage =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/jpg";
              if (!isImage) {
                message.error("Only JPG or PNG images are allowed");
                return Upload.LIST_IGNORE; // Bỏ qua file này
              }
              if (file.size > 3 * 1024 * 1024) {
                message.error("Image must be smaller than 3MB");
                return Upload.LIST_IGNORE; // Bỏ qua file này
              }
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {songData && songData.image && (
          <Form.Item label="Current Image">
            <Image
              src={songData.image}
              alt="Current song"
              style={{ width: "100px" }}
            />
          </Form.Item>
        )}

        <Form.Item
          name="audio"
          label="Audio file"
          valuePropName="file"
          rules={[
            {
              required: true,
              message: "Select a audio file",
            },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            fileList={audioFileList}
            onRemove={() => setAudioFileList([])}
            onChange={handleAudioChange}
            beforeUpload={(file) => {
              const isAudio = file.type === "audio/mpeg";

              if (!isAudio) {
                message.error("Only MP3 or M4A audio files are allowed");
                return Upload.LIST_IGNORE;
              }

              // Kiểm tra kích thước file
              if (file.size > 5 * 1024 * 1024) {
                message.error("File must be smaller than 5MB");
                return Upload.LIST_IGNORE;
              }

              return false; // Chặn tự động upload
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload Audio</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Define PropTypes for the component
EditSongModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  songData: PropTypes.object,
  refreshSongs: PropTypes.func.isRequired,
  songId: PropTypes.string.isRequired,
};

// Default props
EditSongModal.defaultProps = {
  songData: null,
};

export default EditSongModal;
