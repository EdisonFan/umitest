import React from 'react';
import { Spin } from 'antd';

const PageLoading: React.FC = () => {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
      <div>加载中，请稍候...</div>
    </div>
  );
};

export default PageLoading; 