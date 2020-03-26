<template>
  <div id="page-dashboard">
    <v-container>
      <!--Network overview-->
      <v-row align="center" justify="space-between">
        <v-col cols="12">
          <c-card class="text-center" title="Network Overview">
            <v-row>
              <v-col cols="12" md="6" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="6">
                    <span>Genesis Block</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2 mobile-content" cols="12" sm="8" md="6">
                    <div>
                      height <router-link :to="{path: '/inspect/block/' + this.networkOverview.genesisHeight, param : {height : this.networkOverview.genesisHeight}}"> {{this.networkOverview.genesisHeight.toLocaleString()}} </router-link>
                    </div>
                    <div>
                      <span> ({{this.networkOverview.genesisTime}})</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="6">
                    <span class="">Last Block</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2  mobile-content" cols="12" sm="8" md="6">
                    <div>
                      height <router-link :to="{path: '/inspect/block/' + this.networkOverview.lastHeight, param : {height : this.networkOverview.lastHeight}}"> {{this.networkOverview.lastHeight.toLocaleString()}}</router-link>
                    </div>
                    <div>
                      <span> ({{this.networkOverview.lastTime}})</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="3">
                    <span>Average Stat</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2 mobile-content " cols="12" sm="8" md="9" lg="6">
                    <div>
                      <span> block interval : </span>
                      <span class="ml-3"> {{Number(this.networkOverview.avgInterval.toFixed(2)).toLocaleString()}} sec </span>
                    </div>
                    <div>
                      <span> no. of txs per block : </span>
                      <span class="ml-3"> {{Number(this.networkOverview.numTxsPerBlock.toFixed(5)).toLocaleString()}} /blk </span>
                    </div>
                    <div >
                      <span> transaction fee : </span>
                      <span class="ml-3">  {{ this.$byteCalc(this.networkOverview.avgTxFee) }} AMO</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>

      <v-row class="text-center">

        <!-- Validators-->
        <v-col cols="12" md="6">
          <c-card title="Validators" class="text-center">
            <v-row align="center">
              <v-col cols="8" class="pl-lg-12 py-0">

                <!-- 색상 : plugins/vuetify.js 에서 정의-->
                <c-progress-line
                  type="1"
                  :value="100"
                  color="deepBlueGrey1"
                  height="10"
                  title="Eff. Stake Total"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path: '/validators'}"> {{this.$byteCalc(this.validators.value8)}} AMO (100%)</router-link>
                <span>
                  <!-- TODO 증감표시가 필요한 모든 영역에는 v-icon 태그 적용이 필요-->
                  <v-icon small> {{this.validators.value8_change}}</v-icon>
                </span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.validators.value9/ this.validators.value8 * 100"
                  color="deepBlueGrey2"
                  height="10"
                  title="On-line"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path: '/validators'}">{{this.$byteCalc(this.validators.value9)}} AMO ({{this.validators.value9_percentage.toFixed(2)}}%)</router-link>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.validators.value10_percentage"
                  color="deepLightGrey"
                  height="10"
                  title="Off-line"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path:'/validators'}">
                  {{this.$byteCalc(this.validators.value10)}} AMO ({{this.validators.value10_percentage.toFixed(2)}}%)</router-link>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Coins and Stakes-->
        <v-col cols="12" md="6">
          <c-card title="Coins and Stakes" class="text-center">
            <v-row align="center">
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="100"
                  color="deepBlueGrey1"
                  height="10"
                  title="Coin Total"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span> {{this.$byteCalc(this.coinsAndStakes.value11)}} AMO (100%)</span>
                <span>
                  <!-- arrow_upward / arrow_downward-->
                  <!--<v-icon>remove</v-icon>-->
                </span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.coinsAndStakes.value12_percentage"
                  color="deepBlueGrey2"
                  height="10"
                  title="Free Coin"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span> {{this.$byteCalc(this.coinsAndStakes.value12)}} AMO ({{this.coinsAndStakes.value12_percentage.toFixed(2)}}%)</span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.coinsAndStakes.value13_percentage"
                  color="deepLightGrey"
                  height="10"
                  title="Eff. Stake"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span>  {{this.$byteCalc(this.coinsAndStakes.value13)}} AMO ({{this.coinsAndStakes.value13_percentage.toFixed(2)}}%)</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Goverance overview-->
        <v-col cols="12" md="6">
          <c-card title="Governance Overview" class="card-height">
            <v-row>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Last Draft</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <router-link :to="{path: '`' + this.governanceOverview.value14_arg1, params: {draftId: this.governanceOverview.value14_arg1}}">
                      # {{this.governanceOverview.value14_arg1.toLocaleString() }} (
                      {{this.governanceOverview.value14_arg2}}, {{
                      Number(this.governanceOverview.value14_arg3.toFixed(2)).toLocaleString()}} % approval)
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Draft States</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <span> {{this.governanceOverview.value15_arg1.toLocaleString()}} / {{this.governanceOverview.value15_arg2.toLocaleString()}} drafts passed </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Current voting config</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <span>
                      {{this.governanceOverview.value16_arg1.toLocaleString()}} waiting <br>
                      {{this.governanceOverview.value16_arg2.toLocaleString()}} voting <br>
                      {{this.governanceOverview.value16_arg3.toLocaleString()}} grace period
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Data trade overview-->
        <v-col cols="12" md="6">
          <c-card title="Data Trade Overview" class="card-height">
            <v-row>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title"  cols="12" sm="6" md="6">
                    <span>NO. of storage services</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12  text-left subtitle-2 mobile-content" cols="12" sm="6" md="6">
                    <router-link :to="{path: '/storages'}"> {{this.dataTradeOverview.value17.toLocaleString()}}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>NO. of Parcels</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <router-link :to="{path: '/parcels'}"> {{this.dataTradeOverview.value18.toLocaleString()}}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Trade value in 1 month</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <span> {{ this.$byteCalc(this.dataTradeOverview.value19) }}  AMO </span>
                  </v-col>
                </v-row>
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
      networkOverview: {
        genesisHeight: 0,
        genesisTime: 'not yet',
        lastHeight: 0,
        lastTime: 'not yet',
        avgInterval: 0,
        numTxsPerBlock: 117.332323,
        avgTxFee: 12312312313212.123123
      },
      validators: {
        value8 : 323423423200.456456,
        value8_change: '',
        value9 : 234234525440.1233,
        value9_percentage : 1,
        value10 : 100009934922.123123,
        value10_percentage : 1,
      },
      coinsAndStakes: {
        value11:123123.2342,
        value12:114.2323,
        value12_percentage: 1,
        value13:34345.2423,
        value13_percentage: 1,
      },
      governanceOverview: {
        value14_arg1: 223,
        value14_arg2: 'rejected',
        value14_arg3: 223.234,
        value15_arg1: 223,
        value15_arg2: 234,
        value16_arg1: 777234,
        value16_arg2: 554234,
        value16_arg3: 123234,
      },
      dataTradeOverview: {
        value17: 123356,
        value18: 333225,
        value19: 2411.33354
      },
      testVal: '',
    }),
    computed: {
      // vuex의 데이터를 사용하기 위해서는 computed 영역에 함수를 선언해야한다.
      network() {
        return this.$store.state.network
      }
    },
    watch: {
      // network 값이 변경되면 호출되는 함수
      '$store.state.network'() {
        console.log('network changed:', this.$store.state.network);
        // 데이터 불러오기 위한 함수 호출
        this.getPageData()
      },

      // validators.value8 값이 변경되면 호춣되는 함수 : 값의 증감 확인 용도
      'validators.value8': function (newVal, oldVal) {
        console.log('new', newVal);
        console.log('old', oldVal);
        let result = '';
        if(oldVal > newVal) {
          result = 'arrow_drop_down'
        } else if(oldVal < newVal) {
            result = 'arrow_drop_up'
        } else {
          result =  'remove'
        }
        this.validators.value8_change = result;
      }
    },
    mounted() {
      this.getPageData();
      console.debug('starting timer');
      this.intervalId = setInterval(() => {
        console.debug('timer tick');
        this.getPageData()
      }, 10000)

      this.validators.value9_percentage = this.validators.value9/ this.validators.value8 * 100;
      this.validators.value10_percentage = this.validators.value10/ this.validators.value8 * 100;

      this.coinsAndStakes.value12_percentage = this.coinsAndStakes.value12/ this.coinsAndStakes.value11 * 100;
      this.coinsAndStakes.value13_percentage = this.coinsAndStakes.value13 / this.coinsAndStakes.value11 * 100;
    },
    destroyed() {
      console.debug('clearing timer');
      clearInterval(this.intervalId);
    },
    methods: {
      async getPageData() {
        try {
          var res;
          res = await this.$api.getBlockStat();
          var height = res.height;
          this.networkOverview.avgInterval = res.avgInterval;
          this.networkOverview.numTxsPerBlock = res.numTxs / height;
          this.networkOverview.avgTxFee = res.avgTxFee;
          res = await this.$api.getBlock(1);
          this.networkOverview.genesisHeight = res.height;
          this.networkOverview.genesisTime = res.time;
          res = await this.$api.getBlock(height);
          this.networkOverview.lastHeight = res.height; //=getBlockStat().height
          this.networkOverview.lastTime = res.time;
          //console.log('res', res)
        } catch (e) {
          console.log('error', e);
        }
      },
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

  .border-left {
    border-left-style: dashed;
    border-left-width: medium;
  }

  /* 모바일화면 CSS */
  @media (max-width: 600px) {

    .mobile-title {
      font-weight: bold;
      text-align: center !important;
    }

    .mobile-content {
      text-align: center !important;
    }
  }

  /* 패드, 중간화면 CSS*/
  @media (min-width: 600px) and (max-width: 950px) {
    .middle-content {
      text-align: right !important;
    }
  }

  @media (min-width: 965px)and (max-width: 1300px) {
    .card-height {
      height: 325px
    }
  }

  @media (min-width: 1300px) {
    .card-height {
      height: 285px !important;
    }
  }

  @media (min-width: 1900px) {
    .lg-padding {
      /*padding-left: 111px !important;*/
    }
  }
</style>
