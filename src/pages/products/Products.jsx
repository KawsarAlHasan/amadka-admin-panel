import { Button, Input, Space, Table, Tag, Image } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import AddNewProduct from "./AddNewProduct";
import { useGetAllProducts } from "../../api/api";
import IsError from "../../components/IsError";
import { LuSend } from "react-icons/lu";
import ViewProduct from "./ViewProduct";

const { Search } = Input;

function Products() {
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  const { allProducts, pagination, isLoading, isError, error, refetch } =
    useGetAllProducts(filter);

  const onSearch = (value) => {
    setFilter({
      page: 1,
      limit: 10,
      product_name: value || undefined,
    });
  };

  const handleView = (record) => {
    setProductDetails(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setProductDetails(null);
    setIsModalOpen(false);
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
      title: "SL no.",
      dataIndex: "id",
      render: (_, __, index) => {
        return <span>#{(filter.page - 1) * filter.limit + (index + 1)}</span>;
      },
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Space wrap>
          {images?.map((img, index) => (
            <Image
              key={index}
              src={img}
              width={40}
              height={40}
              style={{ borderRadius: 5 }}
            />
          ))}
        </Space>
      ),
    },
    {
      title: "Available Size",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) =>
        sizes?.map((size, index) => (
          <Tag key={index} color="blue">
            {size}
          </Tag>
        )),
    },
    {
      title: "Color",
      dataIndex: "colors",
      key: "colors",
      render: (colors) =>
        colors?.map((color, index) => (
          <Tag key={index} color="default">
            {color}
          </Tag>
        )),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>${price}</span>,
    },
    {
      title: "Offer Price",
      dataIndex: "offer_price",
      key: "offer_price",
      render: (offer_price) => <span>${offer_price}</span>,
    },
    {
      title: "Affiliate Link",
      dataIndex: "affiate_link",
      key: "affiate_link",
      render: (link) => (
        <Button href={link} target="_blank">
          Affiliate Link
          <LuSend />
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status} Status{" "}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button
            type="primary"
            className="custom-primary-btn"
            icon={<EditOutlined />}
          />
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="">
          <Search
            placeholder="Products Search"
            value={searchValue} // Controlled value
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
            style={{ width: 300 }}
            allowClear
          />

          <Button
            onClick={() => {
              setSearchValue("");
              onSearch("");
            }}
            icon={<ReloadOutlined />}
            className="ml-4"
          >
            Reset
          </Button>
        </div>

        <AddNewProduct />
      </div>

      {isError && <IsError error={error} refetch={refetch} />}

      <Table
        columns={columns}
        dataSource={allProducts}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      <ViewProduct
        data={productDetails}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default Products;
