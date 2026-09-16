<script setup>
import TransactionList from '../components/TransactionList.vue'
import { useFinance } from '../composables/useFinance'

const { transactions, categoryLabel, deleteTransaction } = useFinance()
</script>

<template>
  <section class="view">
    <div class="panel-block">
      <TransactionList
        :transactions="transactions"
        :category-label="categoryLabel"
        @delete="deleteTransaction"
      />
    </div>
  </section>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-block {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 22px 24px;
}

@media (max-width: 960px) {
  .panel-block {
    padding: 18px 16px;
  }
}
</style>