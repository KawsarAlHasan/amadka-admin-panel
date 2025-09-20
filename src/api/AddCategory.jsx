import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

const { Title } = Typography;

const AddCategory = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setIsModalOpen(false);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("category_name", values.category_name);

    if (
      values.category_image &&
      values.category_image[0] &&
      values.category_image[0].originFileObj
    ) {
      formData.append("category_image", values.category_image[0].originFileObj);
    }

    try {
      const response = await API.post("/category/create", formData);
      if (response.status === 200 || response.status === 201) {
        message.success(`${values.category_name} added successfully!`);
        refetch();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to add category. Please try again.");
      console.error("AddCategory error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="custom-primary-btn" type="primary" onClick={showModal}>
        + Add Category
      </Button>

      <Modal
        title={<Title level={4}>Add Category</Title>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          {/* Upload Image */}
          <Form.Item label="Upload Image" name="category_image">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList);
                form.setFieldsValue({ category_image: newFileList });
              }}
              onRemove={() => {
                setFileList([]);
                form.setFieldsValue({ category_image: [] });
              }}
              onPreview={(file) => {
                const src = file.url || URL.createObjectURL(file.originFileObj);
                const imgWindow = window.open(src);
                imgWindow.document.write(
                  `<img src="${src}" style="width: 100%;" />`
                );
              }}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          {/* Category Name */}
          <Form.Item
            label="Category Name"
            name="category_name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input placeholder="Enter category name..." />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              className="custom-primary-btn"
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCategory;
