
export interface InventoryItem {
  id: string;
  tagNumber: string;
  dateCreated: string;
  fileReference: string;
  dispoPlanned: string;
  disposed: boolean;
  remarks: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  AI_INSIGHTS = 'AI_INSIGHTS'
}

export interface Stats {
  total: number;
  disposed: number;
  pending: number;
  overdue: number;
}
