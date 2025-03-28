import {
  DashboardLatestActivities,
  DashboardTotalCountCard,
  DealsChart,
  UpcomingDashEvent,
} from "@/components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { DashboardTotalCountsQuery } from "@/graphql/types";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";

export const Home = () => {
  const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
    },
  });

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            isLoading={isLoading}
            totalCount={data?.data?.companies.totalCount}
            resource="companies"
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            isLoading={isLoading}
            totalCount={data?.data?.contacts.totalCount}
            resource="contacts"
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            isLoading={isLoading}
            totalCount={data?.data?.deals.totalCount}
            resource="deals"
          />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <UpcomingDashEvent />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DealsChart />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <DashboardLatestActivities />
        </Col>
      </Row>
    </div>
  );
};
