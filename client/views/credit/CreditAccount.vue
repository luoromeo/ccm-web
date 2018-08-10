<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">信用账户</h4>
          <table class="table">
            <thead>
              <tr>
                <th>名称</th>
                <th>账户</th>
                <th>信用额度</th>
                <th>已用额度</th>
                <th>可用额度</th>
                <th>还款日</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{item.name}}</td>
                <td>{{item.account}}</td>
                <td>{{item.creditLimit.toFixed(2)}}</td>
                <td>{{(item.creditLimit - item.availableCredit).toFixed(2)}}</td>
                <td>{{item.availableCredit.toFixed(2)}}</td>
                <td>{{item.dueDate}}</td>
                <td class="is-icon">
                  <a href="#">
                    <i class="fa fa-credit-card"></i>
                  </a>
                  <a href="#">
                    <i class="fa fa-instagram"></i>
                  </a>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <th>合计</th>
                <th></th>
                <th>{{totalCreditLimit}}</th>
                <th>{{totalCreditLimit - totalAvailableCredit}}</th>
                <th>{{totalAvailableCredit}}</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <div style="text-align:right">
              <Page :total="40"  @on-change="lalala" size="small" show-elevator show-sizer></Page>
          </div>
        </article>
        
      </div>
    </div>
  </div>
</template>

<script>
import { Page } from 'iview'

export default {
  components: {
    Page
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    totalCreditLimit: function () {
      return this.items
        .map(row => row.creditLimit)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0).toFixed(2)
    },
    totalAvailableCredit: function () {
      return this.items
        .map(row => row.availableCredit)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0).toFixed(2)
    }
  },
  methods: {
    lalala (pageNo) {
    },
    getCreditAccount () {
      const that = this
      this.axios
        .get('/creditAccount')
        .then(function (response) {
          that.items = response.data.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getCreditAccount()
  }
}
</script>

<style lang="scss">
.table-responsive {
  display: block;
  width: 100%;
  min-height: 0.01%;
  overflow-x: auto;
}

table tr th {
  text-align: center;
}
</style>
