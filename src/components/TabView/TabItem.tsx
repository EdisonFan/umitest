/**
 * 单个标签项组件
 */
import React from 'react';
import { Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Tab } from '@/features/tab/tabTypes';

interface TabItemProps {
  tab: Tab;
  active: boolean;
  onClose?: (tabId: string) => void;
  onClick?: (tab: Tab) => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, active, onClose, onClick }) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose && tab.closable) {
      onClose(tab.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(tab);
    }
  };

  return (
    <div
      className={`tab-item ${active ? 'tab-item-active' : ''}`}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        marginRight: '4px',
        cursor: 'pointer',
        backgroundColor: active ? '#1890ff' : '#f0f0f0',
        color: active ? '#fff' : '#000',
        borderRadius: '4px 4px 0 0',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {tab.icon && <span style={{ marginRight: '6px' }}>{tab.icon}</span>}
      <span>{tab.title}</span>
      {tab.closable && (
        <CloseOutlined
          onClick={handleClose}
          style={{
            marginLeft: '8px',
            fontSize: '12px',
            padding: '2px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        />
      )}
    </div>
  );
};

export default TabItem;

