import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from "@tarojs/components";
import Calendar from '../calendar/index'

import "./index.scss";

export default class SkuSelector extends Component {
    static defaultProps = {
        ticketPriceList: [],
        proInfo: {}
    }
    constructor(props) {
        super(props);
        this.state = {
            currentPrice: 0,//零售价
            originPrice: 0,//原价
            currentIndex: 0,//当前点击项(外部)
            showModalStatus: false,
            animationData: '',
            weekMap: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],//星期映射表
            skus: [
                { name: '爆款' },
                { name: '补水保湿' },
                { name: '去黑头' },
                { name: '去污渍' },
            ],
        };
    }

    //日期时间的格式化
    formatNum(num) {
        return num < 10 ? '0' + num : num + '';
    }
    //获取当日日期 格式:xxxx-xx-xx
    getLocalDate() {
        const date = new Date();
        const localYear = date.getFullYear()
        const localMonth = date.getMonth() + 1
        const day = date.getDate()
        const localDate = this.formatNum(localYear) + '-' + this.formatNum(localMonth) + '-' + this.formatNum(day)//当日完整日期:'xxxx-xx-xx'
        return localDate;
    }

    //价格日期映射表(当前查询日期->后端返回的价格日期集合 ,返回查询日期在价格日期集合中的索引位置)
    findTicketIndex(obj) {
        const findDate = obj;
        let index = this.props.ticketPriceList.findIndex((item) => {
            return item.sellDate == findDate.sellDate //返回其索引
        })
        return index;

    }

    showModal(v, i = -1) {
        if (v && Number(v.dailyStock) === 0) {
            return;
        }
        this.setState({
            currentIndex: i
        })
        if (i === -1) { //点击全部按钮,之前没有点击过具体的日期
            const status = Object.keys(this.props.currentSelectTicket).length;
            const localDate = this.getLocalDate();//获取当日日期
            const index = this.findTicketIndex({ sellDate: localDate });//查询结果,返回-1说明没有查询到
            if (status === 0 && index === -1) {//所选日期为空对象,并且今日不在价格日期表中,默认使用价格日期表中的第一项为选中项
                this.props.handleSelectTicket(this.props.ticketPriceList[0])
            } else if (status === 0 && index !== -1) {//默认今日为选中项
              
                this.props.handleSelectTicket({
                    sellDate: localDate
                })
            } else {//之前已经选择过了,默认选中之前选择的日期

            }
        } else {//点击的是具体的日期按钮
            this.props.handleSelectTicket(this.props.ticketPriceList[i])
        }

        // 显示遮罩层
        // 创建动画实例 
        let animation = Taro.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        animation.translateY(680).step()
        this.setState({
            animationData: animation.export(),
            showModalStatus: true
        }, () => {
            setTimeout(() => {
                animation.translateY(0).step();
                this.setState({
                    animationData: animation.export()
                })
            }, 200)
        })

    }

    hideModal() {
        this.setState({
            showModalStatus: false

        })
    }
    //禁止滑动穿透
    handleTouchMove() {
        return
    }
    handleClick(obj) {
        const index = this.findTicketIndex(obj);
        this.props.handleSelectTicket(obj);
        this.setState({
            currentIndex:index
        })
      
    }
    componentDidMount() {

    }

    render() {
        const { weekMap, currentIndex } = this.state
        const { ticketPriceList, proInfo, currentSelectTicket } = this.props
        return (
            <View className="sku-selector-container">
                <View className="outer-selector">
                    <View className="title">选择使用日期</View>
                    <View className="liner-selector">
                        <View className="l-left">
                            {ticketPriceList.slice(0, 5).map((v, i) => (
                                <View className={['each-item', currentIndex === i && v.dailyStock > 0 ? 'active' : v.dailyStock == 0 ? 'sale-out' : '']} onClick={this.showModal.bind(this, v, i)}>
                                    <View className="date">{v.sellDate}</View>
                                    <View className="week">( {weekMap[Number(v.week) - 1]} )</View>
                                    {v.dailyStock > 0  && <View className="price">¥{parseFloat(v.marketAmount) / 100 || 0}</View>}
                                    {v.dailyStock <= 0  && <View>售罄</View>}
                                    {/* <View className="discount">会员优惠{v.discount_price}</View> */}
                                </View>
                            ))}
                        </View>
                        <View className="l-right" onClick={this.showModal.bind(this, '', -1)}>
                            <View className="more-date-label">
                                <View>更多</View>
                                <View>日期</View>
                            </View>
                            <Image
                                className="arrow-right"
                                src="http://static.ledouya.com/Fkk90Hh8M4JX0MTHau4Uyoh64dZr"
                            />
                        </View>
                    </View>
                </View>

                <View className="inner-selector" onTouchMove={this.handleTouchMove}>
                    {this.state.showModalStatus &&
                        <View className="inner-mask" onClick={this.hideModal.bind(this)}></View>}
                    {this.state.showModalStatus &&
                        <View className="inner-content" animation={animationData}>
                            <Image className="del-icon" onClick={this.hideModal.bind(this)} src="http://static.ledouya.com/FmK56voYczZzSO8xn1qLQdSJOFVI" />
                            <View className="product-msg">
                                <Image src={proInfo.thumb} className="pro-thumb"></Image>
                                <View className="pro-right">
                                    <View className="pro-title">商品名称</View>
                                    <View className="price">
                                        <View className="current-price">¥{(parseFloat(currentSelectTicket.marketAmount)/100).toFixed(2) || '0.00'}</View>
                                        <View className="origin-price">¥{(parseFloat(currentSelectTicket.storeAmount)/100).toFixed(2) || '0.00'}</View>
                                    </View>
                                </View>
                            </View>
                            <View className="main">
                                {/* <View className="sku">
                                    <View className="sku-label">商品属性</View>
                                    <View className="sku-content">
                                        {
                                            skus.map(v => (
                                                <View className="sku-item">{v.name}</View>
                                            ))

                                        }
                                    </View>
                                </View> */}
                                <View className="calendar-label">选择使用日期</View>
                                <Calendar ticketPriceList={ticketPriceList} currentSelectTicket={currentSelectTicket}
                                    handleClick={this.handleClick.bind(this)}></Calendar>
                            </View>

                        </View>
                    }

                </View>
            </View>
        );
    }
}
