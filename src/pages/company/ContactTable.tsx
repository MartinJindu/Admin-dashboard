import { FilterDropdown, useTable } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";

import type { CompanyContactsTableQuery } from "@/graphql/types";

import { Text } from "@/components/Text";
import CustomAvatar from "@/components/CustomAvatar";
import { ContactStatusTag } from "@/components/tags/ContactStatusTag";
import { COMPANY_CONTACTS_TABLE_QUERY } from "@/graphql/queries";
import { useParams } from "react-router";
import { statusOptions } from "@/constants/Index";

type Contact = GetFieldsFromList<CompanyContactsTableQuery>;

export const CompanyContactsTable = () => {
  const params = useParams(); // get params from the url

  const { tableProps } = useTable<Contact>({
    resource: "contacts",
    syncWithLocation: false,
    // specify initial sorters
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    // specify initial filters
    filters: {
      initial: [
        {
          field: "jobTitle",
          value: "",
          operator: "contains",
        },
        {
          field: "name",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: params?.id as string,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
    },
  });

  return (
    <Card
      styles={{
        body: { padding: 0 },
        header: { borderBottom: "1px solid #d9d9d9" },
      }}
      title={
        <Space size="middle">
          <TeamOutlined />
          <Text>Contacts</Text>
        </Space>
      }
      // property used to render additional content in the top-right corner of the card
      extra={
        <>
          <Text className="tertiary">Total contacts: </Text>
          <Text strong>
            {/* if pagination is not disabled and total is provided then show the total */}
            {tableProps?.pagination !== false && tableProps.pagination?.total}
          </Text>
        </>
      }
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: false, // hide the page size changer
        }}
      >
        <Table.Column<Contact>
          title="Name"
          dataIndex="name"
          render={(_, record) => {
            return (
              <Space>
                <CustomAvatar name={record.name} src={record.avatarUrl} />
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </Text>
              </Space>
            );
          }}
          filterIcon={<SearchOutlined />}
          // render the filter dropdown
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Name" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Title"
          dataIndex="jobTitle"
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Title" />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          title="Stage"
          dataIndex="status"
          // render the status tag for each contact
          render={(_, record) => {
            return <ContactStatusTag status={record.status} />;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "200px" }}
                mode="multiple" // allow multiple selection
                placeholder="Select Stage"
                options={statusOptions}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          dataIndex="id"
          width={112}
          render={(value, record) => {
            return (
              <Space>
                <Button
                  size="small"
                  href={`mailto:${record.email}`}
                  icon={<MailOutlined />}
                />
                <Button
                  size="small"
                  href={`tel:${record.phone}`}
                  icon={<PhoneOutlined />}
                />
              </Space>
            );
          }}
        />
      </Table>
    </Card>
  );
};
