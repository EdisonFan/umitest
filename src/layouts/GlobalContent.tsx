/**
 * 全局内容组件 - 集成 KeepAlive
 */
import React from 'react';
import { useLocation, useSelector } from 'umi';
import KeepAlive from 'react-activation';
import { TabModelState } from '@/models/tab';

interface GlobalContentProps {
  children: React.ReactNode;
}

const GlobalContent: React.FC<GlobalContentProps> = ({ children }) => {
  const location = useLocation();
  const { pathname, search } = location;
  const fullPath = pathname + search;
  const tabs = useSelector((state: { tab: TabModelState }) => state.tab.tabs);

  // 获取当前标签页的 keepAlive 状态
  const currentTab = tabs.find(tab => tab.id === fullPath);
  const keepAlive = currentTab?.keepAlive ?? true;

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

