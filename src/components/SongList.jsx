import { Button, Flex, Typography, Card } from "antd";

import songData from "../../fakedata";
import { Link } from "react-router-dom";
const { Meta } = Card;
const SongList = () => {
  return (
    <div>
      <Flex align="center" justify="space-between" gap="large">
        {/* your song */}
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
            {songData.map((song) => (
              <Card
                key={song.id}
                className="plant-card"
                hoverable
                cover={<img alt="example" src={song.image} />}
              >
                <Meta title={song.name} description={song.des} />
              </Card>
            ))}
          </Flex>
        </Flex>

        {/* your album */}
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
            {songData.map((song) => (
              <Card
                key={song.id}
                className="plant-card"
                hoverable
                cover={<img alt="example" src={song.image} />}
              >
                <Meta title={song.name} description={song.des} />
              </Card>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default SongList;
