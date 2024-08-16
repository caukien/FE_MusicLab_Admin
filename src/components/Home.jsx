import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, isTokenExpired, removeToken } from "../utils/auth";
// import axios from "axios";
import { Flex } from "antd";
import "../../src/App.css";
import Startup from "./layout/Startup";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();

    if (!token || isTokenExpired()) {
      removeToken();
      navigate("/login");
      return;
    }

    // const userId = getUserIdFromToken();
    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // // Lấy danh sách bài hát của người dùng
    // axios
    //   .get(`https://localhost:5001/api/songs?userId=${userId}`)
    //   .then((response) => {
    //     setSongs(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch songs:", error);
    //   });
  }, [navigate]);

  return (
    <Flex gap="large">
      <Startup />
    </Flex>
  );
};

export default Home;
