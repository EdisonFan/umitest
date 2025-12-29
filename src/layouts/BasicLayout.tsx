import React, { Suspense, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Redirect, useLocation } from 'umi';
import { HomeOutlined } from '@ant-design/icons';
import PageLoading from '@/components/PageLoading';
import { routeManager } from '@/utils/routeManager';

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }
    
    const routers = JSON.parse(localStorage.getItem('routers') || '[]');
    // routeManager.setRoutes(routers);
    setMenuItems(
      routers.map((item: any) => ({
        key: item.path,
        icon: item.icon || <HomeOutlined />, // 默认图标
        label: <Link to={item.path}>{item.name}</Link>,
      }))
    );
  }, [token]);

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
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Suspense fallback={<PageLoading />}>
            {children}
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