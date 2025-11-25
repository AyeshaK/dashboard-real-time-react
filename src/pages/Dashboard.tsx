import { Line, Pie, Bar, Area } from "@ant-design/charts";
import { Card, Col, Row, Spin, Typography } from "antd";
const { Title } = Typography;

import { useDashboardMetricsComputed } from "../api/useDashboard";

const Dashboard = () => {
  const { data, isLoading } = useDashboardMetricsComputed();

  if (isLoading || !data) return <Spin style={{ marginTop: 40 }} />;

  const {
    totalRevenue,
    totalOrders,
    activeUsers,
    salesTrend,
    ordersByStatus,
    topProducts,
    dailyOrders,
    salesByCategory,
  } = data;

  return (
    <>
      <Title level={2}>Dashboard Metrics</Title>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Title level={4}>Total Revenue</Title>
            <p>${totalRevenue.toLocaleString()}</p>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Title level={4}>Total Orders</Title>
            <p>{totalOrders}</p>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Title level={4}>Active Users</Title>
            <p>{activeUsers}</p>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card title="Sales Trend">
            <Line
              data={salesTrend}
              xField="month"
              yField="value"
              height={300}
              smooth
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Orders by Status">
            <Pie
              data={ordersByStatus}
              angleField="value"
              colorField="status"
              radius={0.9}
              height={300}
              label={{ type: "inner", offset: "-30%", content: "{value}%" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Top Products">
            <Bar
              data={topProducts}
              xField="sales"
              yField="product"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Daily Orders">
            <Line
              data={dailyOrders}
              xField="day"
              yField="value"
              height={300}
              smooth
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Sales by Category">
            <Pie
              data={salesByCategory}
              angleField="sales"
              colorField="category"
              radius={0.9}
              innerRadius={0.6}
              label={{
                type: "inner",
                offset: "-30%",
                content: "{value}",
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
