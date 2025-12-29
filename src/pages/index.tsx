import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function IndexPage() {
  return (
    <Card>
      <Typography>
        <Title>欢迎使用 Umi + Ant Design 示例</Title>
        <Paragraph>
          这是一个使用 UmiJS 3.x 和 Ant Design 4.x 构建的示例项目。
        </Paragraph>
      </Typography>
    </Card>
  );
} 