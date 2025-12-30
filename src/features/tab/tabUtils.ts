/**
 * 标签页工具函数
 */
import { Tab } from './tabTypes';

/**
 * 根据路由信息创建标签页
 */
export function createTabFromRoute(
  path: string,
  fullPath: string,
  title: string,
  options?: {
    icon?: React.ReactNode;
    keepAlive?: boolean;
    fixed?: boolean;
    closable?: boolean;
  }
): Tab {
  return {
    id: fullPath, // 使用完整路径作为 ID，支持多标签页模式
    path,
    fullPath,
    title,
    icon: options?.icon,
    keepAlive: options?.keepAlive ?? false,
    fixed: options?.fixed ?? false,
    closable: options?.closable ?? true,
  };
}

/**
 * 检查标签页是否已存在
 */
export function isTabExists(tabs: Tab[], tabId: string): boolean {
  return tabs.some(tab => tab.id === tabId);
}

/**
 * 获取固定标签页
 */
export function getFixedTabs(tabs: Tab[]): Tab[] {
  return tabs.filter(tab => tab.fixed);
}

/**
 * 获取固定标签页 ID 列表
 */
export function getFixedTabIds(tabs: Tab[]): string[] {
  return getFixedTabs(tabs).map(tab => tab.id);
}

