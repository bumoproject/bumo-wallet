<template>
  <div class="logo-img">
    <i class="iconfont icon-BUMO-LOGO icon-logo"></i>
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style scoped lang="less">
  .logo-img {
    position: absolute;
    left: 39px;
    top: -14px;
    width: 87px;
    height: 32px;
    & .icon-logo {
      font-size: 100px;
      color: #fff;
    }
    /* background: url(../assets/img/logo.png) no-repeat center; */
  }
</style>
