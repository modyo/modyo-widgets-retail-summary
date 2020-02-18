<template>
  <article
    id="summary-app"
    class="py-4 py-sm-5">
    <div class="container-fluid px-0">
      <header class="header-summary mb-4 mb-sm-5 d-xl-flex align-items-xl-center">
        <h2 class="mb-0 mr-xl-5 text-primary text-center text-xl-left">
          {{ $t('main.title') }}
        </h2>
        <button class="add-product btn btn-primary d-none d-xl-block">
          {{ $t('main.add-product-btn') }}
        </button>
      </header>

      <div
        v-if="!accounts && !cards"
        class="loading text-center pt-5">
        <font-awesome-icon
          icon="circle-notch"
          size="5x"
          spin />
      </div>

      <div
        v-else
        ref="viewport"
        class="products-viewport">
        <div
          ref="content"
          class="products-summary d-flex align-items-stretch">
          <summary-account
            v-for="account in accounts"
            :key="`account-${account.id}`"
            :account="account"
            :client-id="clientId" />

          <summary-card
            v-for="card in cards"
            :key="`card-${card.id}`"
            :card="card"
            :client-id="clientId" />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import ScrollBooster from 'scrollbooster';
import { getURLParams } from '@modyo/financial-commons';
import SummaryAccount from './components/SummaryAccount.vue';
import SummaryCard from './components/SummaryCard.vue';

export default {
  name: 'App',
  components: {
    SummaryAccount,
    SummaryCard,
  },
  data() {
    return {
      carousel: {},
    };
  },
  computed: {
    accounts() {
      return this.$store.state.accounts;
    },
    cards() {
      return this.$store.state.cards;
    },
    clientId() {
      return this.$store.state.clientId;
    },
  },
  created() {
    const client = parseInt(getURLParams('client'), 10) || 1;
    this.$store.commit('SET_CLIENT_ID', client);
    this.$store.dispatch('DO_DATA_INITIALIZATION').then(() => {
      this.initProductsCarousel();
    });
  },
  methods: {
    initProductsCarousel() {
      const { viewport } = this.$refs;
      const { content } = this.$refs;

      // eslint-disable-next-line no-unused-vars
      const sb = new ScrollBooster({
        viewport,
        content,
        direction: 'horizontal',
        emulateScroll: false,
        onUpdate: (state) => {
          if (state.borderCollision.right) {
            content.style.transform = `translateX(${-state.position.x - 20}px)`;
          } else {
            content.style.transform = `translateX(${-state.position.x}px)`;
          }

          if (state.isMoving) {
            viewport.style.cursor = 'grabbing';
          } else {
            viewport.style.cursor = 'grab';
          }
        },
        shouldScroll: (state, event) => {
          // disable scroll if clicked on button
          const isLink = event.target.nodeName.toLowerCase() === 'a';
          return !isLink;
        },
      });

      sb.updateMetrics();
    },
  },
};
</script>

<style lang="scss">
  .products-viewport {
    overflow: hidden;

    cursor: grab;
  }

  @media (max-width: 575.98px) {
    .header-summary h2 {
      font-size: 24px;
    }
  }

  @media (min-width: 1200px) {
    .header-summary {
      margin-left: 140px;
    }
  }
</style>
