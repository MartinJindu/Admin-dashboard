import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { Edit, useForm } from "@refinedev/antd";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import CustomAvatar from "@/components/CustomAvatar";
import { getNameInitials } from "@/utilities";
import SelectOptionWithAvatar from "@/components/SelectOptionWithAvatar";
import { useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from "@/constants/Index";
import { CompanyContactsTable } from "./ContactTable";

export const EditPage = () => {
  const { saveButtonProps, formProps, formLoading, query } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  //
  const { avatarUrl, name } = query?.data?.data || {};

  const { selectProps, query: queryResultUsers } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{ width: 96, height: 96, marginBottom: "24px" }}
              />

              {/* <Form.Item
                label="Company name"
                name={"name"}
                rules={[{ required: true }]}
              >
                <Input placeholder="Please enter a company name" />
              </Form.Item> */}

              <Form.Item
                label="Sales owner"
                name={"salesOwnerId"}
                initialValue={formProps?.initialValues?.salesOwner.id}
              >
                <Select
                  {...selectProps}
                  placeholder="Please select a sales owner"
                  options={
                    queryResultUsers.data?.data.map((user) => ({
                      value: user.id,
                      label: (
                        <SelectOptionWithAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl ?? undefined}
                        />
                      ),
                    })) ?? []
                  }
                />
              </Form.Item>

              <Form.Item>
                <Select options={companySizeOptions} />
              </Form.Item>

              <Form.Item>
                <InputNumber
                  autoFocus
                  addonBefore="$"
                  min={0}
                  placeholder="0.00"
                />
              </Form.Item>

              <Form.Item label="Industry">
                <Select options={industryOptions} />
              </Form.Item>

              <Form.Item label="Business Type">
                <Select options={businessTypeOptions} />
              </Form.Item>

              <Form.Item label="Country" name={"country"}>
                <Input placeholder="Country" />
              </Form.Item>

              <Form.Item label="Business Type" name={"website"}>
                <Input placeholder="Website" />
              </Form.Item>
            </Form>
          </Edit>
        </Col>

        <Col xs={24} xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
};
