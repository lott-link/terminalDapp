import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const Message = () => {
  const location = useLocation()
  console.log(location)
  return (
  <div className='w-100 h-100 bg-danger'>
      <h1>message</h1>
      <h1>message</h1>
      <h1>message</h1>
      <h1>message</h1>
  </div>
  );
};

export default Message;
