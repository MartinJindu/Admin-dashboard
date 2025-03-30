import { totalCountVariants } from "@/constants/Index";
import { Card, Skeleton } from "antd";
import { Text } from "../Text";
import { Area, AreaConfig } from "@ant-design/plots";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount?: number;
};

const DashboardTotalCountCard = ({
  resource,
  isLoading,
  totalCount,
}: Props) => {
  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];

  const config: AreaConfig = {
    data: totalCountVariants[resource].data,
    xField: "index",
    tooltip: false,
    yField: "value",
    shapeField: "smooth",
    autoFit: true,
    axis: {
      y: { label: null, grid: null, line: null, tickCount: null },
      x: false,
    },
    area: {
      shapeField: "smooth",
      style: {
        fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
      },
    },
    line: {
      colorField: primaryColor,
      shapeField: "smooth",
    },
  };

  return (
    <Card
      style={{ height: "auto", padding: 0 }}
      styles={{ body: { padding: "8px 8px 8px 12px" } }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
          ) : (
            totalCount
          )}
        </Text>

        <Area {...config} height={80} width={180} />
      </div>
    </Card>
  );
};
export default DashboardTotalCountCard;
