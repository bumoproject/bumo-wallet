<template>
  <section>
    <div class="page-footer">
      <div v-if="!getBlockStatus" class="no-block-seq">{{$t('footer.noBlockSeq')}}</div>
      <div v-else class="block-seq">
        <!-- <div class="process-loading-icon" v-if="blockStatus.blockSeqUpdatePercent !== 100"></div> -->
        <Progress :percent="blockStatus.blockSeqUpdatePercent"
                  :stroke-width="12"
                  :status="blockStatus.blockSeqUpdatePercent !== 100 ? 'active' : 'normal'">
          <span class="process-percent">{{blockStatus.blockSeqUpdatePercent + '%'}}</span> 
        </Progress>
        <Tooltip :content="$t('footer.synchronizedBlock')" placement="top-end"><em class="block-num">{{blockStatus.currentBlockSeq}}</em></Tooltip>&nbsp;/&nbsp;<Tooltip :content="$t('footer.currentBlock')" placement="top-start"><em class="block-num">{{blockStatus.lastBlockSeq}}</em></Tooltip>
      </div>
      <div class="wallet-node-status">
        <em class="node-status-icon"></em>
        <label>{{$t('footer.nodeConnectionSize')}}：{{blockStatus.connectionSize}}</label>
        <!-- <Tooltip :content="blockStatus.connectionSize" placement="top-end">
          <svg class="icon 4 block-status-connection-size" aria-hidden="true" v-html="blockStatus.currentSignal">{{blockStatus.currentSignal}}</svg>
        </Tooltip> -->
        <!-- <Tooltip :content="version" placement="top-end">
          <i class="iconfont icon-banben"></i>
        </Tooltip> -->
      </div>
    </div>
  </section>
</template>
<script>
import txService from '../controllers/txService'
import errorUtil from '../constants'
import tools from '../utils/tools'
import config from '../../config'
export default {
  data () {
    return {
      currentSignal: '<use xlink:href="#icon-xinhao-0"></use>',
      version: '当前版本: ' + config.version,
      getBlockStatus: false
    }
  },
  mounted () {
    var that = this
    txService.getBlockInfo(that.$store).then(respData => {
      if (errorUtil.ERRORS.SUCCESS.CODE !== respData.errCode) {
        console.log(respData)
      } else {
        console.log(JSON.stringify(respData.data.blockStatus))
      }
    }).catch(data => {
      console.log('err data:', data)
    })
  },
  computed: {
    blockStatus () {
      var _blockStatus = this.$store.state.blockStatus
      var _blockConnectionSize = this.$store.state.blockConnectionSize
      var connectionSize = _blockConnectionSize
      var blockSeqUpdatePercent = Math.floor(tools.percentage(_blockStatus.seq, _blockStatus.seqMax))
      if (_blockStatus.seqMax === 0) {
        blockSeqUpdatePercent = 0
      } else {
        this.getBlockStatus = true
      }
      var result = {
        blockSeqUpdatePercent: blockSeqUpdatePercent,
        currentBlockSeq: _blockStatus.seq,
        lastBlockSeq: _blockStatus.seqMax,
        connectionSize: connectionSize
      }
      return result
    }
  }
}
</script>
<style>
  .page-footer{background-color: #fff;height: 40px;border-top: 1px solid #F2F2F2;position: fixed;bottom: 0;width: 955px;margin-left: 25px;}
  .block-seq{float: left;display: flex;position: relative;width: 305px;height: 40px;line-height: 40px;overflow: hidden;color: #00d080;}
  .block-seq .process-loading-icon {position: absolute;top: 14px;left: 0; width: 13px;height: 13px;z-index: 10;background: url('../assets/img/loading.gif') no-repeat left;background-size:13px 13px;}
  .block-seq svg{width: 36px;height: 29px;}
  .wallet-node-status{height: 40px;line-height: 40px; float: right;}
  .wallet-node-status label{font-size: 12px;color: #00D080;}
  .block-seq .ivu-progress-show-info {margin-right: 5px;}
  .block-seq .ivu-progress-text .process-percent {position: absolute;top: 1px;left: 50%;transform: translateX(-50%);color: #028452;}
  .ivu-progress-success .ivu-progress-text i{color: #00D080;display: none;}
  .ivu-progress-success .ivu-progress-bg{background-color: #00D080;}
  .ivu-progress-bg{background-color: #00D080;}
  .no-block-seq{display: inline-block;height: 35px;overflow: hidden;line-height: 35px;}
  .block-status-connection-size{padding-top: 6px;}
  .node-status-icon{width: 10px;height: 10px;background: #00D080;border-radius:50%;display:inline-block;border: 2px solid #b6ead0;}
  .block-seq .block-num {font-size: 12px; line-height: 1.5;color: #00d080;}
</style>
