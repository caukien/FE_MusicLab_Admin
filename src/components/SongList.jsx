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
        `${API_URL}song/GetAllByUserId/${userId}?PageNumber=1&PageSize=3`
      );
      const albumResponse = await axios.get(
        `${API_URL}album/GetAllByUserId/${userId}?PageNumber=1&PageSize=3`
      );
      setSongs(songResponse.data.songs);
      setAlbums(albumResponse.data.albums);
    } catch (error) {
      message.error("Failed to load songs");
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
    <div>
      {loading ? (
        <div className="!items-center !justify-center flex">
          <Spin size="large" />
        </div>
      ) : (
        <Flex align="center" justify="space-between" gap="large">
          {/* Your Song */}
          <Flex vertical="row" gap="large" className="flex-1">
            <Flex align="center" justify="space-between">
              <Typography.Title level={3} strong className="primary--color">
                Your Song
              </Typography.Title>
              <Button type="link" className="gray--color">
                <Link to="/song">View All</Link>
              </Button>
            </Flex>

            <Flex align="center" gap="small">
              {songs.map((song) => (
                <Card
                  key={song.id}
                  className="plant-card"
                  hoverable
                  cover={<img alt="example" src={song.image} />}
                  onClick={() => navigate(`/song/${song.id}`)}
                >
                  <Meta title={song.name} description={song.des} />
                </Card>
              ))}
            </Flex>
          </Flex>

          {/* Your Album */}
          <Flex vertical="row" gap="large" className="flex-1">
            <Flex align="center" justify="space-between">
              <Typography.Title level={3} strong className="primary--color">
                Your Album
              </Typography.Title>
              <Button type="link" className="gray--color">
                View All
              </Button>
            </Flex>

            <Flex align="center" gap="small">
              {albums.map((album) => (
                <Card
                  key={album.id}
                  className="plant-card"
                  hoverable
                  cover={<img alt="example" src={album.image} />}
                >
                  <Meta title={album.name} description={album.des} />
                </Card>
              ))}
            </Flex>
          </Flex>
        </Flex>
      )}
    </div>
  );
};

export default SongList;
