<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">One</p>
          <p class="subtitle">Subtitle</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">Two</p>
          <p class="subtitle">Subtitle</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">Three</p>
          <p class="subtitle">Subtitle</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">Four</p>
          <p class="subtitle">Subtitle</p>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
          <article class="tile is-child box">
            <div class="content">
              <chart :type="'line'" :data="billTrendsChartData" :options="options_3"></chart>
            </div>
            <div class="content">
              <chart :type="'line'" :data="interestTrendsChartData" :options="options_3"></chart>
            </div>
          </article>
      </div>

      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">Six</h4>
          <div class="content">
            <chart :type="'pie'" :data="chartData"></chart>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-9">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Seven</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
          <div class="tile is-8 is-parent">
            <article class="tile is-child box">
              <p class="title">Eight</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
        </div>
        <div class="tile">
          <div class="tile is-8 is-parent">
            <article class="tile is-child box">
              <p class="title">Nine</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Ten</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <p class="title">Eleven</p>
            <p class="subtitle">Subtitle</p>
            <div class="content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'vue-bulma-chartjs'
import Chartist from 'vue-bulma-chartist'

export default {
  components: {
    Chart,
    Chartist
  },
  data () {
    return {  
      data: [1, 2, 3],
      lineAreaData: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        series: [[5, 9, 7, 8, 5, 3, 5, 4, 1, 32, 11, 10]]
      },
      lineAreaOptions: {
        low: 0,
        showArea: true,
        fullWidth: true,
      },
      billTrends: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      interestTrends: [0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0],
      options_3: {
        legend: {
          display: false
        },
        title: {
            display: true,
            text: '趋势图'
        },
        tooltips: {
          mode: 'nearest',
          enabled: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      },
      labels_3: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      backgroundColor_3: [
        'rgba(31, 200, 219, 1)',
        'rgba(151, 205, 118, 1)'
      ],
      series: ['金额', '利息']
    }
  },
  computed: {
    chartData () {
      return {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
      }
    },
    interestTrendsChartData () {
      let data = {
        labels: this.labels_3
      }
      data.datasets = [{
        data: this.interestTrends,
        label: "利息",
        borderColor: "rgba(151, 205, 118, .5)",
        pointBackgroundColor: "rgba(151, 205, 118, 1)",
        backgroundColor: "rgba(151, 205, 118, .5)"
      }]
      return data 
    },
    billTrendsChartData () {
      let data = {
        labels: this.labels_3
      }
      data.datasets = [{
        data: this.billTrends,
        label: "金额",
        borderColor: "rgba(31, 200, 219, .5)",
        pointBackgroundColor: "rgba(31, 200, 219, 1)",
        backgroundColor: "rgba(31, 200, 219, .5)"
      }]
      return data 
    },
  },
  methods: {
    async getBillTrends () {
      const that = this;
      try {
        const response = await this.axios.get('/creditCardBill/billTrends')
        if (response.data.code === 10000) {
          that.billTrends.forEach((item, i) => {
            that.billTrends.splice(i, 1, response.data.data[i])
          })
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async getInterestTrends() {
      const that = this
      try {
         const response = await this.axios.get('/borrowRecord/interestTrends')
         that.interestTrends.forEach((item, i) => {
            that.interestTrends.splice(i, 1, response.data.data[i])
          })
      } catch (error) {
        console.log('Error:', error)
      }
    }
    
  },
  mounted () {
    this.getBillTrends()
    this.getInterestTrends()
  }
}
</script>

<style lang="scss" scoped>
  .lines-bars {
    height: 240px;
  }
</style>
