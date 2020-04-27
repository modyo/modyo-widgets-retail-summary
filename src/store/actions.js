import axios from 'axios';

const LANG = window.liquid ? window.liquid.lang : 'es-CL';
const BASE_URL = LANG === 'es-CL' ? 'https://api-bank.herokuapp.com' : 'https://dynamic-bank-api.herokuapp.com';

export default {
  async DO_DATA_INITIALIZATION(context) {
    context.commit('SET_IS_LOADING', true);
    try {
      const values = await Promise.all([
        context.dispatch('GET_ACCOUNTS'),
        context.dispatch('GET_CARDS'),
      ]);
      context.commit('SET_IS_LOADING', false);
      return values;
    } catch (err) {
      return err;
    }
  },
  async GET_ACCOUNTS(context) {
    try {
      const accounts = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/accounts`, {
        params: {
          'filter[include]': 'relatedAccount',
          'filter[order]': 'accountType',
        },
      });
      context.commit('SET_ACCOUNTS', accounts.data);
      return accounts.data;
    } catch (err) {
      return err.statusText;
    }
  },
  async GET_TRANSACTIONS_FOR_ACCOUNT(context, payload) {
    try {
      const transactions = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/accounts/${payload.accountId}/transactions/`, {
        params: {
          'filter[limit]': payload.limit,
        },
      });
      return transactions;
    } catch (err) {
      return err;
    }
  },
  async GET_CARDS(context) {
    try {
      const creditCards = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/creditCards`);
      context.commit('SET_CARDS', creditCards.data);
      return creditCards;
    } catch (err) {
      return err;
    }
  },
};
