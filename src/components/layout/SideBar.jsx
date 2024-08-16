import { Flex, Menu } from "antd";
import { FaLeaf } from "react-icons/fa";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { IoAlbumsOutline } from "react-icons/io5";
import { BiAlbum } from "react-icons/bi";
import { SlLogout } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const item = [
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

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = location.pathname.includes("song")
    ? "2"
    : location.pathname.includes("album")
    ? "3"
    : location.pathname.includes("profile")
    ? "5"
    : "1"; // Default to "Home"

  const handleLogout = () => {
    // Remove the token from cookies
    Cookies.remove("token");

    // Redirect to login page
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
        items={item.map((menuItem) =>
          menuItem.key === "6"
            ? { ...menuItem, onClick: handleLogout }
            : menuItem
        )}
      ></Menu>
    </>
  );
};

export default SideBar;
