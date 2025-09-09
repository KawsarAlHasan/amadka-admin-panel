import React from 'react';
import { Button, Result } from 'antd';
const NotFound = () => (
 <div className='flex justify-center items-center min-h-screen' >
   <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary">Back Home</Button>}
  />
 </div>
);
export default NotFound;