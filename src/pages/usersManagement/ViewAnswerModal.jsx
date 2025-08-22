import React, { useState } from 'react';
import { Button, Modal } from 'antd';

function ViewAnswerModal({ question_answer }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <Button 
        type="primary" 
        onClick={showModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
      >
        View Answer
      </Button>
      
      <Modal
        title={<h1 className="text-[#242424] text-[24px] font-bold">View Answer</h1>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button block key="close" onClick={handleCancel} className="border border-gray-300 rounded px-4 py-2">
            Close
          </Button>
        ]}
        centered
      >
        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {question_answer?.map((item, index) => (
            <div 
              key={item.id} 
              className="mb-4 p-4 bg-[#FFF7EB] rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-700 mb-1 flex items-start">
                <span className=" w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-2">
                  {index + 1}
                </span>
                {item.question}
              </h3>
              <p className=" pl-1 text-gray-800 font-medium">
                <span className='font-semibold'>Answer: </span> {item.answer}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default ViewAnswerModal;