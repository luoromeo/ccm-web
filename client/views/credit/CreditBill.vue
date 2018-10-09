<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">账单</h4> 
           <Row type="flex" justify="end" class="code-row-bg" style="margin-bottom:1.5rem">
             <a class="ai" href="javascript:;" @click="changeDate(false)">
                <i class="fa fa-arrow-left"></i>
              </a>
              <DatePicker 
                type="month" 
                placeholder="Select month" 
                style="width: 110px" 
                :clearable=false 
                :value="billDate" 
                format="yyyy年MM月" 
                :options="billDateOption"
                @on-change="billDateChange">
              </DatePicker>
              <a class="ai" href="javascript:;" @click="changeDate(true)" v-bind:disabled="disabledRight">
                <i class="fa fa-arrow-right"></i>
              </a>
              <Button style="height:32px;" type="ghost" icon="plus-round" @click="addBillModal = true"></Button>
          </Row>
          <table class="table">
            <thead>
              <tr>
                <th>账户</th>
                <th>账单周期</th>
                <th>本期应还</th>
                <th>最低还款</th>
                <th>到期日</th>
                <th>账单月份</th>
                <th></th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>合计</th>
                <th></th>
                <th>{{totalNewBalance}}</th>
                <th>{{totalMinPayment}}</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
            <tbody style="height: 320px;">
              <tr v-for="item in items" :key="item.id">
                <td>
                  {{item.creditAccount.name + item.creditAccount.account}}
                </td>
                <td>{{formatStatementCycle(item.statementCycleStart, item.statementCycleEnd)}}</td>
                <td>{{item.newBalance.toFixed(2)}}</td>
                <td>{{item.minPayment.toFixed(2)}}</td>
                <td>{{item.paymentDueDate | formatDate}}</td>
                <td>{{item.billMonth | formatBillMonth}}</td>
                <td v-if="item.paymentStatus == 1">
                    <Icon style="color:green" type="happy-outline"></Icon> {{getPaymentStatus(item.paymentStatus)}}
                </td>
                <td v-else class="is-icon">
                  <Icon style="color:red" type="sad-outline"></Icon>
                  <a href="javascript:;" @click="editCreditBill(item)">
                    <i class="fa fa-pencil fa-fw"></i>
                  </a>
                  <Poptip
                    confirm
                        title="确认删除该账单?"
                        @on-ok="deleteBill(item.id)">
                        <a href="#">
                          <i class="fa fa-trash-o fa-fw"></i>
                        </a>
                  </Poptip>
                  <a href="javascript:;"  @click="paymentM(item)">
                    <i class="fa fa-credit-card"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- <div style="text-align:right">
              <Page :total="40"  @on-change="lalala" size="small" show-elevator show-sizer></Page>
          </div> -->
        </article>
        
      </div>
    </div>
    <Modal title="添加账单" v-model="addBillModal" @on-ok="cofirmCreditBill" @on-visible-change="initFormData" :loading=true :transfer=true>
      <Form :model="creditBill" label-position="right" :label-width="100">
         <FormItem label="id" v-show="false">
            <Input v-model="creditBill.id" :number=true style="width: 280px"></Input>
        </FormItem>
        <FormItem label="账户:">
            <Select v-model="creditBill.creditAccount.id" style="width: 280px">
              <Option v-for="item in creditAccountList" :value="item.id" :key="item.id">{{ item.name + " " + item.account}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账单周期:">
          <DatePicker v-model="creditBill.statementCycle" format="yyyy年MM月dd日" type="daterange" placement="bottom-end" placeholder="请选择周期" style="width: 280px"></DatePicker>
        </FormItem>
        <FormItem label="本期应还:">
            <Input v-model="creditBill.newBalance" :number=true style="width: 280px"></Input>
        </FormItem>
        <FormItem label="最低还款:">
            <Input v-model="creditBill.minPayment" :number=true style="width: 280px"></Input>
        </FormItem>
        <FormItem label="到期日:">
            <DatePicker type="date" placeholder="请选择日期" v-model="creditBill.paymentDueDate" format="yyyy年MM月dd日" style="width: 280px"></DatePicker>
        </FormItem>
        <FormItem label="账单月份:">
            <DatePicker :options="billDateOption" type="month" placeholder="请选择月份" v-model="creditBill.billMonth" format="yyyy年MM月" style="width: 280px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="还款" v-model="paymentModel" @on-ok="cofirmPayment" @on-visible-change="initPayment" :loading=true :transfer=true :styles="{top: '20px'}">
      <Form :model="payment" label-position="right" :label-width="100">
         <FormItem label="id" v-show="false">
            <Input v-model="payment.paymentRecord.creditCardBill.id" :number=true style="width: 280px"></Input>
        </FormItem>
       <FormItem label="本期应还:">
            <Input v-model="payment.paymentRecord.paymentMoney" :number=true style="width: 280px"></Input>
        </FormItem>
        <FormItem label="还款日期:">
            <DatePicker type="date" placeholder="请选择日期" v-model="payment.paymentRecord.paymentDate" format="yyyy年MM月dd日" style="width: 280px"></DatePicker>
        </FormItem>
        <FormItem label="还款方式:">
          <Select v-model="payment.paymentRecord.type" style="width: 280px">
            <Option value=0 label="自有" key=0>
              <span>自有</span>
            </Option>
            <Option value=1 label="套现" key=1>
              <span>套现</span>
            </Option>
          </Select>
        </FormItem>
        <div v-if="payment.paymentRecord.type == 1">
          <FormItem label="借款金额">
            <Input v-model="payment.borrowRecord.money" :number=true style="width: 280px"></Input>
          </FormItem>
          <FormItem label="借款账户">
              <Select v-model="payment.borrowRecord.creditAccount.id" style="width: 280px">
                <Option v-for="item in creditAccountListC" :value="item.id" :key="item.id">{{ item.name + " " + item.account }}</Option>
              </Select>
          </FormItem>
          <FormItem label="借款渠道">
              <Select v-model="payment.borrowRecord.borrowChannels.name" :disabled=true style="width: 280px">
                <Option v-for="item in borrowChannels" :value="item.name" :key="item.id">{{ item.name }}</Option>
              </Select>
          </FormItem>
          <FormItem label="借款日">
            <DatePicker v-model="payment.borrowRecord.borrowingDate" format="yyyy年MM月dd日" placement="bottom-end" placeholder="请选择借款日" style="width: 280px"></DatePicker>
          </FormItem>
          <FormItem label="还款日">
            <DatePicker v-model="payment.borrowRecord.paymentDate" format="yyyy年MM月dd日" placement="bottom-end" placeholder="请选择还款日" style="width: 280px"></DatePicker>
          </FormItem>
        </div>
      </Form>
    </Modal>
  </div>
  
</template>

<script>
import { Page, Row, DatePicker, Button, Modal, Form, FormItem, Input, Select, Option, Col, Poptip, Tooltip, Icon } from 'iview'
import {formatDate} from './../../../common/date'
export default {
  components: {
    Page,
    Row,
    DatePicker,
    Button,
    Modal,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Col,
    Poptip,
    Tooltip,
    Icon
  },
  data () {
    return {
      billDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      billDateOption: {
        disabledDate (date) {
          return date && date.valueOf() >= new Date().setMonth(new Date().getMonth())
        }
      },
      items: [],
      creditBill: {
        creditAccount: {
          id: ''
        },
        statementCycle: '',
        newBalance: '',
        minPayment: '',
        paymentDueDate: '',
        billMonth: ''
      },
      payment: {
        paymentRecord: {
          creditCardBill: {
            id: ''
          },
          paymentMoney: '',
          paymentDate: '',
          type: '0'
        },
        borrowRecord: {
          creditAccount: {
            id: ''
          },
          borrowChannels: {
            id: ''
          },
          money: 0,
          borrowingDate: '',
          paymentDate: ''
        }
      },
      borrowChannels: [],
      borrowChannelsO: {},
      creditAccountList: [],
      creditAccountListO: {},
      disabledRight: false,
      paymentModel: false,
      addBillModal: false
    }
  },
  computed: {
    totalNewBalance: function () {
      return this.items
        .map(row => row.newBalance)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0).toFixed(2)
    },
    totalMinPayment: function () {
      return this.items
        .map(row => row.minPayment)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0).toFixed(2)
    },
    creditAccountListC: function () {
      return this.creditAccountList.filter(cc => !(cc.account.includes('花呗') || cc.account.includes('白条')))
    }
  },
  methods: {
    getPaymentStatus (type) {
      return type === 0 ? '待还款' : '已还清'
    },
    changeDate (add) {
      const next = new Date(new Date().setMonth(new Date().getMonth()))
      if (add) {
        this.billDate = new Date(new Date().setMonth(new Date(this.billDate).getMonth() + 1))
        if (next.valueOf() <= this.billDate.valueOf()) {
          this.disabledRight = true
        }
      } else {
        this.billDate = new Date(new Date().setMonth(new Date(this.billDate).getMonth() - 1))
        if (next.valueOf() > this.billDate.valueOf()) {
          this.disabledRight = false
        }
      }
      this.getCreditBill()
    },
    formatStatementCycle (statementCycleStart, statementCycleEnd) {
      return formatDate(new Date(statementCycleStart), 'yyyy年MM月dd日') + '-' + formatDate(new Date(statementCycleEnd), 'yyyy年MM月dd日')
    },
    async billDateChange (date) {
      const that = this
      try {
        const response = await this.axios.get('/creditCardBill/billMonth/' + date)
        that.items = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async getCreditBill () {
      const that = this
      try {
        const response = await await this.axios.get('/creditCardBill/billMonth/' + formatDate(that.billDate, 'yyyy年MM月'))
        that.items = response.data.data
      } catch (error) {
      }
    },
    async initFormData (show) {
      const that = this
      if (show) {
        const response = await this.axios.get('/creditAccount')
        that.creditAccountList = response.data.data
      } else {
        that.creditBill = {
          creditAccount: {
            id: ''
          },
          statementCycle: '',
          newBalance: '',
          minPayment: '',
          paymentDueDate: '',
          billMonth: ''
        }
      }
    },
    initPayment (show) {
      if (!show) {
        this.payment = {
          paymentRecord: {
            creditCardBill: {
              id: ''
            },
            paymentMoney: '',
            paymentDate: '',
            type: '0'
          },
          borrowRecord: {
            creditAccount: {
              id: ''
            },
            borrowChannels: {
              name: ''
            },
            money: 0,
            borrowingDate: '',
            paymentDate: ''
          }
        }
      }
    },
    async cofirmCreditBill () {
      const that = this
      const creditBillEntity = JSON.parse(JSON.stringify(this.creditBill))
      creditBillEntity['statementCycleStart'] = creditBillEntity.statementCycle[0]
      creditBillEntity['statementCycleEnd'] = creditBillEntity.statementCycle[1]
      console.log(creditBillEntity)
      try {
        const response = await this.axios.post('/creditCardBill', creditBillEntity)
        if (response.data.code === 10000) {
          that.$swal('保存成功!', '保存账单成功!', 'success')
          that.getCreditBill()
          that.addBillModal = false
          that.creditBill = {
            creditAccount: {
              id: ''
            },
            statementCycle: '',
            newBalance: '',
            minPayment: '',
            paymentDueDate: '',
            billMonth: ''
          }
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async cofirmPayment () {
      const that = this
      this.payment.borrowRecord.creditAccount = this.creditAccountListO[this.payment.borrowRecord.creditAccount.id]
      this.payment.borrowRecord.borrowChannels = this.borrowChannelsO[this.payment.borrowRecord.borrowChannels.name]
      try {
        const response = await this.axios.post('/paymentRecord/payment', {'paymentRecord': that.payment.paymentRecord, 'borrowRecord': that.payment.borrowRecord})
        if (response.data.code === 10000) {
          that.$Notice.success({
            title: '还款成功!'
          })
          that.getCreditBill()
          that.paymentModel = false
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async paymentM (bill) {
      this.payment.paymentRecord.paymentMoney = bill.newBalance
      this.payment.paymentRecord.paymentDate = new Date()
      this.payment.paymentRecord.creditCardBill = bill
      this.paymentModel = true
    },
    async deleteBill (id) {
      const that = this
      try {
        const response = await this.axios.delete('/creditCardBill/' + id)
        if (response.data.code === 10000) {
          that.$Notice.success({
            title: '删除账单成功!'
          })
          that.getCreditBill()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    editCreditBill (cb) {
      const creditBill = JSON.parse(JSON.stringify(cb))
      creditBill['statementCycle'] = [creditBill.statementCycleStart, creditBill.statementCycleEnd]
      this.creditBill = creditBill
      this.addBillModal = true
    },
    creatCreditAccountListO () {
      for (var creditAccount of this.creditAccountList) {
        var key = creditAccount.id
        var value = creditAccount
        this.creditAccountListO[key] = value
      }
    },
    creditBorrowChannelsO () {
      for (var bc of this.borrowChannels) {
        var key = bc.name
        var value = bc
        this.borrowChannelsO[key] = value
      }
    }
  },
  mounted () {
    this.getCreditBill()
  },
  filters: {
    formatBillMonth (time) {
      return formatDate(new Date(time), 'yyyy年MM月')
    },
    formatDate (time) {
      return formatDate(new Date(time), 'yyyy年MM月dd日')
    }
  },
  watch: {
    'payment.paymentRecord.type': async function (n, o) {
      if (n === '1') {
        const response = await this.axios.get('/creditAccount')
        this.creditAccountList = response.data.data
        const borrowChannelsResult = await this.axios.get('/borrowChannels')
        this.borrowChannels = borrowChannelsResult.data.data
        this.payment.borrowRecord.money = this.payment.paymentRecord.paymentMoney
        this.payment.borrowRecord.borrowingDate = new Date()
        this.creatCreditAccountListO()
        this.creditBorrowChannelsO()
      }
    },
    'payment.borrowRecord.money': async function (newMoney, oldMoney) {
      if (newMoney !== undefined) {
        const that = this
        const response = await this.axios.get('/creditAccount/money?money=' + newMoney)
        if (response.data.code === 10000) {
          that.creditAccountList = response.data.data
          that.payment.borrowRecord.creditAccount.id = that.creditAccountList[0].id
          this.creatCreditAccountListO()
        }
      }
    },
    'payment.borrowRecord.creditAccount.id': function (newId, oldId) {
      if (newId !== undefined && newId !== '') {
        const creditAccount = this.creditAccountListO[newId]
        if (creditAccount.name.includes('支付宝')) {
          this.payment.borrowRecord.borrowChannels.name = '借呗'
        } else {
          this.payment.borrowRecord.borrowChannels.name = '通刷'
        }
      }
    },
    'payment.borrowRecord.borrowingDate': function (newDate, oldDate) {
      if (this.payment.paymentRecord.type === 1) {
        this.payment.borrowRecord.paymentDate = this.payment.borrowRecord.borrowingDate
      }
    }
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

.ivu-modal-wrap {
  z-index: 1201;
}

.ivu-modal-mask {
  z-index: 1200;
}

.ai {
  width: 32px;
  text-align: center;
  padding: 10px;
  height: 32;
}

</style>
