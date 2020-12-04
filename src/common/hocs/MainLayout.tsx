import React, { ReactElement } from "react";
import { Layout } from "antd";

const { Content } = Layout;
// const { SubMenu } = Menu;

interface IProps {
  children: ReactElement;
}

export default function MainLayout(props: IProps) {
  const { children } = props;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content className="main-content">
          <div
            className="site-layout-background"
            style={{ padding: 10, minHeight: "100vh" }}
          >
            {children}
          </div>
        </Content>
        <footer
          style={{
            textAlign: "center",
            backgroundColor: "#111",
            color: "#fff",
            padding: 5,
          }}
        >
          <p>Ram4GB-SGU</p>
        </footer>
      </Layout>
    </Layout>
  );
}
