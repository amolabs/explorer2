<template>
    <div id="page-dashboard">
        <v-container>
            <v-row justify="space-between" align="center">
                <v-col cols="12" md="4" lg="2">
                    <c-card outlined>
                        <div class="overview-card">
                            <v-icon>layers</v-icon>
                            <span class="black--text pl-1">Height</span>
                            <br/>
                            <div class="text-right pt-1 content">
                                <span>{{ Number(majorStats.value1).toLocaleString() }}</span>
                            </div>
                        </div>
                    </c-card>
                </v-col>

                <v-col cols="12" md="4" lg="2">
                    <c-card tile>
                        <div class="overview-card">
                            <v-icon>access_time</v-icon>
                            <span class="black--text pl-1">Timestamp</span>
                            <br/>
                            <div class="text-right pt-1 content">
                                <span>{{ majorStats.value2 }}</span>
                            </div>
                        </div>
                    </c-card>
                </v-col>

                <v-col cols="12" md="4" lg="2">
                    <c-card tile>
                        <div class="overview-card">
                            <v-icon>timer</v-icon>
                            <span class="black--text pl-1">Interval</span>
                            <br/>
                            <div class="text-right pt-1 content">
                                <span>{{majorStats.value3 }}</span>
                            </div>
                        </div>
                    </c-card>
                </v-col>

                <v-col cols="12" md="6" lg="2">
                    <c-card tile>
                        <div class="overview-card">
                            <v-icon>attach_money</v-icon>
                            <span class="black--text pl-1">AMO Coins</span>
                            <br/>
                            <div class="text-right pt-1 content">
                                <span>{{majorStats.value10 }}</span>
                            </div>
                        </div>
                    </c-card>
                </v-col>

                <v-col cols="12" md="6" lg="2">
                    <c-card tile>
                        <div class="overview-card">
                            <v-icon>layers</v-icon>
                            <span class="black--text pl-1">Stakes Delegates</span>
                            <br/>
                            <div class="text-right pt-1 content">
                                <span>
                                   {{ Number(assetOverview[1].value).toLocaleString() }} + {{ Number(assetOverview[2].value).toLocaleString() }}
                                </span>
                                <br class="hidden-md-and-down"/>
                                <span> {{ assetOverview[1].byte }}</span>
                                <span> {{ assetOverview[1].unit }}</span>
                            </div>
                        </div>
                    </c-card>
                </v-col>

                <v-col cols="12">
                    <c-card class="text-center" title="Network Overview">
                        <v-row class="">
                            <v-col cols="12" md="6" v-for="item in networkOverview">
                                <v-row align="center">
                                    <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                                        <span> {{ item.label }} </span>
                                    </v-col>
                                    <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-1">
                                        <a href="#">
                                            <span v-if="item.timestamp"> {{ item.value }} </span>
                                            <span v-else> {{ Number(item.value).toLocaleString() }} </span>
                                            <span> {{ item.byte }}</span>
                                            <span> {{ item.unit }}</span>
                                        </a>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>
            </v-row>

            <v-row class="text-center">
                <v-col cols="12" md="6">
                    <c-card title="Validator Overview">
                        <v-row>
                            <v-col cols="12" v-for="item in validatorOverview">
                                <span> {{ item.label}} : </span>
                                <a href="#"> <span> {{ Number(item.value).toLocaleString() }}  </span> </a>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>

                <v-col cols="12" md="6">
                    <c-card title="Asset Overview">
                        <v-row>
                            <v-col cols="12" v-for="item in assetOverview">
                                <span> {{ item.label}} : </span>
                                <a href="#">
                                    <span> {{ Number(item.value).toLocaleString()  }} </span>
                                    <span> {{ item.byte }}</span>
                                    <span> {{ item.unit }}</span>
                                </a>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>

                <v-col cols="12" md="6">
                    <c-card title="Governance Overview">
                        <v-row>
                            <v-col cols="12" v-for="item in governanceOverview">
                                <span> {{ item.label }} : </span>
                                <a href="#">
                                    <span> {{ Number(item.value).toLocaleString() }} </span>
                                    <span> {{ item.unit }}</span>
                                </a>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>

                <v-col cols="12" md="6">
                    <c-card title="Data trade Overview">
                        <v-row>
                            <v-col cols="12" v-for="item in tradeOverview">
                                <span> {{ item.label }} : </span>
                                <a href="#">
                                    <span> {{ Number(item.value).toLocaleString() }} </span>
                                    <span> {{ item.byte }}</span>
                                    <span> {{ item.unit }}</span>
                                </a>
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
                value1: '123456',
                value2: '2020-03-31 11:11:11',
                value3: '123456.11',
                value10: '123.11',
                value1112: '123.11',
            },
            networkOverview: [
                {label: 'Height of the last block', value: 111222},
                {label: 'Timestamp of the last block', value: '2020-03-31 11:11:11', timestamp: true},
                {label: 'Average block interval', value: 111222.33, unit: 'sec'},
                {label: 'Average # of txs in a block', value: 111222.33, unit: '/ blk'},
                {label: 'Estimated # of pending txs', value: 111222.33},
                {label: 'Average transaction fee', value: 111.33, byte: 'G', unit: 'AMO'},
            ],
            validatorOverview: [
                {label: '# of validators', value: 555555},
                {label: '# of on-line validators', value: 234233},
                {label: '# of off-line validators', value: 111222},
            ],
            assetOverview: [
                {label: 'Total AMO coins', value: 555555, byte: 'G', unit: 'AMO'},
                {label: 'Total stakes', value: 234233, byte: 'G', unit: 'AMO'},
                {label: 'Total delegated stakes', value: 111222, byte: 'G', unit: 'AMO'},
            ],
            governanceOverview: [
                {label: 'Last draft', value: 555555},
                {label: 'Draft stats', value: 233},
                {label: 'current waiting / voting / grace period', value: 111222, unit: 'blks'},
            ],
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
    .overview-card {
        margin: -10px !important;

        .content {
            font-size: 18px;
        }
    }

    /*.total-overview {
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
    }*/
</style>
