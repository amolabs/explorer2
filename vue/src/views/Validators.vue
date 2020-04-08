<template>
  <div id="page-validators">
    <!--Validator stat-->
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Validator stat">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> # of validators </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span>{{ this.validatorStat.num.toLocaleString() }} </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average activity </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.validatorStat.avgOnline.toFixed(2)).toLocaleString() }} %</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Total effective stakes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$amoHuman(this.validatorStat.totalEffStakes) }} AMO </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average effective stake </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$amoHuman(this.validatorStat.avgEffStake) }} AMO / validators </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!--All Validators table-->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="All validators" outlined>
            <c-scroll-table
              :headers="validatorTable.headers"
              itemKey="name"
              :items="validatorTable.validatorList"
              height="500"
              @loadMore="reqTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #valAddr="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/validator/' + item.valAddr, params : {address: item.valAddr } }">{{ item.valAddr }}</router-link>
              </template>
              <template #stake="{item}">
                <span> {{ $amoHuman(item.stake) }}  AMO</span>
              </template>
              <template #valPower="{item}">
                <span>{{ Number(item.valPower).toPrecision(5) }} </span>
              </template>
              <template #activity="{item}">
                <span>{{ Number(item.activity.toFixed(2).toLocaleString())}} %  </span>
              </template>
            </c-scroll-table>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
  export default {
    data: () => ({
      validatorStat: {
        num: 0,
        avgOnline: 0,
        totalEffStakes: 0,
        avgEffStake: 0,
      },
      incentiveStat: {
        avgIncentive: 0,
        avgReward: 0,
        avgTxFee: 0,
        estInterest: 0,
      },
      statRange: 100,
      validatorTable: {
        headers: [
          { text: 'address', align: 'center', value: 'valAddr'},
          { text: 'stake', align: 'center', value: 'stake'},
          { text: 'power', align: 'center', value: 'valPower'},
          { text: 'activity', align: 'center', value: 'activity'},
        ],
        validatorList: [],
        anchor: 0,
        bulkSize: 20,
      },
    }),
    watch: {
      network() {
        if (this.network) this.getPageData()
        this.validatorTable.anchor = 0;
        this.validatorTable.validatorList = [];
        if (this.network) this.reqTableData();
      },
    },
    computed:{
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      args(){
        return this.$store.state.args
      },
      network() {
        return this.$store.state.network
      }
    },
    mounted() {
      if (this.network) this.getPageData()
      if (this.network) this.reqTableData();
    },
    methods: {
      async getPageData(){
        try {
          this.validatorStat = await this.$api.getValidatorStat(this.network);
          this.incentiveStat = await this.$api.getIncentiveStat(this.network);
        } catch (e) {
          console.log(e);
        }
      },
      async reqTableData() {
        try {
          let l = this.validatorTable.validatorList;
          const res = await this.$api.getValidators(this.network,
            this.validatorTable.anchor, this.validatorTable.bulkSize);
          l = l.concat(res);
          this.validatorTable.validatorList = l;
          this.validatorTable.anchor = l.length;
        } catch (e) {
          console.log(e);
        }
      },
      selectEvent(data){
        if (this.network) this.getPageData();
      }
    }
  }
</script>
<style scoped>

  /* 모바일 */
  @media(max-width: 600px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 120px !important;
    }
  }
  /* Responsive web */
  /* 작은화면 */
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 250px !important;
    }
  }

  /* 아이패드 */
  @media(min-width: 750px) and (max-width: 940px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 140px !important;
    }
  }

  /*  아이패드 프로, 중간화면 */
  @media(min-width: 940px)  and (max-width: 1300px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   /*큰 화면*/
  @media(min-width: 1300px) and (max-width: 1900px){
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 500px !important;
      /*max-width: 500px !important;*/
    }
  }
</style>
