import React from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Space,
  Spin,
  Image,
  Descriptions,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  CopyOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function ViewProduct({ data, isOpen, onClose }) {
  if (!data) {
    return (
      <Modal
        title="Product Details"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  const {
    product_name,
    description,
    offer_price,
    price,
    sizes = [],
    colors = [],
    images = [],
    category,
    affiliates = [],
    status,
    created_at,
    updated_at,
    id,
  } = data;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      title={`Product: ${product_name}`}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
    >
      {/* Product Images */}
      {images.length > 0 && (
        <>
          <Title level={5}>Images ({images.length})</Title>
          <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
            {images.map((image, index) => (
              <Col key={index} xs={8}>
                <Image
                  width="100%"
                  height={300}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  src={image}
                  alt={`${product_name} ${index + 1}`}
                  placeholder={
                    <div
                      style={{
                        background: "#f5f5f5",
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EyeOutlined />
                    </div>
                  }
                />
              </Col>
            ))}
          </Row>
          <Divider />
        </>
      )}

      <Row gutter={16}>
        <Col span={12}>
          {/* Basic Information */}
          <Descriptions column={1} size="small" title="Basic Information">
            <Descriptions.Item label="Product Name">
              <Text strong>{product_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {description || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag color="blue">{category?.category_name || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={12}>
          {/* Pricing */}
          <Descriptions column={1} size="small" title="Pricing">
            <Descriptions.Item label="Original Price">
              ${price}
            </Descriptions.Item>
            <Descriptions.Item label="Offer Price">
              <Text strong type="danger">
                ${offer_price}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />

      {/* Sizes & Colors */}
      <Row gutter={16}>
        <Col span={12}>
          <Title level={5}>Sizes</Title>
          <Space wrap>
            {sizes.length > 0 ? (
              sizes.map((size, index) => <Tag key={index}>{size}</Tag>)
            ) : (
              <Text type="secondary">No sizes available</Text>
            )}
          </Space>
        </Col>

        <Col span={12}>
          <Title level={5}>Colors</Title>
          <Space wrap>
            {colors.length > 0 ? (
              colors.map((color, index) => (
                <Tag key={index} color="blue">
                  {color}
                </Tag>
              ))
            ) : (
              <Text type="secondary">No colors available</Text>
            )}
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* Affiliate Links */}
      <Title level={5}>Affiliate Links ({affiliates.length})</Title>
      {affiliates.length > 0 ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          {affiliates.map((affiliate, index) => (
            <div
              key={affiliate.id}
              style={{
                background: "#f9f9f9",
                padding: "8px 12px",
                borderRadius: 4,
                border: "1px solid #d9d9d9",
              }}
            >
              <Space>
                <Text code style={{ fontSize: 12 }}>
                  {affiliate.affiliate_link}
                </Text>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(affiliate.affiliate_link)}
                >
                  Copy
                </Button>
              </Space>
            </div>
          ))}
        </Space>
      ) : (
        <Text type="secondary">No affiliate links</Text>
      )}

      <Divider />

      {/* Metadata */}
      <Descriptions column={1} size="small" title="System Information">
        <Descriptions.Item label="Product ID">
          <Space>
            <Text code style={{ fontSize: 12 }}>
              {id}
            </Text>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(id)}
            />
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {new Date(created_at).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {new Date(updated_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default ViewProduct;
