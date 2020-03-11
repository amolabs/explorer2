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
                      <span>{{ this.value1.toLocaleString() }} </span>
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
                      <span> {{ Number(this.value2.toFixed(2)).toLocaleString() }} %</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Total effective stake </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$byteCalc(this.value3) }} AMO </span>
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
                      <span> {{ this.$byteCalc(this.value4) }} AMO / validators </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!--Incentive stat -->
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">
            <!--title-->
            <div class="card-title mb-4">Incentive stat <br class="hidden-sm-and-up">  in last
              <span class="mx-2">
                <v-select
                  style="max-width:90px;display:inline-flex"
                  :items="args"
                  v-model="arg"
                  menu-props="offsetY"
                  dense
                  class="pa-0"
                  color="teal lighten-2"
                  @change="selectEvent"
                ></v-select>
              </span>
              blks
            </div>

            <!--stat-->
            <v-row>
              <v-col cols="12" md="6">
                <v-row >
                  <v-col cols="12" md="5" class="py-0 px-lg-12 text-left">
                    <span> Average incentive </span>
                  </v-col>
                  <v-col cols="12" md="5" class="py-0 px-lg-12 text-right subtitle-2">
                  <span>{{ this.$byteCalc(this.value5) }} AMO /blk</span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <span class="hidden-md-and-down"> = </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" class="py-0 px-lg-12 text-left text-lg-right subtitle-2">
                    <span class="hidden-lg-and-up">=</span>
                    <span> Average reward : </span>
                    <br class="hidden-sm-and-up">
                    <span> {{ this.$byteCalc(this.value6) }} AMO /blk </span>
                  </v-col>
                  <v-col cols="12" class="py-0 px-lg-12 text-left text-lg-right subtitle-2"> + </v-col>
                  <v-col cols="12" class="py-0 px-lg-12  text-left text-lg-right subtitle-2">
                    <span> Average tx fee :</span>
                    <br class="hidden-sm-and-up">
                    <span>  {{ this.$byteCalc(this.value7) }} AMO /blk </span>
                  </v-col>
                </v-row>

                <!--<v-row>-->
                  <!--<v-col class="py-0 px-lg-12 text-left">-->
                    <!--<span> Average reward </span>-->
                  <!--</v-col>-->
                  <!--<v-col class="py-0 px-lg-12 text-right subtitle-2">-->
                    <!--<span> {{ Number(this.value6.toFixed(2)).toLocaleString() }} AMO /blk </span>-->
                  <!--</v-col>-->
                <!--</v-row>-->


                <!--<v-row>-->
                  <!--<v-col class="py-0 px-lg-12 text-left">-->
                    <!--<span> Average tx fee </span>-->
                  <!--</v-col>-->
                  <!--<v-col class="py-0 px-lg-12 text-right subtitle-2">-->
                    <!--<span> {{ Number(this.value7.toFixed(2)).toLocaleString() }} AMO /blk </span>-->
                  <!--</v-col>-->
                <!--</v-row>-->


              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 pl-lg-12 pr-lg-0 text-left">
                    <span> Estimated annual interest rate </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span>{{ Number(this.value8.toFixed(2)).toLocaleString() }} %  </span>
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
              :headers="validatorsTable.headers"
              itemKey="name"
              :items="validatorsTable.allValidators"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #address="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/validator/' + item.address, params : {address: item.address } }">{{ item.address }}</router-link>
              </template>
              <template #effStake="{item}">
                <span> {{ item.effStake }}  AMO</span>
                <!--<span>  {{Number(item.effStake.res).toLocaleString() }} {{item.effStake.byte}} AMO</span>-->
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
      value1: 1200345,
      value2: 22.2222,
      value3: 555.4544,
      value4: 44244121244.3333,
      value5: 122344.334,
      value6: 222.5523,
      value7: 132.455,
      value8: 432114.454,
      arg:100,
      pageNum: 1,
      perPage: 50,
      validatorsTable: {
        headers: [
          { text: 'address', align: 'center', value: 'address'},
          { text: 'eff stake', align: 'center', value: 'effStake'},
          { text: 'power', align: 'center', value: 'power'},
          { text: 'activity', align: 'center', value: 'activity'},
        ],
        allValidators: [],

      },
    }),
    computed:{
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      args(){
        return this.$store.state.args
      }
    },
    mounted() {
      this.reqData();
    },
    methods: {
      async reqData() {
        // call api
        // try {
        //     const res = await axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
        //     console.log(res);
        //     if(res.data && res.data.result && res.data.result.length > 0) {
        //         this.validatorsTable.allValidators = this.validatorsTable.allValidators.concat(res.data.result);
        //         this.pageNum++;
        //     }
        // } catch(err) {
        //     console.log('err: ', err);
        // }

        // add data
        const startIdx = (this.pageNum-1) * this.perPage;
        const endIdx = parseInt(startIdx) + parseInt(this.perPage);
        let newData = [];
        for(let i=startIdx; i<endIdx; i++) {
          let col3_arg1 = 1233;
          let col3_arg2 = 1233.329;
          let col2 = this.$byteCalc(232221231344.33);
          newData.push({
            address: 'a3c338a54bea46c64bdde35e72b6d271c16dedf2',
            effStake: col2,
            power: col3_arg1.toLocaleString() + '(' + Number(col3_arg2.toFixed(2)).toLocaleString()+ '%)',
            activity: 333.23,
          });
        }
        this.validatorsTable.allValidators = this.validatorsTable.allValidators.concat(newData);
        this.pageNum++;
      },
      selectEvent(data){
        console.log('select arg : ',data);
      }
    }
  }
</script>
<style scoped>

  @media(max-width: 600px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
  }
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }
</style>
