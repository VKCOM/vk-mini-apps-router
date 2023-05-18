<template>
  <div class="persik">
    <div><img :src="img" :alt="title" class="persik__img" /></div>
    <router-link :to="path">{{ title }}</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PersikCard',
  props: {
    img: String,
    title: String,
    path: String,
  },
});
</script>

<style scoped lang="scss">
.persik {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding: 50px;

  &__img {
    width: 100%;
  }

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
