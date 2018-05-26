<template>
  <div class="page">
    <pageHeader></pageHeader>
    <router-view></router-view>
    <pageFooter></pageFooter>
  </div>
  </template>
<script>
import pageHeader from './header.vue'
import pageFooter from './footer.vue'
export default {
  name: 'app',
  components: {
    pageHeader,
    pageFooter
  }
}
</script>
