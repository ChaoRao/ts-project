<template>
  <div v-loading="loading">
    <template v-if="reports.length">
      <!-- 多份报告切换 -->
      <div class="report-switch">
        <el-radio-group v-model="activeReportId">
          <el-radio-button v-for="r in reports" :key="r.id" :value="r.id">
            {{ r.examItem }}　{{ r.examDate.slice(0, 10) }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="currentReport">
        <!-- 报告元信息 -->
        <el-descriptions :column="3" border size="small" class="report-info">
          <el-descriptions-item label="检查号">{{ currentReport.reportNo }}</el-descriptions-item>
          <el-descriptions-item label="检查项目">{{ currentReport.examItem }}</el-descriptions-item>
          <el-descriptions-item label="检查部位">{{ currentReport.bodyPart }}</el-descriptions-item>
          <el-descriptions-item label="检查时间">{{ currentReport.examDate }}</el-descriptions-item>
          <el-descriptions-item label="报告时间">{{ currentReport.reportDate }}</el-descriptions-item>
          <el-descriptions-item label="检查设备">{{ currentReport.device }}</el-descriptions-item>
          <el-descriptions-item label="检查医师">{{ currentReport.examDoctor }}</el-descriptions-item>
          <el-descriptions-item label="审核医师">{{ currentReport.reviewDoctor }}</el-descriptions-item>
          <el-descriptions-item label="图像数量">{{ currentReport.images.length }} 幅</el-descriptions-item>
        </el-descriptions>

        <!-- 超声图像：点击可放大预览 -->
        <div class="section-title">超声图像（点击图片可放大）</div>
        <div class="image-gallery">
          <div v-for="(img, index) in currentReport.images" :key="img.id" class="image-item">
            <el-image
              :src="img.url"
              :preview-src-list="imageUrls"
              :initial-index="index"
              fit="cover"
              class="ultrasound-img"
              preview-teleported
            />
            <div class="image-caption">{{ img.caption }}</div>
          </div>
        </div>

        <!-- 检查所见与检查提示 -->
        <div class="narrative-grid">
          <div>
            <div class="section-title">检查所见</div>
            <div class="report-box">{{ currentReport.findings }}</div>
          </div>
          <div>
            <div class="section-title">检查提示</div>
            <div class="report-box conclusion">{{ currentReport.conclusion }}</div>
          </div>
        </div>
      </div>
    </template>

    <el-empty v-else description="该患者暂无超声图文报告" :image-size="90" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getUltrasoundReports } from '@/api/patient'
import type { UltrasoundReport } from '@/types/patient'

const props = defineProps<{ patientId: string }>()

const reports = ref<UltrasoundReport[]>([])
const activeReportId = ref('')
const loading = ref(false)

const currentReport = computed(
  () => reports.value.find((r) => r.id === activeReportId.value) ?? null
)
const imageUrls = computed(() => currentReport.value?.images.map((i) => i.url) ?? [])

watch(
  () => props.patientId,
  async (id) => {
    if (!id) {
      reports.value = []
      activeReportId.value = ''
      return
    }
    loading.value = true
    try {
      reports.value = await getUltrasoundReports(id)
      activeReportId.value = reports.value[0]?.id ?? ''
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.report-switch {
  margin-bottom: 16px;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 10px 0 18px;
}
.image-item {
  width: 280px;
}
.ultrasound-img {
  width: 280px;
  height: 210px;
  border-radius: 6px;
  background: #000;
  border: 1px solid #303133;
  cursor: zoom-in;
}
.image-caption {
  text-align: center;
  font-size: 12px;
  color: #606266;
  margin-top: 6px;
}
.narrative-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.report-box {
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 12px;
  line-height: 1.8;
  font-size: 13px;
  color: #4a5768;
  margin-top: 8px;
  min-height: 92px;
}
.report-box.conclusion {
  background: #eef6ff;
  border-left: 3px solid var(--el-color-primary);
  color: #1f2d3d;
  font-weight: 500;
}
@media (max-width: 1100px) {
  .narrative-grid {
    grid-template-columns: 1fr;
  }
}
</style>
