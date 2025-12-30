/**
 * 标签页类型定义
 */

export interface Tab {
  id: string;                    // 标签页唯一标识
  path: string;                  // 路由路径
  fullPath: string;             // 完整路径（含查询参数）
  title: string;                 // 标签页标题
  icon?: React.ReactNode;        // 图标（可选）
  keepAlive?: boolean;           // 是否缓存
  fixed?: boolean;             // 是否固定
  closable?: boolean;            // 是否可关闭
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
}

export type TabAction =
  | { type: 'ADD_TAB'; payload: Tab }
  | { type: 'REMOVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'UPDATE_TAB'; payload: { id: string; tab: Partial<Tab> } }
  | { type: 'SET_TABS'; payload: Tab[] }
  | { type: 'CLEAR_TABS'; payload?: string[] }; // 保留的标签页 ID 列表

