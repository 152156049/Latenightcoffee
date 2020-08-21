<template>
  <div class="myaddress">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" title="收货地址" :border="false">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- 空状态 -->
    <div class="emptystate" v-if="list.length<=0">
      <van-empty
        description="还没添加地址喔"
        :image="require('../assets/images/emptystate.png')"
        v-if="istloggedin"
      ></van-empty>
      <van-empty description="还没有登录呢" :image="require('../assets/images/notloggedin.png')" v-else>
        <van-button round type="danger" class="bottom-button" @click="gotologin">去登录</van-button>
      </van-empty>
    </div>
    <!-- 收货地址内容 -->
    <div class="addresslist" v-if="istloggedin">
      <van-address-list
        :list="list"
        :switchable="false"
        default-tag-text="默认"
        @add="Jumptoadd"
        @edit="jumpedit"
      />
    </div>
  </div>
</template>

<script>
import "../assets/less/myaddress/myaddress.less";
import { utils } from "../assets/js/utils";

export default {
  name: "Myaddress",
  data() {
    return {
      list: [],
      istloggedin: true,
    };
  },

  created() {
    this.getdefaultaddress();
  },
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 获取显示默认地址
    getdefaultaddress() {
      // 获取用户的token
      let token = localStorage.getItem("NO");
      if (!token) {
        this.istloggedin = false;
        return;
      }
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

          if (result.data.code == "20000") {
            this.$toast.clear();
            data.map((v) => {
              this.list.push({
                name: v.name,
                tel: v.tel,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault),
                aid: v.aid,
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
    // 跳转到新增地址
    Jumptoadd() {
      this.$router.push({ name: "Newaddress" });
    },
    // 跳转到编辑地址
    jumpedit(item) {
      this.$router.push({ name: "Editaddress", query: { editdata: item } });
    },
    // 去登录页面
    gotologin() {
      this.$router.push({ name: "Entrance" });
    },
  },
};
</script>

