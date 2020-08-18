<template>
  <div class="shobag">
    <!-- 空状态 -->
    <div class="emptystate" v-if="shoppingdata.length<=0">
      <van-empty
        description="比我脸还干净"
        :image="require('../../assets/images/emptystate.png')"
        v-if="istloggedin"
      >
        <van-button round type="danger" class="bottom-button" @click="Jumphome">去首页逛逛</van-button>
      </van-empty>
      <van-empty
        description="还没有登录呢"
        :image="require('../../assets/images/notloggedin.png')"
        v-else
      >
        <van-button round type="danger" class="bottom-button" @click="gotologin">去登录</van-button>
      </van-empty>
    </div>

    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :fixed="true" :border="false" @click-left="fhiu">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#5e5e5e" />
        </template>
        <template #right v-if="shoppingdata.length>0">
          <div @click="administration">{{isswitch?'编辑':'完成'}}</div>
        </template>
      </van-nav-bar>
    </div>
    <!-- 标题 -->
    <div class="title" v-if="shoppingdata.length>0">
      <h1>购物袋</h1>
    </div>
    <!-- 商品/全选/提交 -->
    <div class="shobag-center">
      <!-- 商品 -->
      <div class="commodity" v-for="(item,index) in shoppingdata" :key="index">
        <div class="commodity-center">
          <van-swipe-cell :disabled="isswitch">
            <template #default>
              <div class="choice">
                <van-checkbox v-model="item.isactive" checked-color="#b4b6bc" @change="checkboxfun"></van-checkbox>
              </div>
              <div class="detailed">
                <p>
                  <span>{{item.name}}</span>
                  <span>￥{{item.price}}</span>
                </p>
                <p>
                  <span>{{item.rule}}</span>
                  <span>
                    <van-stepper
                      v-model="item.count"
                      theme="round"
                      button-size="22"
                      disable-input
                      @change="commodity(item)"
                    />
                  </span>
                </p>
              </div>
            </template>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="deletesingle(item,index)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>
      <!-- 总价格/全选操作 -->
      <div class="tail-box" v-if="shoppingdata.length>0">
        <div class="totalprice">
          <div class="totalprice-center">
            <h1>
              <span>￥</span>
              <span>{{totalprice}}.00</span>
            </h1>
            <p>
              <span>另需服务费: ￥</span>
              <span>0.00</span>
            </p>
          </div>
        </div>
        <div class="addtocart">
          <div class="addtocart-center" v-show="isswitch" @click="Jumporderpage">
            <div>{{numbers}} 杯</div>
            <div>确认订单</div>
            <div>￥{{totalprice}}.00</div>
          </div>
          <div class="addtocart-selectall" v-show="!isswitch">
            <div class="selectall">
              <div>
                <van-checkbox v-model="checked" checked-color="#b4b6bc" @click="selectall">全选</van-checkbox>
              </div>
            </div>
            <div class="delete" @click="deletemultiple">
              <p>
                <span>删除所选</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/main/shobag.less";
import { utils } from "../../assets/js/utils";
export default {
  name: "Shobag",
  data() {
    return {
      // 全选
      checked: false,
      // 管理
      isswitch: true,
      // 商品数量
      value: 1,
      // 购物车商品数据
      shoppingdata: [],
      // 商品总价格
      totalprice: 0,
      // 所选总数量
      numbers: 0,
      // 判断是否登录
      istloggedin: true,
    };
  },
  created() {
    this.shoppingcartdata();
  },

  methods: {
    // 返回上一层
    fhiu() {
      this.$router.push({ name: "Menu" });
    },
    // 跳转到首页逛逛
    Jumphome() {
      this.$router.push({ name: "Home" });
    },
    // 跳转到订单信息页面
    Jumporderpage() {
      let selectdata = [];
      this.shoppingdata.map((v) => {
        if (v.isactive) {
          selectdata.push(v.sid);
          this.$router.push({ name: "Orderpage", query: { sid: selectdata } });
        } else {
          this.$toast("你还没选择商品呢");
        }
      });
    },

    // 获取购物车数据
    shoppingcartdata() {
      // 获取用户的token
      let token = localStorage.getItem("NO");
      if (!token) {
        this.$toast.clear();
        this.istloggedin = false;
        return;
      }
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 发起请求
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // Replace
          let data = result.data.result;
          if (result.data.code == 5000) {
            this.$toast.clear();
            // Replace
            data.map((v, i) => {
              this.shoppingdata.push({
                isactive: false,
                count: v.count,
                name: v.name,
                price: v.price,
                rule: v.rule,
                sid: v.sid,
              });
            });
          }
        })
        .catch((err) => {});
    },
    // 管理按钮切换
    administration() {
      this.isswitch = !this.isswitch;
    },
    // 单选控制全选
    checkboxfun() {
      this.sum();
      this.totalquantity();
      let isactiveall = this.shoppingdata;
      for (let i = 0; i < isactiveall.length; i++) {
        if (isactiveall[i].isactive == false) {
          this.checked = false;
          return;
        }
        this.checked = true;
      }
    },
    // 全选
    selectall() {
      this.sum();
      this.totalquantity();
      let isactiveall = this.shoppingdata;
      isactiveall.map((v) => {
        v.isactive = this.checked;
      });
    },
    // 修改商品商品个数
    commodity(item) {
      // 获取用户的token
      let token = localStorage.getItem("NO");

      // 数据序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        sid: item.sid,
        count: item.count,
      };
      data = utils.queryString(data);

      // 发起请求
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data,
      }).then((result) => {
        if (result.data.code == 6000) {
          this.sum();
          this.totalquantity();
        }
      });
    },
    // 删除单个商品
    deletesingle(item, index) {
      // 获取用户的token
      let token = localStorage.getItem("NO");

      // 数据序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        sids: JSON.stringify([item.sid]),
      };
      data = utils.queryString(data);

      // 发起请求
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data,
      }).then((result) => {
        if (result.data.code == 7000) {
          this.shoppingdata.splice(index, 1);
          this.sum();
          this.totalquantity();
        }
      });
    },
    // 删除多个商品
    deletemultiple() {
      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 保存被勾选的数据
      let sidarr = [];

      // 获取被勾选的数据
      this.shoppingdata.map((v, i) => {
        if (v.isactive == true) {
          sidarr.push(v.sid);
        }
      });
      // Replace
      // 数据序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        sids: JSON.stringify(sidarr),
      };
      data = utils.queryString(data);

      // 发起请求
      if (sidarr.length > 0) {
        this.axios({
          method: "POST",
          url: "/deleteShopcart",
          data,
        })
          .then((result) => {
            if (result.data.code == 7000) {
              // Replace
              for (let i = this.shoppingdata.length - 1; i >= 0; i--) {
                if (this.shoppingdata[i].isactive == true) {
                  this.shoppingdata.splice(i, 1);
                  this.sum();
                  this.totalquantity();
                }
              }
            }
          })
          .catch((err) => {});
      } else {
        this.$toast("还没有勾选!");
      }
    },
    // 总价格
    sum() {
      this.totalprice = 0;
      this.shoppingdata.map((v) => {
        if (v.isactive) {
          this.totalprice += v.count * v.price;
        }
      });
    },
    // 总数量
    totalquantity() {
      this.numbers = 0;
      this.shoppingdata.map((v) => {
        if (v.isactive) {
          this.numbers += v.count;
        }
      });
    },
    // 去登录页面
    gotologin() {
      this.$router.push({ name: "Entrance" });
    },
  },
};
</script>
