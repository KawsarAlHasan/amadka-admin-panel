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
  Carousel,
  Image,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function ViewProduct({ data, isOpen, onClose, refetch }) {
  if (!data) {
    return (
      <Modal
        title="Product Details"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={700}
      >
        <Spin tip="Loading..." />
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
    agent_name,
    affiate_link,
  } = data;

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <Modal
      title="Product Details"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
    >
      <Row gutter={16}>
        {/* Product Image Section (with slider) */}
        <Col span={10}>
          {hasImages ? (
            <Image.PreviewGroup>
              <Carousel arrows dots infinite adaptiveHeight>
                {images.map((src, idx) => (
                  <div key={idx} style={{ padding: 4 }}>
                    <Image
                      src={src}
                      alt={`${product_name} - ${idx + 1}`}
                      width="100%"
                      style={{
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        objectFit: "cover",
                        // aspectRatio: "1 / 1",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </Image.PreviewGroup>
          ) : (
            <div
              style={{
                width: "100%",
                height: 360,
                borderRadius: 8,
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              No image
            </div>
          )}
        </Col>

        {/* Product Info Section */}
        <Col span={14}>
          <Title level={3} style={{ marginBottom: 8 }}>
            {product_name}
          </Title>
          <Text>
            <strong>Category:</strong> {category}
          </Text>

          <div style={{ margin: "10px 0" }}>
            <Text strong>Description:</Text>
            <p style={{ marginBottom: 0 }}>{description}</p>
          </div>

          {/* Price Section */}
          <div style={{ margin: "10px 0" }}>
            <Text strong>Price: </Text>
            {offer_price < price ? (
              <Space>
                <Text delete>{price}</Text>
                <Text type="success">{offer_price}</Text>
              </Space>
            ) : (
              <Text>{price}</Text>
            )}
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <Text strong>Colors: </Text>
              {colors.map((color, index) => (
                <Tag key={index} color="default">
                  {color}
                </Tag>
              ))}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <Text strong>Sizes: </Text>
              {sizes.map((size, index) => (
                <Tag key={index} color="default">
                  {size}
                </Tag>
              ))}
            </div>
          )}

          {/* Affiliate & Agent Info */}
          <div style={{ marginBottom: 10 }}>
            <Text strong>Agent: </Text>
            <Text>{agent_name}</Text>
          </div>
          <div>
            <Text strong>Affiliate Link: </Text>
            <a href={affiate_link} target="_blank" rel="noopener noreferrer">
              {affiate_link}
            </a>
          </div>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewProduct;
