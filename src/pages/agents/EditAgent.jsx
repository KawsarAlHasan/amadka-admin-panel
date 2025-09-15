import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

const { Title } = Typography;

function EditAgent({ agentData, isOpen, onClose, refetch }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (agentData?.agent_image) {
      setFileList([
        {
          uid: "-1",
          name: "Current Image",
          status: "done",
          url: agentData.agent_image,
        },
      ]);
      form.setFieldsValue({
        agent_name: agentData.agent_name || "",
        agent_image: [
          {
            uid: "-1",
            name: "Current Image",
            status: "done",
            url: agentData.agent_image,
          },
        ],
      });
    } else {
      setFileList([]);
      form.setFieldsValue({
        agent_name: agentData?.agent_name || "",
        agent_image: [],
      });
    }
  }, [agentData, form]);

  // Handle form submission
  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("agent_name", values.agent_name);

    if (
      values.agent_image &&
      values.agent_image[0] &&
      values.agent_image[0].originFileObj
    ) {
      formData.append("agent_image", values.agent_image[0].originFileObj);
    }

    try {
      const response = await API.put(`/agent/${agentData?.id}`, formData);
      if (response.status === 200) {
        message.success(`${values.agent_name} updated successfully!`);
      }
      refetch();
      onClose();
    } catch (error) {
      message.error(`Failed to add ${values.agent_name}. Try again.`);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={3}>{agentData?.agent_name} Edit - Agent</Title>}
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
          agent_name: agentData?.agent_name || "",
        }}
      >
        {/* Image Upload */}
        <Form.Item label="Upload Image" name="agent_image">
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => {
              if (newFileList.length > 0 && newFileList[0].originFileObj) {
                setFileList([newFileList[0]]);
                form.setFieldsValue({ agent_image: [newFileList[0]] });
              } else {
                setFileList(newFileList);
                form.setFieldsValue({ agent_image: newFileList });
              }
            }}
            onRemove={() => {
              setFileList([]);
              form.setFieldsValue({ agent_image: [] });
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

        {/* Agent Name */}
        <Form.Item
          label="Agent Name"
          name="agent_name"
          rules={[{ required: true, message: "Agent name is required" }]}
        >
          <Input placeholder="Enter Agent name..." />
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

export default EditAgent;
