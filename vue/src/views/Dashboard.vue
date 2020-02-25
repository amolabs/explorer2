<template>
  <div id="page-dashboard">
    <v-container>
      <v-row justify="space-between">
        <v-col class="total-overview">
          <c-card title="Height" tile>
            content
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Time" tile>
            content
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Tile" tile>
            content
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Tile" tile>
            content
          </c-card>
        </v-col>
        <v-col class="total-overview">
          <c-card title="Tile" tile>
            content
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="12">
          <c-card title="Network Overview"></c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="6">
          <c-card title="Validator Overview"></c-card>
        </v-col>
        <v-col cols="6">
          <c-card title="Asset Overview"></c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align-center justify-space-around row fill-height ma-5>
        <v-col cols="6">
          <c-card title="Governance Overview"></c-card>
        </v-col>
        <v-col cols="6">
          <c-card title="Data trade Overview"></c-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {

  }
</script>


<style lang="scss" scoped>
  .total-overview {
    //xs 적용 안되서 css 직접 선언
    @media (min-width: 901px) {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 16.6666666667%;
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }
    @media (max-width: 900px) {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
</style>
