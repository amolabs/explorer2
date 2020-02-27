<template>
  <v-btn
    class="font-weight-regular"
    :class="getClasses"

    :disabled="disabled"
    :color="color"

    :outlined="outlined"
    :text="text"
    :fab="fab"
    :icon="icon"
    :rounded="rounded"

    :small="small"
    :large="large"
    :block="block"

    v-on="$listeners"
    :href="href"
    :target="target"

  >
    <v-icon v-if="iconName&&!(this.$slots.default)">{{iconName}}</v-icon>
    <v-icon v-else-if="iconName&&this.$slots.default" left>{{iconName}}</v-icon>
    <slot></slot>
  </v-btn>
</template>

<script>
  export default {
    props: {
      classes: {
        type: String,
        default: undefined
      },
      color: { // button color
        type: String,
        default: 'white'
      },
      disabled: { // disable click event
        type: Boolean,
        default: false
      },
      iconName: { // icon name
        type: String,
        default: undefined
      },

      // style
      text: { // Removes the button background color
        type: Boolean,
        default: false
      },
      fab: { // Makes button round
        type: Boolean,
        default: false
      },
      outlined: { // Button will have an outline
        type: Boolean,
        default: false
      },
      icon: { // Designates the button as icon - round and flat(text)
        type: Boolean,
        default: false
      },
      rounded: { // Makes button round
        type: Boolean,
        default: false
      },


      // size
      small: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      block: { // Expands the button to 100% of available space
        type: Boolean,
        default: false
      },

      href: {
        type : String,
        default : undefined
      },
      target: {
        type : String,
        default : undefined
      },
    },
    methods: {
    },
    computed: {
      getClasses() {
        if(this.text || this.icon || this.outlined) {
          return `${this.color}--text ${this.classes}`
        } else {
          return `white--text  ${this.classes}`
        }
      },
    },
  }
</script>
