import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accounts: [],
    cards: [],
    clientId: 1,
  },
  getters: {

  },
  mutations: {
    SET_CLIENT_ID(state, data) {
      state.clientId = data;
    },
    SET_ACCOUNTS(state, data) {
      state.accounts = data;
    },
    SET_CARDS(state, data) {
      state.cards = data;
    },
  },
  actions: {
    DO_DATA_INITIALIZATION(context) {
      return Promise.all([
        context.dispatch('GET_ACCOUNTS'),
        context.dispatch('GET_CARDS'),
      ])
        .then((values) => values)
        .catch((err) => { throw err; });
    },
    GET_ACCOUNTS(context) {
      return axios.get(`https://api-bank.herokuapp.com/api/v1/clients/${context.state.clientId}/accounts`, {
        params: {
          'filter[include]': 'relatedAccount',
          'filter[order]': 'accountType',
        },
      })
        .then((accounts) => {
          context.commit('SET_ACCOUNTS', accounts.data);
          return accounts.data;
        }, (err) => err.statusText);
    },
    GET_TRANSACTIONS_FOR_ACCOUNT(context, payload) {
      return axios.get(`https://api-bank.herokuapp.com/api/v1/clients/${context.state.clientId}/accounts/${payload.accountId}/transactions/`,
        {
          params: {
            'filter[limit]': payload.limit,
          },
        })
        .then((transactions) => transactions, (err) => err);
    },
    GET_CARDS(context) {
      return axios.get(`https://api-bank.herokuapp.com/api/v1/clients/${context.state.clientId}/creditCards`)
        .then((creditCards) => {
          context.commit('SET_CARDS', creditCards.data);
          return creditCards;
        })
        .catch((err) => err);
    },
  },
});
