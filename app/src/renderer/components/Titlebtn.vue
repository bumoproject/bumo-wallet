<template>
  <div 
    class="titlebtn" 
    v-bind:style="style"
    v-on:click="click">
  </div>
</template>

<script>
const {ipcRenderer: ipc} = require('electron')
const style = {
  min: {
    right: '52px',
    'font-size': '12px'
  },
  max: {
    right: '60px'
  },
  close: {
    right: '16px',
    'font-size': '10px'
  }
}
export default {
  name: 'Titlebtn',
  props: ['type'],
  computed: {
    style: function () {
      return style[this.type]
    }
  },
  methods: {
    click: function () {
      ipc.send(this.type)
    }
  }
}
</script>
<style>
.titlebtn {
    position: absolute;
    width: 12px;
    height: 12px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    z-index: 15;
    -webkit-app-region: no-drag;
    cursor: pointer;
    color: #fff;
}
</style>
