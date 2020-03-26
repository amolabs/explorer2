<template>
  <div id="page-inspect-tx">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Tx information">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> hash </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> {{ this.tx.hash }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> block height </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.tx.height.toLocaleString() }}  </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> sender </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> {{ this.tx.sender }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> type </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.tx.type}} </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!--Type-Specific tx Body-->
            <v-row v-if="this.tx.type === 'transfer'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> TO </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Amount</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> AMO </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'stake'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Validator </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Amount</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> AMO </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'withdraw'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Amount </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'delegate'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> TO </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Amount </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'retract'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Amount </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'register'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Owner key custody </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'discard'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'request'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Payment </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'cancel'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'grant'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Grantee </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"></span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Buyer key custody </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else-if="this.tx.type === 'revoke'">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Parcel </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Grantee </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> AMO</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                unknown transaction type
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> result </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class=""> {{ this.tx.info }} ( code = {{ this.tx.code }} ) </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="2" class="py-0 px-lg-12 text-left">
                    <span> signature </span>
                  </v-col>
                  <v-col cols="12" md="10">
                    <v-row>
                      <v-col cols="3" class="px-lg-12 text-center"> pubkey </v-col>
                      <v-col cols="1" class="px-lg-12 text-center"> : </v-col>
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.tx.pubkey }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" class="px-lg-12 text-center"> sig bytes </v-col>
                      <v-col cols="1" class="px-lg-12 text-center"> : </v-col>
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.tx.sigBytes }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" class="px-lg-12 text-center"> verification </v-col>
                      <v-col cols="1" class="px-lg-12 text-center"> : </v-col>
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.tx.sigVerification }}</v-col>
                    </v-row>
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
      tx: {
        hash: '',
        height : 0,
        sender : '',
        type: '',
        info: '',
        code: 0,
        pubkey: '',
        sigBytes: '',
        sigVerification: '',
      },
    }),
    watch: {
      '$store.state.network'() {
        console.log('[InspectTx Page] 변경 된 network value', this.$store.state.network);
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
        try {
          this.tx = await this.$api.getTx(this.$route.params.hash);
        } catch (e) {
          console.log(e);
        }
      },
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
  /* 작은화면, 아이패드 */
  /*@media(min-width: 600px) and (max-width: 940px)  {*/
    /*.truncate-option{*/
      /*max-width: 410px !important;*/
    /*}*/
  /*}*/

  /*!*  중간화면, 아이패드 프로 *!*/
  /*@media(min-width: 940px)  and (max-width: 1300px) {*/
    /*.truncate-option{*/
      /*max-width: 200px !important;*/
    /*}*/
  /*}*/

  /*!* 아주 큰 화면 *!*/
  /*@media(min-width: 1300px) {*/
    /*.truncate-option{*/
      /*max-width: 300px !important;*/
    /*}*/
  /*}*/

</style>
