<template>
  <div id="page-inspectBlank">
    <v-container  mt-12>
      <v-row class="text-center" align="center" justify="center">
        <v-col cols="12">
          Seach Box를 이용해주세요
        </v-col>
        <v-col cols="12" sm="9" md="8">
          <v-text-field
            single-line outlined rounded hide-details search
            label="block, account, tx, validator, draftId"
            color="grey"
            v-model="search"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        search: '',
      }
    },
    mounted() {
      window.addEventListener('keyup', evt => {
        // 자동완성
        // console.log(evt.keyCode);
        if(this.search.length === 1){
          if(evt.keyCode === 65) {
            this.search = 'account:'
          }
          if(evt.keyCode === 66) {
            this.search = 'block:'
          }
          if(evt.keyCode === 68) {
            this.search = 'draftId:'
          }
          if(evt.keyCode === 84) {
            this.search = 'tx:'
          }
          if(evt.keyCode === 86) {
            this.search = 'validator:'
          }
        }

        //엔터키
        if(evt.keyCode === 13){
          this.searchByKeyword()
        }
      })
    },
    methods: {
      searchByKeyword() {
        console.log(this.search);
        //  TODO: api call
      }
    }
  }
</script>

<style scoped>

</style>
