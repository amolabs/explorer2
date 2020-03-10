<template>
  <div id="page-dashboard">
    <v-container>

      <!--Major stats -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" lg="2" md="4">
          <c-card class="card-option" tile>
            <div class="overview-card">
              <v-icon>layers</v-icon>
              <span class="black--text pl-1">Height</span>
              <br/>
              <div class="text-right pt-1 subtitle-1">
                <span>{{ this.majorStats.value1.toLocaleString() }}</span>
              </div>
            </div>
          </c-card>
        </v-col>
        <v-col cols="12" lg="2" md="4">
          <c-card class="card-option" tile>
            <div class="overview-card">
              <v-icon>access_time</v-icon>
              <span class="black--text pl-1">Timestamp</span>
              <br/>
              <div class="text-right pt-1 subtitle-1">
                <span>{{ this.majorStats.value2 }}</span>
              </div>
            </div>
          </c-card>
        </v-col>
        <v-col cols="12" lg="2" md="4">
          <c-card class="card-option" tile>
            <div class="overview-card">
              <v-icon>timer</v-icon>
              <span class="black--text pl-1">Interval</span>
              <br/>
              <div class="text-right pt-1 subtitle-1">
                <span>{{ Number(this.majorStats.value3.toFixed(2)).toLocaleString() }} </span>
              </div>
            </div>
          </c-card>
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <c-card class="card-option" tile>
            <div class="overview-card">
              <v-icon>attach_money</v-icon>
              <span class="black--text pl-1">AMO Coins</span>
              <br/>
              <div class="text-right pt-1 subtitle-1">
                <span>{{this.majorStats.value10 }}</span>
              </div>
            </div>
          </c-card>
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <c-card class="card-option" tile>
            <div class="overview-card">
              <v-icon>layers</v-icon>
              <span class="black--text pl-1">Stakes Delegates</span>
              <br/>
              <div class="text-right pt-1 subtitle-1">
                                <span>
                                   {{ Number(this.assetOverview.value11).toLocaleString() }} + {{ Number(this.assetOverview.value12).toLocaleString() }}
                                </span>
                <br class="hidden-md-and-down"/>
                <span> AMO </span>
              </div>
            </div>
          </c-card>
        </v-col>
      </v-row>

      <!--Network overview-->
      <v-row align="center" justify="space-between">
        <v-col cols="12">
          <c-card class="text-center" title="Network Overview">
            <v-row class="">
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>height of the last block</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/blocks'}"> {{ this.networkOverview.value1.toLocaleString()}}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>timestamp of the last block </span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/blocks'}"> {{this.networkOverview.value2}}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>average block interval</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/blocks'}"> {{
                      Number(this.networkOverview.value3.toFixed(2)).toLocaleString()}} sec
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>average # of txs in a block</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/transactions'}"> {{
                      Number(this.networkOverview.value4.toFixed(2)).toLocaleString()}} /blk
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>estimated # of pending txs</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/transactions'}">{{
                      Number(this.networkOverview.value5.toFixed(2)).toLocaleString()}}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col class="py-0 px-lg-12 text-left" cols="12" md="6">
                    <span>average transaction fee</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-right subtitle-2" cols="12" md="6">
                    <router-link :to="{path: '/transactions'}">{{
                      Number(this.networkOverview.value6.toFixed(2)).toLocaleString()}} AMO
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>

      <v-row class="text-center">
        <!-- Validator overview-->
        <v-col cols="12" md="6">
          <c-card title="Validator Overview">
            <v-row>
              <v-col cols="12">
                <span> # of validators : </span>
                <router-link :to="{path:'/validators'}"> {{this.validatorOverview.value7.toLocaleString()}}
                </router-link>
              </v-col>
              <v-col cols="12">
                <span> # of on-line validators : </span>
                <router-link :to="{path:'/validators'}"> {{this.validatorOverview.value8.toLocaleString()}}
                </router-link>
              </v-col>
              <v-col cols="12">
                <span> # of off-line validators : </span>
                <router-link :to="{path:'/validators'}"> {{this.validatorOverview.value9.toLocaleString()}}
                </router-link>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Asset overview-->
        <v-col cols="12" md="6">
          <c-card title="Asset Overview">
            <v-row>
              <v-col cols="12">
                <span> total AMO coins : </span>
                <span> {{ Number(this.assetOverview.value10.toFixed(2)).toLocaleString() }} AMO </span>
              </v-col>
              <v-col cols="12">
                <span>  total stakes : </span>
                <span> {{ Number(this.assetOverview.value11.toFixed(2)).toLocaleString()}} AMO</span>
              </v-col>
              <v-col cols="12">
                <span> total delegated stakes : </span>
                <span>{{ Number(this.assetOverview.value12.toFixed(2)).toLocaleString()}} AMO </span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Goverance overview-->
        <v-col cols="12" md="6">
          <c-card title="Governance Overview">
            <v-row>
              <v-col cols="12">
                <span> last draft : </span>
                <router-link
                  :to="{path: '/inspect/draft/' + this.governanceOverview.value13_arg1, params: {draftId: this.governanceOverview.value13_arg1}}">
                  # {{this.governanceOverview.value13_arg1.toLocaleString() }} (
                  {{this.governanceOverview.value13_arg2}}, {{
                  Number(this.governanceOverview.value13_arg3.toFixed(2)).toLocaleString()}} % approval)
                </router-link>
              </v-col>
              <v-col cols="12">
                <span> draft stats : </span>
                <span> {{this.governanceOverview.value14_arg1.toLocaleString()}} / {{this.governanceOverview.value14_arg2.toLocaleString()}} drafts passed </span>
              </v-col>
              <v-col cols="12">
                <span> current waiting / voting / grace period : </span>
                <span> {{this.governanceOverview.value15_arg1.toLocaleString()}} / {{this.governanceOverview.value15_arg2.toLocaleString()}} / {{this.governanceOverview.value15_arg3.toLocaleString()}} blks </span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Data trade overview-->
        <v-col cols="12" md="6">
          <c-card title="Data Trade Overview">
            <v-row>
              <v-col cols="12">
                <span> # of registered storage services : </span>
                <router-link :to="{path: '/storages'}"> {{this.dataTradeOverview.value16.toLocaleString()}}
                </router-link>
              </v-col>
              <v-col cols="12">
                <span> # of all parcels : </span>
                <router-link :to="{path: '/parcels'}"> {{this.dataTradeOverview.value17.toLocaleString()}}</router-link>
              </v-col>
              <v-col cols="12">
                <span> average trade values in 1 month : </span>
                <span :to="{}"> {{ Number(this.dataTradeOverview.value18.toFixed(2)).toLocaleString()}} AMO </span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    data: () => ({
      majorStats: {
        value1: 123456,
        value2: '2020-03-31 11:11:11',
        value3: 123456.11,
        value10: 123.11,
        value1112: 123.11,
      },
      networkOverview: {
        value1: 111324,
        value2: '2020-03-31 11:11:11',
        value3: 111222.333,
        value4: 117622.333,
        value5: 997622.333,
        value6: 117.332323,
      },
      validatorOverview: {
        value7: 555555,
        value8: 234233,
        value9: 111222,
      },
      assetOverview: {
        value10: 555.555,
        value11: 234.233,
        value12: 111.22322,
      },
      governanceOverview: {
        value13_arg1: 223,
        value13_arg2: 'rejected',
        value13_arg3: 223.234,
        value14_arg1: 223,
        value14_arg2: 234,
        value15_arg1: 777234,
        value15_arg2: 554234,
        value15_arg3: 123234,
      },
      dataTradeOverview: {
        value16: 123356,
        value17: 333225,
        value18: 241.33354
      },
      tradeOverview: [
        {label: '#of registered storage services', value: 555555},
        {label: '#of all parcels', value: 234233},
        {label: 'Average trade values in 1 month', value: 111.22, byte: 'G', unit: 'AMO'},
      ],
    }),
    mounted() {
      // this.getCurTime();
      // this.getTest2();
    },
    methods: {
      async getTest2() {
        try {
          const res = await this.$api.getTest_2();
          this.height = res.data.height;
          console.log('res', res)
        } catch (e) {
          console.log('error', e);
        }
      },

      async getCurTime() {
        await setInterval(() => {
          this.$api.getCurTime().then(res => {
            this.intervalValue = res.data.date;
          }).catch(({response}) => {
            console.log(response);
          });
        }, 5000)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .overview-card {
    margin: -10px !important;
  }

  .card-option {
    height: 100px
  }
</style>
