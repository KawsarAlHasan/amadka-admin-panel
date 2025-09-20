import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

const { Title } = Typography;

function EditCategory({ categoryData, isOpen, onClose, refetch }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (categoryData?.category_image) {
      setFileList([
        {
          uid: "-1",
          name: "Current Image",
          status: "done",
          url: categoryData.category_image,
        },
      ]);
      form.setFieldsValue({
        category_name: categoryData.category_name || "",
        category_image: [
          {
            uid: "-1",
            name: "Current Image",
            status: "done",
            url: categoryData.category_image,
          },
        ],
      });
    } else {
      setFileList([]);
      form.setFieldsValue({
        category_name: categoryData?.category_name || "",
        category_image: [],
      });
    }
  }, [categoryData, form]);

  // Handle form submission
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
      const response = await API.put(`/category/${categoryData?.id}`, formData);
      if (response.status === 200) {
        message.success(`${values.category_name} updated successfully!`);
      }
      refetch();
      onClose();
    } catch (error) {
      message.error(`Failed to add ${values.category_name}. Try again.`);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={3}>{categoryData?.category_name} Edit - Category</Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={{
          category_name: categoryData?.category_name || "",
        }}
      >
        {/* Image Upload */}
        <Form.Item label="Upload Image" name="category_image">
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => {
              if (newFileList.length > 0 && newFileList[0].originFileObj) {
                setFileList([newFileList[0]]);
                form.setFieldsValue({ category_image: [newFileList[0]] });
              } else {
                setFileList(newFileList);
                form.setFieldsValue({ category_image: newFileList });
              }
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
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Category Name */}
        <Form.Item
          label="Category Name"
          name="category_name"
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input placeholder="Enter Category name..." />
        </Form.Item>

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
  );
}

export default EditCategory;
