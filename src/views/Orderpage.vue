<template>
  <div class="orderpage">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :fixed="true" :border="false" @click-left="fhiu">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#5e5e5e" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 标题 -->
    <div class="title">
      <h1>订单确认</h1>
    </div>
    <div class="ordercontent">
      <!-- 地址填写 -->
      <div class="address">
        <div class="tips">
          <p>为确保您的用餐体验, 请确认您的信息。</p>
        </div>
        <div class="address-content" @click="getaddress">
          <div class="content">
            <div class="content-left">
              <p>
                <span>
                  <van-icon name="location" size="14" color="#7fc6bf" />
                </span>
                <span v-if="displayaddress.address == ''">你没有找到默认地址,请重新选择地址。</span>

                <span>{{displayaddress.address}}</span>
                <span v-if="displayaddress.isDefault">默认</span>
              </p>
              <p>
                <span>{{displayaddress.name}}</span>
                <span>{{displayaddress.tel}}</span>
              </p>
            </div>
            <div class="content-right">
              <div>
                <van-icon name="arrow" size="25" color="#d8cdcd" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="commodity">
        <div class="tips">
          <p>您选择的商品。</p>
        </div>
        <div class="commodity-center" v-for="(item,index) in commoditydata" :key="index">
          <van-swipe-cell>
            <template #default>
              <div class="detailed">
                <p>
                  <span>{{item.name}}</span>
                  <span>￥{{item.price}}</span>
                </p>
                <p>
                  <span>{{item.rule}}</span>
                  <span>*{{item.count}}</span>
                </p>
              </div>
            </template>
          </van-swipe-cell>
        </div>
      </div>
      <!-- 总价格 -->
      <div class="totalprice">
        <p>
          <span>总计</span>
          <strong>
            <span>￥</span>
            <span>{{totalprice}}.00</span>
          </strong>
        </p>
      </div>
    </div>
    <!-- 加入购物车 -->
    <div class="addtocart">
      <div class="addtocart-center" @click="payment">
        <div>{{totalquantity}} 杯</div>
        <div>立即支付</div>
        <div>￥{{totalprice}}.00</div>
      </div>
    </div>
    <!-- 地址选择弹出层 -->
    <div class="popup">
      <van-popup round v-model="isshow" closeable position="bottom">
        <div class="address">
          <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="Jumptoadd"
            @select="selectaddress"
            @edit="jumpedit"
          />
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/orderpage/orderpage.less";
import { utils } from "../assets/js/utils";

export default {
  name: "Orderpage",
  data() {
    return {
      // 商品标识
      sid: [],
      // 商品数据
      commoditydata: [],
      // 弹出层开关
      isshow: false,
      // 选中的地址标识
      chosenAddressId: 0,
      // 地址列表数据
      list: [],
      // 显示的地址
      displayaddress: {
        name: "",
        tel: "",
        address: "",
        isDefault: false,
      },
      // 总价格
      totalprice: 0,
      // 总数量
      totalquantity: 0,
    };
  },
  created() {
    this.getdefaultaddress();
    this.getmerchandise();
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.push({ name: "Shobag" });
    },
    // 获取商品数据
    getmerchandise() {
      this.sid = this.$route.query.sid;
      let sid = "";
      if (typeof this.sid == "string") {
        sid = JSON.stringify([this.sid]);
      } else {
        sid = JSON.stringify(this.sid);
      }
      // Replace
      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString: token,
          sids: sid,
        },
      }).then((result) => {
        // Replace
        let data = result.data.result;
        if (result.data.code == 50000) {
          this.$toast.clear();
          data.map((v) => {
            this.commoditydata.push(v);
            this.totalprice += v.count * parseFloat(v.price);
            this.totalquantity += v.count;
          });
        }
      });
    },

    // 获取显示默认地址
    getdefaultaddress() {
      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 发起请求
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // Replace
          let data = result.data.result;
          if (result.data.code == 20000) {
            data.map((v) => {
              if (v.isDefault) {
                this.displayaddress.name = v.name;
                this.displayaddress.tel = v.tel;
                this.displayaddress.address =
                  v.province + v.city + v.county + v.addressDetail;
                this.displayaddress.isDefault = Boolean(v.isDefault);

                if (v.isDefault) {
                  this.chosenAddressId = v.id;
                }
              }
            });
          }
        })
        .catch((err) => {});
    },

    // 点击获取地址数据
    getaddress() {
      // 弹出地址
      this.isshow = true;

      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 发起请求
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // Replace
          let data = result.data.result;
          if (result.data.code == 20000) {
            this.list = [];
            this.$toast.clear();
            data.map((v) => {
              this.list.push({
                id: v.id,
                aid: v.aid,
                name: v.name,
                tel: v.tel,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault),
                province: v.province,
                city: v.city,
                county: v.county,
                addressDetail: v.addressDetail,
                areaCode: v.areaCode,
                postalCode: v.postalCode,
              });
            });
          }
        })
        .catch((err) => {});
    },

    // 切换地址
    selectaddress(item) {
      // 关闭弹出层
      this.isshow = false;
      // 设置选中的数据
      this.displayaddress.name = item.name;
      this.displayaddress.tel = item.tel;
      this.displayaddress.address = item.address;
      this.displayaddress.isDefault = Boolean(item.isDefault);
      this.chosenAddressId = item.id;
    },

    // 跳转到新增地址
    Jumptoadd() {
      this.$router.push({ name: "Newaddress" });
    },

    // 跳转到编辑页面
    jumpedit(item) {
      this.$router.push({ name: "Editaddress", query: { editdata: item } });
    },

    // 立即支付
    payment() {
      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 数据序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        sids: JSON.stringify(this.sid),
        phone: this.displayaddress.tel,
        address: this.displayaddress.address,
        receiver: this.displayaddress.name,
      };
      data = utils.queryString(data);

      // 发起请求
      this.axios({
        method: "POST",
        url: "/pay",
        data,
      }).then((result) => {
        if (result.data.code == 60000) {
          this.$toast.success("结算成功");
          setTimeout(() => {
            this.$router.push({ name: "Shobag" });
          }, 1000);
        }
      });
    },
  },
};
</script>

