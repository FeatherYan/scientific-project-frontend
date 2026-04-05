import type { NotificationRecord } from '../../types/notification'
import { loadMockState, MOCK_STORAGE_KEYS, saveMockState } from '../utils/storage'

const initialNotifications: NotificationRecord[] = [
  {
    id: 'n_001',
    userId: 'u_001',
    title: '项目已通过审批',
    content: '你提交的“科研成果转化流程治理研究”已审批通过，请关注后续立项安排。',
    type: 'approval',
    read: false,
    createdAt: '2026-03-29T16:20:00+08:00',
    relatedProjectId: 'p_005',
  },
  {
    id: 'n_002',
    userId: 'u_001',
    title: '项目被退回修改',
    content: '“面向研究生培养的科研协同系统设计”已退回，请根据审批意见补充实施计划。',
    type: 'approval',
    read: true,
    createdAt: '2026-04-04T15:10:00+08:00',
    relatedProjectId: 'p_004',
  },
  {
    id: 'n_003',
    userId: 'u_001',
    title: '系统维护通知',
    content: '本周六晚 22:00 至 23:00 将进行系统维护，期间可能短暂影响申报提交。',
    type: 'system',
    read: false,
    createdAt: '2026-04-05T09:00:00+08:00',
  },
]

const NOTIFICATIONS_STORAGE_KEY = MOCK_STORAGE_KEYS.notifications

export let mockNotifications: NotificationRecord[] = loadMockState({
  key: NOTIFICATIONS_STORAGE_KEY,
  fallback: initialNotifications,
})

export function persistMockNotifications() {
  saveMockState(NOTIFICATIONS_STORAGE_KEY, mockNotifications)
}
