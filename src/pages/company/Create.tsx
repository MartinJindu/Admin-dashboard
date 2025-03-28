import { Form, Input, Modal, Select } from "antd";
import { CompanyList } from "./List";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/SelectOptionWithAvatar";
import { GetFields, GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";

export const Create = () => {
  const go = useGo();

  const goToListPage = () => {
    go({
      to: { resource: "companies", action: "list" },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create", // to create new companies
    defaultVisible: true,
    resource: "companies",
    redirect: false, // to prevent redirect after creating
    mutationMode: "pessimistic", // redirect and UI update is executed only after creating is successfull
    onMutationSuccess: goToListPage, // navigate to company List
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });

  const { selectProps, query } = useSelect<GetFieldsFromList<UsersSelectQuery>>(
    {
      resource: "users",
      optionLabel: "name",
      meta: {
        gqlQuery: USERS_SELECT_QUERY,
      },
    }
  );

  return (
    <CompanyList>
      <Modal
        {...modalProps}
        mask={true}
        onCancel={goToListPage} // navigate back to company list page
        title="Create Company"
        width={512}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Company name"
            name={"name"}
            rules={[{ required: true }]}
          >
            <Input placeholder="Please enter a company name" />
          </Form.Item>

          <Form.Item
            label="Sales owner"
            name={"salesOwnerId"}
            rules={[{ required: true }]}
          >
            <Select
              {...selectProps}
              placeholder="Please select a sales owner"
              options={
                query.data?.data.map((user) => ({
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
        </Form>
      </Modal>
    </CompanyList>
  );
};
