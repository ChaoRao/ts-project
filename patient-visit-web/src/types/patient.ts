/** 就诊类型 */
export type VisitType = '门诊' | '住院' | '急诊'

/** 患者就诊状态 */
export type PatientStatus = '在院' | '出院' | '就诊中'

/** 诊断类型 */
export type DiagnosisType = '主要诊断' | '其他诊断'

/** 诊断状态 */
export type DiagnosisStatus = '确诊' | '疑似' | '待查'

/** 患者基本信息 */
export interface PatientInfo {
  id: string
  name: string
  gender: '男' | '女'
  age: number
  patientNo: string
  idCard: string
  phone: string
  department: string
  visitType: VisitType
  visitDate: string
  status: PatientStatus
  chiefComplaint: string
  presentIllness: string
  doctor: string
  bedNo?: string
}

/** 诊断信息 */
export interface Diagnosis {
  id: string
  name: string
  icdCode: string
  type: DiagnosisType
  status: DiagnosisStatus
  diagnoseDate: string
}

/** 生命体征 */
export interface VitalSign {
  date: string
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  respiratoryRate: number
  spo2: number
}

/** 检验结果 */
export interface LabResult {
  id: string
  name: string
  value: string
  unit: string
  referenceRange: string
  abnormal: boolean
  date: string
}

/** 就诊记录 */
export interface VisitRecord {
  id: string
  date: string
  department: string
  doctor: string
  type: string
  summary: string
}

/** 患者就诊完整信息（详情接口返回） */
export interface PatientVisitDetail extends PatientInfo {
  diagnoses: Diagnosis[]
  vitalSigns: VitalSign[]
  labResults: LabResult[]
  visitRecords: VisitRecord[]
}

/** 超声图像（模拟 DICOM 截图的静态资源） */
export interface UltrasoundImage {
  id: string
  url: string
  caption: string
}

/** 超声图文报告 */
export interface UltrasoundReport {
  id: string
  reportNo: string
  examItem: string
  bodyPart: string
  examDate: string
  reportDate: string
  examDoctor: string
  reviewDoctor: string
  device: string
  findings: string
  conclusion: string
  images: UltrasoundImage[]
}

/** 患者分页查询结果 */
export interface PatientPageResult {
  total: number
  list: PatientInfo[]
  page: number
  pageSize: number
}
