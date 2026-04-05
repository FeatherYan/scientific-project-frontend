import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  applyProjectOpportunity,
  deleteProject,
  getProjectDetail,
  getMyProjectByOpportunity,
  getMyProjectList,
  getProjectOpportunityDetail,
  getProjectOpportunityList,
  saveProjectDraft,
  submitProject,
} from '../api/project'
import type { ProjectListParams, SaveProjectPayload } from '../types/project'

const projectKeys = {
  all: ['projects'] as const,
  opportunityList: (params: ProjectListParams) =>
    [...projectKeys.all, 'opportunity-list', params] as const,
  opportunityDetail: (id: string) =>
    [...projectKeys.all, 'opportunity-detail', id] as const,
  myProjectByOpportunity: (id: string) =>
    [...projectKeys.all, 'my-project-by-opportunity', id] as const,
  myList: (params: ProjectListParams) => [...projectKeys.all, 'my-list', params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}

export function useProjectOpportunityList(params: ProjectListParams) {
  return useQuery({
    queryKey: projectKeys.opportunityList(params),
    queryFn: () => getProjectOpportunityList(params),
  })
}

export function useProjectOpportunityDetail(id: string) {
  return useQuery({
    queryKey: projectKeys.opportunityDetail(id),
    queryFn: () => getProjectOpportunityDetail(id),
    enabled: Boolean(id),
  })
}

export function useMyProjectByOpportunity(id: string) {
  return useQuery({
    queryKey: projectKeys.myProjectByOpportunity(id),
    queryFn: () => getMyProjectByOpportunity(id),
    enabled: Boolean(id),
  })
}

export function useApplyProjectOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => applyProjectOpportunity(id),
    onSuccess: () => {
      message.success('已成功发起申报，已为你创建一条草稿记录')
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useMyProjectList(params: ProjectListParams) {
  return useQuery({
    queryKey: projectKeys.myList(params),
    queryFn: () => getMyProjectList(params),
  })
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectDetail(id),
    enabled: Boolean(id),
  })
}

export function useSaveProjectDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SaveProjectPayload }) =>
      saveProjectDraft(id, payload),
    onSuccess: (data) => {
      message.success('草稿已保存')
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
      void queryClient.setQueryData(projectKeys.detail(data.id), data)
    },
  })
}

export function useSubmitProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => submitProject(id),
    onSuccess: () => {
      message.success('项目已提交，等待管理员审批')
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      message.success('草稿项目已删除')
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
