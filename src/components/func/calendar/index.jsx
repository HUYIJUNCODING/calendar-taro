import Taro, {
    Component
} from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class SkuSelector extends Component {
    //props default
    static defaultProps = {
        ticketPriceList: []
    };
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(), //获取系统日期
            currentDate: '', //当前选择的日期
            selectMonth: '', //选择的月份
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            color: '#fff',//选中日期文字颜色
            bgColor: 'f5f6f7',//非今日的日期背景色
            dayArr: [], //月份天数
            year: '', //当前选择的年
            month: '', //当前选择的月
            status: 1, //1:属于当月的天,0:属于上月2:属于下月
            prevMonthStatus: false,//返回上个月按钮禁用状态,false:禁用,true,不禁用
        }
    }

    //时间格式 xxxx-xx-xx 转时间戳
    fmtDate(date) {
        let dateStamp = new Date(date.replace(/-/g, '/'));
        return dateStamp.getTime()
    }

    //设置有效的日期范围
    setValidDate(dateObj) {
        const currentDateStamp = this.fmtDate(dateObj.sellDate);//当前传入日期时间戳
        const startDateStamp = this.fmtDate(this.props.ticketPriceList[0].sellDate);//设定价格的票券起始日期时间戳
        const endDateStamp = this.fmtDate(this.props.ticketPriceList[this.props.ticketPriceList.length - 1].sellDate)///设定价格的票券结束日期时间戳
        if (currentDateStamp >= startDateStamp && currentDateStamp <= endDateStamp) {
            if (dateObj.marketAmount && dateObj.dailyStock > 0) {//有效的日期(可点击)
                dateObj.ban = 1;//可选状态
                dateObj.color = '#666';
            } else if (dateObj.marketAmount && dateObj.dailyStock <= 0) {//已售罄
                dateObj.bgColor = '#999';
                dateObj.color = '#333';
                dateObj.ban = 3;//已售罄
            }

        }
    }

    //判断传入时间跟当日时间大小,返回值为两者差值
    checkValidDate(date) {
        let localYear = this.state.date.getFullYear()
        let localMonth = this.state.date.getMonth() + 1
        let day = this.state.date.getDate()
        let localDate = this.formatNum(localYear) + '-' + this.formatNum(localMonth) + '-' + this.formatNum(day)//当日完整日期:'xxxx-xx-xx'
        const currentDateStamp = this.fmtDate(date);//当前传入日期时间戳
        const localDateStamp = this.fmtDate(localDate)//当日时间戳
        return currentDateStamp - localDateStamp


    }

    //初始化日期
    initDate(year, month) {
        return new Promise(resolve => {
            let weekValue = '';
            let totalDay = new Date(year, month + 1, 0).getDate()//获取当前所选择月份总天数
            this.setState({
                selectMonth: month + 1,
                dayArr: []
            }, () => {
                //获取并填充当前所查询年份对应月份数据
                for (let i = 1; i <= totalDay; i++) {
                    let dayDate = this.formatNum(year) + '-' + this.formatNum(month + 1) + '-' + this.formatNum(i);
                    let obj = {
                        sellDate: dayDate,
                        day: i,
                        marketAmount: '',//零售价
                        storeAmount: '',//门市价
                        dailyStock: '',//库存
                        bgColor: 'none',
                        color: '#ccc',
                        status: 1, //当月的天
                        ban: 2//1:正常,2:禁用,3:售罄
                    }

                    weekValue = (new Date(year, month, i)).getDay(); //获取这天对应的是星期几 0 - 6,0 表示星期天
                    if (i == 1 && weekValue != 0) {
                        this.addBeforeValue(weekValue)//填充日历开始的空白,
                    }

                    let index = this.props.ticketPriceList.findIndex((item) => {
                        return item.sellDate == dayDate //匹配设置价格的天,并返回其索引
                    })
                    if (index >= 0) {
                        obj.marketAmount = this.props.ticketPriceList[index].marketAmount;//将价格赋值给日历中匹配到的项
                        obj.dailyStock = this.props.ticketPriceList[index].dailyStock;
                        obj.storeAmount = this.props.ticketPriceList[index].storeAmount;
                    }
                    this.setValidDate(obj) //设置有效的日期范围
                    let dayArr = this.state.dayArr;
                    dayArr.push(obj)//将当前月的天push进数组
                    this.setState({
                        dayArr
                    }, () => {
                        if (i == totalDay && weekValue != 6) {
                            this.addAfterValue(weekValue) //填充日历结尾的空白
                        }
                        resolve(true);
                    })
                }
            })
            //判断当前展示的月份跟本月关系,如果是当月则禁用返回上个月按钮
            let dayDate = this.formatNum(year) + '-' + this.formatNum(month + 1) + '-' + this.formatNum(1);
            if (this.checkValidDate(dayDate) <= 0) {
                this.setState({
                    prevMonthStatus: false
                })
            } else {
                this.setState({
                    prevMonthStatus: true
                })
            }
        })
    }

    //补充前面空白日期
    addBeforeValue(weekValue) {
        let totalDay = new Date(this.state.year, this.state.month, 0).getDate();
        for (let i = 0; i < weekValue; i++) {
            let obj = {
                sellDate: '',
                day: '',
                marketAmount: '',//零售价
                storeAmount: '',//门市价
                bgColor: 'none',
                color: '#ccc',
                status: 0,
                ban: 2//禁用
            }
            // obj.day = totalDay - (weekValue - i) + 1;
            let dayArr = this.state.dayArr;
            dayArr.push(obj);
            this.setState({
                dayArr
            })
        }
    }

    //补充后空白日期
    addAfterValue(weekValue) {
        let totalDay = new Date(this.state.year, this.state.month, 0).getDate();
        for (let i = 0; i < (6 - weekValue); i++) {
            let obj = {
                sellDate: '',
                day: '',
                marketAmount: '',//零售价
                storeAmount: '',//门市价
                bgColor: 'none',
                color: '#ccc',
                status: 2,
                ban: 2//禁用
            }
            //  obj.day = i + 1;
            let dayArr = this.state.dayArr;
            dayArr.push(obj);
            this.setState({
                dayArr
            })
        }
    }
    //日期时间的格式化
    formatNum(num) {
        return num < 10 ? '0' + num : num + '';
    }

    //调用initDate方法
    async callInitDateFunc(year, month) {
        await this.initDate(year, month);
        this.initInfo();
    }
    //上一个月
    prevMonth() {
        if (!this.state.prevMonthStatus) return
        if (this.state.month == 0) {//1月
            let year = this.state.year - 1;//需要返回到上一年
            this.setState({
                year,
                month: 11//12月
            }, () => {
                this.callInitDateFunc(this.state.year, this.state.month);
            })
        } else {
            let month = this.state.month - 1;
            this.setState({
                month
            }, () => {
                this.callInitDateFunc(this.state.year, this.state.month);
            })
        }

    }
    //下一个月
    nextMonth() {
        if (this.state.month == 11) {//12月
            let year = this.state.year + 1;//到下一年
            this.setState({
                year,
                month: 0//1月
            }, () => {
                this.callInitDateFunc(this.state.year, this.state.month);
            })
        } else {
            let month = this.state.month + 1;
            this.setState({
                month
            }, () => {
                this.callInitDateFunc(this.state.year, this.state.month);
            })
        }

    }
    //输出当前点击项(选中的哪天)
    handleClick(obj) {
        //查询当前选中日期下标
        let idx = this.state.dayArr.findIndex((item) => {
            return item.sellDate == obj.sellDate
        })
        if (this.state.dayArr[idx].status == 0) {//如果点击日历开始的填充日期
            this.setState({
                status: 0
            }, () => {
                // this.prevMonth();//自动跳转上一个月
            })
            return;
        }
        if (this.state.dayArr[idx].status == 2) { //如果点击日历结尾的填充日期
            this.setState({
                status: 2
            }, () => {
                //  this.nextMonth();//自动跳转下一个月
            })
            return;
        }
        if (this.state.dayArr[idx].status == 1 && this.state.dayArr[idx].ban == 1) {//点击日历日期,并且为可点击状态
            let dayArr = this.state.dayArr;
            dayArr[idx].bgColor = '#FEB100';//设定选中日期的背景色
            dayArr[idx].color = '#fff';//选中日期的文字颜色

            //将日历其他可点击状态的日期文字重置为默认色
            let count = 0;
            for (let i = 0; i < this.state.dayArr.length; i++) {
                if (this.state.dayArr[i].status == 1 && this.state.dayArr[i].ban == 1 && i != idx) {
                    dayArr[i].bgColor = 'none';
                    dayArr[i].color = '#666';
                    count++;
                }
                if (count >= this.props.ticketPriceList.length) break;//说明已经全部重置完成,直接结束循环
            }
            this.setState({
                dayArr
            })
            this.props.handleClick(obj)//返回当前点击的日期给父组件
        }

    }
    //价格日历映射表(当前查询日期->价格日历 ,返回查询日期在价格日历的索引位置)
    findTicketIndex(obj) {
        let findDateObj = obj;
        let index = this.state.dayArr.findIndex((item) => {
            return item.sellDate == findDateObj.sellDate //返回其索引
        })
        return index;

    }
    //初始化商品信息
    initInfo() {
        const findIndex = this.findTicketIndex(this.props.currentSelectTicket);
        if (findIndex !== -1) {
            this.handleClick(this.state.dayArr[findIndex])
        }
    }

    componentDidMount() {
        let year = this.state.date.getFullYear(); //获取当前所在年份
        let month = this.state.date.getMonth(); //获取当前所在月份 0-11
        this.setState({
            year,
            month
        }, async () => {
            await this.initDate(this.state.year, this.state.month); //初始化日历数据 
            this.initInfo() //初始化当前商品价格等展示信息,该方法只在组件初始化的时候执行一次
        })


    }

    render() {
        const { year, selectMonth, dayArr, weeks, prevMonthStatus } = this.state
        return (
            <View className="calendar-selector-container">
                <View className="calendar-header">
                    <View className="header-left" onClick={() => this.prevMonth()}>
                        <Image className='left-arrow' src={prevMonthStatus ? 'http://static.ledouya.com/FkhXIKoqvceD_ieVbVlUWzM4X_PR' : 'http://static.ledouya.com/Fr3ECEFgaTuTbQPkPKLl-PA2eV8m'} />
                        <Text className={['left-text', !prevMonthStatus && 'ban-text']}>上月</Text>
                    </View>
                    <View className="header-center">{year + '年' + selectMonth}月</View>
                    <View className="header-right" onClick={() => this.nextMonth()}>
                        <Text className="right-text">下月</Text>
                        <Image className="right-arrow" src="http://static.ledouya.com/Fl7CcBEZszqiWTpfN0bKSB9NeZdX" />
                    </View>
                </View>
                <View className="calendar-week">
                    {
                        weeks.map((v) => (
                            <View className="list">{v}</View>
                        ))
                    }

                </View>
                <View className="calendar-content">
                    <View className="calendar-day">
                        {dayArr.map((v, i) => (
                            <View className="list" onClick={() => this.handleClick(v)}>
                                <View className={['day', v.ban == 3 && 'sell-out']} style={{ background: v.bgColor, color: v.color }}>{v.ban == 1 || v.ban == 2 ? v.day : '售罄'}</View>
                                {v.ban == 1 && <View className="price">¥{(parseFloat(v.marketAmount) / 100).toFixed(2)}</View>}
                            </View>
                        ))
                        }
                        <View className="local-month">{selectMonth}</View>
                    </View>
                </View>
            </View>
        )
    }
}
