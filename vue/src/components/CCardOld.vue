<template>
    <v-card
        v-bind="$attrs"
        :style="styles"
        v-on="$listeners"
    >
        <div
            class="v-offset"
            v-if="hasOffset"
            :inline="inline"
            :full-width="fullWidth"
            :offset="offset"
        >
            <v-card
                v-if="!$slots.offset"
                :color="color"
                :class="`elevation-${elevation}`"
                class="v-card--material__header"
                dark
                :outlined="outlined"
                :raised="raised"
                :sharped="sharped"
                :tile="tile"
            >
                <slot v-if="!title && !text" name="header" />
                <span v-else>
                    <h4 class="title font-weight-light mb-2" v-text="title" />
                    <p class="category font-weight-thin" v-text="text" />
                </span>
            </v-card>
            <slot v-else name="offset" />
        </div>

        <v-card-text>
            <slot/>
        </v-card-text>

        <v-divider v-if="$slots.actions" class="mx-3"/>
        <v-card-actions v-if="$slots.actions">
            <slot name="actions"/>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {
        /// outline style
        outlined: {
            type: Boolean,
            default: false
        },
        raised: {
            type: Boolean,
            default: false
        },
        sharped: {
            type: Boolean,
            default: false
        },
        tile: {
            type: Boolean,
            default: false
        },


        color: {
            type: String,
            default: 'secondary'
        },
        elevation: {
            type: [Number, String],
            default: 10
        },
        inline: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
        offset: {
            type: [Number, String],
            default: 24
        },
        title: {
            type: String,
            default: undefined
        },
        text: {
            type: String,
            default: undefined
        }
    },

    computed: {
        hasOffset() {
            return this.$slots.header ||
                this.$slots.offset ||
                this.title ||
                this.text
        },
        styles() {
            if (!this.hasOffset) return null

            return {
                marginBottom: `${this.offset}px`,
                marginTop: `${this.offset * 2}px`
            }
        }
    }
}
</script>

<style lang="scss">
    .v-card--material {
        &__header {
            &.v-card {
                border-radius: 4px;
            }
        }
    }
</style>
