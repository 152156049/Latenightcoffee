<template>
  <div class="main">
    <div>
      <!-- 二级路由插座 -->
      <keep-alive exclude="Shobag,My">
        <router-view />
      </keep-alive>
    </div>
    <div class="main-navigation">
      <van-tabbar v-model="active" route>
        <van-tabbar-item v-for="(item,index) in navigationtab" :key="index" :to="item.url">
          <span>{{item.title}}</span>
          <template #icon="props">
            <van-icon
              :name="props.active?item.icon.leaveActiva:item.icon.isActiva"
              color="#2a9f93"
              :size="25"
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import "../assets/less/main/main.less";

export default {
  data() {
    return {
      active: 0,
      navigationtab: [
        {
          title: "首页",
          icon: {
            isActiva: "wap-home-o",
            leaveActiva: "wap-home",
          },
          url: {
            name: "Home",
          },
        },
        {
          title: "菜单",
          icon: {
            isActiva: "bill-o",
            leaveActiva: "bill",
          },
          url: {
            name: "Menu",
          },
        },
        {
          title: "订单",
          icon: {
            isActiva: "bag-o",
            leaveActiva: "bag",
          },
          url: {
            name: "Shobag",
          },
        },
        {
          title: "我的",
          icon: {
            isActiva: "manager-o",
            leaveActiva: "manager",
          },
          url: {
            name: "My",
          },
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  .main-navigation {
    height: 0;
  }
}
.main > div {
  height: 100%;
}
</style>