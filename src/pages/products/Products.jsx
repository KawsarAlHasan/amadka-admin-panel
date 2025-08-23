import { Button, Input, Space, Table, Tag, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAllProducts } from "../../services/productsService";
import { useState } from "react";
import AddNewProduct from "./AddNewProduct";

const { Search } = Input;

function Products() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { allProducts, pagination, isLoading, isError, error, refetch } =
    useAllProducts(filter);

  const onSearch = (value) => {
    console.log("Searching:", value);
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
      dataIndex: "sl_no",
      key: "sl_no",
      render: (sl_no) => <span>#{sl_no}</span>,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
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
        <a href={link} target="_blank" rel="noreferrer">
          Copy Link
        </a>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Products Search"
          onSearch={onSearch}
          style={{ width: 300 }}
        />

        <AddNewProduct />
      </div>

      <Table
        columns={columns}
        dataSource={allProducts}
        rowKey="sl_no"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination?.totalProduct,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  );
}

export default Products;
