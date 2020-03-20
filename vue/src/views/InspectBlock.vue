<template>
  <div id="page-inspect-block">
    <v-container>
      <!-- Block information -->
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Block Information">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Height </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ block.height.toLocaleString() }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Time </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ block.time }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Block hash </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ block.hash }}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{$byteCalc(block.txBytes) + 'B'}} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Proposer </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ block.proposer }}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> # of txs </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <span>{{ block.numTxs.toLocaleString() }} ({{block.numTxsValid.toLocaleString()}} valid + {{block.numTxsInvalid.toLocaleString()}} invalid)</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <!-- Included txs -->
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Included txs" outlined>
            <c-scroll-table
              :headers="txTable.headers"
              itemKey="name"
              :items="txTable.txList"
              height="500"
              @loadMore="reqTxTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #hash="{item}">
                <router-link class="truncate-option"
                  :to="{ path: '/inspect/tx/' + item.hash, params : {hash: item.hash } }">{{ item.hash }}</router-link>
              </template>
              <template #sender="{item}">
                <router-link class="truncate-option"
                  :to="{ path: '/inspect/account/' + item.sender, params : {proposer: item.hash }  }">{{ item.sender }}</router-link>
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
      // NOTE: don't use 'this' in here.
      block: {
        height: 0,
        time: '-',
        hash: '-',
        txBytes: 0,
        proposer: '-',
        numTxs: 0,
        numTxsValid: 0,
        numTxsInvalid: 0,
      },
      txTable: {
        headers: [
          { text: 'hash',align: 'center',  value: 'hash' },
          { text: 'sender',align: 'center',  value: 'sender' },
          { text: 'type', align: 'center',  value: 'type' },
          { text: 'result', align: 'center', value: 'result' },
        ],
        txList: [],
        pageNum: 1,
        perPage: 50,
      },
    }),
    watch: {
      '$store.state.network'() {
        console.debug('network changed:', this.$store.state.network);
        this.getPageData()
        this.reqTxTableData();
      },
    },
    computed:{
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      network() {
        return this.$store.state.network
      }
    },
    mounted() {
      this.getPageData();
      this.reqTxTableData();
    },
    methods: {
      async getPageData() {
        try {
          this.block = await this.$api.getBlock(this.$route.params.height);
        } catch (e) {
          console.log(e);
        }
      },
      async reqTxTableData() {
        this.txTable.txList = [];
        //console.log('get tx table data', this.txTable);
        //axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
        //     console.log(res);
        //     if(res.data && res.data.result && res.data.result.length > 0) {
        //         this.txTable.txList = this.txTable.txList.concat(res.data.result);
        //         this.pageNum++;
        //     }
        // } catch(err) {
        //     console.log('err: ', err);
        // }

        // res.data.result format
        // const axoisResponse = [
        //   {'hash':123, 'sender': '2020-03-04 11:22:33', 'type':123123,'result': 123456},
        // ];
        // add data
        // const startIdx = (this.pageNum-1) * this.perPage;
        // const endIdx = parseInt(startIdx) + parseInt(this.perPage);
        // let newData = [];
        // for(let i=startIdx; i<endIdx; i++) {
        //   newData.push({hash: '9917c981107a5c7a05e171d61bfaed6046fcf1792da7fabf3fe1dbbd2eed1111', sender: '73bae62d33bb942c914d85f9ed612ec8f5a0fa62', type: 'reject', result : 'OK'});
        // }
        // this.txTable.txList = this.txTable.txList.concat(newData);
        // this.pageNum++;
      },
    }
  }
</script>

<style scoped>
  /* 모바일 */
  @media(max-width: 600px) {
    .truncate-option-box {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
  }

  /* Responsive web */
  @media(min-width: 600px) and (max-width: 1260px)  {

    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

  @media(min-width: 900px) and (max-width: 1260px)  {
    /*.truncate-option-box{*/
      /*max-width: 270px !important;*/
    /*}*/
  }

  @media(min-width: 1260px) {
    /*.truncate-option-box {*/
      /*max-width: 320px !important;*/
    /*}*/
  }
</style>
