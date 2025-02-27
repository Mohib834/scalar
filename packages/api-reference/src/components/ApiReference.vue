<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, ref } from 'vue'

import { useTemplateStore } from '../stores/template'
import { type ReferenceProps, type SpecConfiguration } from '../types'
import ApiReferenceBase from './ApiReferenceBase.vue'
import DarkModeToggle from './DarkModeToggle.vue'
import MobileHeader from './MobileHeader.vue'
import SearchButton from './SearchButton.vue'

const props = defineProps<ReferenceProps>()

const { state } = useTemplateStore()

const isMobile = useMediaQuery('(max-width: 1000px)')

const content = ref('')

// Override the sidebar value for mobile to open and close the drawer
const config = computed(() => {
  const showSidebar = isMobile.value
    ? state.showMobileDrawer
    : props.configuration?.showSidebar
  const spec: SpecConfiguration = props.configuration?.spec || {
    content: content.value,
  }
  return { ...props.configuration, showSidebar, spec }
})

const otherProps = computed(() => {
  const { configuration, ...other } = props
  return other
})
</script>
<template>
  <ApiReferenceBase
    v-bind="otherProps"
    :configuration="config"
    @updateContent="content = $event">
    <template
      v-if="isMobile"
      #header>
      <MobileHeader />
    </template>
    <template
      v-if="!isMobile"
      #sidebar-start>
      <SearchButton :searchHotKey="props.configuration?.searchHotKey" />
    </template>
    <template #sidebar-end>
      <DarkModeToggle />
    </template>
  </ApiReferenceBase>
</template>
<style>
@media (max-width: 1000px) {
  :root {
    /* By default add a header on mobile for the navigation */
    --theme-header-height: 50px;
  }
}
</style>
