<template>
  <v-app>
    <Navbar/>
    <v-content class="content-main">
      <div style="padding: 40px 20px 0px 20px">
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>

</template>

<script>

import Navbar from '@/components/Navbar'
export default {
  name: 'App',
  components: {
   Navbar
  },

  data: () => ({
    //
  }),
};
</script>
<style lang="scss">
@import './styles/index.scss';
.content-main {
  background-color: #f9f9f9;
}
</style>
