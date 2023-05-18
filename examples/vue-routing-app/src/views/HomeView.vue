<template>
  <div class="home">
    <PersikCard
      v-for="card in cards"
      :img="card.img"
      :title="card.title"
      :path="card.key"
      :key="card.key"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PersikCard from '@/components/PersikCard.vue';
import { PERSIK_DATA } from '@/persik-data';
import { PersikInfo } from '@/type';

const cards: PersikInfo[] = Object.values(PERSIK_DATA);

export default defineComponent({
  name: 'HomeView',
  components: {
    PersikCard,
  },
  data: () => ({ cards }),
});
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
