import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import Search from "antd/es/transfer/search";
import { getUserNameFromToken } from "../../utils/auth";

const CustomHeader = () => {
  const userName = getUserNameFromToken();
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour >= 6 && currentHour < 12) {
    greeting = `Good morning${userName ? `, ${userName}` : ""}!`;
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = `Good afternoon${userName ? `, ${userName}` : ""}!`;
  } else {
    greeting = `Good evening${userName ? `, ${userName}` : ""}!`;
  }
  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        {greeting}
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
