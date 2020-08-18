<template>
  <div class="my">
    <!-- 顶部弹出层 -->
    <div class="setpopuplayer">
      <van-popup v-model="isshow" position="top">
        <div @click="jumpinformation">
          <van-cell title="个人信息" is-link arrow-direction size="large" />
        </div>
        <div class="backimg">
          <van-cell title="设置背景" is-link arrow-direction size="large">
            <template>
              <van-uploader
                :accept="picturetype"
                :max-size="1024*1024"
                @oversize="onOversize"
                :after-read="backgroundimage"
                :before-read="beforeRead"
              />
            </template>
          </van-cell>
        </div>
        <div @click="nobackground">
          <van-cell title="无背景" is-link arrow-direction size="large" />
        </div>
        <div @click="logout">
          <van-cell title="退出登录" is-link arrow-direction size="large" />
        </div>
      </van-popup>
    </div>
    <!-- 底部弹出层 -->
    <div class="sharetemplate">
      <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    </div>
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" :fixed="true" :border="false" @click-right="showPopup">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
        <template #right>
          <van-icon name="setting-o" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 头像 -->
    <div
      class="information"
      :style="defaults == true ?
      {background:'none'}:
       {backgroundImage:`url(${userBg})`}"
    >
      <div class="information-center" v-if="istloggedin">
        <div class="info-name">
          <h1>{{nickName}}</h1>
          <p>个人简介</p>
          <p>
            <van-notice-bar color="#000" left-icon="volume-o" :text="desc" />
          </p>
        </div>
        <div class="info-headportrait" :style="{backgroundImage:`url(${userImg})`}"></div>
      </div>
      <div class="information-center" v-else @click="gotologin">
        <div class="info-name">
          <h1>未登录</h1>
        </div>
        <div class="info-headportrait" :style="{backgroundImage:`url(${userImg})`}"></div>
      </div>
    </div>
    <!-- 咖啡值 -->
    <div class="activity">
      <div class="activity-center">
        <div class="activity-left">
          <p>咖啡值</p>
          <div>
            <span>
              <van-icon :name="require('../../assets/images/waterdrop.png')" />
            </span>
            <span>90</span>
            <span>%</span>
          </div>
          <p>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </p>
          <p>已经兑换0次咖啡劵</p>
        </div>
        <div class="activity-right">
          <img :src="require('../../assets/images/activityico.png')" alt />
        </div>
      </div>
    </div>
    <!-- 选项栏 -->
    <div class="optionsbar">
      <div class="optionsbar-center">
        <div @click="gotomyorder">
          <van-cell title="我的订单" is-link arrow-direction size="large" icon="bag-o" />
        </div>
        <div>
          <van-cell title="收货地址" is-link arrow-direction size="large" icon="location-o" />
        </div>
        <div>
          <van-cell title="我的收藏" is-link arrow-direction size="large" icon="star-o" />
        </div>
        <div @click="onSelect">
          <van-cell title="分享我们" is-link arrow-direction size="large" icon="smile-comment-o" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/main/my.less";
import { utils } from "../../assets/js/utils";

export default {
  name: "My",
  data() {
    return {
      // 弹出层开关
      isshow: false,
      showShare: false,
      //  弹出层数据
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
      // 允许上传的图片类型
      picturetype: "image/jpeg,/image/gif,image/png",
      // 背景图片
      userBg: "",
      // 判断否默认背景
      defaults: false,
      // 头像
      userImg: "",
      // 昵称
      nickName: "",
      // 简介
      desc: "",
      // 未登录显示的
      istloggedin: true,
    };
  },
  created() {
    this.personalcenterdata();
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.push({ name: "Shobag" });
    },
    // 顶部弹出层
    showPopup() {
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
      this.isshow = true;
    },
    // 获取个人中心数据
    personalcenterdata() {
      let defaults = localStorage.getItem("defaults");
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
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // Replace
          if (result.data.code == "A001") {
            this.$toast.clear();
            this.userImg = result.data.result[0].userImg;
            this.nickName = result.data.result[0].nickName;
            this.desc = result.data.result[0].desc;
            if (defaults == "false") {
              this.userBg = result.data.result[0].userBg;
            }
          }
        })
        .catch((err) => {});
    },
    // 无背景
    nobackground() {
      this.defaults = true;
      this.isshow = false;
      localStorage.setItem("defaults", this.defaults);
    },
    // 上传背景图
    backgroundimage(file) {
      // Replace
      this.defaults = false;
      localStorage.setItem("defaults", this.defaults);
      let token = localStorage.getItem("NO");
      let basemin = file.content.indexOf(",");
      let imgmin = file.file.type.indexOf("/");
      let base64 = file.content.slice(basemin + 1);
      let imgtype = file.file.type.slice(imgmin + 1);
      // Replace

      // 参数序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        imgType: imgtype,
        serverBase64Img: base64,
      };
      data = utils.queryString(data);
      // Replace
      // 发起请求
      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data,
      })
        .then((result) => {
          // Replace
          if (result.data.code == "I001") {
            this.personalcenterdata();
            this.isshow = false;
          }
        })
        .catch((err) => {});
    },
    // 限制类型提示
    beforeRead(file) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
        this.$toast("图片格式不正确╮(╯﹏╰）╭");
        return false;
      }
      return true;
    },
    // 超过限制大小提示
    onOversize(file) {
      this.$toast("图片太大了╮(╯﹏╰）╭");
    },
    // 分享弹出层
    onSelect(option) {
      this.showShare = true;
    },
    // 跳转到个人信息
    jumpinformation() {
      this.$router.push({ name: "Information" });
    },

    // 退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "确定退出登录吗?",
        })
        .then(() => {
          let token = localStorage.getItem("NO");

          // 序列化
          let data = {
            appkey: this.appkey,
            tokenString: token,
          };
          data = utils.queryString(data);

          this.axios({
            method: "POST",
            url: "/logout",
            data,
          }).then((result) => {
            // Replace
            if (result.data.code == "F001") {
              this.$dialog
                .alert({
                  message: "退出成功",
                })
                .then(() => {
                  localStorage.removeItem("NO");
                  this.$router.push({ name: "Entrance" });
                });
            }
          });
        })
        .catch(() => {});
    },
    // 去登录页面
    gotologin() {
      this.$router.push({ name: "Entrance" });
    },

    // 去我的订单页面
    gotomyorder() {
      this.$router.push({ name: "Myorder" });
    },
    // 获取所有收藏
    // allcollection() {
    //   // 发起请求
    //   let token = localStorage.getItem("NO");
    //   let bool = true;
    //   this.axios({
    //     method: "GET",
    //     url: "/findAllLike",
    //     params: {
    //       appkey: this.appkey,
    //       tokenString: token,
    //     },
    //   })
    //     .then((result) => {
    //       Replace
    //     })
    //     .catch((err) => {
    //       Replace
    //     });
    // },
  },
};
</script>
