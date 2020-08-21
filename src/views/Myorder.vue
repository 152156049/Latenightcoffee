<template>
  <div class="myorder">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" title="我的订单" :border="false">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tag切换栏 -->
    <div class="tab-center">
      <van-tabs v-model="activeName" @change="switchlabel">
        <van-tab :title="item.title" v-for="(item,index) in tabItems" :key="index">
          <van-empty
            :image="require('../assets/images/emptystate.png')"
            description="无该订单记录"
            v-if="orderdata.length<1"
          />

          <div class="ordercenter" v-for="(v,i) in orderdata" :key="i" v-else>
            <div class="order_box">
              <div class="ordernumber">
                <div class="numbers">订单号:{{v.orderId}}</div>
                <div class="state" v-if="v.status == 1">待取餐</div>
                <div class="statewc" v-else-if="v.status == 2">已完成</div>
              </div>
              <div class="address">
                <h3>{{v.address}}</h3>
              </div>
              <div class="commodity">
                <div class="commodity-center" v-for="(value,is) in v.products" :key="is">
                  <div class="center-left">
                    <img :src="value.smallImg" alt />
                  </div>
                  <div class="center-right">
                    <p>
                      <span>{{value.name}}</span>
                      <span>￥{{value.price}}</span>
                    </p>
                    <p>
                      <span>{{value.rule}}</span>
                      <span>*{{value.count}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="statistics">
                <div class="statistic-number">
                  <span>{{v.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                </div>

                <div class="operation">
                  <span @click="confirmorder(v,i) " v-if="v.status == 1">确认收货</span>
                  <span class="czuowc" @click="deleteorder(v,i)" v-else-if="v.status == 2">删除</span>
                </div>
              </div>
            </div>
            <div class="order_price">
              <div>
                <span>共计{{v.count}}件商品</span>
              </div>
              <div>
                <span>￥</span>
                <span>{{v.total}}.00</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/myorder/myorder.less";
import { utils } from "../assets/js/utils";
export default {
  name: "Myorder",
  data() {
    return {
      n: "2020-08-13T02:18:50.000Z",
      activeName: 0,
      // 订单数据
      orderdata: [],
      // 订单状态码
      status: 0,
      // 切换栏标签
      tabItems: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
    };
  },
  created() {
    this.switchlabel(0);
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 获取订单数据
    switchlabel(status) {
      this.status = status;

      // Replace
      let token = localStorage.getItem("NO");
      if (!token) {
        return;
      }
      // 发起请求
      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: token,
          status,
        },
      })
        .then((result) => {
          // Replace
          let data = result.data.result;
          let orderdataarr = {};
          if (result.data.code == "70000") {
            this.orderdata = [];
            this.$toast.clear();

            result.data.result.map((v) => {
              if (!orderdataarr[v.oid]) {
                //如果不存在该订单数据，则初始化一个对象
                orderdataarr[v.oid] = {
                  orderId: v.oid,
                  address: v.address,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price,
                  products: [v],
                  status: v.status,
                };
              } else {
                orderdataarr[v.oid].count += v.count;
                orderdataarr[v.oid].total += v.count * v.price;
                orderdataarr[v.oid].products.push(v);
              }
            });
            for (let key in orderdataarr) {
              this.orderdata.push(orderdataarr[key]);
            }

            this.orderdata.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            // Replace
          }
        })
        .catch((err) => {});
      // 发起请求
    },
    // 确认订单
    confirmorder(item, index) {
      // Replace
      let token = localStorage.getItem("NO");

      let oid = item.orderId;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 参数序列化

      let data = {
        appkey: this.appkey,
        tokenString: token,
        oid,
      };
      data = utils.queryString(data);
      // console.log(data);
      // 发起请求
      this.axios({
        method: "POST",
        url: "/receive",
        data,
      }).then((result) => {
        console.log(result);
        if (result.data.code == "80000") {
          this.$toast.clear();
          if (this.status != 0) {
            this.orderdata.splice(index, 1);
          } else {
            this.switchlabel(0);
          }
        }
      });
    },
    // 删除订单
    deleteorder(item, index) {
      let token = localStorage.getItem("NO");
      let oid = item.orderId;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 参数序列化

      let data = {
        appkey: this.appkey,
        tokenString: token,
        oid,
      };
      data = utils.queryString(data);
      // console.log(data);
      // 发起请求
      this.axios({
        method: "POST",
        url: "/removeOrder",
        data,
      }).then((result) => {
        console.log(result);
        if (result.data.code == "90000") {
          this.$toast.clear();
          this.orderdata.splice(index, 1);
        }
      });
    },
  },
};
</script>

