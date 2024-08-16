import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import Search from "antd/es/transfer/search";

const CustomHeader = () => {
  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        aksdfkasjfk
      </Typography.Title>
      <Flex align="center" gap="3rem">
        <Search placeholder="What you wanna search?" alowClear />
        <Flex align="center" gap="10rem">
          <Avatar icon={<UserOutlined />} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CustomHeader;
