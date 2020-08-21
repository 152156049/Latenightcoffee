<template>
  <div id="app">
    <!-- 一级路由插座 -->
    <router-view />
  </div>
</template>

<style lang="less">
html,
body,
#app {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.img-auto {
  width: 100%;
  height: 100%;
}
.setclear::after {
  content: "";
  display: block;
  clear: both;
}
</style>
