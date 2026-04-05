import { Tag } from 'antd'
import { PROJECT_STATUS_META, type ProjectStatus } from '../../../constants/project'

type StatusTagProps = {
  status: ProjectStatus
}

export function StatusTag({ status }: StatusTagProps) {
  const meta = PROJECT_STATUS_META[status]

  return <Tag color={meta.color}>{meta.label}</Tag>
}
