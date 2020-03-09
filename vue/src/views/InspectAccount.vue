<template>
  <div id="page-inspect-account">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Account information">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Address </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.param.account }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> AMO balance </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.value2.toFixed(2)}} AMO</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Stake </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span v-if="this.value3_arg1 === ''"> none </span>
                    <span v-else> {{ this.value3_arg1.toFixed(2) }} AMO for validator <br>{{ this.value3_arg2 }}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Delegate </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span v-if="this.value4_arg1 === ''"> none</span>
                    <span v-else> {{this.value4_arg1.toFixed(2)}} AMO for account <br> {{this.value4_arg2}}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Table -->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Related txs" outlined>
            <c-scroll-table
              :headers="relatedTxsTable.headers"
              itemKey="name"
              :items="relatedTxsTable.relatedTxItem"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #hash="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/tx/' + item.hash, params : {hash: item.hash} }">{{ item.hash }}</router-link>
              </template>
              <template #sender="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/account/' + item.sender, params: {account : item.sender }}">{{ item.sender }}</router-link>
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
    data() {
      return {
        param : this.$route.params,
        value2: 234.435,
        value3_arg1: 234.234,
        value3_arg2:'d1b1af47c016e7b6a4b92b99ca4df24261b8d22b',
        value4_arg1:342.3455,
        value4_arg2: '0cbb6558ba7864d3b4ca12906e0739d28b38b027',
        pageNum: 1,
        perPage: 50,
        relatedTxsTable: {
          headers: [
            { text: 'hash',align: 'center',  value: 'hash' },
            { text: 'sender',align: 'center',  value: 'sender' },
            { text: 'type', align: 'center',  value: 'type' },
            { text: 'result', align: 'center', value: 'result' },
          ],
          relatedTxItem: [],
        },
      }
    },
    watch: {
      '$route' (to, from) {
        this.param = this.$route.params;
      }
    },
    computed: {
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
    },
    mounted() {
      console.log('params', this.param);
      this.reqData();
    },
    methods: {
      async reqData() {
        // call api
        // try {
        //     const res = await axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
        //     console.log(res);
        //     if(res.data && res.data.result && res.data.result.length > 0) {
        //         this.relatedTxsTable.relatedTxItem = this.relatedTxsTable.relatedTxItem.concat(res.data.result);
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
          newData.push({hash: 'c9ae0c3a27ed1f807a65598d30abd94c249c70ac08a2bb792ff018f7193227b4', sender: 'b19a5131795d70c24d6bd74d1e61fb1d7c411795', type: 'SEND', result: 'Error'});
        }
        this.relatedTxsTable.relatedTxItem = this.relatedTxsTable.relatedTxItem.concat(newData);
        this.pageNum++;
      },
    }
  }
</script>

<style scoped>

   /*  모바일 */
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

  @media(min-width: 600px) and (max-width: 750px)  {
    /*.truncate-option-box{*/
      /*max-width: 300px !important;*/
    /*}*/
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   /* 아이패드, 아이패드 프로 */
  @media(min-width: 750px) and (max-width: 1260px)  {
    /*.truncate-option-box{*/
      /*max-width: 350px !important;*/
    /*}*/
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   @media(min-width: 940px)  and (max-width: 1260px) {
     /*.truncate-option-box{*/
       /*max-width: 200px !important;*/
     /*}*/
   }
   /* 큰화면 */
  @media(min-width: 1260px) {
    /*.truncate-option-box {*/
      /*max-width: 280px !important;*/
    /*}*/
  }
</style>
