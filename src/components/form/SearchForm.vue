<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ search: [id: number] }>()

const id = ref(10975505)

const onInitSearch = () => {
  const value = id.value
  if (!value) {
    return
  }
  emit('search', value)
}
</script>

<template>
  <form :class="$style.form" @submit.prevent="onInitSearch">
    <input v-model="id" type="number" placeholder="Group ID" />
    <button type="submit">Search users</button>
  </form>
</template>

<style lang="scss" module>
.form {
  margin-top: 4rem;
}
</style>
