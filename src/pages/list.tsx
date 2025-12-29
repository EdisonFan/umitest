import React from 'react';
import { Table, Card } from 'antd';

export default function ListPage() {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const data = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
  ];

  return (
    <Card title="数据列表">
      <Table columns={columns} dataSource={data} />
    </Card>
  );
} 