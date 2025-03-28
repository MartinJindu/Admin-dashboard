import { Button, Popover } from "antd";
import CustomAvatar from "../CustomAvatar";
import { useGetIdentity } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";
import { Text } from "../Text";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AccountSettings } from "../AccountSettings";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useGetIdentity<User>(); // from authProvider

  // content for the popover
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Text strong style={{ padding: "12px 20px" }}>
        {user?.name}
      </Text>

      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setIsOpen(true)}
        >
          Account Settings
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger={["click"]}
        styles={{ body: { padding: 0 }, root: { zIndex: 999 } }}
        style={{ padding: 0 }}
        content={content}
      >
        <CustomAvatar
          name={user?.name}
          src={user?.avatarUrl}
          size={"default"}
          style={{ cursor: "pointer" }}
        />
      </Popover>

      {/* Account Settings Modal */}
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={user.id}
        />
      )}
    </>
  );
};
export default CurrentUser;
