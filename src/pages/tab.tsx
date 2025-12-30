import React, { useState } from 'react';
import { Card, Button, Divider, Input, Space, message } from 'antd';
import { useHistory } from 'umi';

import { useTabActions } from '@/features/tab/tabHooks';
import { TabProvider } from '@/features/tab/TabContext';
export default function TabPage() {
  const history = useHistory();
  const { activeTabId, closeTab } = useTabActions();
//   const { activeTabId, closeTab, tabs, updateTab } = useTabActions();

  const [newTitle, setNewTitle] = useState('');

  /** 打开关于页面（会自动创建关于的标签页） */
  const handleOpenAbout = () => {
    history.push('/about');
  };

  /** 关闭当前激活的标签页 */
  const handleCloseCurrent = () => {
    if (!activeTabId) {
      message.warning('当前没有激活的标签页');
      return;
    }
    closeTab(activeTabId);
  };

  /** 关闭关于页面对应的标签页 */
  const handleCloseAbout = () => {
    // 我们在 tab 创建时使用 fullPath 作为 id，这里查找 /about 路径的标签页
    // const aboutTab = tabs.find(tab => tab.path === '/about' || tab.id === '/about' || tab.id.startsWith('/about'));
    // if (!aboutTab) {
    //   message.warning('当前没有关于页面的标签页');
    //   return;
    // }
    // closeTab(aboutTab.id);
  };

  /** 修改当前激活标签页的标题 */
  const handleChangeTitle = () => {
    // const title = newTitle.trim();
    // if (!title) {
    //   message.warning('请输入新标题');
    //   return;
    // }

    // if (!activeTabId) {
    //   message.warning('当前没有激活的标签页');
    //   return;
    // }

    // const activeTab = tabs.find(tab => tab.id === activeTabId);
    // if (!activeTab) {
    //   message.warning('未找到当前激活的标签页');
    //   return;
    // }

    // updateTab(activeTab.id, { title });
    // message.success('标题已修改');
    // setNewTitle(''); // 清空输入框
  };

  return (
    <Card title="标签页 Demo">
      <Divider>打开标签页</Divider>
      <Button type="primary" onClick={handleOpenAbout}>
        跳转到关于页面
      </Button>

      <Divider>关闭标签页</Divider>
      <Space>
        <Button type="primary" onClick={handleCloseCurrent}>
          关闭当前标签页
        </Button>
        <Button type="primary" onClick={handleCloseAbout}>
          关闭关于标签页
        </Button>
      </Space>

      <Divider>修改当前标签页标题</Divider>
      <Input
        placeholder="请输入新标题"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        style={{ maxWidth: 320 }}
        addonAfter={
          <Button type="primary" onClick={handleChangeTitle}>
            修改
          </Button>
        }
      />
    </Card>
  );
}