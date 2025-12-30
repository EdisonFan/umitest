import React, { Suspense, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Redirect, useLocation } from 'umi';
import { HomeOutlined } from '@ant-design/icons';
import KeepAlive, { useKeepAliveRef } from 'react-activation';
import PageLoading from '@/components/PageLoading';
import { routeManager } from '@/utils/routeManager';
import { useTabManager } from '@/features/tab/tabHooks';
import TabView from '@/components/TabView/TabView';
import GlobalContent from './GlobalContent';

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  // 标签页管理器 - 自动根据路由创建标签页
  useTabManager();

  useEffect(() => {
    const updateMenuFromRoutes = (routes: any[]) => {
      setMenuItems(
        routes.map((item: any) => ({
          key: item.path,
          icon: item.icon || <HomeOutlined />,
          label: <Link to={item.path}>{item.name}</Link>,
        })),
      );
    };

    updateMenuFromRoutes(routeManager.getRoutes());

    const unsubscribe = routeManager.onRoutesUpdate(updateMenuFromRoutes);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (!token) {
    return <Redirect to="/login" />;
  }

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

export default BasicLayout; 