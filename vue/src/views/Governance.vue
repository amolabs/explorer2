<template>
  <div id="page-governance">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Governance stat">
            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> # of drafts</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <a href="#">
                      <span> {{ this.governanceStat.value1.toLocaleString() }} </span>
                    </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 pl-lg-12 text-left">
                    <span> Pass rate for far </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <a href="#">
                      <span> {{ this.governanceStat.value2 }} %</span>
                    </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="3" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Current voting configuration </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-left subtitle-3">
                    <div>
                      <span> waiting period (open_count) : </span>
                      <span>  {{ this.governanceStat.value3.toLocaleString() }} blks </span>
                    </div>
                    <div>
                      <span> voting period (close_count) : </span>
                      <span> {{ this.governanceStat.value3.toLocaleString() }} blks </span>
                    </div>
                    <div>
                      <span> grace period (apply_count) : </span>
                      <span> {{ this.governanceStat.value3.toLocaleString() }} blks </span>
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
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Current active draft">
            <v-row v-if="activeDraft">
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Draft ID </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <a href="#">
                      <span> {{ Number(this.currentActiveDraft.value1).toLocaleString() }} </span>
                    </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="4" class="py-0 pl-lg-12 pr-0 text-left">
                    <span> Proposer </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-10 text-right subtitle-3">
                    <a href="#">
                      <span> {{ this.currentActiveDraft.value2 }} </span>
                    </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="3" class="py-0 px-lg-12 text-left">
                    <span> Stage </span>
                  </v-col>
                  <v-col cols="12" md="9" class="py-0 px-lg-12 text-right subtitle-2">
                    <a href="#">
                      <span> {{ this.arg1 }} ( {{ this.arg2.toLocaleString() }} blks remaining) </span>
                    </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="2" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Projected YEA : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="7" sm="6" class="py-0 px-lg-4 text-left subtitle-3">
                      <span> {{ this.currentActiveDraft.value4 }} AMO </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="2" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Projected NAY : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="7" sm="6" class="py-0 px-lg-4 text-left subtitle-3">
                    <span> {{ this.currentActiveDraft.value5 }} AMO </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="2" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Projected ABSENT : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="7" sm="6" class="py-0 px-lg-4 text-left subtitle-3">
                    <span> {{ this.currentActiveDraft.value6 }} AMO </span>
                    <span> (would be counted as BAY when closing vote)</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Scroll Table -->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Draft history" outlined>
            <c-scroll-table
              :headers="draftHistoryTable.headers"
              itemKey="name"
              :items="draftHistoryTable.histories"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #proposer="{item}">
                <a href="#" class="d-inline-block text-truncate truncate-option"> {{ item.proposer }} </a>
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
      activeDraft: true,
      arg:100,
      arg1 : 'applied',
      arg2 : 405123,
      governanceStat:{
        value1 : 123456 ,
        value2: 33.33 ,
        value3: 124664,
        value4: 234124,
        value5: 594064
      },
      currentActiveDraft:{
        value1: 123,
        value2: '73bae62d33bb942c914d85f9ed612ec8f5a0fa62',
        value4: 123.45,
        value5: 455.45,
        value6: 999.45,
      },
      pageNum: 1,
      perPage: 50,
      draftHistoryTable: {
        headers: [
          { text: 'id', align: 'center', value: 'id'},
          { text: 'status', align: 'center', value: 'status'},
          { text: 'proposer', align: 'center', value: 'proposer'},
        ],
        histories: [],

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
        //         this.draftHistoryTable.histories = this.draftHistoryTable.histories.concat(res.data.result);
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
          newData.push({
            id: 674,
            status: 'applied',
            proposer: 'a3c338a54bea46c64bdde35e72b6d271c16dedf2',
          });
        }
        this.draftHistoryTable.histories = this.draftHistoryTable.histories.concat(newData);
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
