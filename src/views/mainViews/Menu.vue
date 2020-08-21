<template>
  <div class="menu">
    <div class="head">
      <van-nav-bar :border="false" :fixed="true" :z-index="2">
        <template #left>
          <van-icon name="arrow-left" :size="30" color="#606060" @click="fhiu" />
        </template>
      </van-nav-bar>
    </div>
    <div class="option">
      <div class="option-nav">
        <van-nav-bar>
          <template #left>
            <h1>{{commoditytype}}</h1>
          </template>
          <template #right>
            <van-icon :name="optionic" :size="30" color="#606060" @click="showPopup" />
          </template>
        </van-nav-bar>
      </div>
      <van-popup v-model="ishow" position="top" :style="{ height: '40%' }" :round="true">
        <div
          class="option-center setclear"
          :class="{active:item.bool}"
          v-for="(item,index) in categorycolumn"
          :key="index"
          @click="getcommodity(item)"
        >
          <div class="left">
            <van-icon :name="item.icon" :size="25" />
            <span>{{item.typeDesc}}</span>
          </div>
          <div class="right">
            <van-icon name="arrow" :size="20" />
          </div>
        </div>
      </van-popup>
    </div>
    <div class="commodity">
      <div
        class="commodity-center"
        v-for="(item,index) in commodity"
        :key="index"
        @click="switchProducts(item)"
      >
        <van-row>
          <van-col span="18">
            <h2>{{item.name}}</h2>
            <p>{{item.desc}}</p>
            <p>
              <span>￥</span>
              <span>{{item.price}}</span>
            </p>
          </van-col>
          <van-col span="6">
            <img :src="item.smallImg" alt />
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/main/menu.less";
export default {
  name: "Menu",
  data() {
    return {
      ishow: false,
      url: this.$route.query.id,
      optionic: require("../../assets/images/menu-option.png"),
      iocnarr: [
        require("../../assets/images/home-latte.png"),

        require("../../assets/images/home-coffee.png"),

        require("../../assets/images/home-rena_ice.png"),
      ],
      // 分类栏的数据
      categorycolumn: [],
      // 商品数据
      commodity: [],
      commoditytype: "",
    };
  },
  created() {
    this.getclassification();
    this.getcommodity();
  },

  methods: {
    // 返回上一层
    fhiu() {
      this.$router.push({ name: "Home" });
    },
    // 弹出层
    showPopup() {
      this.ishow = true;
    },
    // 获取分类数据
    getclassification() {
      this.axios({
        method: "GET",
        url: "/type",
        params: { appkey: this.appkey },
      }).then((result) => {
        // Replace
        let categorycolumn = result.data.result;
        if (result.data.code == 400) {
          categorycolumn.map((v, i) => {
            this.categorycolumn.push({
              type: v.type,
              typeDesc: v.typeDesc,
              icon: this.iocnarr[i],
              bool: false,
            });
          });
          this.categorycolumn[0].bool = true;
        }
      });
    },
    // 获取默认显示商品数据
    getcommodity(item) {
      this.commodity = [];

      if (item) {
        //   // 高亮切换
        this.categorycolumn.map((v) => {
          v.bool = false;
        });
        item.bool = !item.bool;
      }
      let types = "";
      types = item ? item.type : "latte";

      //   // 关闭弹出层
      this.ishow = false;

      // 判断本地缓存是否有数据,如果有则不发起请求
      let commoditydata = sessionStorage.getItem(types);
      if (commoditydata) {
        this.commodity = [];

        this.$toast.clear();
        this.commodity = JSON.parse(commoditydata);
        this.commoditytype = this.commodity[0].typeDesc;
        return;
      }

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: types,
        },
      }).then((result) => {
        // Replace

        let commodity = result.data.result;
        if (result.data.code == 500) {
          commodity.map((v, i) => {
            this.commodity.push({
              type: v.type,
              typeDesc: v.typeDesc,
              name: v.name,
              price: v.price,
              smallImg: v.smallImg,
              desc: v.desc,
              pid: v.pid,
            });
          });
          this.commoditytype = this.commodity[0].typeDesc;
          sessionStorage.setItem(types, JSON.stringify(this.commodity));
        }
      });
    },
    // 跳转到详情页
    switchProducts(item) {
      this.$router.push({ name: "Details", query: { pid: item.pid } });
    },
  },
};
</script>

