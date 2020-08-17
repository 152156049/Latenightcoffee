<template>
  <div class="home">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :border="false">
        <template #left>
          <div class="head-title">
            <p>营业到 21:00</p>
            <h1>{{itemText}}</h1>
          </div>
        </template>
        <template #right>
          <!-- <van-icon name="weapp-nav" :size="30" color="#515151" /> -->
          <div class="head-place">
            <span>配送至:</span>
            <span>你的心里</span>
            <van-icon class="icon" name="arrow" />
          </div>
        </template>
      </van-nav-bar>
    </div>
    <!-- 搜索框 -->
    <div class="search">
      <van-search placeholder="请输入商品名称" />
    </div>
    <!-- 轮播图 -->
    <div class="rotation">
      <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in rotation" :key="index" @click="jumpdetails(item)">
          <div class="rotation-center">
            <img class="img-auto" v-lazy="item.bannerImg" />
            <div>
              <span>{{item.name}}</span>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 今日推荐 -->
    <div class="hotsale">
      <div class="title">
        <p>Recommend</p>
        <p>今日推荐</p>
      </div>
      <div class="hotsale-center">
        <ul :style="{width:maxwight+'px'}">
          <li
            :ref="'ulli'+index"
            v-for="(item,index) in commodity"
            :key="index"
            @click="jumpdetails(item)"
          >
            <img :src="item.smallImg" alt />
            <p>{{item.name}}</p>
            <p>{{item.price}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 正在热销 -->
    <div class="poprlar">
      <div class="title">
        <p>Poprlar</p>
        <p>正在热销</p>
      </div>
      <div class="poprlar-center">
        <van-row gutter="20">
          <van-col
            span="8"
            v-for="(item,index) in classIfication"
            :key="index"
            @click="getintoMenu(item.type)"
          >
            <div class="classification">
              <van-icon :name="item.icom" :size="30" />
              <p>{{item.typeDesc}}</p>
              <p>{{item.type}}</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/main/home.less";

export default {
  name: "Home",
  data() {
    return {
      // 轮播图数据
      rotation: [],
      // 今日推荐数据
      commodity: [],
      // 正在热销数据
      classIfication: [],
      iocnarr: [
        require("../../assets/images/home-latte.png"),

        require("../../assets/images/home-coffee.png"),

        require("../../assets/images/home-rena_ice.png"),
      ],
      itemText: "",
      maxwight: 0,
    };
  },
  created() {
    this.getitemDate();
    this.getbannerData();
    this.getcommodityType();
    this.getclassIfication();
  },
  methods: {
    // 获取时间
    getitemDate() {
      let gethours = new Date().getHours();
      if (gethours >= 6 && gethours < 12) {
        this.itemText = "早上好!";
      } else if (gethours >= 12 && gethours < 15) {
        this.itemText = "中午好!";
      } else if (gethours >= 15 && gethours < 19) {
        this.itemText = "下午好!";
      } else if (gethours >= 19 && gethours < 24) {
        this.itemText = "晚上好!";
      } else if (gethours >= 24 && gethours < 6) {
        this.itemText = "打烊了,亲!";
      }
    },
    // 获取轮播图数据
    getbannerData() {
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 判断本地缓存是否有数据,如果有则不发起请求
      let sessiondata = sessionStorage.getItem("bannerData");
      if (sessiondata) {
        this.$toast.clear();
        this.rotation = JSON.parse(sessiondata);
        return;
      }

      // 获取数据
      this.axios({
        method: "GET",
        url: "/banner",
        params: { appkey: this.appkey },
      })
        .then((result) => {
          console.log("轮播图", result);
          let bannerimg = result.data.result;
          if (result.data.code == 300) {
            this.$toast.clear();
            bannerimg.map((v) => {
              this.rotation.push({
                bannerImg: v.bannerImg,
                name: v.name,
                pid: v.pid,
              });
            });
            sessionStorage.setItem("bannerData", JSON.stringify(this.rotation));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取今日推荐
    getcommodityType() {
      // 判断本地缓存是否有数据,如果有则不发起请求
      let sessiondata = JSON.parse(sessionStorage.getItem("commodityData"));
      // console.log(sessiondata);
      if (sessiondata) {
        this.commodity = sessiondata;
        this.$nextTick(() => {
          let width = this.$refs.ulli0[0].clientWidth;
          // console.log(width);
          this.maxwight = width * sessiondata.length + 180;
          // console.log(width);
        });
        return;
      }

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: { appkey: this.appkey, key: "isHot", value: 1 },
      })
        .then((result) => {
          // console.log(result);

          if (result.data.code == 500) {
            let commodity = result.data.result;

            let is = 0;
            // 提取数据
            commodity.map((v, i) => {
              is = i + 1;
              // console.log(i);
              this.commodity.push({
                name: v.name,
                price: `￥` + v.price,
                smallImg: v.smallImg,
                pid: v.pid,
              });
              sessionStorage.setItem(
                "commodityData",
                JSON.stringify(this.commodity)
              );
            });
            // 设置推荐商品的动态宽度

            this.$nextTick(() => {
              let width = this.$refs.ulli0[0].clientWidth;
              this.maxwight = width * is + 180;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取正在热销
    getclassIfication() {
      this.axios({
        method: "GET",
        url: "/type",
        params: { appkey: this.appkey },
      }).then((result) => {
        // console.log(result);
        let classIfication = result.data.result;
        if (result.data.code == 400) {
          classIfication.map((v, i) => {
            this.classIfication.push({
              type: v.type,
              typeDesc: v.typeDesc,
              icom: this.iocnarr[i],
              id: i,
            });
          });
          // console.log(this.classIfication);
        }
      });
    },
    // 选择推荐商品跳转到详情页
    jumpdetails(item) {
      this.$router.push({ name: "Details", query: { pid: item.pid } });
    },
    // 跳转到菜单页面
    getintoMenu(item) {
      this.$router.push({ name: "Menu", query: { id: item } });
    },
  },
};
</script>
