<template>
  <div class="language-select-wrapper">
    <div class="lang"
         @click="handleLangItemClick('en')"
         :class="currentLang === 'en' ? 'lang-active' : ''">
         English
    </div>
    <div class="lang" 
         @click="handleLangItemClick('cn')"
         :class="currentLang === 'cn' ? 'lang-active' : ''">
         简体中文
    </div>
    <!-- <div class="lang"
         @click="handleLangItemClick('ct')"
         :class="currentLang === 'ct' ? 'lang-active' : ''">
         繁体中文
    </div> -->
  </div>
</template>
<script>
  import baseService from '../controllers/baseService'
  export default {
    name: 'LanguageSelect',
    data () {
      return {
        currentLang: ''
      }
    },
    methods: {
      handleLangItemClick (lang) {
        this.$i18n.locale = lang
        this.currentLang = lang
        baseService.setLang(lang)
      }
    },
    mounted () {
      this.$i18n.locale = baseService.getLang()
      this.currentLang = this.$i18n.locale
    }
  }
</script>

<style scoped lang="less">
  .language-select-wrapper {
    position: absolute;
    left: 156px;
    top: 23px;
    display: flex;
    & .lang {
      width: 80px;
      height: 24px;
      line-height: 24px;
      border: 1px solid rgba(255, 255, 255, 0);
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.7);
      background-color: rgba(255, 255, 255, 0);
      text-align: center;
      cursor: pointer;
    }
    & .lang-active {
      border: 1px solid #fff;
      color: #fff;
    }
  }
</style>
