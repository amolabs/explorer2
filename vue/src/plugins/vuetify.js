import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md',
      },
    theme: {
        themes: {
            light: {
                lightRed: '#f87979',
                red: '#ff3a4c',
                deepRed: '#ff0017',
                green: '#58deb6',
                deepGreen: '#18bb4b',
                blue: '#65a8fe',
                deepBlue: '#0070ff',
                orange: '#ffb35e',
                lightOrange: '#ffb767',
                deepOrange: '#fb8502',
                grey: '#8d99a3',
                deepGrey: '#485158',
                lightGrey: '#d9dee4',
                white: '#ffffff',

            },
            dark: {
                red: '#ff3a4c',
                green: '#58deb6',
                deepGreen: '#18bb4b',
                blue: '#65a8fe',
                orange: '#ffb35e',
                grey: '#8d99a3',
                deepGrey: '#485158',
                lightGray: '#d2d8de',
            },
        },
    }
});
