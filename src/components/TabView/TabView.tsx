/**
 * 标签页主组件
 */
import React, { useRef, useEffect } from 'react';
import { useTabActions } from '@/features/tab/tabHooks';
import TabItem from './TabItem';
import TabContextMenu from './TabContextMenu';
import TabReloadButton from './TabReloadButton';

const TabView: React.FC = () => {
  const {
    tabs,
    activeTabId,
    switchToTab,
    closeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
  } = useTabActions();

  const tabContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到激活的标签页
  useEffect(() => {
    if (tabContainerRef.current && activeTabId) {
      const activeTab = tabContainerRef.current.querySelector(`[data-tab-id="${activeTabId}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTabId]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 16px',
        height: '40px',
        overflow: 'hidden',
      }}
    >
      <div
        ref={tabContainerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'thin',
        }}
      >
        {tabs.map((tab, index) => (
          <TabContextMenu
            key={tab.id}
            tab={tab}
            tabIndex={index}
            totalTabs={tabs.length}
            onCloseCurrent={closeTab}
            onCloseOther={closeOtherTabs}
            onCloseLeft={closeLeftTabs}
            onCloseRight={closeRightTabs}
            onCloseAll={closeAllTabs}
          >
            <div data-tab-id={tab.id}>
              <TabItem
                tab={tab}
                active={tab.id === activeTabId}
                onClose={closeTab}
                onClick={switchToTab}
              />
            </div>
          </TabContextMenu>
        ))}
      </div>
      <TabReloadButton />
    </div>
  );
};

export default TabView;

