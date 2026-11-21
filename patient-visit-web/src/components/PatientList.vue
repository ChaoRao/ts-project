<template>
  <el-card v-loading="loading" class="list-card card-shadow" shadow="never">
    <template #header>
      <div class="list-header">
        <span class="section-title">患者列表</span>
        <el-tag type="info" size="small">共 {{ total }} 人</el-tag>
      </div>
      <el-input
        v-model="keywordInput"
        placeholder="就诊号 / 科室 / 姓名"
        clearable
        @keyup.enter="doSearch"
        @clear="doSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="doSearch" />
        </template>
      </el-input>
    </template>

    <div class="patient-list">
      <div
        v-for="p in patients"
        :key="p.id"
        class="patient-item"
        :class="{ active: p.id === currentId }"
        @click="emit('select', p.id)"
      >
        <div class="item-top">
          <el-avatar
            :size="40"
            :style="{ background: p.gender === '男' ? '#409eff' : '#e6a23c' }"
          >
            {{ p.name.charAt(0) }}
          </el-avatar>
          <div class="item-main">
            <div class="item-name-row">
              <span class="name">{{ p.name }}</span>
              <el-tag size="small" :type="visitTypeTag(p.visitType)" effect="light">
                {{ p.visitType }}
              </el-tag>
              <el-tag size="small" :type="statusTag(p.status)" effect="plain">
                {{ p.status }}
              </el-tag>
            </div>
            <div class="item-sub">{{ p.gender }} · {{ p.age }} 岁 · {{ p.department }}</div>
            <div class="item-sub text-muted">{{ p.patientNo }}</div>
          </div>
        </div>
        <div class="item-bottom">
          <span class="text-muted">{{ p.visitDate }}</span>
          <span class="doctor">{{ p.doctor }} 医生</span>
        </div>
      </div>

      <el-empty v-if="!patients.length" description="无匹配患者" :image-size="70" />
    </div>

    <template #footer>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[3, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        small
        @current-change="emit('update:page', $event)"
        @size-change="handleSizeChange"
      />
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { PatientInfo, VisitType, PatientStatus } from '@/types/patient'

defineProps<{
  patients: PatientInfo[]
  total: number
  currentId: string
  page: number
  pageSize: number
  loading: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  'update:page': [page: number]
  'update:pageSize': [size: number]
  search: [keyword: string]
}>()

const keywordInput = ref('')

function doSearch() {
  emit('search', keywordInput.value.trim())
}

function handleSizeChange(size: number) {
  emit('update:pageSize', size)
}

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
</script>

<style scoped>
.list-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.list-card :deep(.el-card__header) {
  flex: 0 0 auto;
  padding: 14px;
}
.list-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  padding: 10px;
  overflow-y: auto;
}
.list-card :deep(.el-card__footer) {
  flex: 0 0 auto;
  padding: 10px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.patient-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.patient-item {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}
.patient-item:hover {
  border-color: #a3c9f0;
  background: #f5faff;
}
.patient-item.active {
  border-color: var(--el-color-primary);
  background: #eef6ff;
  box-shadow: inset 0 0 0 1px var(--el-color-primary);
}
.item-top {
  display: flex;
  gap: 10px;
}
.item-main {
  flex: 1;
  min-width: 0;
}
.item-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.name {
  font-weight: 600;
  font-size: 15px;
}
.item-sub {
  font-size: 12px;
  margin-top: 4px;
}
.item-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}
.doctor {
  color: #606266;
}
</style>
