import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faChevronLeft, faChevronRight, faWallet, faCircleNotch, faCreditCard,
} from '@fortawesome/free-solid-svg-icons';

import { } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronLeft, faChevronRight, faWallet, faCircleNotch, faCreditCard);

Vue.component('font-awesome-icon', FontAwesomeIcon);
