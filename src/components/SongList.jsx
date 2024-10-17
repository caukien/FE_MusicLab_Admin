// import { Button, Flex, Typography, Card, Spin, message } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   getToken,
//   getUserIdFromToken,
//   hasAccess,
//   isTokenExpired,
// } from "../utils/auth";
// import axios from "axios";
// const { Meta } = Card;

// const API_URL = import.meta.env.VITE_API_URL;

// const SongList = () => {
//   const [songs, setSongs] = useState([]);
//   const [albums, setAlbums] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(getUserIdFromToken());

//   const token = getToken();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || isTokenExpired() || !hasAccess(["admin", "producer"])) {
//       navigate("/login");
//     }
//   }, [navigate, token]);

//   const fetchData = async () => {
//     try {
//       const songResponse = await axios.get(
//         `${API_URL}song/GetAllByUserId/${userId}?PageNumber=1&PageSize=3`
//       );
//       const albumResponse = await axios.get(
//         `${API_URL}album/GetAllByUserId/${userId}?PageNumber=1&PageSize=3`
//       );
//       setSongs(songResponse.data.songs);
//       setAlbums(albumResponse.data.albums);
//     } catch (error) {
//       message.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       setUserId(getUserIdFromToken());
//       fetchData();
//     }
//   }, [userId, token]);
//   return (
//     <div>
//       {loading ? (
//         <div className="!items-center !justify-center flex">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <Flex align="center" justify="space-between" gap="large">
//           {/* Your Song */}
//           <Flex vertical="row" gap="large" className="flex-1">
//             <Flex align="center" justify="space-between">
//               <Typography.Title level={3} strong className="primary--color">
//                 Your Song
//               </Typography.Title>
//               <Button type="link" className="gray--color">
//                 <Link to="/song">View All</Link>
//               </Button>
//             </Flex>

//             <Flex align="center" gap="small">
//               {songs.map((song) => (
//                 <Card
//                   key={song.id}
//                   className="plant-card"
//                   hoverable
//                   cover={<img alt="example" src={song.image} />}
//                   onClick={() => navigate(`/song/${song.id}`)}
//                 >
//                   <Meta title={song.name} description={song.des} />
//                 </Card>
//               ))}
//             </Flex>
//           </Flex>

//           {/* Your Album */}
//           <Flex vertical="row" gap="large" className="flex-1">
//             <Flex align="center" justify="space-between">
//               <Typography.Title level={3} strong className="primary--color">
//                 Your Album
//               </Typography.Title>
//               <Button type="link" className="gray--color">
//                 View All
//               </Button>
//             </Flex>

//             <Flex align="center" gap="small">
//               {albums.map((album) => (
//                 <Card
//                   key={album.id}
//                   className="plant-card"
//                   hoverable
//                   cover={<img alt="example" src={album.image} />}
//                 >
//                   <Meta title={album.name} description={album.des} />
//                 </Card>
//               ))}
//             </Flex>
//           </Flex>
//         </Flex>
//       )}
//     </div>
//   );
// };

// export default SongList;

import { Button, Flex, Typography, Card, Spin, message, Carousel } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getToken,
  getUserIdFromToken,
  hasAccess,
  isTokenExpired,
} from "../utils/auth";
import axios from "axios";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Meta } = Card;

const API_URL = import.meta.env.VITE_API_URL;

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(getUserIdFromToken());

  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired() || !hasAccess(["admin", "producer"])) {
      navigate("/login");
    }
  }, [navigate, token]);

  const fetchData = async () => {
    try {
      const songResponse = await axios.get(
        `${API_URL}song/GetAllByUserId/${userId}?PageNumber=1&PageSize=5`
      );
      const albumResponse = await axios.get(
        `${API_URL}album/GetAllByUserId/${userId}?PageNumber=1&PageSize=5`
      );
      setSongs(songResponse.data.songs);
      setAlbums(albumResponse.data.albums);
    } catch (error) {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setUserId(getUserIdFromToken());
      fetchData();
    }
  }, [userId, token]);

  const CarouselArrow = ({ type, onClick }) => (
    <Button
      shape="circle"
      icon={type === "prev" ? <LeftOutlined /> : <RightOutlined />}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
      className={type === "prev" ? "left-1" : "right-1"}
    />
  );

  const renderCarousel = (items, title, viewAllLink) => (
    // <div className="relative">
    <Carousel
      arrows
      prevArrow={<CarouselArrow type="prev" />}
      nextArrow={<CarouselArrow type="next" />}
      slidesToShow={3}
      slidesToScroll={1}
    >
      {items.map((item) => (
        <div key={item.id} className="px-2">
          <Card
            className="plant-card"
            hoverable
            cover={<img alt="example" src={item.image} />}
            onClick={() => navigate(`/${title.toLowerCase()}/${item.id}`)}
          >
            <Meta title={item.name} description={item.des} />
          </Card>
        </div>
      ))}
      <div className="px-2">
        <Card
          className="plant-card flex items-center justify-center"
          hoverable
          onClick={() => navigate(viewAllLink)}
        >
          <Typography.Title level={4}>More</Typography.Title>
        </Card>
      </div>
    </Carousel>
    // </div>
  );

  return (
    <div>
      {loading ? (
        <div className="!items-center !justify-center flex">
          <Spin size="large" />
        </div>
      ) : (
        <Flex vertical gap="large">
          {/* Your Song */}
          <Flex vertical gap="small">
            <Flex align="center" justify="space-between">
              <Typography.Title level={3} strong className="primary--color">
                Your Song
              </Typography.Title>
              <Button type="link" className="gray--color">
                <Link to="/song">View All</Link>
              </Button>
            </Flex>
            {songs && songs.length > 0 ? (
              renderCarousel(songs, "Song", "/song")
            ) : (
              <Typography.Text>Bạn chưa có bài hát nào</Typography.Text>
            )}
          </Flex>

          {/* Your Album */}
          <Flex vertical gap="small">
            <Flex align="center" justify="space-between">
              <Typography.Title level={3} strong className="primary--color">
                Your Album
              </Typography.Title>
              <Button type="link" className="gray--color">
                <Link to="/album">View All</Link>
              </Button>
            </Flex>
            {albums && albums.length > 0 ? (
              renderCarousel(albums, "Album", "/album")
            ) : (
              <Typography.Text>Bạn chưa có album nào</Typography.Text>
            )}
          </Flex>
        </Flex>
      )}
    </div>
  );
};

SongList.propTypes = {
  type: PropTypes.oneOf(["prev", "next"]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SongList;
