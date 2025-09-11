import React, { useState } from "react";
import { useGetAllCategories } from "../../api/api";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { Avatar, Image, message, Modal, Space, Table, Tag, Select } from "antd";
import EditCategory from "./EditCategory";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddCategory from "./AddCategory";

function Categories() {
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  const { allCategories, isLoading, isError, error, refetch } =
    useGetAllCategories({ status: statusFilter }); // Fetch categories based on filter

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [categoryData, setCategoryData] = React.useState(null);

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError || error) {
    return <IsError error={error} refetch={refetch} />;
  }

  const handleEdit = (categoryDetail) => {
    setCategoryData(categoryDetail);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setCategoryData(null); // Reset the details
    setIsModalOpen(false); // Close modal
  };

  const showDeleteConfirm = (adminId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          // await API.post(`/admin/administrators/${adminId}/action/`, {
          //   action: "delete",
          // });
          message.success("Admin deleted successfully!");
          // refetch();
        } catch (err) {
          message.error(err.response?.data?.error || "Failed to delete admin");
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Category Name</span>,
      dataIndex: "category_name",
      key: "category_name",
      render: (_, record) => (
        <Space size="middle">
          <Image
            className="!w-[50px] !h-[50px] !rounded-full"
            src={record.category_image}
          />
          <span className="font-bold">{record.category_name}</span>
        </Space>
      ),
    },

    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div>
          {status == "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">{status}</Tag>
          )}{" "}
        </div>
      ),
    },

    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "superadmin";

        return (
          <Space size="middle">
            <EditOutlined
              className={`text-[23px] bg-[#006699] p-1 rounded-sm text-white hover:text-blue-300 cursor-pointer`}
              onClick={() => handleEdit(record)}
            />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record.id)
              }
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* Status filter */}
      <div className="flex justify-between mb-4">
        <AddCategory />

        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: "200px" }}
          placeholder="Filter by Status"
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={allCategories}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <EditCategory
        categoryData={categoryData}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default Categories;
