<template>
  <div class="editaddress">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar title="编辑地址" @click-left="fhiu">
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
        show-delete
        :address-info="editdata"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="editrequest"
        @change-default="setdefault"
        @delete="deleteaddress"
      />
    </div>
  </div>
</template>

<script>
import "../assets/less/editaddress/editaddress.less";
import arealist from "../assets/js/arealist";
import { utils } from "../assets/js/utils";

export default {
  name: "Editaddress",
  data() {
    return {
      // 编辑的地址
      editdata: {},
      // 地区数据
      areaList: arealist,
      // 默认地址标识
      default: 0,
    };
  },
  created() {
    this.getaid();
  },
  methods: {
    // 获取要编辑的数据
    getaid() {
      let sessiondata = sessionStorage.getItem("editData");
      if (sessiondata) {
        this.editdata = JSON.parse(sessiondata);
        if (this.editdata.isDefault) {
          this.default = 1;
        }
        return;
      }

      this.editdata = this.$route.query.editdata;
      sessionStorage.setItem("editData", JSON.stringify(this.editdata));
      if (this.editdata.isDefault) {
        this.default = 1;
      }
    },
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
      sessionStorage.removeItem("editData");
    },
    // 编辑地址请求
    editrequest(content) {
      let token = localStorage.getItem("NO");
      // // 加载提示
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
        aid: content.aid,
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
      console.log(data);
      // 发起请求
      this.axios({
        method: "POST",
        url: "/editAddress",
        data,
      })
        .then((result) => {
          console.log(result);
          if (result.data.code == 30000) {
            this.$toast.clear();
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除地址请求
    deleteaddress(content) {
      let token = localStorage.getItem("NO");
      // // 加载提示
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
        aid: content.aid,
      };
      data = utils.queryString(data);
      // 发起请求
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data,
      })
        .then((result) => {
          console.log(result);
          if (result.data.code == 10000) {
            this.$toast.clear();
            this.$toast(result.data.msg);
            sessionStorage.removeItem("editData");
            this.editdata = {};
            this.$router.go(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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

<style lang="less" scoped>
</style>