/**
 * 标签页刷新按钮组件
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'umi';

const TabReloadButton: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    // 强制刷新当前页面
    window.location.reload();
  };

  return (
    <Button
      type="text"
      icon={<ReloadOutlined />}
      onClick={handleReload}
      loading={loading}
      style={{
        marginLeft: '8px',
        padding: '4px 8px',
      }}
      title="刷新当前页面"
    />
  );
};

export default TabReloadButton;

