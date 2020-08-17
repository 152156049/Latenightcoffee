<template>
  <div class="information">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar
        @click-left="fhiu"
        @click-right="jumpsafety"
        title="个人信息"
        :fixed="true"
        :border="false"
      >
        <template #left>
          <van-icon name="arrow-left" size="30" color="#5e5e5e" />
        </template>
        <template #right>
          <div>安全中心</div>
        </template>
      </van-nav-bar>
    </div>
    <div class="editor">
      <div class="headportrait">
        <van-uploader
          :after-read="headportrait"
          :accept="picturetype"
          :max-size="1024*1024"
          @oversize="onOversize"
          :before-read="beforeRead"
        />
        <div class="headportrait-left" :style="{backgroundImage:`url(${userImg})`}">
          <!-- <img :src="userImg" alt /> -->
        </div>
        <div class="text-left">点击修改头像</div>
      </div>
      <!-- 输入任意文本 -->
      <van-field v-model="name" label="昵称" @input="displaysave" maxlength="6" />
      <!-- 输入手机号，调起手机号键盘 -->
      <van-field v-model="tel" label="账号" readonly />
      <!-- 允许输入正整数，调起纯数字键盘 -->
      <van-field v-model="id" label="ID" readonly />
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="留言"
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
        @input="displaysave"
      />
    </div>
    <div class="addtocart" v-if="isbool" @click="preservation">
      <div class="addtocart-center">
        <div>保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/information/information.less";
import { utils } from "../assets/js/utils";

export default {
  name: "Information",
  data() {
    return {
      // 信息数据
      userImg: "",
      tel: "",
      name: "",
      id: "",
      message: "",

      // 允许上传的图片类型
      picturetype: "image/jpeg,/image/gif,image/png",
      informationdata: [],
      // 判断显示保存按钮
      isbool: false,
    };
  },
  created() {
    this.accountinformation();
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.push({ name: "My" });
    },
    // 跳转到安全中心
    jumpsafety() {
      this.$router.push({ name: "Securitycenter" });
    },
    // 头像上传
    headportrait(file) {
      console.log(file);
      let token = localStorage.getItem("NO");
      let basemin = file.content.indexOf(",");
      let imgmin = file.file.type.indexOf("/");
      let base64 = file.content.slice(basemin + 1);
      let imgtype = file.file.type.slice(imgmin + 1);
      // 参数序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        imgType: imgtype,
        serverBase64Img: base64,
      };
      data = utils.queryString(data);
      // console.log(data);
      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data,
      })
        .then((result) => {
          // console.log(result);
          if (result.data.code == "H001") {
            this.accountinformation();
            this.$toast("修改成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
    // 获取账号信息
    accountinformation() {
      let token = localStorage.getItem("NO");
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // console.log(result);
          let data = result.data.result;
          if (result.data.code == "B001") {
            this.$toast.clear();
            this.tel = data[0].phone;
            this.userImg = data[0].userImg;
            this.name = data[0].nickName;
            this.id = data[0].userId;
            this.message = data[0].desc;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 显示保存按钮
    displaysave() {
      this.isbool = true;
    },
    // 点击保存
    preservation() {
      let token = localStorage.getItem("NO");
      let isname = false;
      let isdesc = false;
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 参数序列化
      let namedata = {
        appkey: this.appkey,
        tokenString: token,
        nickName: this.name,
      };
      let descdata = {
        appkey: this.appkey,
        tokenString: token,
        desc: this.message,
      };
      namedata = utils.queryString(namedata);
      descdata = utils.queryString(descdata);
      console.log(namedata);
      console.log(descdata);
      // 昵称发起请求
      this.axios({
        method: "POST",
        url: "/updateNickName",
        data: namedata,
      })
        .then((result) => {
          // console.log(result);
          if (result.data.code == "C001") {
            isname = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 简介发起请求
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: descdata,
      })
        .then((result) => {
          // console.log(result);

          if (result.data.code == "D001") {
            isdesc = true;
            if (isname == true && isdesc == true) {
              this.$toast.clear();
              this.$toast("保存成功");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

