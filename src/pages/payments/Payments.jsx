import { Avatar, Space, Table } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { usePayments } from "../../services/payoutService";

function Payments() {
  const { paymentsData, isLoading, isError, error, refetch } = usePayments();

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial_number) => <span className="">#{serial_number}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => (
        <Space size="middle">
          <Avatar className="w-[40px] h-[40px]" src={record.profile} />
          <span className="">{text}</span>
        </Space>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },

    {
      title: <span>Payments</span>,
      dataIndex: "pay_amout",
      key: "pay_amout",
      render: (pay_amout) => <span className="">{pay_amout}</span>,
    },
    {
      title: <span>date</span>,
      dataIndex: "date",
      key: "date",
      render: (date) => <span className="">{date}</span>,
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
        dataSource={paymentsData}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}

export default Payments;
