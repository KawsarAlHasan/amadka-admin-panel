import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Avatar,
  Modal,
  notification,
  Button,
  Select,
  message,
} from "antd";
import { MdBlock } from "react-icons/md";
import { useAllUsers } from "../../services/userService";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import {
  EyeOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ViewAnswerModal from "./ViewAnswerModal";
import { useGetAllUsers } from "../../api/api";
// import UserDetailsModal from "./UserDetailsModal";

const { confirm } = Modal;

function UserManagement() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  const [blockLoading, setBlockLoading] = useState(false);

  const { allUsers, pagination, isLoading, isError, error, refetch } =
    useGetAllUsers(filter);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const showBlockConfirm = (id) => {
    confirm({
      title: "Are you sure you want to block this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Blocked users will lose access to the platform",
      okText: "Yes, Block",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleBlock(id);
      },
    });
  };

  const handleBlock = async (id) => {
    setBlockLoading(true);
    try {
      // API call to block user would go here
      // await blockUserAPI(id);
      openNotification("success", "Success", "User blocked successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to block user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
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
      // await API.patch(`/user/${selectedCategory.id}`, {
      //   status: newStatus,
      // });
      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedCategory(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update user status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => {
        return <span>#{(filter.page - 1) * filter.limit + (index + 1)}</span>;
      },
    },
    {
      title: <span>User</span>,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size="middle">
          <Avatar className="w-[40px] h-[40px]" src={record.profilePic} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span>{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span>{phone || "N/A"}</span>,
    },
    {
      title: <span>Currency</span>,
      dataIndex: "currency",
      key: "currency",
      render: (currency) => <span>{currency || "N/A"}</span>,
    },
    {
      title: <span>Agents</span>,
      dataIndex: "agent",
      key: "agent",
      render: (agent) => (
        <>
          {" "}
          {agent?.agent_name ? (
            <Space size="middle">
              <Avatar className="w-[30px] h-[30px]" src={agent?.agent_image} />
              <span>{agent?.agent_name}</span>
            </Space>
          ) : (
            "N/A"
          )}{" "}
        </>
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
      render: (_, record) => (
        <Space size="middle">
          {/* <EyeOutlined
            onClick={() => handleUserDetails(record)}
            className="text-[23px] text-blue-400 hover:text-blue-300 cursor-pointer"
          /> */}
          <MdBlock
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => showBlockConfirm(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={allUsers}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalUser,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change User Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this User:</p>
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

export default UserManagement;
