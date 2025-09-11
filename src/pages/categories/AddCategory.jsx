import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { API } from '../../api/api';
const AddCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


// category_name, 
// category_image

//  await API.post('/category/create', formData);

  return (
    <>
      <Button className='custom-primary-btn' type="primary" onClick={showModal}>
        + Add Category
      </Button>
      <Modal
        title="Add Category"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
export default AddCategory;