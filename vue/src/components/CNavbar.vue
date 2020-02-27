<template>
    <nav>
        <v-app-bar id="AppBar" class="app-bar coinBlack" app height="110">
	        <v-container class="pt-0 mt-1">
		        <v-row>
              <v-col md="8" sm="10">
                <v-row>
                  <v-img
                    :src="require('../assets/amo_white.png')"
                    max-height="35"
                    max-width="35"
                    @click="$router.push('/')"></v-img>
                  <v-toolbar-title @click="$router.push('/')" class="headline ml-2 hidden-sm-and-down white--text"> AMO Blockchain Explorer</v-toolbar-title>
                  <v-select
                    id="test13"
                    class="ml-3"
                    item-color="coinTeal"
                    style="max-width:20%;min-width:17%"
                    label="network"
                    single-line outlined rounded hide-details dark dense
                    :items="menuItem"
                    :menu-props="{ top: false, offsetY: true, color : '#ffffff' }"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col md="4" sm="2" class="d-inline-flex justify-end">
                <v-spacer></v-spacer>
                <v-text-field
                  class="hidden-sm-and-down"
                  label="Search"
                  single-line outlined rounded hide-details dense dark
                  prepend-inner-icon="search"
                ></v-text-field>
                <!--nav 아이콘은 md사이즈 화면에서부터 보인다-->
                <v-app-bar-nav-icon color="#555" class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
              </v-col>
		        </v-row>
            <v-row class="hidden-sm-and-down" justify="space-between">
              <v-tabs background-color="transparent" grow slider-color="coinTealLight" color="#ffffff">
                <v-tab v-for="page in routes" :key="page.name" :to="page.path" @click="currentPage = page" class="white--text tabs-item-font">
                  {{ page.name }}
                </v-tab>
              </v-tabs>
            </v-row>
	        </v-container>
        </v-app-bar>

      <v-navigation-drawer v-model="drawer" app class="app-navibar" temporary>
        <v-list flat>
          <v-list-item class="app-menu-item" v-for="page in routes" :key="page.name" :to="page.path" active-class="border" @click="currentPage = page">
            <v-list-item-action>
              <v-icon>{{page.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="app-menu-item-text">{{page.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>
</template>
<script>
  import routes from '../router/routes';
export default {
    data: () => ({
        drawer: false,
        routes: routes,
        currentPage: {},
	    menuItem : ['mainnet', 'testnet']
    }),
    components: {
        // Popup
    },
    mounted() {
    	console.log('current page',this.$route);
        this.currentPage = this.$route;
    },
  methods: {
  }
}
</script>
<style scoped>
.border {
    /*border-radius: 4px;*/
    /*background-color: #e91e63 !important;*/
    color: #ff9117 !important;
}
.app-navibar {
    /*top: 64px !important;*/
    background-color: #ffffff !important;
}
.app-bar {
    /*left: 0px !important;*/
    color: black !important;
    box-shadow: 0 0 0 0 !important;

    border-style: solid;
    border-top: hidden;
    border-left: hidden;
    border-right: hidden;
    border-width: thin;
    border-bottom-color: #e6dbdb;
}
.app-menu-item {
    margin: 10px 10px;
    color: #535659;
}
.app-menu-item-text {
    font-weight: 400;
    font-size: 15px;
}
.tabs-item-font {
  font-weight: normal;
}

</style>
