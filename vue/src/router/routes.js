import Dashboard from '../views/Dashboard.vue';
import Inspect from '../views/Inspect'
import Blocks from '../views/Blocks'
import Transactions from '../views/Transactions'
import Validators from '../views/Validators'
import Governance from '../views/Governance'
import Storages from '../views/Storages'
import Parcels from '../views/Parcels'
import InspectBlank from '../views/InspectBlank'
import InspectBlock from '../views/InspectBlock'
import InspectTx from '../views/InspectTx'
import InspectAoount from '../views/InspectAccount'
import InspectValidator from '../views/InspectValidator'
import InspectDraft from '../views/InspectDraft'
import InspectStorate from '../views/InspectStorage'
import InspectParcel from '../views/InspectParcel'

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
    component : Inspect,
    children: [
      {
        path:'',
        props:true,
        component : InspectBlank
      },
      {
        path: 'block/:block',
        props : true,
        component: InspectBlock
      },
      {
        path: 'account/:account',
        props : true,
        component: InspectAoount
      },
      {
        path: 'tx/:hash',
        props : true,
        component: InspectTx
      },
      {
        path: 'validator/:address',
        props : true,
        component: InspectValidator
      },
      {
        path: 'draft/:draftId',
        props : true,
        component: InspectDraft
      },
      {
        path: 'storage/:storageId',
        props : true,
        component: InspectStorate
      },
      {
        path: 'parcel/:parcelId',
        props : true,
        component: InspectParcel
      },
    ]
  },
  {
    path: '/blocks',
    name: 'Blocks',
    icon: 'dashboard',
    component: Blocks
  },
  {
    path: '/transactions',
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
