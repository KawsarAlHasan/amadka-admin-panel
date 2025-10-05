import React, { useState, useEffect } from "react";
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
  Avatar,
  Card,
  Tag,
} from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { API, useGetAllAgents, useGetAllCategories } from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

const EditProduct = ({ refetch, product }) => {
  const { allAgents } = useGetAllAgents({
    status: "Active",
  });

  const { allCategories } = useGetAllCategories({ status: "Active" });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [affiliateLinks, setAffiliateLinks] = useState({});

  // Populate form with existing product data when product prop changes
  useEffect(() => {
    if (product && isModalOpen) {
      // Set basic form fields
      form.setFieldsValue({
        product_name: product.product_name,
        description: product.description,
        price: product.price,
        offer_price: product.offer_price,
        categoryId: product.categoryId,
      });

      // Set sizes and colors
      setSizes(product.sizes || []);
      setColors(product.colors || []);

      // Set affiliates data
      const agentIds = product.affiliates?.map(affiliate => affiliate.agentId) || [];
      setSelectedAgents(agentIds);

      // Set affiliate links
      const links = {};
      product.affiliates?.forEach(affiliate => {
        links[affiliate.agentId] = affiliate.affiliate_link;
      });
      setAffiliateLinks(links);

      // Set existing images for display (read-only)
      const existingImages = product.images?.map((image, index) => ({
        uid: `existing-${index}`,
        name: `image-${index}.jpg`,
        status: 'done',
        url: image,
        thumbUrl: image,
      })) || [];
      setImageList(existingImages);
    }
  }, [product, isModalOpen, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      // Prepare form data for multipart/form-data
      const formData = new FormData();

      // Add basic fields
      formData.append("product_name", values.product_name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      if (values.offer_price) {
        formData.append("offer_price", values.offer_price);
      }
      if (values.categoryId) {
        formData.append("categoryId", values.categoryId);
      }

      // Add arrays as JSON strings
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("colors", JSON.stringify(colors));

      // Prepare affiliates array
      const affiliates = selectedAgents.map((agentId) => ({
        agent: agentId,
        affiliat_link: affiliateLinks[agentId] || "",
      }));
      formData.append("affiliates", JSON.stringify(affiliates));

      // Add only new image files (exclude existing URLs)
      const newImageFiles = imageList.filter(file => file.originFileObj);
      newImageFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // If no new images but existing images, keep the existing ones
      if (newImageFiles.length === 0 && product.images && product.images.length > 0) {
        formData.append("existing_images", JSON.stringify(product.images));
      }

      // API call
      const response = await API.put(`/product/update/${product.id}`, formData);

      if (response.data.success) {
        message.success("Product Updated successfully!");
        setIsModalOpen(false);
        form.resetFields();
        setImageList([]);
        setSizes([]);
        setColors([]);
        setSelectedAgents([]);
        setAffiliateLinks({});
        refetch();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Please fill in all the required fields."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageList([]);
    setSizes([]);
    setColors([]);
    setSelectedAgents([]);
    setAffiliateLinks({});
  };

  const handleImageUpload = ({ fileList }) => {
    setImageList(fileList);
  };

  const handleAgentSelect = (values) => {
    setSelectedAgents(values);
  };

  const handleAffiliateLinkChange = (agentId, link) => {
    setAffiliateLinks((prev) => ({
      ...prev,
      [agentId]: link,
    }));
  };

  const removeAgent = (agentId) => {
    setSelectedAgents((prev) => prev.filter((id) => id !== agentId));
    setAffiliateLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[agentId];
      return newLinks;
    });
  };

  const uploadProps = {
    beforeUpload: () => false,
    listType: "picture",
    onChange: handleImageUpload,
    multiple: true,
    fileList: imageList,
  };

  const getAgentName = (agentId) => {
    const agent = allAgents?.find((a) => a.id === agentId);
    return agent ? agent.agent_name : "Unknown Agent";
  };

  const getAgentImage = (agentId) => {
    const agent = allAgents?.find((a) => a.id === agentId);
    return agent ? agent.agent_image : null;
  };

  // Function to handle image removal
  const handleImageRemove = (file) => {
    const newImageList = imageList.filter(item => item.uid !== file.uid);
    setImageList(newImageList);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        className="custom-primary-btn"
        icon={<EditOutlined />}
      />

      <Modal
        title="Edit Product"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width={800}
        okText="Update Product"
        cancelText="Cancel"
        className="luxury-modal"
        centered
      >
        <Form
          onFinish={handleOk}
          form={form}
          layout="vertical"
          className="product-form"
        >
          <Divider orientation="left">Basic Information</Divider>

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
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category">
              {allCategories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  <div className="flex items-center gap-[10px] py-[8px]">
                    <Avatar
                      src={category.category_image}
                      size="default"
                      className="!w-[32px] !h-[32px] min-w-[32px] bg-gray-300"
                    />
                    <div>
                      <div className="font-bold">{category.category_name}</div>
                    </div>
                  </div>
                </Option>
              ))}
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
              { 
                required: imageList.length === 0, 
                message: "Please upload at least one image!" 
              },
            ]}
          >
            <Upload 
              {...uploadProps} 
              fileList={imageList}
              onRemove={handleImageRemove}
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              Existing images will be kept unless removed. Upload new images to add more.
            </div>
          </Form.Item>

          <Divider orientation="left">Affiliate Information</Divider>

          <Form.Item
            label="Select Agents"
            rules={[
              { 
                required: selectedAgents.length === 0, 
                message: "Please select at least one agent!" 
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select agents"
              value={selectedAgents}
              onChange={handleAgentSelect}
              style={{ width: "100%" }}
            >
              {allAgents?.map((agent) => (
                <Option key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-[10px]">
                    <Avatar
                      src={agent.agent_image}
                      size="default"
                      className="!w-[32px] !h-[32px] min-w-[32px] mt-[-5px]"
                    />
                    <div>
                      <div className="font-semibold mt-[-10px]">
                        {agent.agent_name}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedAgents.length > 0 && (
            <Card title="Affiliate Links" size="small">
              {selectedAgents.map((agentId) => (
                <Form.Item
                  key={agentId}
                  label={
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar src={getAgentImage(agentId)} size="small" />
                        <span className="font-medium">
                          {getAgentName(agentId)}
                        </span>
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeAgent(agentId)}
                      />
                    </div>
                  }
                >
                  <Input
                    placeholder="Enter affiliate link for this agent"
                    value={affiliateLinks[agentId] || ""}
                    onChange={(e) =>
                      handleAffiliateLinkChange(agentId, e.target.value)
                    }
                  />
                </Form.Item>
              ))}
            </Card>
          )}

          {/* Display selected agents summary */}
          {selectedAgents.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Selected Agents: </span>
              {selectedAgents.map((agentId) => (
                <Tag key={agentId} color="blue" className="m-1">
                  {getAgentName(agentId)}
                </Tag>
              ))}
            </div>
          )}

          <Divider orientation="left">Variants</Divider>

          <Form.Item label="Available Sizes">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or add sizes"
              value={sizes}
              onChange={setSizes}
              options={[
                { value: "XS", label: "XS" },
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
                { value: "XL", label: "XL" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Available Colors">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or add colors"
              value={colors}
              onChange={setColors}
              options={[
                { value: "Red", label: "Red" },
                { value: "Blue", label: "Blue" },
                { value: "Black", label: "Black" },
                { value: "White", label: "White" },
              ]}
            />
          </Form.Item>

          <Button
            type="primary"
            loading={loading}
            block
            className="custom-primary-btn"
            htmlType="submit"
          >
            Update Product
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditProduct;