<template>
  <div id="page-block">
    <v-container>
       <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">
            <div class="card-title mb-4">Block stat <br class="hidden-sm-and-up"> in last
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
              blockTable
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average interval </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.value1.toFixed(2)).toLocaleString() }} sec /blk</span>
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
                      <span> {{ Number(this.value2.toFixed(2)).toLocaleString() }} M AMO /blk </span>
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
                      <span> {{ Number(this.value3.toFixed(2)).toLocaleString() }} txs /blk </span>
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
                      <span> {{ Number(this.value4.toFixed(2)).toLocaleString() }} B /blk </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Recent blockTable" outlined>
            <c-scroll-table
              :headers="blockTable.headers"
              itemKey="name"
              :items="blockTable.recentBlocks"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #timestamp="{item}">
                <span class="font-option">
                  {{item.timestamp.split(' ')[0]}}
                  <br class="hidden-sm-and-up">
                  {{item.timestamp.split(' ')[1]}} </span>
              </template>
              <template #height="{item}">
                <router-link class="d-inline-block text-truncate truncate-option"
                             :to="{ path: '/inspect/block/' + item.height, params : {block: item.height } }">{{ item.height }}</router-link>
                <!--#D1C4E9-->
                <!--<a href="#" style="text-decoration: none;color: #4CAF50"> {{ item.height }} </a>-->
                <!--<v-chip style="cursor: pointer" color="#DCEDC8" target="#">{{ item.height }}</v-chip>-->
              </template>
              <template #proposer="{item}">
                <router-link class="d-inline-block text-truncate truncate-option"
                             :to="{ path: '/inspect/account/' + item.proposer, params: {account : item.proposer }}">{{ item.proposer }}</router-link>
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
      // responseData: {},
      value1: 123456.1234,
      value2: 123.2432,
      value3: 234222.35432,
      value4: 234.33,
      arg:100,
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
        recentBlocks: [],
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
        //         this.blockTable.recentBlocks = this.blockTable.recentBlocks.concat(res.data.result);
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
          newData.push({height: 123+i, timestamp: '2020-03-04 11:22:33', proposer: '73bae62d33bb942c914d85f9ed612ec8f5a0fa62', ofTxs: Number(123456).toLocaleString()});
        }
        this.blockTable.recentBlocks = this.blockTable.recentBlocks.concat(newData);
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
      max-width: 100px !important;
    }
  }
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      max-width: 200px !important;
    }
  }
</style>
