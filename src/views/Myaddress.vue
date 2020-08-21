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

    <!-- 收货地址内容 -->
    <div class="addresslist">
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
          console.log(data);

          if (result.data.code == 20000) {
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
  },
};
</script>

