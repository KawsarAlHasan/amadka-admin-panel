import React, { useState } from "react";
import { Table, Tag, Space, Avatar, Modal, notification } from "antd";
import { MdBlock } from "react-icons/md";
import { useAllUsers } from "../../services/userService";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import {
  EyeOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ViewAnswerModal from "./ViewAnswerModal";
// import UserDetailsModal from "./UserDetailsModal";

const { confirm } = Modal;

function UserManagement() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState(null);
  const [blockLoading, setBlockLoading] = useState(false);

  const { allUsers, pagination, isLoading, isError, error, refetch } =
    useAllUsers(filter);

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

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setUserDetailsData(null);
    setIsViewModalOpen(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial) => <span>#{serial}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => (
        <Space size="middle">
          <Avatar className="w-[40px] h-[40px]" src={record.profile} />
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
      render: (phone) => <span>{phone}</span>,
    },
    {
      title: <span>Currency</span>,
      dataIndex: "currency",
      key: "currency",
      render: (currency) => <span>{currency}</span>,
    },
    {
      title: <span>Agents</span>,
      dataIndex: "agents",
      key: "agents",
      render: (agents) => <span>{agents}</span>,
    },
    // {
    //   title: <span>Answers</span>,
    //   dataIndex: "question_answer",
    //   key: "question_answer",
    //   render: (question_answer) => (
    //     <ViewAnswerModal question_answer={question_answer} />
    //   ),
    // },
    // {
    //   title: <span>Status</span>,
    //   key: "status",
    //   render: () => (
    //     <Tag
    //       className="w-full mr-5 text-center text-[20px] py-3"
    //       color="#359700"
    //     >
    //       Active
    //     </Tag>
    //   ),
    // },
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
        // className="custom-dark-table"
        // rowClassName={() => "dark-table-row"}
      />

      {/* <UserDetailsModal
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
      /> */}
    </div>
  );
}

export default UserManagement;
