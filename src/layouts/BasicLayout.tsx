import React, { Suspense, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Redirect, useLocation } from 'umi';
import { HomeOutlined } from '@ant-design/icons';
import KeepAlive, { useKeepAliveRef } from 'react-activation';
import PageLoading from '@/components/PageLoading';
import { routeManager } from '@/utils/routeManager';
import { TabProvider } from '@/features/tab/TabContext';
import { useTabManager } from '@/features/tab/tabHooks';
import TabView from '@/components/TabView/TabView';
import GlobalContent from './GlobalContent';

const { Header, Content, Footer } = Layout;

// 内部布局组件（使用 TabProvider）
const BasicLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // 标签页管理器 - 自动根据路由创建标签页
  useTabManager();

  useEffect(() => {
    const updateMenuFromRoutes = (routes: any[]) => {
      setMenuItems(
        routes.map((item: any) => ({
          key: item.path,
          icon: item.icon || <HomeOutlined />, // 默认图标
          label: <Link to={item.path}>{item.name}</Link>,
        })),
      );
    };

    // 先用当前内存中的路由初始化一次菜单
    updateMenuFromRoutes(routeManager.getRoutes());

    // 监听后续动态路由更新
    const unsubscribe = routeManager.onRoutesUpdate(updateMenuFromRoutes);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Header>
      {/* 标签页区域 */}
      <TabView />
      <Content style={{ padding: '0 50px', marginTop: 0 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Suspense fallback={<PageLoading />}>
            <GlobalContent>{children}</GlobalContent>
          </Suspense>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Umi Demo ©2024 Created by Your Name
      </Footer>
    </Layout>
  );
};

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <TabProvider>
      <BasicLayoutInner>{children}</BasicLayoutInner>
    </TabProvider>
  );
};

export default BasicLayout; 