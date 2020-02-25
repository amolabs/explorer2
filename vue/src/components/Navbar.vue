<template>
    <nav>
        <v-app-bar id="AppBar" class="app-bar" app>
            <v-app-bar-nav-icon color="#555" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-uppercase ">
                <!--<span class="font-weight-light">AAE</span>-->
                <span>{{currentPage.name}}</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn text>
                <v-icon color="#555">notifications</v-icon>
            </v-btn>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                        <v-icon color="#555">person</v-icon>
                    </v-btn>
                </template>
                <v-list flat>
                    <v-list-item v-for="route in routes" :key="route.name" router :to="route.path" active-class="border" @click="currentPage = route">
                        <v-list-item-title>{{route.name}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app class="app-navibar">
            <!--<v-layout column align-center>
                <v-flex class="mt-5">
                    <v-avatar size="100">
                        <img src="/img1.png" alt="">
                    </v-avatar>
                    <p class="white&#45;&#45;text subheading mt-1 text-center">Username</p>
                </v-flex>
                <v-flex class="mt-4 mb-4">
                    <Popup/>
                </v-flex>
            </v-layout>-->
            <div class="app-menu-logo">
                <!--<v-layout column align-center>
                    <v-flex class="d-flex align-center text-center">
                        <img class="app-menu-logo-img" src="/amo.png" alt="">
                        <span class="ml-2">LOGO</span>
                    </v-flex>
                </v-layout>-->

                <v-icon class="app-menu-logo-icon">local_car_wash</v-icon> LOGO
            </div>
            <!--<hr class="app-menu-separator">-->
            <!--<v-list flat>
                <v-list-item class="app-menu-item" v-for="route in routes" :key="route.name" router :to="route.path" active-class="border" @click="currentPage = route">
                    <v-list-item-action>
                        <v-icon>{{route.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="app-menu-item-text">{{route.name}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>-->
            <v-list  v-for="route in routes" :key="route.name">

                <v-list-item v-if="route.type === 'menu'" router :to="route.path" active-class="border" @click="currentPage = route">
                    <v-list-item-action>
                        <v-icon>{{route.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="app-menu-item-text">{{route.name}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group
                        v-else
                        active-class="border"
                        :prepend-icon="route.icon"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title v-text="route.name"></v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="subRoute in route.subRoutes"
                        :key="subRoute.name"
                        route
                        :to="subRoute.path"
                        @click="currentPage = subRoute"
                        active-class="border"
                    >
                        <v-list-item-action class="pl-5">
                            <v-icon>{{subRoute.icon}}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="app-menu-item-text">{{subRoute.name}}</v-list-item-title>
                        </v-list-item-content>

                    </v-list-item>
                </v-list-group>
            </v-list>

        </v-navigation-drawer>
    </nav>
</template>
<script>
// import Popup from './Popup.vue'
import routes from '../router/routes';
import dev_routes from '../router/dev_routes';
export default {
    data: () => ({
        drawer: true,
        routes: [],
        currentPage: {}
    }),
    components: {
        // Popup
    },
    created() {
        this.routes = process.env.NODE_ENV === 'development'? [...dev_routes, ...routes] : routes;
        this.currentPage = this.$route;
    },
    mounted() {
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
