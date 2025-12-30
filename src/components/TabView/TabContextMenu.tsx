/**
 * 标签页右键菜单组件
 */
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { Tab } from '@/features/tab/tabTypes';

interface TabContextMenuProps {
  tab: Tab;
  tabIndex: number;
  totalTabs: number;
  onCloseCurrent: (tabId: string) => void;
  onCloseOther: (tabId: string) => void;
  onCloseLeft: (tabId: string) => void;
  onCloseRight: (tabId: string) => void;
  onCloseAll: () => void;
  children: React.ReactNode;
}

const TabContextMenu: React.FC<TabContextMenuProps> = ({
  tab,
  tabIndex,
  totalTabs,
  onCloseCurrent,
  onCloseOther,
  onCloseLeft,
  onCloseRight,
  onCloseAll,
  children,
}) => {
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'closeCurrent':
        onCloseCurrent(tab.id);
        break;
      case 'closeOther':
        onCloseOther(tab.id);
        break;
      case 'closeLeft':
        onCloseLeft(tab.id);
        break;
      case 'closeRight':
        onCloseRight(tab.id);
        break;
      case 'closeAll':
        onCloseAll();
        break;
    }
  };

  const menuItems = [
    {
      key: 'closeCurrent',
      label: '关闭当前标签页',
      disabled: !tab.closable,
    },
    {
      key: 'closeOther',
      label: '关闭其他标签页',
      disabled: totalTabs <= 1,
    },
    {
      key: 'closeLeft',
      label: '关闭左侧标签页',
      disabled: tabIndex === 0 || tab.fixed,
    },
    {
      key: 'closeRight',
      label: '关闭右侧标签页',
      disabled: tabIndex === totalTabs - 1,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'closeAll',
      label: '关闭所有标签页',
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={['contextMenu']}
    >
      {children}
    </Dropdown>
  );
};

export default TabContextMenu;

