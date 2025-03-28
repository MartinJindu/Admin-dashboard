import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import Header from "./Header";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => <ThemedTitleV2 {...titleProps} text="Refine" />}
    >
      {children}
    </ThemedLayoutV2>
  );
};
export default Layout;
