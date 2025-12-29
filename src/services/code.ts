import { TreeNode } from '@/pages/test';
import {
    FolderOutlined,
    FileOutlined,
    DeleteOutlined,
    FolderAddOutlined,
    FileAddOutlined,
    SaveOutlined,
  } from '@ant-design/icons';

// 模拟获取代码内容的接口
export async function getCodeContent(fileKey: string): Promise<string> {
  // 模拟接口延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟不同文件的代码内容
      const codeMap: Record<string, string> = {
        '2': `import React from 'react';

function ExampleComponent() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>This is an example component</p>
    </div>
  );
}

export default ExampleComponent;`,
        // 可以添加更多示例代码
      };

      resolve(codeMap[fileKey] || '// 新文件');
    }, 300);
  });
}

// 模拟保存代码内容的接口
export async function saveCodeContent(fileKey: string, content: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('保存文件:', fileKey, content);
      resolve(true);
    }, 300);
  });
}

// 添加获取树形数据的接口
export async function getTreeData(): Promise<TreeNode[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: 'code',
          key: '0',
          icon: 'FolderOutlined',
          children: [
            {
              title: '示例目录',
              key: '1',
              icon:'FolderOutlined',
              children: [
                {
                  title: '示例页面',
                  key: '2',
                  icon: 'FileOutlined',
                  isLeaf: true,
                },
                {
                  title: '示例页面2',
                  key: '3',
                  icon: 'FileOutlined',
                  isLeaf: true,
                },
              ],
            },
            {
              title: '系统目录',
              key: '4',
              icon: 'FolderOutlined',
              children: [
                {
                  title: '系统配置',
                  key: '5',
                  icon: 'FileOutlined',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ]);
    }, 300);
  });
}

// 保存树形数据的接口
export async function saveTreeData(treeData: TreeNode[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('保存树形数据:', treeData);
      resolve(true);
    }, 300);
  });
} 