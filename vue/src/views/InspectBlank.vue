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
            @keyup.enter="searchByKeyword"
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

    },
    watch: {
      search: function(newVal, oldVal) {
        if(newVal === 'a') {
          this.search = 'account:'
        }
        if(newVal === 'b') {
          this.search = 'block:'
        }
        if(newVal === 'd') {
          this.search = 'draftId:'
        }
        if(newVal === 't') {
          this.search = 'tx:'
        }
        if(newVal === 'v') {
          this.search = 'validator/:'
        }
      }

    },
    methods: {
      searchByKeyword(evt) {
          //엔터키
          if(evt.keyCode === 13){
            console.log('searchbox in inspect blank:', this.search);
            //  TODO: api call
          }
      }
    }
  }
</script>

<style scoped>

</style>
