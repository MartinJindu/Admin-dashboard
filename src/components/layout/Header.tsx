import { Layout, Space } from "antd";
import CurrentUser from "./CurrentUser";
import { CSSProperties } from "react";

const Header = () => {
  const headerStyle: CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };
  return (
    <Layout.Header>
      <Space align="center" style={headerStyle}>
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
export default Header;
