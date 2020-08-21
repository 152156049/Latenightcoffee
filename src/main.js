import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from "vue-router";
// rem配置
import "lib-flexible/flexible";

// ajax请求配置
import axios from "axios";
import VueAxios from "vue-axios";

// vant导入
import {
    Button,
    Tag,
    Tab,
    NavBar,
    Icon,
    Form,
    Field,
    Popup,
    Tabbar,
    TabbarItem,
    Notify,
    Toast,
    Loading,
    Search,
    Swipe,
    SwipeItem,
    Lazyload,
    Tabs,
    Col,
    Row,
    RadioGroup,
    Radio,
    Cell,
    CellGroup,
    Stepper,
    SwipeCell,
    Card,
    Checkbox,
    CheckboxGroup,
    Empty,
    AddressList,
    AddressEdit,
    NoticeBar,
    Uploader,
    ShareSheet,
    Dialog,
} from "vant";

// 全局注册
Vue.use(Button)
    .use(Empty)
    .use(Dialog)
    .use(Tag)
    .use(Tab)
    .use(ShareSheet)
    .use(Uploader)
    .use(NoticeBar)
    .use(AddressList)
    .use(AddressEdit)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(NavBar)
    .use(SwipeCell)
    .use(Card)
    .use(Field)
    .use(Form)
    .use(Popup)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Notify)
    .use(Toast)
    .use(Loading)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(Tabs)
    .use(Col)
    .use(Row)
    .use(RadioGroup)
    .use(Radio)
    .use(Cell)
    .use(CellGroup)
    .use(Stepper)
    .use(Icon);

// 注册axios,ajax方案
Vue.use(VueAxios, axios);

// 修复重复点击报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

// 设置请求基础路径
axios.defaults.baseURL = "http://www.kangliuyong.com:10002";

// 请求头
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=utf-8";

// 添加VUE原型属性
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";

//全局注册过滤器, 用于格式化数字
Vue.filter("formatDate", (value, format) => {
    //value: 需要格式化的数据
    //format: 指定格式 yyyy-MM-dd hh:mm:ss
    let date = new Date(value);
    //获取年份
    let year = date.getFullYear();
    if (/(y+)/.test(format)) {
        //获取匹配组的内容
        let content = RegExp.$1;
        format = format.replace(content, year.toString().slice(4 - content.length));
    }
    let o = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
    };
    for (let key in o) {
        //构造动态正则
        let reg = new RegExp(`(${key}+)`);
        if (reg.test(format)) {
            //获取匹配组的内容
            let content = RegExp.$1;
            let k =
                o[key] >= 10 ? o[key] : content.length == 2 ? "0" + o[key] : o[key];
            format = format.replace(content, k);
        }
    }

    return format;
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");