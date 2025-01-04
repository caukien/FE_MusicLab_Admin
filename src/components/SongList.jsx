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

import { Button, Flex, Typography, Card, Spin, message } from "antd";
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

const CustomCarousel = ({ items, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, items.length - itemsPerPage)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoNext = currentIndex + itemsPerPage < items.length;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="relative">
      <div className="flex gap-4 items-center">
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={prevSlide}
          disabled={!canGoPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
        />

        <div className="flex gap-4 mx-10">
          {visibleItems.map((item) => (
            <Card
              key={item.id}
              className="flex-1"
              hoverable
              cover={<img alt={item.name} src={item.image} />}
              onClick={() => onItemClick(item.id)}
            >
              <Meta
                title={<div style={{ textAlign: "center" }}>{item.name}</div>}
                description={item.des}
              />
            </Card>
          ))}
        </div>

        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={nextSlide}
          disabled={!canGoNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
        />
      </div>
    </div>
  );
};

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(getUserIdFromToken());

  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired() || !hasAccess(["producer"])) {
      navigate("/login");
    }
  }, [navigate, token]);

  const fetchData = async () => {
    try {
      const songResponse = await axios.get(
        `${API_URL}song/GetAllByUserId/${userId}?PageNumber=1&PageSize=10`
      );
      const albumResponse = await axios.get(
        `${API_URL}album/GetAllByUserId/${userId}?PageNumber=1&PageSize=10`
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

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Flex align="start" justify="space-between" gap="large" wrap>
          {/* Your Song */}
          <div style={{ flex: 1 }}>
            <Flex align="center" justify="space-between" className="mb-4">
              <Typography.Title level={3} strong className="primary--color m-0">
                Your Song
              </Typography.Title>
              <Button type="link" className="gray--color">
                <Link to="/song">View All</Link>
              </Button>
            </Flex>
            {songs && songs.length > 0 ? (
              <CustomCarousel
                items={songs}
                onItemClick={(id) => navigate(`/song/${id}`)}
              />
            ) : (
              <Typography.Text>Bạn chưa có bài hát nào</Typography.Text>
            )}
          </div>

          {/* Your Album */}
          <div style={{ flex: 1 }}>
            <Flex align="center" justify="space-between" className="mb-4">
              <Typography.Title level={3} strong className="primary--color m-0">
                Your Album
              </Typography.Title>
              <Button type="link" className="gray--color">
                <Link to="/album">View All</Link>
              </Button>
            </Flex>
            {albums && albums.length > 0 ? (
              <CustomCarousel
                items={albums}
                onItemClick={(id) => navigate(`/album/${id}`)}
              />
            ) : (
              <Typography.Text>Bạn chưa có album nào</Typography.Text>
            )}
          </div>
        </Flex>
      )}
    </div>
  );
};

CustomCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      des: PropTypes.string,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default SongList;
