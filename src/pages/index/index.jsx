import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SkuSelector from '../../components/func/skuSelector/index'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '商品详情'
  }
  constructor(props) {
    super(props)
    this.state = {
      ticketPriceList: [
        {
          id: "1263",
          ticketId: "1164",
          sellDate: "2019-11-26",
          agentAmount: "1",
          marketAmount: "1",
          storeAmount: "1",
          dailyStock: "54",
          week: "2"
        },
        {
          id: "1264",
          ticketId: "1164",
          sellDate: "2019-11-27",
          agentAmount: "1024",
          marketAmount: "1024",
          storeAmount: "1024",
          dailyStock: "55",
          week: "3"
        },
        {
          id: "1265",
          ticketId: "1164",
          sellDate: "2019-11-28",
          agentAmount: "18",
          marketAmount: "18",
          storeAmount: "18",
          dailyStock: "53",
          week: "4"
        },
        {
          id: "1266",
          ticketId: "1164",
          sellDate: "2019-11-29",
          agentAmount: "204",
          marketAmount: "204",
          storeAmount: "204",
          dailyStock: "55",
          week: "5"
        },
        {
          id: "1267",
          ticketId: "1164",
          sellDate: "2019-11-30",
          agentAmount: "100",
          marketAmount: "100",
          storeAmount: "100",
          dailyStock: "55",
          week: "6"
        },
        {
          id: "1268",
          ticketId: "1164",
          sellDate: "2019-12-01",
          agentAmount: "199",
          marketAmount: "199",
          storeAmount: "199",
          dailyStock: "55",
          week: "7"
        },
        {

          id: "1269",
          ticketId: "1164",
          sellDate: "2019-12-02",
          agentAmount: "50",
          marketAmount: "50",
          storeAmount: "50",
          dailyStock: "55",
          week: "1"
        }
      ]
      , //有价格信息的商品集合
      currentSelectTicket: {}, //当前选中的商品
    }
  }

    //选中日期后的回调,(包含商品信息)
    handleSelectTicket(obj) {
      this.setState({
          currentSelectTicket: obj
      })
  }

  componentDidMount() {
    this.setState({
      currentSelectTicket: this.state.ticketPriceList[0],//初始化默认选中项
    })
  }
  render() {
    const { ticketPriceList,currentSelectTicket} = this.state
    return (
      <View className='product-detail-container'>
         {/* 购票选择器 */}
         <SkuSelector ticketPriceList={ticketPriceList}
                    currentSelectTicket={currentSelectTicket}
                    handleSelectTicket={this.handleSelectTicket.bind(this)}></SkuSelector>
      </View>
    )
  }
}
