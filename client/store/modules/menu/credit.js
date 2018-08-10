import lazyLoading from './lazyLoading'

export default {
  name: 'Credit',
  meta: {
    icon: 'fa-table',
    expanded: false
  },

  children: [
    {
      name: 'Credit Account',
      path: '/credit/CreditAccount',
      meta: {
        label: 'Credit Account',
        link: 'credit/CreditAccount.vue'
      },
      component: lazyLoading('credit/CreditAccount')
    },
    {
      name: 'Credit Bill',
      path: '/credit/CreditBill',
      meta: {
        label: 'Credit Bill',
        link: 'credit/CreditBill.vue'
      },
      component: lazyLoading('credit/CreditBill')
    },
    {
      name: 'Payment Record',
      path: '/credit/PaymentRecord',
      meta: {
        label: 'Payment Record',
        link: 'credit/PaymentRecord.vue'
      },
      component: lazyLoading('credit/PaymentRecord')
    },
    {
      name: 'Borrow Record',
      path: '/credit/BorrowRecord',
      meta: {
        label: 'Borrow Record',
        link: 'credit/BorrowRecord.vue'
      },
      component: lazyLoading('credit/BorrowRecord')
    }
  ]
}
