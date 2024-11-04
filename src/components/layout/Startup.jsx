import { Flex } from "antd";
import Banner from "./Banner";
import SongList from "../SongList";
import ChartSection from "./ChartSection.";

const Startup = () => {
  return (
    <div style={{ flex: 1 }}>
      <Flex vertical gap="2.5rem">
        <Banner />
        <ChartSection/>
        <SongList />
      </Flex>
    </div>
  );
};

export default Startup;
