import type {
  PatientInfo,
  PatientPageResult,
  PatientVisitDetail,
  UltrasoundReport,
} from '@/types/patient'

/**
 * 接口层：调用 FastAPI 后端服务（默认 http://localhost:8000）。
 * 组件只依赖这些函数，后端地址变更时只需修改 API_BASE。
 */

const API_BASE = 'http://localhost:8000'

/** 统一请求封装 */
async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`接口请求失败：HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

/** 患者分页查询参数 */
export interface PatientQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/** 患者列表（分页 + 条件查询）：GET /api/patients */
export function getPatientList(params: PatientQueryParams): Promise<PatientPageResult> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    keyword: params.keyword ?? '',
  })
  return request<PatientPageResult>(`/api/patients?${searchParams.toString()}`)
}

/** 患者详情：GET /api/patients/{id} */
export function getPatientDetail(id: string): Promise<PatientVisitDetail> {
  return request<PatientVisitDetail>(`/api/patients/${encodeURIComponent(id)}`)
}

/** 超声图文报告：GET /api/patients/{id}/ultrasound-reports */
export async function getUltrasoundReports(
  patientId: string
): Promise<UltrasoundReport[]> {
  const reports = await request<UltrasoundReport[]>(
    `/api/patients/${encodeURIComponent(patientId)}/ultrasound-reports`
  )
  // 后端返回图像相对路径（如 /ultrasound/heart.svg），拼接为可访问的完整地址
  return reports.map((report) => ({
    ...report,
    images: report.images.map((image) => ({
      ...image,
      url: `${API_BASE}${image.url}`,
    })),
  }))
}
