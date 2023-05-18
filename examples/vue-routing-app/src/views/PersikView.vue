<template>
  <PersikCard :title="info.title" :path="info.key" :img="info.img"></PersikCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PersikInfo } from '@/type';
import { PERSIK_DATA } from '@/persik-data';
import PersikCard from '@/components/PersikCard.vue';

export default defineComponent({
  components: { PersikCard },
  computed: {
    path(): string {
      return this.$route.fullPath;
    },
    info(): PersikInfo {
      return PERSIK_DATA[this.path];
    },
  },
});
</script>

<style lang="scss" scoped></style>
