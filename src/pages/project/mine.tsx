import { PagePlaceholder } from '../../components/common/PagePlaceholder'

export default function MyProjectsPage() {
  return (
    <PagePlaceholder
      title="我的申报"
      description="这里会只展示当前登录用户的申报记录，用来体现角色数据隔离和复用列表能力。"
      tags={['我的申报', '数据隔离', '角色场景']}
    />
  )
}
