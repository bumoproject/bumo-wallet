<template>
  <div class="bottom-bar-comp">
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/online.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title"
        :class="currentTab === 'buildTx' ? 'bar-item-content-title-active' : ''">
        {{$t('ost.bottomBarComp.step1.title')}}</div>
        <div class="bar-item-content-text">{{$t('ost.bottomBarComp.step1.content')}}</div>
      </div>
    </div>
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/offline.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title" 
             :class="currentTab === 'outlineSign' ? 'bar-item-content-title-active' : ''">
            {{$t('ost.bottomBarComp.step2.title')}}
          </div>
        <div class="bar-item-content-text">{{$t('ost.bottomBarComp.step2.content')}}</div>
      </div>  
    </div>
    <div class="bar-item">
      <div class="bar-item-img-wrapper">
        <img src="../../assets/img/online.png" alt="">
      </div>
      <div class="bar-item-content">
        <div class="bar-item-content-title"
        :class="currentTab === 'submitTx' ? 'bar-item-content-title-active' : ''">
        {{$t('ost.bottomBarComp.step3.title')}}</div>
        <div class="bar-item-content-text">{{$t('ost.bottomBarComp.step3.content')}}</div>
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
    return {
      stepOneImgUrl: {
        active: '../../assets/img/step1-active.png',
        inactive: '../../assets/img/step1-inactive.png'
      },
      stepTwoImgUrl: {
        active: '../../assets/img/step2-active.png',
        inactive: '../../assets/img/step2-inactive.png'
      },
      stepThreeImgUrl: {
        active: '../../assets/img/step3-active.png',
        inactive: '../../assets/img/step3-inactive.png'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .bottom-bar-comp {
    position: absolute;
    left: 150px;
    bottom: 0;
    width: 850px;
    height: 80px;
    padding-left: 45px;
    padding-top: 18px;
    background: #F4FFFB;
  }
  .bottom-bar-comp .bar-item {
    float: left;
    height: 57px;
    width: 240px;
    margin-right: 28px;
  }
  .bottom-bar-comp .bar-item .bar-item-img-wrapper {
    float: left;
    width: 60px;
    height: 54px;
  }
  .bottom-bar-comp .bar-item .bar-item-content {
    float: left;
    padding-left: 10px;
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-title {
    width: 170px;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    color: #666;
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-title-active {
    color: #00D080;
  }
  .bottom-bar-comp .bar-item .bar-item-content .bar-item-content-text {
    width: 170px;
    font-size: 10px;
    line-height: 15px;
    padding-left: 19px;
    color: #999;
  }
</style>
