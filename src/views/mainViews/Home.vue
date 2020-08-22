<template>
  <div class="home">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :border="false">
        <template #left>
          <div class="head-title">
            <p>最晚营业到 15:00</p>
            <h1>{{itemText}}{{nickName}}</h1>
          </div>
        </template>
        <template #right>
          <!-- <van-icon name="weapp-nav" :size="30" color="#515151" /> -->
          <div class="head-place" @click="jumpmyaddress" v-if="isdlu">
            <span>配送至:</span>
            <span v-if="address">{{address}}</span>

            <span v-else>去编辑</span>
            <!-- <span>
              <van-icon class="icon" name="arrow" />
            </span>-->
          </div>
          <div class="head-place" v-else @click="gotologin">
            <span>未登录</span>
          </div>
        </template>
      </van-nav-bar>
    </div>
    <!-- 搜索框 -->
    <div class="search">
      <van-search placeholder="请输入商品名称" @focus="searchPopup" />
    </div>
    <!-- 搜索弹出层 -->
    <div class="searchlayer">
      <van-popup v-model="issearch" position="top" :style="{ height: '60%' }">
        <!-- 输入框 -->
        <div class="searchbar">
          <van-search
            v-model="searchcontent"
            placeholder="请输入商品名称"
            size="20"
            show-action
            :autofocus="true"
            @blur="searchnull"
          >
            <template #action>
              <div @click="searchrequest">搜索</div>
            </template>
          </van-search>

          <!-- 搜索结果展示 -->
          <div class="searchresult">
            <ul>
              <li v-for="(item,index) in searchdata" :key="index" @click="jumpdetails(item)">
                <span>{{item.name}}</span>
                <van-icon name="arrow" size="20" />
              </li>
            </ul>
          </div>
        </div>
      </van-popup>
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
import bannerdata from "../../assets/js/bannerdata";
export default {
  name: "Home",
  data() {
    return {
      // 轮播图数据
      rotation: bannerdata,
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

      // 用户名称
      nickName: "",
      // 用户地址
      address: "",
      issearch: false,
      isdlu: true,

      // 输入的内容
      searchcontent: "",
      // 搜索的数据
      searchdata: [],
    };
  },
  created() {
    this.getitemDate();
    // this.getbannerData();
    this.getcommodityType();
    this.getclassIfication();
  },
  methods: {
    // 获取时间,名称,地址
    getitemDate() {
      let gethours = new Date().getHours();
      if (gethours >= 6 && gethours < 12) {
        this.itemText = "早上好";
      } else if (gethours >= 12 && gethours < 15) {
        this.itemText = "中午好";
      } else if (gethours >= 15 && gethours < 19) {
        this.itemText = "下午好";
      } else if (gethours >= 19 && gethours < 24) {
        this.itemText = "晚上好";
      } else if (gethours >= 24 && gethours < 6) {
        this.itemText = "晚安";
      }
      let token = localStorage.getItem("NO");
      if (!token) {
        // 用户名称
        this.nickName = "";
        // 用户地址
        this.address = "";
        this.isdlu = false;
        return;
      }
      // 发起请求
      // 获取名称
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      }).then((result) => {
        //
        if (result.data.code == "A001") {
          this.nickName = "," + result.data.result[0].nickName;
        }
      });
      // 地址请求
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      }).then((result) => {
        //
        let data = result.data.result;
        if (result.data.code == "20000") {
          data.map((v) => {
            if (v.isDefault == 1) {
              this.address = v.addressDetail;
            }
          });
        }
      });
    },
    // 获取轮播图数据
    getbannerData() {
      // 判断本地缓存是否有数据,如果有则不发起请求
      let sessiondata = sessionStorage.getItem("bannerData");
      if (sessiondata) {
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
          let bannerimg = result.data.result;
          if (result.data.code == 300) {
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
        .catch((err) => {});
    },
    // 获取今日推荐
    getcommodityType() {
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 判断本地缓存是否有数据,如果有则不发起请求
      let sessiondata = JSON.parse(sessionStorage.getItem("commodityData"));
      // Replace
      if (sessiondata) {
        this.$toast.clear();

        this.commodity = sessiondata;
        this.$nextTick(() => {
          let width = this.$refs.ulli0[0].clientWidth;
          // Replace
          this.maxwight = width * sessiondata.length + 180;
          // Replace
        });
        return;
      }

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: { appkey: this.appkey, key: "isHot", value: 1 },
      })
        .then((result) => {
          // Replace

          if (result.data.code == 500) {
            this.$toast.clear();

            let commodity = result.data.result;

            let is = 0;
            // 提取数据
            commodity.map((v, i) => {
              is = i + 1;
              // Replace
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
        .catch((err) => {});
    },
    // 获取正在热销
    getclassIfication() {
      this.axios({
        method: "GET",
        url: "/type",
        params: { appkey: this.appkey },
      }).then((result) => {
        // Replace
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
          // Replace
        }
      });
    },
    // 搜索请求
    searchrequest() {
      let name = this.searchcontent;

      // 判断输入框是否为空
      if (this.searchcontent) {
        // 发起请求
        this.axios({
          method: "GET",
          url: "/search",
          params: {
            appkey: this.appkey,
            name,
          },
        }).then((result) => {
          let data = result.data.result;
          if (result.data.code == "Q001") {
            this.searchdata = [];

            data.map((v) => {
              this.searchdata.push(v);
            });
          }
        });
      } else {
        this.searchdata = [];
      }
    },
    // 判断输入框是否为空
    searchnull() {
      if (!this.searchcontent) {
        this.searchdata = [];
      }
    },
    // 搜索弹出层
    searchPopup() {
      this.issearch = true;
    },
    // 选择推荐商品跳转到详情页
    jumpdetails(item) {
      this.$router.push({ name: "Details", query: { pid: item.pid } });
    },
    // 选择推荐商品跳转到菜单页
    jumpmyaddress(item) {
      this.$router.push({ name: "Myaddress" });
    },
    // 跳转到菜单页面
    getintoMenu(item) {
      this.$router.push({ name: "Menu", query: { id: item } });
    },
    // 去登录页面
    gotologin() {
      this.$router.push({ name: "Entrance" });
    },
  },
};
</script>
