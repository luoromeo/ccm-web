<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">借款记录</h4>
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
                <th>信用账户</th>
                <th>方式</th>
                <th>金额</th>
                <th>借款日</th>
                <th>还款日期</th>
                <th>天数</th>
                <th>计息方式</th>
                <th>利率</th>
                <th>利息</th>
                <th>其他</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{item.creditAccount.name}} {{item.creditAccount.account}}</td>
                <td>{{item.borrowChannels.name}}</td>
                <td>{{item.money.toFixed(2)}}</td>
                <td>{{item.borrowingDate}}</td>
                <td>{{item.paymentDate}}</td>
                <td>{{item.borrowingDay}}</td>
                <td>{{getInterestAccrualTypeName(item.borrowChannels.interestAccrualType)}}</td>
                <td>{{item.borrowChannels.interestRate + '%'}}</td>
                <td>{{item.interest.toFixed(2)}}</td>
                <td>{{item.fee.toFixed(2)}}</td>
                
                <td class="is-icon">
                    <a href="javascript:;" @click="editBorrowRecord(item)">
                      <i class="fa fa-pencil fa-fw"></i>
                    </a>
                    <Poptip
                      confirm
                          title="确认删除该记录?"
                          @on-ok="deleteBorrowRecord(item.id)">
                          <a href="#">
                            <i class="fa fa-trash-o fa-fw"></i>
                          </a>
                    </Poptip>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>合计</th>
                <th></th>
                <th>{{totalMoney}}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>{{totalInterest}}</th>
                <th>{{totalExtraPayment}}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <!-- <div style="text-align:right">
              <Page :total="40"  @on-change="lalala" size="small" show-elevator show-sizer></Page>
          </div> -->
        </article>
        
      </div>
    </div>

    <Modal title="借款" v-model="addBillModal" @on-ok="cofirmBorrowRecord" @on-visible-change="initFormData" :loading=true>
      <Form :model="borrowRecord" label-position="right" :label-width="100">
        <FormItem label="借款金额">
            <Input v-model="borrowRecord.money" :number=true style="width: 280px"></Input>
        </FormItem>
        <FormItem label="借款账户">
            <Select v-model="borrowRecord.creditAccount.id" style="width: 280px">
              <Option v-for="item in creditAccountListC" :value="item.id" :key="item.id">{{ item.name + " " + item.account }}</Option>
            </Select>
        </FormItem>
        <FormItem label="借款渠道">
            <Select v-model="borrowRecord.borrowChannels.name" :disabled=true style="width: 280px">
              <Option v-for="item in borrowChannels" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="借款日">
          <DatePicker v-model="borrowRecord.borrowingDate" format="yyyy年MM月dd日" placement="bottom-end" placeholder="请选择借款日" style="width: 280px"></DatePicker>
        </FormItem>
        <FormItem label="还款日">
          <DatePicker v-model="borrowRecord.paymentDate" format="yyyy年MM月dd日" placement="bottom-end" placeholder="请选择还款日" style="width: 280px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>

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
      billDate: new Date(new Date().setMonth(new Date().getMonth())),
      billDateOption: {
        disabledDate (date) {
          return date && date.valueOf() >= new Date().setMonth(new Date().getMonth())
        }
      },
      items: [],
      creditAccountList: [],
      borrowChannels: [],
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
      },
      disabledRight: true,
      addBillModal: false
    }
  },
  computed: {
    totalMoney: function () {
      return this.items
        .map(row => row.money)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    totalInterest: function () {
      return this.items
        .map(row => row.interest)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    totalExtraPayment: function () {
      return this.items
        .map(row => row.fee)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
        .toFixed(2)
    },
    creditAccountListC: function () {
      return this.creditAccountList.filter(cc => !(cc.account.includes('花呗') || cc.account.includes('白条')))
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
      this.getBorrowRecord()
    },
    async billDateChange (date) {
      const that = this
      try {
        const response = await this.axios.get('/borrowRecord/month/' + date)
        that.items = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async getBorrowRecord () {
      const that = this
      try {
        const response = await await this.axios.get('/borrowRecord/month/' + formatDate(that.billDate, 'yyyy年MM月'))
        that.items = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async initFormData (show) {
      const that = this
      if (show) {
        const response = await this.axios.get('/creditAccount')
        that.creditAccountList = response.data.data
        const borrowChannelsResult = await this.axios.get('/borrowChannels')
        that.borrowChannels = borrowChannelsResult.data.data
      } else {
        that.borrowRecord = {
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
      }
    },
    async cofirmBorrowRecord () {
      const that = this
      try {
        this.borrowRecord['borrowingDay'] = (this.borrowRecord.paymentDate - this.borrowRecord.borrowingDate) / (1000 * 60 * 60 * 24)
        var borrowChannelsO = {}
        for (var bc of this.borrowChannels) {
          var key = bc.name
          borrowChannelsO[key] = bc
        }
        var borrowChannels = borrowChannelsO[this.borrowRecord.borrowChannels.name]
        var interestAccrualType = borrowChannels.interestAccrualType
        if (interestAccrualType === 0) {
          // 按天计息
          this.borrowRecord['interest'] = (borrowChannels.interestRate * this.borrowRecord.money / 100 * this.borrowRecord['borrowingDay']).toFixed(2)
        } else {
          // 按次计息
          this.borrowRecord['interest'] = (borrowChannels.interestRate * this.borrowRecord.money / 100 + borrowChannels.fee).toFixed(2)
        }
        this.borrowRecord['fee'] = borrowChannels.fee
        this.borrowRecord.borrowingDate = formatDate(new Date(this.borrowRecord.borrowingDate), 'yyyy年MM月dd日')
        this.borrowRecord.paymentDate = formatDate(new Date(this.borrowRecord.paymentDate), 'yyyy年MM月dd日')
        const response = await this.axios.post('/borrowRecord', this.borrowRecord)
        if (response.data.code === 10000) {
          that.$swal('保存成功!', '保存借款成功!', 'success')
          that.getBorrowRecord()
          that.addBillModal = false
          that.borrowRecord = {
            creditAccount: {
              id: ''
            },
            borrowChannels: {
              id: '',
              name: ''
            },
            money: 0,
            borrowingDate: '',
            paymentDate: ''
          }
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    getInterestAccrualTypeName (type) {
      return type === 0 ? '按天计息' : '按次计息'
    },
    async deleteBorrowRecord (id) {
      const that = this
      try {
        const response = await this.axios.delete('/borrowRecord/' + id)
        if (response.data.code === 10000) {
          that.$Notice.success({
            title: '删除记录成功!'
          })
          that.getBorrowRecord()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    editBorrowRecord (borrowRecord) {
      const br = JSON.parse(JSON.stringify(borrowRecord))
      this.borrowRecord = br
      this.addBillModal = true
    }
  },
  mounted () {
    this.getBorrowRecord()
  },
  watch: {
    'borrowRecord.money': async function (newMoney, oldMoney) {
      const that = this
      const response = await this.axios.get('/creditAccount/money?money=' + newMoney)
      if (response.data.code === 10000) {
        that.creditAccountList = response.data.data
      }
    },
    'borrowRecord.creditAccount.id': function (newId, oldId) {
      for (var creditAccount of this.creditAccountList) {
        if (creditAccount.id === newId) {
          if (creditAccount.name.includes('支付宝')) {
            this.borrowRecord.borrowChannels.name = '借呗'
          } else {
            this.borrowRecord.borrowChannels.name = '通刷'
          }
          break
        }
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
