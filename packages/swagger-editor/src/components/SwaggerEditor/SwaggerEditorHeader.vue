<script setup lang="ts">
import { FlowModal, useModal } from '@scalar/use-modal'
import { useFileDialog } from '@vueuse/core'
import { ref, watch } from 'vue'

import { fetchSpecFromUrl } from '../../helpers'
import {
  type EditorHeaderTabs,
  type SwaggerEditorHeaderProps,
} from '../../types'
import FlowButton from '../FlowButton.vue'
import FlowTextField from '../FlowTextField.vue'

const props = defineProps<SwaggerEditorHeaderProps>()

const emit = defineEmits<{
  (e: 'import', value: string): void
  (e: 'updateActiveTab', value: EditorHeaderTabs): void
}>()

const { files, open, reset } = useFileDialog({
  multiple: false,
  accept: '.json,.yaml,.yml',
})

const importUrlModal = useModal()
const importUrlError = ref<string | null>(null)

defineExpose({
  importUrlModal,
  openFileDialog: open,
})

const specUrl = ref('')

const handleImportUrl = () => {
  importUrlError.value = ''

  fetchSpecFromUrl(specUrl.value, props.proxyUrl)
    .then(async (content) => {
      emit('import', content)
      importUrlModal.hide()
    })
    .catch((error) => {
      console.error('[importUrl]', error)
      importUrlError.value = error
    })
}

watch(files, () => {
  if (files.value?.length) {
    const file = files.value[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (typeof data !== 'string') return

      emit('import', data)
      reset()
    }
    reader.readAsText(file)
  }
})
</script>
<template>
  <div class="swagger-editor-header">
    <!-- <div
      class="swagger-editor-title"
      :class="{
        'swagger-editor-active': activeTab === 'Getting Started',
      }"
      @click="emit('updateActiveTab', 'Getting Started')">
      <div class="swagger-editor-type">Getting Started</div>
    </div> -->
    <div
      class="swagger-editor-title"
      :class="{
        'swagger-editor-active': activeTab === 'Swagger Editor',
      }"
      @click="emit('updateActiveTab', 'Swagger Editor')">
      <div class="swagger-editor-type">Swagger Editor</div>
    </div>
    <div
      class="swagger-editor-title"
      :class="{
        'swagger-editor-active': activeTab === 'Getting Started',
      }"
      @click="emit('updateActiveTab', 'Getting Started')">
      <div class="swagger-editor-type">Getting Started</div>
    </div>
    <div
      class="swagger-editor-title"
      :class="{
        'swagger-editor-active': activeTab === 'AI Writer',
      }"
      @click="emit('updateActiveTab', 'AI Writer')">
      <div class="swagger-editor-type">✨ AI Writer</div>
    </div>
  </div>
  <div
    v-show="activeTab === 'Swagger Editor'"
    class="swagger-editor-buttons">
    <div class="swagger-editor-heading">Swagger File</div>
    <div>
      <button
        type="button"
        @click="() => open()">
        Upload File
      </button>
      <button
        type="button"
        @click="importUrlModal.show">
        Import URL
      </button>
    </div>
  </div>
  <FlowModal
    :state="importUrlModal"
    title="Import Swagger from URL">
    <div class="flex-col gap-1">
      <FlowTextField
        v-model="specUrl"
        autofocus
        label="URL"
        placeholder="https://scalar.com/swagger.json" />
      {{ importUrlError }}
      <div class="flex-mobile gap-1">
        <FlowButton
          label="Cancel"
          variant="outlined"
          @click="importUrlModal.hide()" />
        <FlowButton
          label="Import"
          @click="handleImportUrl" />
      </div>
    </div>
  </FlowModal>
</template>
<style>
.swagger-editor-header {
  padding: 11px 12px 0 12px;
  display: flex;
  align-items: center;
  flex-flow: wrap;
  position: relative;
  border-bottom: 1px solid
    var(--theme-border-color, var(--default-theme-border-color));
}

.swagger-editor-header span {
  font-size: var(--theme-mini, var(--default-theme-mini));
  color: var(--theme-color-3, var(--default-theme-color-3));
  font-weight: 600;
  margin-right: 12px;
  position: relative;
  cursor: pointer;
}

.swagger-editor-title {
  font-weight: var(--theme-semibold, var(--default-theme-semibold));
  border-radius: var(--theme-radius, var(--default-theme-radius))
    var(--theme-radius, var(--default-theme-radius)) 0 0;
  color: var(--theme-color-2, var(--default-theme-color-2));
  font-size: var(--theme-mini, var(--default-theme-mini));
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.swagger-editor-title:hover:not(.swagger-editor-active):after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-radius: var(--theme-radius, var(--default-theme-radius));
  background: var(--theme-background-2, var(--default-theme-background-2));
}
.swagger-editor-type {
  padding: 9px 12px;
  user-select: none;
  position: relative;
  z-index: 1;
}
.swagger-editor-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 6px 0 12px;
  height: 44px;
  min-height: 44px;
  align-items: center;
  border-bottom: 1px solid
    var(--theme-border-color, var(--default-theme-border-color));
  background: var(--theme-background-1, var(--default-theme-background-1));
}
.swagger-editor-active {
  /* use layered box shadow so opaque border overlap doesn't show  */
  box-shadow: 0 1px 0 0px
      var(--theme-background-1, var(--default-theme-background-1)),
    0px 0 0 1px var(--theme-border-color, var(--default-theme-border-color)),
    0 0 0 1px var(--theme-background-1, var(--default-theme-background-1));
  cursor: default;
  color: var(--theme-color-1, var(--default-theme-color-1));
}
.swagger-editor-buttons button {
  background: transparent;
  appearance: none;
  outline: none;
  border: none;
  color: var(--theme-color-1, var(--default-theme-color-1));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
  padding: 9px;
  border-radius: var(--theme-radius, var(--default-theme-radius));
  font-weight: var(--theme-semibold, var(--default-theme-semibold));
  font-size: var(--theme-font-size-4, var(--default-theme-font-size-4));
  user-select: none;
  display: flex;
  align-items: center;
}
.swagger-editor-buttons button svg {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.swagger-editor-buttons div {
  display: flex;
}
.swagger-editor-buttons button:hover {
  cursor: pointer;
  border-color: currentColor;
  background: var(--theme-background-2, var(--default-theme-background-2));
}
.swagger-editor-heading {
  font-weight: var(--theme-semibold, var(--default-theme-semibold));
  font-size: var(--theme-mini, var(--default-theme-mini));
  color: var(--theme-color-3, var(--default-theme-color-3));
  text-transform: uppercase;
}
</style>
