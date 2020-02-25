<template>
  <v-app>
    <c-navbar></c-navbar>
    <v-content class="content-main">
      <div style="padding: 40px 20px 0px 20px">
        <router-view></router-view>
      </div>
    </v-content>
    <c-footer></c-footer>
  </v-app>

</template>

<script>

export default {
  name: 'App',
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
