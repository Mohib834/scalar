<script setup lang="ts">
import { useRequestStore } from '../../../stores'
import type { Query } from '../../../types'
import { CollapsibleSection } from '../../CollapsibleSection'
import { Grid } from '../../Grid'

defineProps<{ queries?: Query[] }>()

const { activeRequest } = useRequestStore()

function handleDeleteIndex(index: number) {
  activeRequest.query?.splice(index, 1)
}

function addAnotherHandler() {
  activeRequest.query?.push({ name: '', value: '' })
}
</script>
<template>
  <CollapsibleSection title="Query Parameters">
    <template v-if="!queries || queries.length === 0">
      <div class="scalar-api-client__empty-state">
        <button
          class="scalar-api-client-add"
          type="button"
          @click="addAnotherHandler">
          <svg
            class="flow-icon"
            data-v-aa4fbd2d=""
            height="100%"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 1.714v44.572M1.714 24h44.572"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3.429"
              xmlns="http://www.w3.org/2000/svg"></path>
          </svg>
          Query Parameter
        </button>
      </div>
    </template>
    <template v-else>
      <Grid
        addLabel="Query Parameter"
        :items="queries"
        @addAnother="addAnotherHandler"
        @deleteIndex="handleDeleteIndex" />
    </template>
  </CollapsibleSection>
</template>
