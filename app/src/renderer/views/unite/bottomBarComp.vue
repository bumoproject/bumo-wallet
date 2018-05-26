<template>
  <div class="bottom-bar-comp">
    <div class="bar-item">
      <div class="bar-item-img-wrapper first-step">
        <img src="../../assets/img/create.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title"
        :class="currentTab === 'listUniteAccountComponet' ? 'bar-item-content-title-active' : ''">
        {{$t('unite.bottomBarComp.step1.title')}}</div>
        <div class="bar-item-content-text" v-html="$t('unite.bottomBarComp.step1.content')"></div>
      </div>
    </div>
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/online.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title"
        :class="currentTab === 'buildTxComponet' ? 'bar-item-content-title-active' : ''">
        {{$t('unite.bottomBarComp.step2.title')}}</div>
        <div class="bar-item-content-text" v-html="$t('unite.bottomBarComp.step2.content')"></div>
      </div>
    </div>
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/sgin.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title" 
             :class="currentTab === 'signTxComponet' ? 'bar-item-content-title-active' : ''">
            {{$t('unite.bottomBarComp.step3.title')}}
          </div>
        <div class="bar-item-content-text" v-html="$t('unite.bottomBarComp.step3.content')"></div>
      </div>  
    </div>
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/online.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title"
        :class="currentTab === 'submitTxComponet' ? 'bar-item-content-title-active' : ''">
        {{$t('unite.bottomBarComp.step4.title')}}</div>
        <div class="bar-item-content-text" v-html="$t('unite.bottomBarComp.step4.content')"></div>
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  name: 'bottomBar',
  props: {
    currentTab: String
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .bottom-bar-comp {
    position: absolute;
    left: 0px;
    bottom: 0;
    width: 100%;
    height: 80px;
    background: #F4FFFB;
    display: flex;
    justify-content: space-around;
    padding-left:37px;
  }
  .bottom-bar-comp .bar-item {
    position: relative;
    padding-left: 60px;
    padding-top: 18px;
    height: 80px;
    flex-grow: 4;
    &:nth-child(3){
        flex-grow: 5;
    }
  }
  .bottom-bar-comp .bar-item .bar-item-img-wrapper {
    position: absolute;
    left: 0px;
    top: 18px;
    width: 60px;
    height: 54px;
    &.first-step{
      width: 54px;
    }
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-title {
    width: auto;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    color: #666;
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-title-active {
    color: #00D080;
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-text {
    font-size: 10px;
    line-height: 15px;
    color: #999;
    padding-left: 19px;
  }
</style>
