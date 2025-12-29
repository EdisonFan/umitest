import React, { useState, useEffect } from 'react';
import { Tree, Row, Col, Modal, Form, Input, message, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import Editor from "@monaco-editor/react";
import {
  FolderOutlined,
  FileOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  FileAddOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getCodeContent, saveCodeContent, getTreeData, saveTreeData } from '@/services/code';

export interface TreeNode extends DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  parentKey?: string;
}

const TestPage: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedRightNode, setSelectedRightNode] = useState<TreeNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'folder' | 'file' | null>(null);
  const [form] = Form.useForm();
  const [codeContent, setCodeContent] = useState<string>('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [title, setTitle] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);


  // 处理左键点击
  const handleSelect = async (selectedKeys: React.Key[], info: any) => {
    const node = info.node as TreeNode;

    if (node.isLeaf) {
      setSelectedNode(node);
      const content = await getCodeContent(node.key);
      setCodeContent(content);
    } else {
      // 展开或折叠节点，如果节点是展开的，则折叠，否则展开
      if (expandedKeys.includes(node.key)) {
        setExpandedKeys(expandedKeys.filter(key => key !== node.key));
      } else {
        setExpandedKeys([...expandedKeys, node.key]);
      }
    }
  };

  // 处理右键点击
  const handleRightClick = (info: any) => {
    const node = info.node as TreeNode;
    setSelectedRightNode(node);
  };

  // 处理代码保存
  const handleSaveCode = async () => {
    if (!selectedNode?.isLeaf) return;

    try {
      await saveCodeContent(selectedNode.key, codeContent);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 处理编辑器内容变化
  const handleEditorChange = (value: string = '') => {
    setCodeContent(value);
  };

  // 编辑器加载完成回调
  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  // 处理右键菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    if (!selectedRightNode) return;

    switch (key) {
      case 'delete':
        handleDelete();
        break;
      case 'addFolder':
        showModal('folder');
        setTitle('创建目录')
        break;
      case 'addFile':
        showModal('file');
        setTitle('创建页面')
        break;
      case 'editFile':
        showModal('file');
        setTitle('修改页面')
        break;
    }
  };

  // 显示模态框
  const showModal = (type: 'folder' | 'file') => {
    setModalType(type);
    setIsModalVisible(true);
    form.resetFields();
  };

  // 处理删除操作
  const handleDelete = () => {
    if (!selectedRightNode) return;
    if (selectedRightNode.key === '0') {
      message.error('根节点不能删除！');
      return;
    }

    const hasChildren = selectedRightNode.children && selectedRightNode.children.length > 0;
    if (hasChildren) {
      const _modal = Modal.confirm({
        title: '确认删除',
        content: '该操作会连同子节点一起删除，是否继续？',
        onOk: () => {
          deleteNode(treeData, selectedRightNode.key)
          _modal.destroy()
        },
      });
    } else {
      deleteNode(treeData, selectedRightNode.key);
    }
  };

  // 递归删除节点
  const deleteNode = async (data: TreeNode[], key: string): Promise<boolean> => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.key === key) {
        data.splice(i, 1);
        const newTreeData = [...treeData];
        setTreeData(newTreeData);
        // 保存到后端
        await saveTreeData(newTreeData);
        message.success('删除成功');
        return true;
      }
      if (node.children) {
        if (deleteNode(node.children, key)) {
          return true;
        }
      }
    }
    return false;
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newNode: TreeNode = {
        title: values.name,
        key: `${Date.now()}`,
        icon: modalType === 'folder' ? <FolderOutlined /> : <FileOutlined />,
        isLeaf: modalType === 'file',
        children: modalType === 'folder' ? [] : undefined,
      };

      if (selectedNode) {
        // 找到选中节点并添加子节点
        const addChildNode = async (data: TreeNode[], parentKey: string): Promise<boolean> => {
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            if (node.key === parentKey) {
              node.children = node.children || [];
              node.children.push(newNode);
              const newTreeData = [...treeData];
              setTreeData(newTreeData);
              // 保存到后端
              await saveTreeData(newTreeData);
              return true;
            }
            if (node.children) {
              if (addChildNode(node.children, parentKey)) {
                return true;
              }
            }
          }
          return false;
        };

        await addChildNode(treeData, selectedNode.key);
      }

      setIsModalVisible(false);
      message.success(`${modalType === 'folder' ? '目录' : '页面'}创建成功`);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 右键菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      disabled: selectedRightNode?.key === '0',
    },
    {
      key: 'addFolder',
      icon: <FolderAddOutlined />,
      label: '创建目录',
      disabled: selectedRightNode?.isLeaf,
    },
    {
      key: 'addFile',
      icon: <FileAddOutlined />,
      label: '创建页面',
      disabled: selectedRightNode?.isLeaf,
    },
    {
      key: 'editFile',
      icon: <FileAddOutlined />,
      label: '修改页面',
      disabled: !selectedRightNode?.isLeaf,
    },
  ];

  // 添加获取树形数据的 useEffect
  useEffect(() => {
    getTreeData().then(data => {
      setTreeData(data);
      // 设置展开的节点，所有节点都展开
      const getAllKeys = (data: TreeNode[]): string[] => {
        let keys: string[] = [];
        data.forEach(node => {
          keys.push(node.key);
          if (node.children) {
            keys = keys.concat(getAllKeys(node.children));
          }
        });
        return keys;
      };
      setExpandedKeys(getAllKeys(data));
    });
  }, []);

  // 递归TreeData，根据类型添加图标
  const addIconsToTreeData = (data: TreeNode[]): TreeNode[] => {
    return data.map(node => {
      const newNode = {
        ...node,
        icon: node.isLeaf ? <FileOutlined /> : <FolderOutlined />,
      };
      if (node.children) {
        newNode.children = addIconsToTreeData(node.children);
      }
      return newNode;
    });
  };

  return (
    <Row>
      <Col span={4} style={{ borderRight: '1px solid #ddd', padding: '20px' }}>
        <Dropdown
          menu={{
            items: menuItems.filter((item: any) =>
              item !== null && !item.disabled
            ),
            onClick: handleMenuClick
          }}
          trigger={['contextMenu']}
        >
          <div>

            <Tree
              showIcon
              treeData={addIconsToTreeData(treeData)}
              onSelect={handleSelect}
              onRightClick={handleRightClick}
              selectedKeys={[selectedNode?.key || '']}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}

            />
          </div>
        </Dropdown>
      </Col>
      <Col span={20} style={{ padding: '20px' }}>
        {selectedNode?.isLeaf && (
          <>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveCode}
                disabled={!isEditorReady}
              >
                保存
              </Button>
            </div>
            <Editor
              height="80vh"
              defaultLanguage="javascript"
              value={codeContent}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </>
        )}
      </Col>

      <Modal
        title={title}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default TestPage; 