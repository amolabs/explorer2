<template>
  <div id="page-block">
    <!-- Block stat -->
    <v-container>
       <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">
            <div class="card-title mb-4">Block stat <br class="hidden-sm-and-up"> in last
              <span class="mx-2">
                <v-select
                  style="max-width:90px;display:inline-flex"
                  :items="args"
                  v-model="statRange"
                  menu-props="offsetY"
                  dense
                  class="pa-0"
                  color="teal lighten-2"
                  @change="selectEvent"
                ></v-select>
              </span>
              blocks
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average interval </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.chainSummary.avgInterval.toFixed(2)).toLocaleString() }} sec / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average incentive </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$byteCalc(this.chainSummary.avgIncentive)  }} AMO / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average # of txs </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.chainSummary.avgNumTxs.toFixed(2)).toLocaleString() }} txs / blk </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$byteCalc(this.chainSummary.avgTxBytes) + 'B' }} / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!--Table-->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Recent blocks" outlined>
            <c-scroll-table
              :headers="blockTable.headers"
              itemKey="name"
              :items="blockTable.blockList"
              height="500"
              @loadMore="reqBlockTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #timestamp="{item}">
                <span class="font-option">
                  {{item.timestamp.split(' ')[0]}}
                  <br class="hidden-sm-and-up">
                  {{item.timestamp.split(' ')[1]}} </span>
              </template>
              <template #height="{item}">
                <router-link :to="{ path: '/inspect/block/' + item.height, params : {block: item.height } }">{{ item.height }}</router-link>
                <!--<v-chip style="cursor: pointer" color="#DCEDC8" :to="{ path: '/inspect/block/' + item.height, params : {block: item.height } }">{{ item.height }}</v-chip>-->
              </template>
              <template #proposer="{item}">
                <router-link class="d-inline-block text-truncate truncate-option"
                             :to="{ path: '/inspect/account/' + item.proposer, params: {account : item.proposer }}">{{ item.proposer }}</router-link>
              </template>
              <template #ofTxs="{item}">
                <span> {{item.ofTxs.toLocaleString()}}</span>
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
      chainSummary: {
        avgInterval: 0,
        avgIncentive: 0,
        avgNumTxs: 0,
        avgTxBytes: 222234.33,
      },
      statRange:100,
      pageNum: 1,
      perPage: 50,
      blockTable: {
        headers: [
          {
            text: 'height',
            value: 'height',
            align: 'center', // 'start' | 'center' | 'end'
          },
          { text: 'timestamp',align: 'center',  value: 'timestamp' },
          { text: 'proposer', align: 'center',  value: 'proposer' },
          { text: '# of txs', align: 'center', value: 'ofTxs' },
        ],
        blockList: [],
      },
    }),
    watch: {
      '$store.state.network'() {
        console.log('[Blocks Page] 변경 된 network value', this.$store.state.network);
        this.getPageData()
      },
    },
    computed:{
      // tableBreakpoint, args -> vuex에서 선언된 데이터 사용하기 위함.
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
      this.getPageData();
      this.reqBlockTableData();
    },
    methods: {
      async getPageData(){
        try {
          this.chainSummary = await this.$api.getChain();
        } catch (e) {
          console.log(e);
        }
      },
      async reqBlockTableData() {
        this.blockTable.blockList = [];
        // call api
        // try {
        //     const res = await axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
        //     console.log(res);
        //     if(res.data && res.data.result && res.data.result.length > 0) {
        //         this.blockTable.blockList = this.blockTable.blockList.concat(res.data.result);
        //         this.pageNum++;
        //     }
        // } catch(err) {
        //     console.log('err: ', err);
        // }

        // add data
        // const startIdx = (this.pageNum-1) * this.perPage;
        // const endIdx = parseInt(startIdx) + parseInt(this.perPage);
        // let newData = [];
        // for(let i=startIdx; i<endIdx; i++) {
        //   newData.push({height: 123+i, timestamp: '2020-03-04 11:22:33', proposer: '73bae62d33bb942c914d85f9ed612ec8f5a0fa62', ofTxs:123453+i});
        // }
        // this.blockTable.blockList = this.blockTable.blockList.concat(newData);
        // this.pageNum++;
      },
      selectEvent(){
        console.log('select statRange : ', this.statRange);
        // 변경된 select 값으로 api 호출
        this.getPageData()
      }
    }
  }
</script>

<style scoped>
  @media(max-width: 600px) {
    .truncate-option{
      max-width: 100px !important;
    }
  }
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      max-width: 200px !important;
    }
  }
</style>
