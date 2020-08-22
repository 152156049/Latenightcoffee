<template>
  <div class="securitycenter">
    <!-- 修改密码弹出层 -->
    <div class="changepassword">
      <van-popup v-model="isshow" round closeable position="bottom">
        <h2>修改密码</h2>
        <div class="passwordinput">
          <van-form @submit="onSubmit">
            <div v-for="(item,index) in passworddata" :key="index">
              <van-field
                v-model="item.password"
                :type="item.isactive ? 'text':'password'"
                :name="item.typename"
                :label="item.name"
                :placeholder="item.placeholder"
                :right-icon="item.isactive ? item.isrighticon : item.righticon"
                @click-right-icon="toggleIcon(item)"
              />
            </div>

            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" title="安全中心" :fixed="true" :border="false">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 单元格 -->
    <div class="revised-content">
      <van-cell title="修改密码" size="large" is-link arrow-direction @click="showPopup" />

      <van-cell size="large" @click="cancelaccount">
        <template #title>
          <span class="custom-title">注销账号</span>
          <van-tag type="danger">谨慎操作</van-tag>
        </template>
        <template #right-icon>
          <van-icon name="warning-o" :size="18" class="search=icon" />
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import "../assets/less/securitycenter/securitycenter.less";
import { utils } from "../assets/js/utils";
import { validForm } from "../assets/js/validFonm";

export default {
  name: "Securitycenter",
  data() {
    return {
      isshow: false,
      // 密码数据
      passworddata: [
        {
          password: "",
          typename: "oldpassword",
          name: "旧密码",
          righticon: "closed-eye",
          isrighticon: "eye-o",
          placeholder: "以大小字母开头,大于6位的数字",
          isactive: false,
        },
        {
          password: "",
          typename: "newpassword",
          name: "新密码",
          placeholder: "以大小字母开头,大于6位的数字",
          righticon: "closed-eye",
          isrighticon: "eye-o",
          isactive: false,
        },
        {
          password: "",
          typename: "confirmpassword",
          name: "确认密码",
          placeholder: "再次输入新密码",
          righticon: "closed-eye",
          isrighticon: "eye-o",
          isactive: false,
        },
      ],
    };
  },
  created() {},
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 修改密码弹出层
    showPopup() {
      this.isshow = true;
    },
    // 切换小眼睛
    toggleIcon(item) {
      item.isactive = !item.isactive;
    },

    // 修改密码
    onSubmit(values) {
      let token = localStorage.getItem("NO");
      // 旧密码
      let oldpassword = values.oldpassword;
      // 新密码
      let newpassword = values.newpassword;
      // 确认密码
      let confirmpassword = values.confirmpassword;
      let newsObj = {
        password: {
          value: newpassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码格式不正确",
        },
      };
      // 调用验证方法开始验证
      if (!validForm.valid(newsObj)) {
        // 验证不通过
        return;
      }
      if (newpassword !== confirmpassword) {
        this.$notify({
          type: "warning",
          message: "密码不一致",
        });
        return;
      }

      // 序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        password: newpassword,
        oldPassword: oldpassword,
      };
      data = utils.queryString(data);
      // Replace
      // 发起请求
      this.axios({
        method: "POST",
        url: "/updatePassword",
        data,
      })
        .then((result) => {
          // Replace
          if (result.data.code == "E003") {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
          if (result.data.code == "E001") {
            this.$dialog
              .alert({
                message: "密码修改成功,需要重新登录",
              })
              .then(() => {
                this.$router.push({ name: "Entrance" });
              });
          }
        })
        .catch((err) => {});
    },
    // 注销账号
    cancelaccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "确定注销您的账号吗?",
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
            url: "/destroyAccount",
            data,
          }).then((result) => {
            this.$dialog
              .alert({
                message: "注销成功",
              })
              .then(() => {
                localStorage.removeItem("NO");

                this.$router.push({ name: "Entrance" });
              });
          });
        })
        .catch(() => {});
    },
  },
};
</script>

