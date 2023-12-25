<template>
  <div>
    <PushCard></PushCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import PushCard from './components/PushCard.vue';

export default defineComponent({
  name: 'App',
  components: {
    PushCard,
  },
  setup() {
    onMounted(() => {
    });
    return {
    };
  },
});
</script>
<style lang="scss" scoped></style>
