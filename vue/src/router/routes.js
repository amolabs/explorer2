import Dashboard from '../views/Dashboard.vue';
import Inspect from '../views/Inspect'
import Blocks from '../views/Blocks'
import Transactions from '../views/Transactions'
import Validators from '../views/Validators'
import Governance from '../views/Governance'
import Storages from '../views/Storages'
import Parcels from '../views/Parcels'


const routes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: 'dashboard',
    component: Dashboard
  },
  {
    path: '/inspect',
    name: 'Inspect',
    icon: 'dashboard',
    component: Inspect
  },
  {
    path: '/blocks',
    name: 'Blocks',
    icon: 'dashboard',
    component: Blocks
  },
  {
    path: '/Transactions',
    name: 'Transactions',
    icon: 'dashboard',
    component: Transactions
  },{
    path: '/validators',
    name: 'Validators',
    icon: 'dashboard',
    component: Validators
  },
  {
    path: '/governance',
    name: 'Governance',
    icon: 'dashboard',
    component: Governance
  },
  {
    path: '/storages',
    name: 'Storages',
    icon: 'dashboard',
    component: Storages
  },
  {
    path: '/parcels',
    name: 'Parcels',
    icon: 'dashboard',
    component: Parcels
  },

];
export default routes;
