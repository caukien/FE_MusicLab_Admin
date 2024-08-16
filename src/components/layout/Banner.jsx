import { Button, Card, Flex, Typography } from "antd";

const Banner = () => {
  return (
    <Card style={{ height: 250, padding: "20px" }}>
      <Flex vertical gap="30px">
        <Flex vertical align="flex-start">
          <Typography.Title level={3} strong>
            You have a song? Lets upload now!
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            naskvnaishjfidjiawjefjo
          </Typography.Text>
        </Flex>
        <Flex gap="large">
          <Button type="primary" size="large">
            Upload
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Banner;
