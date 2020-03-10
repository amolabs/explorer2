<template>
  <div id="page-transaction">
    <!-- Tx state -->
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">

            <!-- title-->
            <div class="card-title mb-4">TX stat <br class="hidden-sm-and-up">  in last
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
              txs
            </div>

            <!-- stat -->
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.value1.toFixed(2)).toLocaleString() }} / tx</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx fee </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.value2.toFixed(2)).toLocaleString() }} / tx </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 pl-lg-12 text-left">
                    <span> Average binding lag </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 pr-lg-12 text-right subtitle-2">
                    <div>
                      <span>{{ Number(this.value3_arg1.toFixed(2)).toLocaleString() }} blks / <br class="hidden-sm-and-up">max {{ this.value3_arg2.toLocaleString() }} blks</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Invalid ratio </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.value4_arg1.toLocaleString()}} / {{ this.value4_arg2.toLocaleString() }} ( {{ Number(this.value4_arg3.toFixed(2)).toLocaleString() }} % ) </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recent txs table-->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Recent txs" outlined>
            <c-scroll-table
              :headers="transactionTable.headers"
              itemKey="name"
              :items="transactionTable.recentTxs"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #height="{item}">
                <router-link :to="{ path: '/inspect/block/' + item.height, params : {block: item.height } }">{{ item.height }}</router-link>
              </template>
              <template #hash="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/tx/' + item.hash, params: {hash : item.hash }}">{{ item.hash }}</router-link>
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
    data: () => ({
      value1 : 111.55,
      value2 : 222.1243,
      value3_arg1: 123456.34,
      value3_arg2: 455344,
      value4_arg1: 123456,
      value4_arg2: 324543,
      value4_arg3: 213.23435,
      arg:100,
      pageNum: 1,
      perPage: 50,
      transactionTable: {
        headers: [
          { text: 'height', align: 'center', value: 'height'},
          { text: 'index', align: 'center', value: 'index'},
          { text: 'hash', align: 'center', value: 'hash'},
          { text: 'sender', align: 'center', value: 'sender'},
          { text: 'type', align: 'center', value: 'type'},
          { text: 'result', align: 'center', value: 'result'},
        ],
        recentTxs: [],
      },
    }),
    computed:{
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      args() {
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
        //         this.transactionTable.recentTxs = this.transactionTable.recentTxs.concat(res.data.result);
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
            height: 100,
            index: 234,
            hash: 'df75be17fdd7508a9fc4f1fbdad72ee13efc47058ea37fe82a44e68c81917ee0',
            sender: 'a3c338a54bea46c64bdde35e72b6d271c16dedf2',
            type: 'SEND',
            result: 'OK'
          });
        }
        this.transactionTable.recentTxs = this.transactionTable.recentTxs.concat(newData);
        this.pageNum++;
      },
      selectEvent(data){
        console.log('select arg : ',data);
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

  /* 아주 큰 화면 */
  /*@media(min-width: 1300px) {*/
    /*.truncate-option{*/
      /*max-width: 500px !important;*/
    /*}*/
  /*}*/
</style>
