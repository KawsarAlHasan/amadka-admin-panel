import React, { useState } from "react";
import {
  Button,
  Modal,
  Upload,
  message,
  Progress,
  Space,
  Typography,
} from "antd";
import {
  CloudUploadOutlined,
  InboxOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { API } from "../../api/api";

const { Dragger } = Upload;
const { Text } = Typography;

function UploadXlsx({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
    setFileList([]);
    setUploadProgress(0);
  };

  const handleCancel = () => {
    if (!uploading) {
      setIsModalOpen(false);
      setFileList([]);
      setUploadProgress(0);
    }
  };

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("excelFile", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Make actual API call
      const response = await API.post("/product/upload-xlsx", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
          onProgress({ percent });
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      onSuccess(response.data, file);
      message.success(`${file.name} file uploaded successfully!`);

      // Close modal after successful upload
      setTimeout(() => {
        setUploading(false);
        setIsModalOpen(false);
        setFileList([]);
        setUploadProgress(0);
        refetch();
      }, 1000);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      onError(error);
      message.error(
        error.response.data.message || `${file.name} file upload failed.`
      );
      message.error(error?.message || "Upload failed. Please try again.");
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",
    fileList: fileList,
    customRequest: customRequest,
    beforeUpload: (file) => {
      // Validate file type
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv");

      if (!isExcel) {
        message.error("You can only upload Excel/CSV files!");
        return false;
      }

      // Validate file size (1GB max)
      const isLt5M = file.size / 1024 / 1024 < 1024;
      if (!isLt5M) {
        message.error("File must be smaller than 1GB!");
        return false;
      }

      // Reset file list to only allow one file
      setFileList([file]);
      return false; // Prevent default upload
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully!`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      message.error("You can only upload one file at a time.");
    },
    onRemove: () => {
      setFileList([]);
      setUploadProgress(0);
    },
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning("Please select a file first!");
      return;
    }

    // Trigger upload manually since we're using customRequest
    const file = fileList[0];
    uploadProps.customRequest({
      file,
      onSuccess: () => {},
      onError: () => {},
      onProgress: () => {},
    });
  };

  return (
    <div>
      <Button
        className="upload-button custom-primary-btn"
        type="primary"
        onClick={showModal}
        icon={<CloudUploadOutlined />}
      >
        Upload Xlsx
      </Button>

      <Modal
        title={
          <Space>
            <FileExcelOutlined style={{ color: "#1890ff" }} />
            Upload Products Excel File
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={uploading}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUpload}
            disabled={fileList.length === 0 || uploading}
            icon={<CloudUploadOutlined />}
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </Button>,
        ]}
        width={600}
        closable={!uploading}
        maskClosable={!uploading}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag Excel file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for .xlsx, .xls, .csv files. Maximum file size: 1GB
            </p>
          </Dragger>

          {fileList.length > 0 && (
            <div>
              <Text strong>Selected File:</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {fileList[0].name} (
                {(fileList[0].size / 1024 / 1024).toFixed(2)} MB)
              </Text>
            </div>
          )}

          {uploading && (
            <div>
              <Text strong>Upload Progress:</Text>
              <Progress
                percent={uploadProgress}
                status={uploadProgress === 100 ? "success" : "active"}
                style={{ marginTop: 8 }}
              />
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
}

export default UploadXlsx;
