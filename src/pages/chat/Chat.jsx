import React, { useState } from "react";
import { useUsersForMessage } from "../../services/usersForMessage";
import { Avatar, Badge, List, Typography } from "antd";
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  MoreOutlined,
  SearchOutlined
} from "@ant-design/icons";
import MessageBox from "./MessageBox";

const { Text } = Typography;

function Chat() {
  const { usersForMessage, isLoading, isError, error, refetch } =
    useUsersForMessage();
  const [selectedUser, setSelectedUser] = useState(null);

  // Format timestamp to relative time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-[88vh)]">
      <div className="flex gap-6 rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Sidebar */}
        <div className="w-[380px] bg-[#FFFFFF] flex flex-col border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <Text strong className="text-xl">Messages</Text>
              <div className="bg-gray-100 rounded-full p-2 cursor-pointer">
                <MoreOutlined className="text-lg" />
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages"
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* User List with Scroll */}
          <div className="overflow-y-auto flex-1 min-h-[72vh]" style={{ maxHeight: 'calc(80vh - 100px)' }}>
            <List
              itemLayout="horizontal"
              dataSource={usersForMessage}
              renderItem={(user) => (
                <List.Item 
                  className={`p-4 mx-2 border-0 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                  extra={
                    <div className="flex flex-col items-end">
                      <Text type="secondary" className="text-xs">
                        {formatTime(user.last_message_time)}
                      </Text>
                      {user.un_read_message > 0 && (
                        <Badge 
                          count={user.un_read_message} 
                          style={{ backgroundColor: '#1890ff' }} 
                          className="mt-1" 
                        />
                      )}
                    </div>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div className="relative">
                        <Badge
                          dot
                          color={user.is_active ? '#52c41a' : '#f5222d'}
                          offset={[-5, 35]}
                        >
                          <Avatar
                            size={50}
                            src={<img src={user.profile} alt={user.full_name} className="object-cover" />}
                          />
                        </Badge>
                      </div>
                    }
                    title={
                      <div className="flex items-center">
                        <Text strong className="text-base">
                          {user.full_name}
                        </Text>
                        {user.is_active && (
                          <CheckCircleOutlined 
                            className="text-green-500 ml-2" 
                            style={{ fontSize: 14 }} 
                          />
                        )}
                      </div>
                    }
                    description={
                      <div className="flex items-center">
                        {!user.is_active && (
                          <ClockCircleOutlined className="text-gray-400 mr-1" />
                        )}
                        <Text 
                          ellipsis 
                          className="text-sm max-w-[180px]" 
                          type="secondary"
                        >
                          {user.last_message}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white flex flex-col w-full">
          {selectedUser ? (
            <MessageBox user={selectedUser} />
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 bg-gray-50"></div>
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <Text strong className="text-lg block mb-2">
                    Select a conversation
                  </Text>
                  <Text type="secondary">
                    Choose a contact from the list to start chatting
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;