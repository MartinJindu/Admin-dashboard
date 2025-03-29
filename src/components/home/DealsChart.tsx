import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../Text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
import { mapDealsData } from "@/utilities/helpers";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

const DealsChart = () => {
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"],
      },
    ],
    meta: { gqlQuery: DASHBOARD_DEALS_CHART_QUERY },
  });

  // to memoize the data
  const dealData = useMemo(() => {
    return mapDealsData(data?.data);
  }, [data?.data]);

  const won = "l(270) 0:#ffffff 0.5:#b7eb8f 1:#52c41a";
  const lost = "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f";

  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    stack: false,
    seriesField: "state",
    shapeField: "smooth",
    colorField: "state",
    tooltip: {
      channel: "y",
      valueFormatter: "~s",
    },

    axis: {
      x: { title: "Date" },
      y: {
        labelFormatter: "~s",
      },
    },
    area: {
      shapeField: "smooth",
      style: {
        fillOpacity: 0.2,
      },
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        body: { padding: "24px 24px 0 24px" },
        header: { padding: "8px 16px" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
};
export default DealsChart;
