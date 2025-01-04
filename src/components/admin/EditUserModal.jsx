import { useState, useEffect } from "react";
import { Modal, Select, notification } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL;

const EditUserModal = ({
  visible,
  user,
  onCancel,
  onRoleChange,
  pagination,
}) => {
  const [role, setRole] = useState(user?.role);

  useEffect(() => {
    // Update role when user prop changes
    setRole(user?.role);
  }, [user]);

  const handleRoleChange = async () => {
    try {
      await axios.post(`${API_URL}user/change-role`, {
        userId: user.id,
        newRole: role,
      });

      notification.success({
        message: "Success",
        description: `Role changed successfully for user "${user.username}"`,
      });

      onRoleChange(pagination.current, pagination.pageSize);
      onCancel();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to change user role",
      });
    }
  };

  const handleRoleSelectChange = (value) => {
    setRole(value);
  };

  return (
    <Modal
      title="Edit User Role"
      visible={visible}
      onOk={handleRoleChange}
      onCancel={onCancel}
    >
      {user && (
        <>
          <p>Username: {user.username}</p>
          <p>Name: {user.name || "N/A"}</p>
          <Select
            value={role}
            style={{ width: 120 }}
            onChange={handleRoleSelectChange}
          >
            <Option value="admin">Admin</Option>
            <Option value="producer">Producer</Option>
            <Option value="user">User</Option>
          </Select>
        </>
      )}
    </Modal>
  );
};

EditUserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }).isRequired,
};

export default EditUserModal;
