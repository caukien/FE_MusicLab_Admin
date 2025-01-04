import { Flex, Menu } from "antd";
import { FaLeaf } from "react-icons/fa";
import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { IoAlbumsOutline } from "react-icons/io5";
import { BiAlbum } from "react-icons/bi";
import { SlLogout } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeToken, hasAccess } from "../../utils/auth";

const getMenuItems = () => {
  if (hasAccess(["admin"])) {
    return [
      {
        key: "1",
        icon: <UserOutlined />,
        label: <Link to="/user">Users</Link>,
      },
      {
        key: "2",
        icon: <IoAlbumsOutline />,
        label: <Link to="/genre">Genre</Link>,
      },
      {
        key: "6",
        icon: <SlLogout />,
        label: "Log-out",
      },
    ];
  }

  return [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/home">Home</Link>,
    },
    {
      key: "2",
      icon: <BiAlbum />,
      label: <Link to="/song">Song</Link>,
    },
    {
      key: "3",
      icon: <IoAlbumsOutline />,
      label: <Link to="/album">Album</Link>,
    },
    {
      key: "5",
      icon: <SettingOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "6",
      icon: <SlLogout />,
      label: "Log-out",
    },
  ];
};

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = getMenuItems();

  const selectedKey = location.pathname.includes("users")
    ? "1"
    : location.pathname.includes("genre")
    ? "2"
    : location.pathname.includes("song")
    ? "2"
    : location.pathname.includes("album")
    ? "3"
    : location.pathname.includes("profile")
    ? "5"
    : "1";

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <FaLeaf />
        </div>
      </Flex>
      <Menu
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        className="menu-bar"
        items={menuItems.map((menuItem) =>
          menuItem.key === "6"
            ? { ...menuItem, onClick: handleLogout }
            : menuItem
        )}
      />
    </>
  );
};

export default SideBar;
