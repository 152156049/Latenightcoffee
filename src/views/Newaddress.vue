<template>
  <div class="newaddress">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar title="新增地址" @click-left="fhiu">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#5e5e5e" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 地址编辑器 -->
    <div class="addresser-center">
      <van-address-edit
        :area-list="areaList"
        show-postal
        show-set-default
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="newrequest"
        @change-default="setdefault"
      />
    </div>
  </div>
</template>

<script>
import "../assets/less//newaddress/newaddress.less";
import arealist from "../assets/js/arealist";
import { utils } from "../assets/js/utils";

export default {
  name: "Newaddress",
  data() {
    return {
      // 地区列表
      areaList: arealist,
      // 设置默认地址标识
      default: 0,
    };
  },
  created() {},
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 新增地址请求
    newrequest(content) {
      // Replace
      // 获取用户的token
      let token = localStorage.getItem("NO");
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "circular",
      });
      // 数据序列化
      let data = {
        appkey: this.appkey,
        tokenString: token,
        name: content.name,
        tel: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        addressDetail: content.addressDetail,
        areaCode: content.areaCode,
        postalCode: content.postalCode,
        isDefault: this.default,
      };
      data = utils.queryString(data);

      // 发起请求
      this.axios({
        method: "POST",
        url: "/addAddress",
        data,
      })
        .then((result) => {
          if (result.data.code == 9000) {
            this.$toast.clear();
            this.$toast(result.data.msg);
            this.$router.go(-1);
          }
        })
        .catch((err) => {});
    },

    // 设置默认地址
    setdefault() {
      if (this.default == 0) {
        this.default = 1;
      } else {
        this.default = 0;
      }
    },
  },
};
</script>
