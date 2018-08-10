<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">还款记录</h4>
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
                :options="paymentDateOption"
                @on-change="paymentDateChange">
              </DatePicker>
              <a class="ai" href="javascript:;" @click="changeDate(true)" v-bind:disabled="disabledRight">
                <i class="fa fa-arrow-right"></i>
              </a>
              <Button style="height:32px;" type="ghost" icon="plus-round" @click="addPaymentRecordModal = true"></Button>
          </Row>
          <table class="table">
            <thead>
              <tr>
                <th>账单</th>
                <th>本期应还</th>
                <th>本次还款</th>
                <th>剩余应还</th>
                <th>还款方式</th>
                <th>利息</th>
                <th>还款日期</th>
                <th></th>
              </tr>
            </thead>
          
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{item.creditCardBill.creditAccount.name}} {{item.creditCardBill.billMonth | formatBillMonth}}</td>
                <td>{{item.creditCardBill.newBalance.toFixed(2)}}</td>
                <td>{{item.paymentMoney.toFixed(2)}}</td>
                <td>{{(item.creditCardBill.newBalance - item.paymentMoney).toFixed(2)}}</td>
                <td>{{item.type}}</td>
                <td>{{item.interest.toFixed(2)}}</td>
                <td>{{item.paymentDate | formatDate}}</td>
                <td class="is-icon">
                    <a href="javascript:;" @click="editPaymentRecord(item)">
                      <i class="fa fa-pencil fa-fw"></i>
                    </a>
                    <Poptip
                      confirm
                          title="确认删除该记录?"
                          @on-ok="deletePaymentRecord(item.id)">
                          <a href="#">
                            <i class="fa fa-trash-o fa-fw"></i>
                          </a>
                    </Poptip>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <!-- <th>合计</th>
                <th></th>
                <th>{{totalNewBalance}}</th>
                <th>{{totalMinPayment}}</th>
                <th></th>
                <th></th> -->

                <th>合计</th>
                <th>{{totalNewBalance}}</th>
                <th>{{totalPaymentMoney}}</th>
                <th>{{totalIn}}</th>
                <th></th>
                <th>{{totalInterest}}</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>

          </table>

          <!-- <div style="text-align:right">
              <Page :total="40"  @on-change="lalala" size="small" show-elevator show-sizer></Page>
          </div> -->
        </article>
        
      </div>

      <Modal title="添加还款记录" v-model="addPaymentRecordModal" @on-ok="cofirmPaymentRecord" @on-visible-change="initFormData" :loading=true>
        <Form :model="paymentRecord" label-position="right" :label-width="100">
          <FormItem label="id:" v-show="false">
              <Input v-model="paymentRecord.id" :number=true style="width: 280px"></Input>
          </FormItem>
          <FormItem label="账单:">
              <Select v-model="paymentRecord.creditCardBill.id" style="width: 280px">
                <Option v-for="item in creditBillList" :value="item.id" :key="item.id">{{ item.creditAccount.name }} {{item.billMonth | formatBillMonth}} ￥{{item.newBalance}}</Option>
              </Select>
          </FormItem>
          <FormItem label="本次还款:">
              <Input v-model="paymentRecord.paymentMoney" :number=true style="width: 280px"></Input>
          </FormItem>
          <FormItem label="还款日期:">
            <DatePicker v-model="paymentRecord.paymentDate" format="yyyy年MM月dd日" placement="bottom-end" placeholder="请选择还款日" style="width: 280px"></DatePicker>
          </FormItem>
          <FormItem label="还款方式:">
            <Select v-model="paymentRecord.type" style="width: 280px">
              <Option value=0 label="自有" key=0>
                <span>自有</span>
              </Option>
              <Option value=1 label="套现" key=1>
                <span>套现</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="利息:">
            <Input v-model="paymentRecord.interest" :number=true style="width: 280px"></Input>
          </FormItem>
        </Form>
    </Modal>
    </div>
  </div>
</template>

<script>
import { Page, Row, DatePicker, Button, Modal, Form, FormItem, Input, Select, Option, Col, Poptip } from 'iview'
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
    Poptip
  },
  data () {
    return {
      addPaymentRecordModal: false,
      billDate: new Date(new Date().setMonth(new Date().getMonth())),
      paymentDateOption: {
        disabledDate (date) {
          return date && date.valueOf() >= new Date().setMonth(new Date().getMonth())
        }
      },
      items: [],
      disabledRight: true,
      paymentRecord: {
        creditCardBill: {
          id: ''
        },
        paymentMoney: '',
        paymentDate: '',
        type: '0',
        interest: 0
      },
      creditBillList: [],
      creditBillO: {}
    }
  },
  computed: {
    totalNewBalance: function () {
      return this.items
        .map(row => row.creditCardBill.newBalance)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    totalPaymentMoney: function () {
      return this.items
        .map(row => row.paymentMoney)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    totalInterest: function () {
      return this.items
        .map(row => row.interest)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    totalIn: function () {
      return this.items
        .map(row => row.creditCardBill.newBalance - row.paymentMoney)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    }
  },
  methods: {
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
      this.getPaymenRecord()
    },
    async paymentDateChange (date) {
      const that = this
      try {
        const response = await this.axios.get('/paymentRecord/billMonth/' + date)
        that.items = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async getPaymenRecord () {
      const that = this
      try {
        const response = await await this.axios.get('/paymentRecord/month/' + formatDate(that.billDate, 'yyyy年MM月'))
        that.items = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async initFormData (show) {
      const that = this
      if (show) {
        const response = await this.axios.get('/creditCardBill/paymentStatus/0')
        that.creditBillList = response.data.data
        for (var cb of this.creditBillList) {
          var key = cb.id
          this.creditBillO[key] = cb
        }
      } else {
        that.paymentRecord = {
          creditCardBill: {
            id: ''
          },
          paymentMoney: '',
          paymentDate: '',
          type: '',
          interest: ''
        }
      }
    },
    async cofirmPaymentRecord () {
      const that = this
      try {
        this.paymentRecord.creditCardBill = this.creditBillO[this.paymentRecord.creditCardBill.id]
        // this.paymentRecord.paymentDate = formatDate(new Date(this.paymentRecord.paymentDate), 'yyyy年MM月dd日')
        const response = await this.axios.post('/paymentRecord', this.paymentRecord)
        if (response.data.code === 10000) {
          that.$swal('保存成功!', '保存还款记录成功!', 'success')
          that.getPaymenRecord()
          that.addPaymentRecordModal = false
          that.paymentRecord = {
            creditCardBill: {
              id: ''
            },
            paymentMoney: '',
            paymentDate: '',
            type: '',
            interest: ''
          }
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async deletePaymentRecord (id) {
      const that = this
      try {
        const response = await this.axios.delete('/paymentRecord/' + id)
        if (response.data.code === 10000) {
          that.$Notice.success({
            title: '删除记录成功!'
          })
          that.getPaymenRecord()
        }
      } catch (error) {
        console.error('Error', error)
      }
    },
    editPaymentRecord (paymentRecord) {
      this.addPaymentRecordModal = true
      this.paymentRecord = JSON.parse(JSON.stringify(paymentRecord))
      console.log(this.paymentRecord)
    }
  },
  mounted () {
    this.getPaymenRecord()
  },
  filters: {
    formatBillMonth (time) {
      return formatDate(new Date(time), 'yyyy年MM月')
    },
    formatDate (time) {
      return formatDate(new Date(time), 'yyyy年MM月dd日')
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
  z-index: 1201
}

.ivu-modal-mask {
  z-index: 1200
}

.ai {
  width: 32px;
  text-align: center;
  padding: 10px;
  height: 32;
}
</style>
