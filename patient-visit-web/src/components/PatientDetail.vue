<template>
  <div v-if="detail" v-loading="loading">
    <!-- 患者概要 -->
    <el-card class="card-shadow" shadow="never">
      <div class="summary-wrap">
        <el-avatar
          :size="62"
          :style="{
            background: detail.gender === '男' ? '#409eff' : '#e6a23c',
            fontSize: '24px',
          }"
        >
          {{ detail.name.charAt(0) }}
        </el-avatar>
        <div class="summary-info">
          <div class="summary-name">
            {{ detail.name }}
            <el-tag size="small" :type="visitTypeTag(detail.visitType)" effect="light">
              {{ detail.visitType }}
            </el-tag>
            <el-tag size="small" :type="statusTag(detail.status)" effect="plain">
              {{ detail.status }}
            </el-tag>
          </div>
          <div class="summary-meta">
            <span>{{ detail.gender }} · {{ detail.age }} 岁</span>
            <el-divider direction="vertical" />
            <span>就诊号：{{ detail.patientNo }}</span>
            <el-divider direction="vertical" />
            <span>科室：{{ detail.department }}</span>
            <el-divider direction="vertical" />
            <span>床位：{{ detail.bedNo || '—' }}</span>
          </div>
        </div>
        <div class="summary-right">
          <div class="text-muted">{{ detail.visitType === '住院' ? '入院时间' : '就诊时间' }}</div>
          <div class="summary-date">{{ detail.visitDate }}</div>
          <div class="text-muted" style="margin-top: 6px">主治医生：{{ detail.doctor }}</div>
        </div>
      </div>
    </el-card>

    <!-- 详情 Tab -->
    <el-card class="card-shadow" shadow="never" style="margin-top: 16px">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="tab-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ detail.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ detail.gender }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ detail.age }} 岁</el-descriptions-item>
              <el-descriptions-item label="就诊号">{{ detail.patientNo }}</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ detail.idCard }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ detail.phone }}</el-descriptions-item>
              <el-descriptions-item label="就诊科室">{{ detail.department }}</el-descriptions-item>
              <el-descriptions-item label="就诊类型">{{ detail.visitType }}</el-descriptions-item>
              <el-descriptions-item label="床位号">{{ detail.bedNo || '—' }}</el-descriptions-item>
              <el-descriptions-item label="主治医生">{{ detail.doctor }}</el-descriptions-item>
              <el-descriptions-item label="就诊时间">{{ detail.visitDate }}</el-descriptions-item>
              <el-descriptions-item label="当前状态">{{ detail.status }}</el-descriptions-item>
            </el-descriptions>

            <div class="narrative">
              <div class="section-title">主诉</div>
              <div class="narrative-box">{{ detail.chiefComplaint }}</div>
              <div class="section-title" style="margin-top: 16px">现病史</div>
              <div class="narrative-box">{{ detail.presentIllness }}</div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 诊断信息 -->
        <el-tab-pane :label="`诊断信息 (${detail.diagnoses.length})`" name="diagnosis">
          <div class="tab-content">
            <el-table :data="detail.diagnoses" border stripe style="width: 100%">
              <el-table-column prop="name" label="诊断名称" min-width="260" />
              <el-table-column prop="icdCode" label="ICD 编码" width="120" align="center" />
              <el-table-column label="诊断类型" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="diagTypeTag(row.type)" size="small" effect="light">
                    {{ row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="诊断状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="diagStatusTag(row.status)" size="small" effect="plain">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="diagnoseDate" label="诊断日期" width="120" align="center" />
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 生命体征 -->
        <el-tab-pane label="生命体征" name="vital">
          <div class="tab-content">
            <template v-if="latestVital">
              <div class="vital-grid">
                <div class="vital-card">
                  <div class="vital-label">体温</div>
                  <div class="vital-value" :class="tempCls(latestVital.temperature)">
                    {{ latestVital.temperature }}<span class="vital-unit">℃</span>
                  </div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">血压</div>
                  <div class="vital-value" :class="bpCls(latestVital.systolic, latestVital.diastolic)">
                    {{ latestVital.systolic }}/{{ latestVital.diastolic }}
                    <span class="vital-unit">mmHg</span>
                  </div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">心率</div>
                  <div class="vital-value" :class="hrCls(latestVital.heartRate)">
                    {{ latestVital.heartRate }}<span class="vital-unit">次/分</span>
                  </div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">呼吸</div>
                  <div class="vital-value" :class="rrCls(latestVital.respiratoryRate)">
                    {{ latestVital.respiratoryRate }}<span class="vital-unit">次/分</span>
                  </div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">血氧饱和度</div>
                  <div class="vital-value" :class="spo2Cls(latestVital.spo2)">
                    {{ latestVital.spo2 }}<span class="vital-unit">%</span>
                  </div>
                </div>
              </div>
              <div class="vital-tip">
                最新记录：{{ latestVital.date }}　<span class="text-muted">异常值以红色标识</span>
              </div>
            </template>

            <el-table :data="detail.vitalSigns" border stripe style="width: 100%">
              <el-table-column prop="date" label="测量时间" min-width="160" />
              <el-table-column label="体温(℃)" width="100" align="center">
                <template #default="{ row }">
                  <span :class="tempCls(row.temperature)">{{ row.temperature }}</span>
                </template>
              </el-table-column>
              <el-table-column label="血压(mmHg)" width="120" align="center">
                <template #default="{ row }">
                  <span :class="bpCls(row.systolic, row.diastolic)">
                    {{ row.systolic }}/{{ row.diastolic }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="心率(次/分)" width="110" align="center">
                <template #default="{ row }">
                  <span :class="hrCls(row.heartRate)">{{ row.heartRate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="呼吸(次/分)" width="110" align="center">
                <template #default="{ row }">
                  <span :class="rrCls(row.respiratoryRate)">{{ row.respiratoryRate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="血氧(%)" width="100" align="center">
                <template #default="{ row }">
                  <span :class="spo2Cls(row.spo2)">{{ row.spo2 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 检验结果 -->
        <el-tab-pane :label="`检验结果 (${detail.labResults.length})`" name="lab">
          <div class="tab-content">
            <el-table :data="detail.labResults" border stripe style="width: 100%">
              <el-table-column prop="name" label="检验项目" min-width="220" />
              <el-table-column label="结果" width="110" align="center">
                <template #default="{ row }">
                  <span :class="row.abnormal ? 'abnormal-value' : ''">{{ row.value }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" width="100" align="center" />
              <el-table-column prop="referenceRange" label="参考范围" width="140" align="center" />
              <el-table-column label="判定" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.abnormal ? 'danger' : 'success'" size="small" effect="plain">
                    {{ row.abnormal ? '异常' : '正常' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="检验日期" width="120" align="center" />
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 就诊记录 -->
        <el-tab-pane :label="`就诊记录 (${detail.visitRecords.length})`" name="record">
          <div class="tab-content">
            <el-timeline>
              <el-timeline-item
                v-for="r in detail.visitRecords"
                :key="r.id"
                :timestamp="r.date"
                placement="top"
                :color="r.type === '急诊' ? '#f56c6c' : '#409eff'"
              >
                <el-card shadow="never" class="record-card">
                  <div class="record-head">
                    <span class="record-title">{{ r.department }} · {{ r.type }}</span>
                    <span class="text-muted">{{ r.doctor }} 医生</span>
                  </div>
                  <div class="record-summary">{{ r.summary }}</div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>

        <!-- 超声图文报告 -->
        <el-tab-pane label="超声图文报告" name="ultrasound">
          <div class="tab-content">
            <UltrasoundReports :patient-id="detail.id" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

  <el-card v-else class="card-shadow" shadow="never">
    <el-empty description="请选择患者查看详情" />
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UltrasoundReports from '@/components/UltrasoundReports.vue'
import type {
  PatientVisitDetail,
  VisitType,
  PatientStatus,
  DiagnosisType,
  DiagnosisStatus,
} from '@/types/patient'

const props = defineProps<{
  detail: PatientVisitDetail | null
  loading: boolean
}>()

const activeTab = ref('basic')
const latestVital = computed(() => props.detail?.vitalSigns?.[0] ?? null)

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

function visitTypeTag(type: VisitType): TagType {
  if (type === '住院') return 'primary'
  if (type === '急诊') return 'danger'
  return 'success'
}

function statusTag(status: PatientStatus): TagType {
  if (status === '在院') return 'warning'
  if (status === '就诊中') return 'primary'
  return 'info'
}

function diagTypeTag(type: DiagnosisType): 'danger' | 'info' {
  return type === '主要诊断' ? 'danger' : 'info'
}

function diagStatusTag(status: DiagnosisStatus): 'success' | 'warning' | 'info' {
  if (status === '确诊') return 'success'
  if (status === '疑似') return 'warning'
  return 'info'
}

function tempCls(v: number) {
  return v > 37.3 ? 'abnormal-value' : ''
}
function bpCls(s: number, d: number) {
  return s >= 140 || d >= 90 ? 'abnormal-value' : ''
}
function hrCls(v: number) {
  return v > 100 || v < 60 ? 'abnormal-value' : ''
}
function rrCls(v: number) {
  return v > 20 || v < 12 ? 'abnormal-value' : ''
}
function spo2Cls(v: number) {
  return v < 95 ? 'abnormal-value' : ''
}
</script>

<style scoped>
.summary-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}
.summary-info {
  flex: 1;
  min-width: 0;
}
.summary-name {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.summary-meta {
  margin-top: 8px;
  font-size: 13px;
  color: #606266;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.summary-right {
  text-align: right;
  font-size: 13px;
  white-space: nowrap;
}
.summary-date {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
}
.tab-content {
  min-height: 380px;
}
.narrative {
  margin-top: 18px;
}
.narrative-box {
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 12px;
  line-height: 1.8;
  font-size: 13px;
  color: #4a5768;
  margin-top: 8px;
}
.vital-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}
.vital-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: #fafcff;
}
.vital-label {
  font-size: 12px;
  color: #909399;
}
.vital-value {
  font-size: 22px;
  font-weight: 600;
  margin-top: 6px;
}
.vital-unit {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
  margin-left: 2px;
}
.vital-tip {
  font-size: 12px;
  margin-bottom: 10px;
}
.record-card {
  border: 1px solid #ebeef5;
}
.record-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}
.record-title {
  font-weight: 600;
}
.record-summary {
  font-size: 13px;
  line-height: 1.7;
  color: #4a5768;
}
</style>
