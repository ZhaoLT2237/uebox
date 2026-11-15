<script setup lang="ts">
/**
 * 中转站网页「聊天 → UEBox」唤起的 Box Plan 导入（unrealbox://box-plan?key=…）。挂在 App 根上：
 * 主进程拉到清单后跳到设置页的模型面板，导入预览由 CreatorPlanCard 弹；拉不到就提示原因。
 * 冷启动时清单可能比界面先拉到，挂载时补查一次。
 */
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { creatorPlanAPI } from '@renderer/api/creatorPlan'
import { message } from '@renderer/utils/messageManager'

const { t } = useI18n()
const router = useRouter()

function openModels(): void {
  void router.push({ path: '/preferences', query: { tab: 'models' } })
}

let unsubscribe: (() => void) | null = null
onMounted(async () => {
  unsubscribe = creatorPlanAPI.onLinkImport((result) => {
    if (result.ok) openModels()
    else if (result.code === 'network' && result.error)
      message.error(t('aiProvider.creatorPlan.errors.networkDetail', { error: result.error }))
    else if (result.code === 'unknown')
      message.error(t('aiProvider.creatorPlan.errors.unknown', { error: result.error }))
    else message.error(t(`aiProvider.creatorPlan.errors.${result.code}`))
  })
  if (await creatorPlanAPI.linkPreview()) openModels()
})
onUnmounted(() => unsubscribe?.())
</script>

<template>
  <span hidden />
</template>
