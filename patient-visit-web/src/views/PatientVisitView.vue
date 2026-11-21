<template>
  <el-container v-loading="listLoading" class="page-container">
    <el-header class="app-header">
      <div class="header-left">
        <el-icon :size="24"><FirstAidKit /></el-icon>
        <span class="title">患者就诊信息管理系统</span>
        <el-tag size="small" type="info" effect="plain">CDSS 演示</el-tag>
      </div>
      <div class="header-right">
        <span>{{ today }}</span>
        <el-avatar :size="30" style="margin-left: 16px; background: #67c23a">医</el-avatar>
        <span style="margin-left: 8px">值班医生</span>
      </div>
    </el-header>

    <el-main class="main-area">
      <el-row :gutter="16" class="content-row">
        <el-col :xs="24" :sm="24" :md="9" :lg="6" class="side-col">
          <PatientList
            :patients="patients"
            :total="total"
            :current-id="currentId"
            :page="page"
            :page-size="pageSize"
            :loading="listLoading"
            @select="handleSelect"
            @update:page="handlePageChange"
            @update:page-size="handleSizeChange"
            @search="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="15" :lg="18" class="detail-col">
          <!-- 滚动只发生在这里，左侧列表保持固定 -->
          <div class="detail-scroll">
            <PatientDetail :detail="currentDetail" :loading="detailLoading" />
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PatientList from '@/components/PatientList.vue'
import PatientDetail from '@/components/PatientDetail.vue'
import { getPatientList, getPatientDetail } from '@/api/patient'
import type { PatientInfo, PatientVisitDetail } from '@/types/patient'

const patients = ref<PatientInfo[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(3)
const keyword = ref('')
const currentId = ref<string>('')
const currentDetail = ref<PatientVisitDetail | null>(null)
const listLoading = ref(false)
const detailLoading = ref(false)

const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

async function loadPatientList() {
  listLoading.value = true
  try {
    const result = await getPatientList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
    })
    patients.value = result.list
    total.value = result.total
    // 当前选中患者不在新页/新结果中时，自动选中第一条
    if (patients.value.length > 0) {
      const stillExists = patients.value.some((p) => p.id === currentId.value)
      if (!stillExists) {
        await handleSelect(patients.value[0].id)
      }
    }
  } catch {
    ElMessage.error('患者列表加载失败')
  } finally {
    listLoading.value = false
  }
}

function handleSearch(kw: string) {
  keyword.value = kw
  page.value = 1
  loadPatientList()
}

function handlePageChange(newPage: number) {
  page.value = newPage
  loadPatientList()
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize
  page.value = 1
  loadPatientList()
}

async function handleSelect(id: string) {
  if (currentId.value === id && currentDetail.value) return
  currentId.value = id
  detailLoading.value = true
  try {
    currentDetail.value = await getPatientDetail(id)
  } catch {
    ElMessage.error('患者详情加载失败')
  } finally {
    detailLoading.value = false
  }
}

onMounted(loadPatientList)
</script>

<style scoped>
.page-container {
  height: 100vh;
}
.app-header {
  background: linear-gradient(90deg, #1e6fbf, #2b8ee6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.header-right {
  display: flex;
  align-items: center;
  font-size: 13px;
}
.main-area {
  padding: 16px;
  overflow: hidden;
  min-height: 0;
  background: var(--page-bg);
}
.content-row {
  height: 100%;
}
.side-col,
.detail-col {
  height: 100%;
  min-height: 0;
}
.detail-scroll {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

/* 窄屏下左右改为上下堆叠，恢复整页自然滚动 */
@media (max-width: 991px) {
  .main-area {
    overflow-y: auto;
  }
  .content-row,
  .side-col,
  .detail-col,
  .detail-scroll {
    height: auto;
    overflow: visible;
  }
}
</style>
