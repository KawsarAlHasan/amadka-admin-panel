import React, { useState } from "react";
import { API, useGetAllCategories } from "../../api/api";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { Image, message, Modal, Space, Table, Tag, Select, Button } from "antd";
import EditCategory from "./EditCategory";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddCategory from "./AddCategory";

function Categories() {
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const { allCategories, isLoading, isError, error, refetch } =
    useGetAllCategories({ status: statusFilter }); // Fetch categories based on filter

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [categoryData, setCategoryData] = React.useState(null);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

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

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await API.delete(`/category/${id}`);
          message.success("Category deleted successfully!");
          refetch();
        } catch (err) {
          message.error(
            err.response?.data?.error || "Failed to delete category"
          );
        }
      },
    });
  };

  // Status change modal open
  const openStatusModal = (record) => {
    setSelectedCategory(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  // Status update API call
  const handleStatusChange = async () => {
    if (!selectedCategory) return;

    setIsStatusChangeLoading(true);

    try {
      await API.patch(`/category/${selectedCategory.id}`, {
        status: newStatus,
      });
      message.success("Category status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update category status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const columns = [
    {
      title: <span>Category Name</span>,
      dataIndex: "category_name",
      key: "category_name",
      render: (_, record) => (
        <Space size="middle">
          <Image
            className="!w-[50px] !h-[50px] !rounded-full bg-gray-300 p-1"
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
      render: (status, record) => (
        <div className="flex items-center ">
          {status === "Active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">{status}</Tag>
          )}
          <Button
            className="-ml-1"
            title="Status Change"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
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
        <AddCategory refetch={refetch} />

        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: "200px" }}
          placeholder="Filter by Status"
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
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

      {/* Status Change Modal */}
      <Modal
        title="Change Category Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this category:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default Categories;
