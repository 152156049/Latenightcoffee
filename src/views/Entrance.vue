<template>
  <div class="entrance">
    <div class="title">
      <van-nav-bar :border="false" @click-left="jumphome">
        <template #left>
          <van-icon name="arrow-left" :size="30" color="#fff" />
        </template>
      </van-nav-bar>
    </div>
    <div class="entrance-head">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/images/logo.png" alt="..." />
      </div>
      <h1>欢迎回来!</h1>
      <p>Welcome back</p>
      <div class="signin">
        <van-form>
          <!-- 登录信息输入 -->
          <van-field v-model="logininfo.phone" left-icon="manager" size="30" placeholder="用户名" />
          <van-field
            v-model="logininfo.password"
            :type="iseyes ? 'password' : 'text'"
            left-icon="lock"
            :right-icon="iseyes ? 'closed-eye' : 'eye-o'"
            placeholder="密码"
            @click-right-icon="switcheyes"
          />
          <div>
            <van-button round block type="default" native-type="submit" @click="signin">登录</van-button>
            <van-button
              round
              block
              type="default"
              color="#6f7dd0"
              native-type="submit"
              @click="showPopup"
            >注册</van-button>
            <!-- 注册弹出层 -->
            <van-popup
              v-model="show"
              closeable
              round
              position="bottom"
              duration="0.3"
              :style="{ height: '70%' }"
              close-on-click-overlay:false
            >
              <div class="register">
                <h2>注册</h2>
                <div class="registrationtext">
                  <van-field
                    v-model="Registrationinfo.phone"
                    type="digit"
                    placeholder="手机号 中国(+86)"
                    maxlength="11"
                  />
                  <van-field
                    v-model="Registrationinfo.nickName"
                    placeholder="昵称(最多6位字符)"
                    maxlength="6"
                  />
                  <van-field
                    v-model="Registrationinfo.password"
                    type="password"
                    placeholder="密码(以字母开头,最少6位字符)"
                  />
                  <van-field
                    v-model="Registrationinfo.confirmpassword"
                    type="password"
                    placeholder="确认密码"
                  />
                  <van-button
                    round
                    block
                    type="default"
                    color="#2a9f93"
                    native-type="submit"
                    @click="confirm"
                  >注册</van-button>
                </div>
              </div>
            </van-popup>
          </div>
        </van-form>
      </div>
    </div>
    <div class="tail">
      <p>
        <span @click="forgettinglayer">忘记密码?</span>
      </p>
    </div>
    <!-- 忘记密码弹出层 -->
    <div class="retrieve">
      <van-popup round closeable v-model="isshow" position="bottom" :style="{ height: '60%' }">
        <h1>找回密码</h1>

        <van-form @submit="retrieve">
          <van-field
            v-model="username"
            size="large"
            name="username"
            label="手机号"
            placeholder="注册时的手机号"
          />
          <van-field
            v-model="password"
            size="large"
            :type="!isactive ? 'password': 'text'"
            name="password"
            label="新密码"
            placeholder="以大小字母开头,大于6位的数字"
            :right-icon="isactive ? 'eye-o': 'closed-eye'"
            @click-right-icon="smalleyes"
          />
          <van-field
            v-model="email"
            size="large"
            type="'text'"
            name="email"
            label="邮箱"
            placeholder="输入存在的邮箱"
          />
          <van-field
            class="control"
            v-model="sms"
            name="sms"
            center
            clearable
            label="邮箱验证码"
            placeholder="请输入邮箱验证码"
          >
            <template #button>
              <van-button
                v-if="isdisable"
                size="small"
                native-type="button"
                @click="mailboxnumber"
                type="primary"
              >发送验证码</van-button>
              <van-button
                v-else
                disabled
                size="small"
                native-type="button"
                type="default"
              >{{countdown}}秒再次发送</van-button>
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">确 定</van-button>
          </div>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/entrance/entrance.less";
import { validForm } from "../assets/js/validFonm";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      // 登录信息
      logininfo: {
        phone: "",
        password: "",
      },
      // 注册信息
      Registrationinfo: {
        phone: "",
        nickName: "",
        password: "",
        confirmpassword: "",
      },
      // 忘记密码信息
      username: "",
      password: "",
      email: "",
      sms: "",
      countdown: 60,

      iseyes: true,
      show: false,
      isshow: false,
      isactive: false,
      isdisable: true,
    };
  },
  methods: {
    // 眼睛查看密码
    switcheyes() {
      this.iseyes = !this.iseyes;
    },
    // 注册弹出层
    showPopup() {
      this.show = true;
    },
    // 切换忘记密码小眼睛
    smalleyes() {
      this.isactive = !this.isactive;
    },
    // 忘记密码弹出层
    forgettinglayer() {
      this.isshow = true;
    },
    // 跳转回首页
    jumphome() {
      this.$router.push({ name: "Home" });
    },
    // 注册验证,注册请求
    confirm() {
      let verification = this.Registrationinfo;

      // 注册验证
      let newsObj = {
        phone: {
          value: verification.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        nickname: {
          value: verification.nickName,
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
          errorMsg: "昵称格式不正确",
        },
        password: {
          value: verification.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      // 调用验证方法开始验证
      if (!validForm.valid(newsObj)) {
        // 验证不通过
        return;
      }

      if (
        this.Registrationinfo.password !== this.Registrationinfo.confirmpassword
      ) {
        this.$notify({
          type: "warning",
          message: "请再次确认密码",
        });
        return;
      }

      // 发起请求
      // 开启加载提示
      this.$toast.loading({
        message: "注册中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });

      // 参数序列化
      // 复制对象
      let info = Object.assign({}, verification);
      // 带上原型上面的key
      info.appkey = this.appkey;
      // 序列化传参
      let data = utils.queryString(info);
      // Replace

      // 发送请求
      this.axios({
        method: "POST",
        // 请求参数
        url: "/register",
        data,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 100) {
            this.show = false;
            for (let key in verification) {
              verification[key] = "";
            }
            this.$toast.success("注册成功");
          } else {
            // 失败则提示
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          // 关闭等待提示ui
          this.$toast.clear();
        });
    },
    // 登录验证,登录请求
    signin() {
      let logininfo = this.logininfo;
      // 格式验证
      let signObj = {
        phone: {
          value: logininfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: logininfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };

      if (!validForm.valid(signObj)) {
        // 验证失败
        return;
      }

      // 验证通过
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });

      // 序列化参数
      let info = Object.assign({}, logininfo);
      info.appkey = this.appkey;
      let data = utils.queryString(info);

      // 发起登录请求
      this.axios({
        method: "POST",
        url: "/login",
        data,
      })
        .then((result) => {
          // 移除加载动画
          this.$toast.clear();
          // Replace
          if (result.data.code == 200) {
            // 将登录信息储存到本地
            localStorage.setItem("NO", result.data.token);
            // 跳转到首页
            this.$router.push({ name: "Home" });
          } else {
            // 失败提示
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();

          // Replace
        });
    },
    // 找回密码
    retrieve(values) {
      // console.log(values);
      // Replace
      let token = localStorage.getItem("NO");
      // 手机号
      let tel = values.username;
      // 新密码
      let newpassword = values.password;

      // 验证码
      let validCode = this.sms;
      let newsObj = {
        phone: {
          value: tel,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
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
      if (!this.email) {
        this.$notify({
          type: "warning",
          message: "邮箱不能为空",
        });
        return;
      }

      // 发起邮箱验证
      let data = {
        appkey: this.appkey,
        validCode,
      };
      data = utils.queryString(data);
      // console.log(data);

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data,
      }).then((result) => {
        // console.log(result);
        if (result.data.code == "K001") {
          // 序列化
          let data = {
            appkey: this.appkey,
            phone: tel,
            password: newpassword,
          };
          data = utils.queryString(data);

          this.axios({
            method: "POST",
            url: "/retrievePassword",
            data,
          }).then((result) => {
            // Replace
            if (result.data.code == "L001") {
              this.$toast(result.data.msg);
              this.username = "";
              this.password = "";
              this.email = "";
              this.sms = "";
              this.isshow = false;
            }
            if (result.data.code == "L003") {
              this.$notify({
                type: "warning",
                message: result.data.msg,
              });
            }
            if (result.data.code == "L004") {
              this.$notify({
                type: "warning",
                message: result.data.msg,
              });
            }
          });
        } else {
          this.$notify({
            type: "warning",
            message: "验证码不正确",
          });
        }
      });
    },
    // 发送邮箱验证码
    mailboxnumber() {
      // console.log(this.email);
      let email = this.email;

      // 邮箱验证验证
      let newsObj = {
        email: {
          value: email,
          reg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
          errorMsg: "邮箱格式不正确",
        },
      };

      if (!validForm.valid(newsObj)) {
        // 验证不通过
        return;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "努力加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 参数序列化
      let data = {
        appkey: this.appkey,
        email,
      };
      data = utils.queryString(data);
      console.log(data);
      // 发送请求
      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data,
      }).then((result) => {
        // console.log(result);
        if (result.data.code == "J001") {
          this.$toast.clear();
          this.$toast("验证码发送成功");
          this.isdisable = false;
          this.countdown = 60;

          let itemr = setInterval(() => {
            this.countdown--;
            if (this.countdown == 0) {
              this.countdown = 0;
              this.isdisable = true;
              clearInterval(itemr);
            }
          }, 1000);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
