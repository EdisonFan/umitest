import React from 'react';
import { Card, Input, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <Card>
      <Typography>
        <Title>关于我们</Title>
        <Paragraph>
          这是一个示例页面，展示了如何使用 UmiJS 和 Ant Design 构建现代化的 React 应用。
        </Paragraph>
        <Input
          placeholder="请输入"
        />
      </Typography>
    </Card>
  );
} 