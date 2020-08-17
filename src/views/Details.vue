<template>
  <div class="details">
    <!-- 返回图标 -->
    <div class="head">
      <van-nav-bar :border="false" @click-left="returns" @click-right="collection">
        <template #left>
          <van-icon name="cross" :size="30" color="#715e58" />
        </template>
        <template #right>
          <van-icon
            :name="isicon? 'star-o' : 'star'"
            :size="30"
            :color="isicon? '#715e58' : '#f6b13e'"
          />
        </template>
      </van-nav-bar>
    </div>
    <!-- 头部详情 -->
    <div class="picture">
      <div class="picture-center">
        <img class="img-auto" :src="detaileddata.large_img" alt=" " />
        <div class="slogan">
          <div class="slogan-text1">
            <p>
              <span>{{detaileddata.name}}</span>
            </p>
            <p>
              <span>{{detaileddata.enname}}</span>
            </p>
            <p>
              <span>{{detaileddata.type_desc}}</span>
            </p>
          </div>

          <div class="slogan-text2">
            <p>{{detaileddata.desc}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择规格 -->
    <div class="selected">
      <div class="selected-center">
        <div class="title" v-for="(item,index) in selecteddata" :key="index">
          <p>
            <span>{{item.title}}</span>
          </p>
          <div>
            <van-radio-group v-model="arr[index].radio" checked-color="#2a9f93">
              <van-cell-group :border="false">
                <van-cell
                  :border="false"
                  :title="item.option[0]"
                  clickable
                  @click="switchoption(item.option[0])"
                >
                  <template #right-icon>
                    <van-radio :name="item.option[0]" />
                  </template>
                </van-cell>

                <van-cell :title="item.option[1]" clickable @click="switchoption(item.option[1])">
                  <template #right-icon>
                    <van-radio :name="item.option[1]" />
                  </template>
                </van-cell>

                <van-cell
                  :title="item.option[2]"
                  v-if="item.option[2] != undefined"
                  clickable
                  @click="switchoption(item.option[2])"
                >
                  <template #right-icon>
                    <van-radio :name="item.option[2]" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="choicenum">
        <div class="stepper">
          <van-stepper
            v-model="pricenum"
            input-width="80px"
            button-size="42px"
            @change="cumulative"
          />
        </div>
      </div>
    </div>
    <!-- 加入购物车 -->
    <div class="addtocart">
      <div class="addtocart-center" @click="clickshopping">
        <div>{{pricenum}}</div>
        <div>加入购物车</div>
        <div>{{totalprice}}</div>
      </div>
    </div>

    <!-- 购物车图标 -->
    <div class="shoppingicon" @click="jumpbag">
      <van-icon name="bag" :size="30" :badge="badges" color="#fff" />
    </div>
  </div>
</template>

<script>
import "../assets/less/details/details.less";
import { utils } from "../assets/js/utils";

export default {
  name: "Details",
  data() {
    return {
      // model数据
      arr: [],
      // 商品标签
      pid: "",
      // 商品介绍数据
      detaileddata: {},
      // 商品选择数据
      selecteddata: [],
      // 数量
      pricenum: 1,
      // 单品价格
      price: "",
      // 累计价格
      totalprice: "",
      // 收藏按钮图标控制
      isicon: true,
      // 购物车勋章数量
      badges: 0,
    };
  },
  created() {
    this.obtainPid();
    this.seecollection();
    this.shoppingcarttotal();
  },

  methods: {
    // 获取商品数据
    obtainPid() {
      // 获取pid
      this.pid = this.$route.query.pid;

      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });

      // 获取数据
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      }).then((result) => {
        // console.log(result);

        if (result.data.code == 600) {
          this.$toast.clear();
          let string = "desc,enname,name,large_img,type_desc";
          let optionstrng = "milk,cream,sugar,tem";
          let data = result.data.result;
          let obj = {};
          let arrdata = [];
          let arrselect = [];
          // 绑定价格
          this.price = result.data.result[0].price;
          this.totalprice = "￥" + result.data.result[0].price;
          // 选项的数据
          data.map((v, i) => {
            for (let key in v) {
              if (optionstrng.includes(key)) {
                arrdata.push(v[key].split("/"));
              }
            }
            arrselect.push(
              {
                title: v.cream_desc,
                option: arrdata[3],
              },
              {
                title: v.milk_desc,
                option: arrdata[1],
              },
              {
                title: v.sugar_desc,
                option: arrdata[2],
              },
              {
                title: v.tem_desc,
                option: arrdata[0],
              }
            );
            // 详情的数据
            for (let key in v) {
              if (string.includes(key)) {
                obj[key] = v[key];
              }
            }
          });
          this.detaileddata = obj;

          for (let key in arrselect) {
            if (arrselect[key].option[0] !== "") {
              this.selecteddata.push(arrselect[key]);
              this.arr.push({
                radio: arrselect[key].option[0],
              });
            }
          }
          // console.log(this.price);
        }
      });
    },
    // 返回菜单
    returns() {
      this.$router.go(-1);
    },
    // 跳转到购物车
    jumpbag() {
      this.$router.push({ name: "Shobag" });
    },
    // 选择规格
    switchoption(item) {
      // console.log(item);
    },
    // 计算价格
    cumulative() {
      // console.log(parseFloat(this.price));
      this.totalprice = "￥" + parseFloat(this.price) * this.pricenum + ".00";
    },
    // 收藏/取消收藏
    collection() {
      // 发起请求
      let token = localStorage.getItem("NO");
      if (!token) {
        this.$dialog
          .confirm({
            title: "未登录",
            message: "你需要去登录一下哦",
          })
          .then(() => {
            this.$router.push({ name: "Entrance" });
          });
        return;
      }
      this.isicon = !this.isicon;
      let data = {
        appkey: this.appkey,
        pid: this.pid,
        tokenString: token,
      };
      data = utils.queryString(data);

      if (!this.isicon) {
        // console.log("收藏");
        this.axios({
          method: "POST",
          url: "/like",
          data,
        })
          .then((result) => {
            // console.log("收藏商品的接口=>", result);
            if (result.data.code == 800) {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // console.log("取消收藏");
        this.axios({
          method: "POST",
          url: "/notlike",
          data,
        })
          .then((result) => {
            // console.log("取消收藏商品的接口=>", result);
            if (result.data.code == 900) {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 刷新动态显示收藏状态
    seecollection() {
      // 发起请求
      let token = localStorage.getItem("NO");

      let bool = true;
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: token,
        },
      })
        .then((result) => {
          if (result.data.result[0] == undefined) {
            this.isicon = true;
          } else {
            this.isicon = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击加入购物车
    clickshopping() {
      let token = localStorage.getItem("NO");
      if (!token) {
        this.$dialog
          .confirm({
            title: "未登录",
            message: "你需要去登录一下哦",
          })
          .then(() => {
            this.$router.push({ name: "Entrance" });
          });
        return;
      }

      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 遍历规格
      let arrspr = [];
      this.arr.map((v, i) => {
        arrspr.push(v.radio);
      });
      arrspr = arrspr.join("/");

      // 初始化数据给后台
      let data = {
        pid: this.pid,
        count: this.pricenum,
        rule: arrspr,
        appkey: this.appkey,
        tokenString: token,
      };
      data = utils.queryString(data);

      // 发起请求(加入购物车)
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          // console.log("购物车数据", result);
          if (result.data.code == 3000) {
            this.$toast.clear();
            this.$toast(result.data.msg);
            this.shoppingcarttotal();
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 获取购物车数据
    },
    // 查询购物车总数
    shoppingcarttotal() {
      let token = localStorage.getItem("NO");

      // 发起请求
      this.axios({
        method: "GET",
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // console.log(result);
          if (result.data.code == 4000) {
            this.badges = result.data.result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

