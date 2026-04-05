import type { ProjectOpportunity } from '../../types/projectOpportunity'

export const mockProjectOpportunities: ProjectOpportunity[] = [
  {
    id: 'o_001',
    title: '高校科研数字化治理创新专项',
    code: 'OPEN-2026-001',
    category: '重点项目',
    department: '科研处',
    amountLimit: 120000,
    deadline: '2026-05-10T18:00:00+08:00',
    summary: '面向高校科研管理场景，支持信息化治理、流程优化和数据分析相关研究方向。',
    requirements: ['申请人需为本校教师或研究生', '项目周期不超过 12 个月', '需提交研究计划与预算说明'],
  },
  {
    id: 'o_002',
    title: '青年教师科研启动基金',
    code: 'OPEN-2026-002',
    category: '青年项目',
    department: '人事处',
    amountLimit: 80000,
    deadline: '2026-05-18T18:00:00+08:00',
    summary: '支持青年教师围绕教学科研融合、学科交叉和创新探索开展前期研究。',
    requirements: ['申请人年龄原则上不超过 40 周岁', '仅限首次申请', '需提供近三年研究基础说明'],
  },
  {
    id: 'o_003',
    title: '研究生创新实践课题',
    code: 'OPEN-2026-003',
    category: '校级项目',
    department: '研究生院',
    amountLimit: 30000,
    deadline: '2026-05-25T18:00:00+08:00',
    summary: '鼓励研究生围绕实验平台建设、科研协同与成果转化开展创新实践。',
    requirements: ['需有导师同意', '项目成员不超过 5 人', '结题需提交成果报告'],
  },
]
