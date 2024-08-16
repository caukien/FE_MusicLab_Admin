import { Outlet } from "react-router-dom";
import { Button, Layout } from "antd";
import { MenuFoldOutlined, MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import SideBar from "./SideBar";
import CustomHeader from "./CustomHeader";

const { Sider, Content, Header } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsed={collapsed}
        className="sider"
      >
        <SideBar />
      </Sider>
      <Button
        type="text"
        icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="trigger-btn"
      />
      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>
        <Content className="content">
          <Outlet /> {/* This will render the matched child route component */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
