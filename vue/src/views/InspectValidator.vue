<template>
  <div id="page-inspect-validator">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Validator information">
            <v-row>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Address </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.param.address }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Public key </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.value2 }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Control account </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link class="truncate-option-box"
                                 :to="{ path: '/inspect/account/' + this.value3 , params : {account: this.value3 } }">{{ this.value3 }}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Effective stake </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.$byteCalc(this.value4) }} AMO </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Voting power </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.value5_arg1.toLocaleString() }} ( {{this.value5_arg2.toFixed(2).toLocaleString() }} %) </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Activity </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.value6.toFixed(2).toLocaleString() }} % </span>
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
    data() {
      return {
        param: this.$route.params,
        value2: '66d6f6b107e14a335fd416e76749256fa81c146b4cff118049a177f0fe4161e1',
        value3: '1169e6753ae9d6aa9f1f57bc4e0f1de5a3db436a',
        value4: 1222223.3455,
        value5_arg1 : 111,
        value5_arg2: 232.113,
        value6:645.3455
      }
    },
    watch: {
      '$store.state.network'() {
        console.log('[InspectValidator Page] 변경 된 network value', this.$store.state.network);
        this.getPageData()
      },
    },
    computed: {
      network() {
        return this.$store.state.network
      }
    },
    mounted() {
      this.getPageData();
    },
    methods: {
      async getPageData(){
        // 데이터 바인딩
        console.log(this.param.address);
        console.log('network val',this.network);
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
  }

  /*@media(min-width: 600px) and (max-width: 750px)  {*/
    /*.truncate-option-box{*/
      /*max-width: 300px !important;*/
    /*}*/
  /*}*/

  /*!* 아이패드, 아이패드 프로 *!*/
  /*@media(min-width: 750px) and (max-width: 940px)  {*/
    /*.truncate-option-box{*/
      /*max-width: 320px !important;*/
    /*}*/
  /*}*/

  /*!* 큰화면 *!*/
  /*@media(min-width: 940px)  and (max-width: 1260px) {*/
    /*.truncate-option-box{*/
      /*max-width: 420px !important;*/
    /*}*/
  /*}*/

</style>
