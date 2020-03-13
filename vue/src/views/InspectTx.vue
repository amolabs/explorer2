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
                    <span class="truncate-option"> {{ this.param.hash }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> block height </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.value2.toLocaleString() }}  </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> sender </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option"> {{ this.value3 }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> type </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.value4}} </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!--Type-Specific tx Body-->
            <v-row v-if="this.value4 === 'transfer'">
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
            <v-row v-else-if="this.value4 === 'stake'">
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
            <v-row v-else-if="this.value4 === 'withdraw'">
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
            <v-row v-else-if="this.value4 === 'delegate'">
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
            <v-row v-else-if="this.value4 === 'retract'">
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
            <v-row v-else-if="this.value4 === 'register'">
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
            <v-row v-else-if="this.value4 === 'discard'">
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
            <v-row v-else-if="this.value4 === 'request'">
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
            <v-row v-else-if="this.value4 === 'cancel'">
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
            <v-row v-else-if="this.value4 === 'grant'">
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
            <v-row v-else-if="this.value4 === 'revoke'">
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

            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> result </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class=""> {{ this.value5_arg1 }} ( code = {{ this.value5_arg2 }} ) </span>
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
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.value6 }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" class="px-lg-12 text-center"> sig bytes </v-col>
                      <v-col cols="1" class="px-lg-12 text-center"> : </v-col>
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.value7 }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" class="px-lg-12 text-center"> verification </v-col>
                      <v-col cols="1" class="px-lg-12 text-center"> : </v-col>
                      <v-col cols="7" class="px-lg-12 text-left subtitle-2">{{ this.value8 }}</v-col>
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
    data() {
      return {
        param : this.$route.params,
        value2 : 123,
        value3 : '3e1ca2bc03050d6e2b5868a968b551c68ee14854',
        value4: 'transfer',
        value5_arg1: 'ABCD',
        value5_arg2: 344,
        value6: '98ee0c782742cf6099d2854338562d24e24335de13cdad7012079b4f082988cdc9a25a88bf5333ec898e6f0c1efc1c6f4a70abf6e0f33fc20dfb1a9b6930bd90df',
        value7: '9f2633241418630e7fe210a7fff0df891cbf2f53d833153b89c0a68017e1e40acfccb65c412c4fff39531234240fb825980a0b5d5db84f63977f020aebdaebff',
        value8: '??',
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
