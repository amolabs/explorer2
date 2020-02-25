<template>
    <nav>
        <v-app-bar id="AppBar" class="app-bar" app height="128">
	        <v-container>
		        <v-row>
              <v-col md="8" sm="10">
                <v-row>
                  <v-img
                    style=""
                    :src="require('../assets/amo.png')"
                    max-height="48"
                    max-width="48"
                    @click="$router.push('/')"></v-img>
                  <v-toolbar-title @click="$router.push('/')" class="headline font-weight-bold ml-2 mt-2 hidden-sm-and-down"> AMO Blockchain Explorer</v-toolbar-title>
                  <v-select
                    class="ml-4 mt-2"
                    label="network"
                    color="#000305"
                    single-line
                    dense
                    style="max-width:40%"
                    :items="menuItem"
                    :menu-props="{ top: false, offsetY: true }"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col md="4" sm="2" class="d-inline-flex justify-end">
                <v-spacer></v-spacer>
                <v-text-field
                  class="hidden-sm-and-down mt-2"
                  label="Search"
                  color="#000305"
                  single-line
                  dense
                  hide-details
                  prepend-inner-icon="search"
                ></v-text-field>
                <!--nav 아이콘은 md사이즈 화면에서부터 보인다-->
                <v-app-bar-nav-icon color="#555" class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
              </v-col>
			        <v-row class="hidden-sm-and-down" justify="space-between">
				        <v-tabs background-color="transparent" color="#000350" grow>
					        <v-tabs-slider color="#000350"></v-tabs-slider>
					        <v-tab v-for="page in routes" :key="page.name" :to="page.path" @click="currentPage = page">
						        {{ page.name }}
					        </v-tab>
				        </v-tabs>
			        </v-row>
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
    	console.log('hello',this.$route);
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
.app-menu-logo-img {
    height: 30px;
    width: 30px;
}
.app-menu-logo-icon {
    color: #ff9117;
}
.app-menu-logo {
    color: #474250;
    font-size: 20px;
    text-align: center;
    margin:15px 0px;
}
.app-menu-separator {
    border: solid;
    border-width: thin 0 0 0;
    border-color: hsla(0, 0%, 71%, .1);
    background-color: hsla(0, 0%, 71%, .5);
    margin: 10px 15px;
}
.app-menu-item {
    margin: 10px 10px;
    color: #535659;
}
.app-menu-item-text {
    font-weight: 400;
    font-size: 15px;
}

</style>
