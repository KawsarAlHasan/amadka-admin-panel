import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Divider,
  message,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AddNewProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        // Here you would typically send the data to your backend
        message.success("Product uploaded successfully!");
        setIsModalOpen(false);
        form.resetFields();
        setImageList([]);
        setSizes([]);
        setColors([]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageList([]);
    setSizes([]);
    setColors([]);
  };

  const handleImageUpload = ({ fileList }) => {
    setImageList(fileList);
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent automatic upload
    listType: "picture",
    onChange: handleImageUpload,
    multiple: true,
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="upload-button custom-primary-btn">
        New Product Upload
      </Button>
      <Modal
        title="Upload New Product"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        okText="Upload Product"
        cancelText="Cancel"
        className="luxury-modal "
      >
        <Form form={form} layout="vertical" className="product-form">
          <Divider orientation="left">Basic Information</Divider>

          <Form.Item
            name="agent_name"
            label="Agent Name"
            rules={[
              { required: true, message: "Please input the agent name!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Enter agent name"
              optionFilterProp="label"
              // onChange={onChange}
              // onSearch={onSearch}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="product_name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the product description!",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category">
              <Option value="Luxury">Luxury</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Classic">Classic</Option>
              <Option value="Electric">Electric</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">Pricing</Divider>

          <div className="price-row">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please input the price!" }]}
              className="price-input"
            >
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
                placeholder="0.00"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="offer_price"
              label="Offer Price"
              className="price-input"
            >
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
                placeholder="0.00"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Divider orientation="left">Media</Divider>

          <Form.Item
            label="Product Images"
            rules={[
              { required: true, message: "Please upload at least one image!" },
            ]}
          >
            <Upload {...uploadProps} fileList={imageList}>
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>

          <Divider orientation="left">Variants</Divider>

          <Form.Item label="Available Sizes" name="sizes">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or add sizes"
              options={[
                { value: "XS", label: "XS" },
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
                { value: "XL", label: "XL" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Available Colors" name="colors">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or add colors"
              options={[
                { value: "Red", label: "Red" },
                { value: "Blue", label: "Blue" },
                { value: "Black", label: "Black" },
                { value: "White", label: "White" },
              ]}
            />
          </Form.Item>

          <Divider orientation="left">Affiliate Information</Divider>

          <Form.Item name="affiate_link" label="Affiliate Link">
            <Input placeholder="https://affiliate.example.com/product/1" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewProduct;
