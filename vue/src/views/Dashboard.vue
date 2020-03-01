<template>
  <div id="page-dashboard">
    <v-container>
      <v-row justify="space-between">
        <v-col class="total-overview">
          <c-card title="Height" tile>
            {{ Number(majorStats.value1).toLocaleString() }}
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Timestamp" tile>
            {{ majorStats.value2 }}
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Interval" tile>
            {{ majorStats.value3 }}
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="AMO Coins" tile>
            {{ majorStats.value10 }}
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Stakes Delegates" tile>
            <span>
            {{ Number(assetOverview[1].value).toLocaleString() }} + {{ Number(assetOverview[2].value).toLocaleString() }}
            </span>
            <span> {{ assetOverview[1].byte }}</span>
            <span> {{ assetOverview[1].unit }}</span>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="12"  >
          <c-card title="Network Overview">
            <v-row>
              <v-col cols="6" v-for="item in networkOverview">
                <span> {{ item.label }} : </span>
                <span v-if="item.timestamp"> {{ item.value }} </span>
                <span v-else> {{ Number(item.value).toLocaleString() }} </span>
                <span> {{ item.byte }}</span>
                <span> {{ item.unit }}</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="6" class="col-sm-12 col-md-6">
          <!--xs 사이즈에서는 grid 적용이 안됌-->
          <c-card title="Validator Overview">
            <v-row>
              <v-col cols="12" v-for="item in validatorOverview">
                <span> {{ item.label}} : </span>
                <span> {{ Number(item.value).toLocaleString() }}  </span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
        <v-col cols="6" class="col-sm-12 col-md-6">
          <c-card title="Asset Overview">
            <v-row>
              <v-col cols="12" v-for="item in assetOverview">
                <span> {{ item.label}} : </span>
                <span> {{ Number(item.value).toLocaleString()  }} </span>
                <span> {{ item.byte }}</span>
                <span> {{ item.unit }}</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="6" class="col-sm-12 col-md-6">
          <c-card title="Governance Overview">
            <v-row>
              <v-col cols="12" v-for="item in governanceOverview">
                <span> {{ item.label }} : </span>
                <span> {{ Number(item.value).toLocaleString() }} </span>
                <span> {{ item.unit }}</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
        <v-col cols="6" class="col-sm-12 col-md-6">
          <c-card title="Data trade Overview">
            <v-row>
              <v-col cols="12" v-for="item in tradeOverview">
                <span> {{ item.label }} : </span>
                <span> {{ Number(item.value).toLocaleString() }} </span>
                <span> {{ item.byte }}</span>
                <span> {{ item.unit }}</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

  import api from '../router/api';

  export default {
    data: () => ({
      majorStats: {
        value1:'123456',
        value2:'2020-03-31 11:11:11',
        value3:'123456.11',
        value10:'123.11',
        value1112:'123.11',
      },
      networkOverview: [
        {label: 'Height of the last block', value : 111222},
        {label: 'timestamp of the last block', value : '2020-03-31 11:11:11', timestamp: true},
        {label: 'average block interval', value : 111222.33, unit : 'sec'},
        {label: 'average # of txs in a block', value : 111222.33, unit : '/ blk'},
        {label: 'estimated # of pending txs', value : 111222.33},
        {label: 'average transaction fee', value : 111.33, byte: 'G', unit : 'AMO'},
      ],
      validatorOverview: [
        {label: '# of validators', value : 555555},
        {label: '# of on-line validators', value : 234233},
        {label: '# of off-line validators', value : 111222},
      ],
      assetOverview: [
        {label: 'total AMO coins', value : 555555, byte: 'G', unit : 'AMO' },
        {label: 'total stakes', value : 234233, byte: 'G', unit : 'AMO' },
        {label: 'total delegated stakes', value : 111222,  byte: 'G', unit : 'AMO'},
      ],
      governanceOverview: [
        {label: 'last draft', value : 555555},
        {label: 'draft stats', value : 233},
        {label: 'current waiting / voting / grace period', value : 111222, unit : 'blks' },
      ],
      tradeOverview: [
        {label: '#of registered storage services', value : 555555},
        {label: '#of all parcels', value : 234233},
        {label: 'average trade values in 1 month', value : 111.22, byte: 'G', unit : 'AMO' },
      ],
    }),
    mounted() {
      // this.getCurTime();
      // this.getTest2();
    },
    methods :{
      // async getTest2(){
      //   try {
      //     const res = await api.getTest_2();
      //     this.height = res.data.height;
      //     console.log('res',res)
      //   } catch (e) {
      //     console.log('error',e);
      //   }
      // },
      //
      // async getCurTime() {
      //   await setInterval(() => {
      //     api.getCurTime().then(res => {
      //       this.intervalValue = res.data.date;
      //     }).catch(({response})=> {
      //       console.log(response);
      //     });
      //   }, 5000)
      // }
    }
  }
</script>


<style lang="scss" scoped>
  .total-overview {
    //xs 적용 안되서 css 직접 선언
    @media (min-width: 901px) {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 16.6666666667%;
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }
    @media (max-width: 900px) {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
</style>
