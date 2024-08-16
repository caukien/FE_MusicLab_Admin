import { Flex } from "antd";
import Banner from "./Banner";
import SongList from "../SongList";

const Startup = () => {
  return (
    <div style={{ flex: 1 }}>
      <Flex vertical gap="2.5rem">
        <Banner />
        <SongList />
      </Flex>
    </div>
  );
};

export default Startup;
