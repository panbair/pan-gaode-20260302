<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="特效代码"
    width="70%"
    class="code-dialog"
  >
    <div class="code-content">
      <el-button
        type="primary"
        size="small"
        @click="$emit('copy', code)"
        icon="DocumentCopy"
        style="margin-bottom: 10px"
      >
        复制代码
      </el-button>
      <pre class="code-block"><code>{{ code }}</code></pre>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  code: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'copy', code: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss" scoped>
.code-dialog {
  .code-content {
    .code-block {
      background: #282c34;
      color: #abb2bf;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      max-height: 500px;
      overflow-y: auto;
    }

    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
  }
}
</style>
