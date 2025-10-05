import React, { useState } from "react";
import { API, useGetAllAgents } from "../../api/api";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { Image, message, Modal, Space, Table, Tag, Select, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditAgent from "./EditAgent";
import AddAgent from "./AddAgent";

function Agents() {
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const { allAgents, isLoading, isError, error, refetch } = useGetAllAgents({
    status: statusFilter,
  }); // Fetch categories based on filter

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [agentData, setAgentData] = React.useState(null);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError || error) {
    return <IsError error={error} refetch={refetch} />;
  }

  const handleEdit = (record) => {
    setAgentData(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setAgentData(null); // Reset the details
    setIsModalOpen(false); // Close modal
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this agent?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await API.delete(`/agent/${id}`);
          message.success("Agent deleted successfully!");
          refetch();
        } catch (err) {
          message.error(err.response?.data?.error || "Failed to delete agent");
        }
      },
    });
  };

  // Status change modal open
  const openStatusModal = (record) => {
    setSelectedAgent(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  // Status update API call
  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    setIsStatusChangeLoading(true);

    try {
      await API.patch(`/agent/${selectedAgent.id}`, {
        status: newStatus,
      });
      message.success("Agent status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedAgent(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update Agent status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const columns = [
    {
      title: <span>Agent Name</span>,
      dataIndex: "agent_name",
      key: "agent_name",
      render: (_, record) => (
        <Space size="middle">
          <Image
            className="!w-[50px] !h-[50px] !rounded-full bg-gray-300 p-1"
            src={record.agent_image}
          />
          <span className="font-bold">{record.agent_name}</span>
        </Space>
      ),
    },

    {
      title: <span>Yuan Rate</span>,
      dataIndex: "yuan_rate",
      key: "yuan_rate",
      render: (yuan_rate) => <span>¥ {yuan_rate}</span>,
    },
    {
      title: <span>USD Rate</span>,
      dataIndex: "usd_rate",
      key: "usd_rate",
      render: (usd_rate) => <span>$ {usd_rate}</span>,
    },
    {
      title: <span>EURO Rate</span>,
      dataIndex: "euro_rate",
      key: "euro_rate",
      render: (euro_rate) => <span>€ {euro_rate}</span>,
    },
    {
      title: <span>AUD Rate</span>,
      dataIndex: "aud_rate",
      key: "aud_rate",
      render: (aud_rate) => <span>A$ {aud_rate}</span>,
    },
    {
      title: <span>CAD Rate</span>,
      dataIndex: "cad_rate",
      key: "cad_rate",
      render: (cad_rate) => <span>C$ {cad_rate}</span>,
    },
    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center">
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
        <AddAgent refetch={refetch} />

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
        dataSource={allAgents}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <EditAgent
        agentData={agentData}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Agent Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p className="mb-2">Select new status for this Agent:</p>
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

export default Agents;
