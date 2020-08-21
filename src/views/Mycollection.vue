<template>
  <div class="mycollection">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" title="我的收藏" :border="false">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 空状态 -->
    <div class="emptystate" v-if="collectiondata.length<=0">
      <van-empty
        description="空空如也喔"
        :image="require('../assets/images/emptystate.png')"
        v-if="istloggedin"
      >
        <van-button round type="danger" class="bottom-button" @click="Jumphome">去逛逛菜单</van-button>
      </van-empty>
      <van-empty description="还没有登录呢" :image="require('../assets/images/notloggedin.png')" v-else>
        <van-button round type="danger" class="bottom-button" @click="gotologin">去登录</van-button>
      </van-empty>
    </div>
    <!-- 收藏内容 -->
    <div class="collection" v-else>
      <div class="collection-content" v-for="(item,index) in collectiondata" :key="index">
        <div class="content-left" @click.capture="switchProducts(item)">
          <img :src="item.smallImg" alt />
        </div>
        <div class="content-right" @click.capture="switchProducts(item)">
          <div>
            <span>{{item.name}}</span>
          </div>
          <div>
            <span>{{item.enname}}</span>
          </div>
          <div>
            <span>￥</span>
            <span>{{item.price}}</span>
          </div>
          <div>
            <span>{{item.desc}}</span>
          </div>
        </div>
        <div class="iconbox">
          <van-icon
            :name="!item.isicon ?'star-o' :'star'"
            :color="!item.isicon? '#715e58' : '#f6b13e'"
            @click="collection(item,index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/mycollection/mycollection.less";
import { utils } from "../assets/js/utils";
export default {
  name: "Mycollection",
  data() {
    return {
      // 收藏的数据
      collectiondata: [],
      istloggedin: true,
    };
  },
  created() {
    this.allcollection();
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 跳转到详情页
    switchProducts(item) {
      this.$router.push({ name: "Details", query: { pid: item.pid } });
    },
    // 取消收藏
    collection(item, index) {
      item.isicon = !item.isicon;
      // console.log("isicom=>", item.isicon);
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      let token = localStorage.getItem("NO");
      let data = {
        appkey: this.appkey,
        pid: item.pid,
        tokenString: token,
      };
      data = utils.queryString(data);
      this.axios({
        method: "POST",
        url: "/notlike",
        data,
      }).then((result) => {
        // console.log(result);
        if (result.data.code == "900") {
          this.$toast.clear();

          this.$toast(result.data.msg);
          this.collectiondata.splice(index, 1);
        }
      });
    },
    // 获取所有收藏
    allcollection() {
      // 发起请求
      let token = localStorage.getItem("NO");
      if (!token) {
        this.istloggedin = false;
      }
      // 加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      let bool = true;
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // console.log(result);
          let data = result.data.result;
          if (result.data.code == "2000") {
            this.$toast.clear();
            data.map((v) => {
              v.isicon = true;
              this.collectiondata.push(v);
            });
            // console.log(this.collectiondata);
          }
        })
        .catch((err) => {
          console.log(result);
        });
    },
    // 去登录页面
    gotologin() {
      this.$router.push({ name: "Entrance" });
    },
    // 跳转到首页逛逛
    Jumphome() {
      this.$router.push({ name: "Menu" });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>