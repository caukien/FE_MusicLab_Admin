import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  notification,
  Spin,
  Flex,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";
import debounce from "lodash/debounce";
import { getUserIdFromToken } from "../../utils/auth";

const { Option } = Select;

const userId = getUserIdFromToken();
const API_URL = import.meta.env.VITE_API_URL;

const AddSong = ({ visible, onClose, refreshSongs }) => {
  const [form] = Form.useForm();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadgenre, setLoadgenre] = useState(false);
  const [fileList, setFileList] = useState([]);

  const fetchGenres = async () => {
    try {
      setLoadgenre(true);
      const response = await axios.get(`${API_URL}genre`);
      setGenres(response.data);
    } catch (error) {
      message.error("Failed to load genres");
    } finally {
      setLoadgenre(false);
    }
  };

  const searchGenres = debounce((search) => {
    axios
      .get(`${API_URL}genre/search/${search}`)
      .then((response) => setGenres(response.data))
      .catch(() => message.error("Failed to search genres"));
  }, 300);

  const handleGenreSearch = (value) => {
    if (value) {
      searchGenres(value);
    } else if (genres.length === 0) {
      //   axios
      //     .get(`${API_URL}genre`)
      //     .then((response) => setGenres(response.data))
      //     .catch(() => message.error("Failed to load genres"));
      fetchGenres();
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("userIds", userId);
      formData.append("name", values.name);
      values.genres.forEach((genreId) => {
        formData.append("genreIds[]", genreId);
      });

      //   if (values.upload && values.upload.file) {
      //     formData.append("image", values.upload.file.originFileObj);
      //   }
      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      await axios.post(`${API_URL}song`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notification.success({
        message: "Success",
        description: `Song Added successfully.`,
      });
      onClose();
      refreshSongs();
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to add the song.`,
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
      title="Add Song"
      okText="Add"
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
            // onDropdownVisibleChange={() => {
            //   axios
            //     .get(`${API_URL}genre`)
            //     .then((response) => setGenres(response.data))
            //     .catch(() => message.error("Failed to load genres"))
            //     .finally(setLoadgenre(false));
            // }}
            onDropdownVisibleChange={fetchGenres}
            onSearch={handleGenreSearch}
            filterOption={false}
            showSearch
            allowClear
          >
            {loadgenre ? (
              <>
                <Flex align="center" justify="center">
                  <Spin indicator={<LoadingOutlined spin />} />
                </Flex>
              </>
            ) : (
              <>
                {genres.map((genre) => (
                  <Option key={genre.id} value={genre.id}>
                    {genre.name}
                  </Option>
                ))}
              </>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Song Image"
          valuePropName="file"
          extra="Upload an image for the song"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent auto-upload
            // onChange={(info) => {
            //   if (info.file.status === "uploading") {
            //     setUploading(true);
            //   } else {
            //     setUploading(false);
            //   }
            // }}
            fileList={fileList}
            onRemove={() => setFileList([])}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddSong.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshSongs: PropTypes.func.isRequired,
};

export default AddSong;
