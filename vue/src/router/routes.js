import Dashboard from '../views/Dashboard.vue';

import Cards from '../views/_dev/Cards';
import Buttons from '../views/_dev/Buttons.vue';
import Tables from '../views/_dev/Tables.vue';
import Charts from '../views/_dev/Charts.vue';
import Progresses from '../views/_dev/Progresses.vue';

const routes = [
    {
        path: '/',
        type: "menu",
        name: 'Dashboard',
        icon: 'dashboard',
        component: Dashboard
    },
    // {
    //     path: '/projects',
    //     name: 'projects',
    //     icon: 'dashboard',
    //     component: Projects
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // },
    // {
    //     path: '/team',
    //     name: 'team',
    //     icon: 'dashboard',
    //     component: Team
    // }
];
export default routes;
