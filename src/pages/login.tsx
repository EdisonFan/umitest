import React, { useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { history } from 'umi';
import { fetchRouteConfig } from '@/services/route';
import { routeManager } from '@/utils/routeManager';
import { list } from '@/services/auth';
const LoginPage: React.FC = () => {
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    // 模拟登录成功
    localStorage.setItem('token', '123456');

    // 获取动态路由信息并更新
    const routes = await fetchRouteConfig();
    routeManager.setRoutes(routes);
    localStorage.setItem('routers', JSON.stringify(routes));


    // 跳转到列表页
    history.replace('/list');
  };
  useEffect(() => {
    list().then((res) => {
      console.log(res, 'res');
    });
  }, []);
  return (
    <Card title="登录" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage; 