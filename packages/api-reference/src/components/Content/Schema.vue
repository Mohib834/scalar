<script lang="ts" setup>
import SchemaProperty from './SchemaProperty.vue'

withDefaults(
  defineProps<{
    value?: Record<string, any>
    level?: number
    name?: string
  }>(),
  {
    level: 0,
  },
)
</script>
<template>
  <div class="schema">
    <div
      v-if="value?.properties"
      class="properties">
      <div class="type">
        <span
          class="type-icon"
          :title="value.type">
          <template v-if="value.type === 'object'"> {} </template>
          <template v-if="value.type === 'array'"> [] </template>
        </span>
        <template v-if="value?.xml?.name && value?.xml?.name !== '##default'">
          &lt;{{ value?.xml?.name }} /&gt;
        </template>
        <template v-else-if="name">
          {{ name }}
        </template>
        <template v-else>
          {{ value.type }}
        </template>
      </div>
      <SchemaProperty
        v-for="property in Object.keys(value.properties)"
        :key="property"
        :level="level"
        :name="property"
        :required="
          value.required &&
          value.required.length &&
          value.required.includes(property)
        "
        :value="value.properties[property]" />
    </div>
    <div
      v-else-if="value?.type"
      class="properties">
      <SchemaProperty
        :level="level"
        :value="value" />
    </div>
  </div>
</template>

<style scoped>
.error {
  background-color: red;
}
.schema {
  width: 100%;
  font-size: var(--theme-font-size-3, var(--default-theme-font-size-3));
  color: var(--theme-color-1, var(--default-theme-color-1));
}

.type {
  font-size: var(--theme-micro, var(--default-theme-micro));
  color: var(--theme-color-2, var(--default-theme-color-2));
  font-family: var(--theme-font-code, var(--default-theme-font-code));
  font-weight: var(--theme-bold, var(--default-theme-bold));
  background: var(--theme-background-4, var(--default-theme-background-4));
  padding: 10px 12px;
}

.type-icon {
  color: var(--theme-color-1, var(--default-theme-color-1));
  font-size: var(--theme-micro, var(--default-theme-micro));
}

.properties {
  border: 1px solid var(--theme-border-color, var(--default-theme-border-color));
  margin: 24px 0 0;
  border-radius: var(--theme-radius-lg, var(--default-theme-radius-lg));
  overflow: hidden;
}
.properties .properties {
  margin-top: 12px;
}
</style>
