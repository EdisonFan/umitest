/**
 * 全局内容组件 - 集成 KeepAlive
 */
import React from 'react';
import { useLocation } from 'umi';
import KeepAlive from 'react-activation';
import { useTabContext } from '@/features/tab/TabContext';

interface GlobalContentProps {
  children: React.ReactNode;
}

const GlobalContent: React.FC<GlobalContentProps> = ({ children }) => {
  const location = useLocation();
  const { pathname, search } = location;
  const fullPath = pathname + search;
  const { state } = useTabContext();

  // 获取当前标签页的 keepAlive 状态
  const currentTab = state.tabs.find(tab => tab.id === fullPath);
  const keepAlive = currentTab?.keepAlive ?? true; // 默认启用缓存

  return (
    <KeepAlive
      name={fullPath}
      cacheKey={fullPath}
      when={keepAlive}
      id={fullPath}
    >
      {children}
    </KeepAlive>
  );
};

export default GlobalContent;

