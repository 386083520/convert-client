<template>
  <div class="ocr-image-wrapper">
    <div class="image-wrapper" :style='{ width: imgScale+"%", background: isHiddenImg? "#5a5a5a": "#fff" }'>
      <div class="canvas-wrapper" :style='{opacity: isHiddenImg ? 0 : "unset"}'>
        <img
          class="img-dom"
          :src="imageRes.attachPath"
          @load="imageOnLoad"
          ref="ocrImg"/>
      </div>
      <div class="ocr-container">
        <div
          @mousedown="ocrMouseDowm($event)"
          @mousemove="ocrMouseMove($event)"
          @mouseup="ocrMouseUp($event)"
          class="ocr-lines"
          :style='{opacity: !isHiddenImg ? 0 : "unset"}'
        ></div>
        <div v-for="(selectPos, index) in posList"
          :style='{
           width:  selectPos.scaleLocation.width + "px",
           height: selectPos.scaleLocation.height + "px",
           left: selectPos.scaleLocation.left + "px",
           top: selectPos.scaleLocation.top + "px"
          }' class="select-line" :class="{'dark': isHiddenImg}" :key="'pos_' + index">
        </div>
      </div>
      <div class="copy-button" :class="{'dark': isHiddenImg}" v-show="showCopyButton" ref="copyButton" @click.prevent="copyWordsHandle()">复制文本</div>
    </div>
    <div class="scale-tool">
      <el-slider
        :min="50"
        :max="200"
        v-model="imgScale">
      </el-slider>
    </div>
    <div class="ocr-tool">
      <svg class="ocr-tool-scan icon"
           aria-hidden="true"
           v-loading.fullscreen.lock="fullscreenLoading"
           v-if="imageRes.attachPath && ocrResult.length === 0"
           @click="getOcrResult">
        <use xlink:href="#icon-saomiaoguanli"></use>
      </svg>
      <svg class="ocr-tool-scan icon" aria-hidden="true" v-if="this.isShowOcrText && this.ocrResult.length > 0" @click="isShowOcrText = false">
        <use xlink:href="#icon-icon-eye-open"></use>
      </svg>
      <svg class="ocr-tool-scan icon" aria-hidden="true" v-if="!this.isShowOcrText && this.ocrResult.length > 0" @click="isShowOcrText = true">
        <use xlink:href="#icon-icon-eye-close"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import API from '@/api/api.js'
import $ from 'jquery'
export default {
  name: 'OcrPaper',
  props: {
    imageRes: {}
  },
  computed: {
    isHiddenImg () {
      return this.isShowOcrText && this.ocrResult.length > 0
    }
  },
  data () {
    return {
      imgScale: 100,
      ocrResult: [],
      isShowOcrText: false,
      textArray: [],
      ocrConfig: {
        color: 'rgba(255, 255, 255, 255)'
      },
      selectFlag: false,
      showCopyButton: false,
      startPos: {
        x: 0,
        y: 0
      },
      endPos: {
        x: 0,
        y: 0
      },
      selectText: '',
      selectWords: '',
      posList: [],
      fullscreenLoading: false
    }
  },
  watch: {
    'imgScale': function (newScale, oldScale) {
      this.$nextTick(() => {
        this.initOcr()
      })
    }
  },
  methods: {
    imageOnLoad () {
      let ocrImg = this.$refs.ocrImg
      this.imageRes.attachWidth = ocrImg.naturalWidth
      this.imageRes.attachHeight = ocrImg.naturalHeight
    },
    async getOcrResult () {
      let params = {
        'id': this.imageRes.id
      }
      this.fullscreenLoading = true
      let res = await API.getOcrResultApi(params)
      this.fullscreenLoading = false
      if (res.data.status === 1) {
        let ocrResultTemp = JSON.parse(res.data.body)
        if (ocrResultTemp && ocrResultTemp.words_result) {
          this.ocrResult = ocrResultTemp.words_result
          this.initOcr()
          this.isShowOcrText = true
        }
      }
    },
    initOcr () {
      $('.ocr-lines').empty()
      this.posList = []
      this.showCopyButton = false
      let imgWidth = this.$refs.ocrImg.width
      this.imageRes.height = this.imageRes.attachHeight * imgWidth / this.imageRes.attachWidth
      let scale = imgWidth / Number(this.imageRes.attachWidth)
      this.textArray = this.dealOcrResult(scale)
      this.activeOcrObj()
    },
    dealOcrResult (scale) {
      let textArray = []
      let ocrData = JSON.parse(JSON.stringify(this.ocrResult))
      ocrData && ocrData.map((line, index) => {
        if (!line || !line.chars || !line.chars.length === 0) {
          return []
        }
        let lineArray = line.chars.map(charObj => {
          return {
            fontSize: Math.min(charObj.location.width, charObj.location.height) * scale,
            width: charObj.location.width * scale,
            height: charObj.location.height * scale,
            left: charObj.location.left * scale,
            top: charObj.location.top * scale,
            char: charObj.char,
            choose: false
          }
        })
        textArray.push({
          scaleChars: lineArray,
          chars: line.chars,
          scaleLocation: {
            width: line.location.width * scale,
            height: line.location.height * scale,
            left: line.location.left * scale,
            top: line.location.top * scale
          },
          words: line.words
        })
      })
      return textArray
    },
    activeOcrObj () {
      let html = ''
      for (let i = 0; i < this.textArray.length; i++) {
        let lineObj = this.textArray[i]
        let divDisPlay = 'block'
        let divClass = 'ocr-line'
        html += '<div class="' + divClass + '" style="display: ' + divDisPlay + '">'
        for (let j = 0; j < lineObj.scaleChars.length; j++) {
          let textObj = lineObj.scaleChars[j]
          let spanClass = (textObj.choose ? 'word-choose' : '')
          html += '<span class="ocr-word" class="' + spanClass + '" style="width: ' + textObj.width + 'px;height: ' + textObj.height + 'px;left: ' + textObj.left + 'px;top: ' + textObj.top + 'px;font-size: ' + textObj.fontSize + 'px;color: ' + this.ocrConfig.color + '"> ' + textObj.char + ' </span>'
        }
        html += '</div>'
      }
      $('.ocr-lines').empty().append(html)
    },
    ocrMouseDowm (e) {
      this.selectFlag = true
      this.showCopyButton = false
      let scrollDom = document.querySelector('.image-wrapper').parentNode
      this.startPos = {
        x: e.clientX + scrollDom.scrollLeft,
        y: e.clientY + scrollDom.scrollTop
      }
    },
    ocrMouseMove (e) {
      e.stopPropagation()
      if (e.which !== -1) {
        return
      }
      let scrollDom = document.querySelector('.image-wrapper').parentNode
      this.endPos = {
        x: e.clientX + scrollDom.scrollLeft,
        y: e.clientY + scrollDom.scrollTop
      }
      this.getSelect()
    },
    ocrMouseUp (e) {
      e && e.stopPropagation()
      let scrollDom = document.querySelector('.image-wrapper').parentNode
      this.endPos = {
        x: e.clientX + scrollDom.scrollLeft,
        y: e.clientY + scrollDom.scrollTop
      }
      this.getSelect()
      if (this.selectText !== '') {
        this.showCopyButton = true
        this.selectWords = this.selectText
        this.$refs.copyButton.style.left = this.endPos.x + 10 + 'px'
        this.$refs.copyButton.style.top = this.endPos.y + 'px'
      }
    },
    getSelect () {
      let includeLine = []
      this.textArray.map(item => {
        if (item.scaleLocation.top + item.scaleLocation.height < Math.min(this.startPos.y, this.endPos.y) || item.scaleLocation.top > Math.max(this.endPos.y, this.startPos.y)) {
          item.scaleChars.map(char => {
            char.choose = false
          })
        } else {
          includeLine.push(item)
        }
      })
      this.posList = []
      this.selectText = ''
      if (Math.abs(this.endPos.y - this.startPos.y) < 5 && Math.abs(this.endPos.x - this.startPos) < 5) {
        return
      }
      includeLine.map(item => {
        if (item.scaleLocation.top > Math.min(this.startPos.y, this.endPos.y) && (item.scaleLocation.top + item.scaleLocation.height) < Math.max(this.startPos.y, this.endPos.y)) {
          this.posList.push(item)
          this.selectText += item.words
        } else {
          if (item.scaleLocation.top < Math.min(this.startPos.y, this.endPos.y) && (item.scaleLocation.top + item.scaleLocation.height) < Math.max(this.startPos.y, this.endPos.y)) {
            if (item.scaleLocation.left + item.scaleLocation.width < (this.startPos.y > this.endPos.y ? this.endPos.x : this.startPos.x)) {
            } else {
              let left = Math.max(item.scaleLocation.left, this.startPos.y > this.endPos.y ? this.endPos.x : this.startPos.x)
              this.posList.push({
                chars: item.scaleChars,
                words: item.words,
                scaleLocation: {
                  width: item.scaleLocation.left + item.scaleLocation.width - Math.max(item.scaleLocation.left, this.startPos.y > this.endPos.y ? this.endPos.x : this.startPos.x),
                  height: item.scaleLocation.height,
                  left: left,
                  top: item.scaleLocation.top
                }
              })
              item.scaleChars.map(word => {
                if (word.left + word.width > left) {
                  this.selectText += word.char
                } else {
                }
              })
            }
          } else if (item.scaleLocation.top > Math.min(this.startPos.y, this.endPos.y) && (item.scaleLocation.top + item.scaleLocation.height) > Math.max(this.startPos.y, this.endPos.y)) {
            if (item.scaleLocation.left > (this.startPos.y < this.endPos.y ? this.endPos.x : this.startPos.x)) {
            } else {
              this.posList.push({
                chars: item.scaleChars,
                words: item.words,
                scaleLocation: {
                  width: Math.min((this.startPos.y < this.endPos.y ? this.endPos.x : this.startPos.x) - item.scaleLocation.left, item.scaleLocation.width),
                  height: item.scaleLocation.height,
                  left: item.scaleLocation.left,
                  top: item.scaleLocation.top
                }
              })
              item.scaleChars.map(word => {
                if (word.left < (this.startPos.y < this.endPos.y ? this.endPos.x : this.startPos.x)) {
                  this.selectText += word.char
                } else {
                }
              })
            }
          } else if (item.scaleLocation.top < Math.min(this.startPos.y, this.endPos.y) && item.scaleLocation.top + item.scaleLocation.height > Math.max(this.startPos.y, this.endPos.y)) {
            if (item.scaleLocation.left > Math.max(this.startPos.x, this.endPos.x) || (item.scaleLocation.left + item.scaleLocation.width) < Math.min(this.startPos.x, this.endPos.x)) {
            } else {
              let left = Math.max(Math.min(this.startPos.x, this.endPos.x), item.scaleLocation.left)
              let width = Math.min((item.scaleLocation.left + item.scaleLocation.width), Math.max(this.startPos.x, this.endPos.x)) - left
              this.posList.push({
                chars: item.scaleChars,
                words: item.words,
                scaleLocation: {
                  width: width,
                  height: item.scaleLocation.height,
                  left: left,
                  top: item.scaleLocation.top
                }
              })
              item.scaleChars.map(word => {
                if (word.left + word.width < Math.min(this.startPos.x, this.endPos.x) || word.left > Math.max(this.startPos.x, this.endPos.x)) {
                } else {
                  this.selectText += word.char
                }
              })
            }
          }
        }
      })
    },
    copyWordsHandle () {
      this.copyToClipboard(this.selectWords)
      this.showCopyButton = false
      this.clearSelect()
    },
    copyToClipboard (txt) {
      let aux = document.createElement('input')
      try {
        aux.setAttribute('value', txt)
      } catch (e) {
        aux.value = txt
      }
      document.getElementsByTagName('body')[0].appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.getElementsByTagName('body')[0].removeChild(aux)
    },
    clearSelect () {
      this.posList = []
      this.selectText = ''
    }
  }
}
</script>

<style lang="scss" type="text/scss">
  .ocr-image-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    .image-wrapper {
      position: relative;
      .copy-button {
        position: absolute;
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(65, 94, 167, 0.7);
        z-index: 200;
        cursor: pointer;
        color: #fff;
        .dark {
          background: rgba(65, 94, 167, 1);
        }
      }
      .canvas-wrapper {
        position: relative;
        width: 100%;
        .img-dom {
          width: 100%;
        }
      }
      .ocr-container {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 200;
        background: rgba(0, 0, 0, 0);
        .ocr-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0);
          .ocr-line {
            .ocr-word {
              position: absolute;
              color: rgba(0, 0, 0, 0);
              z-index: 100;
            }
          }
        }
        .select-line {
          position: absolute;
          background-color: rgba(41,140,255,0.4);
          z-index: 99;
          .dark {
            background: rgba(41,140,255,0.7);
          }
        }
      }
    }
    .scale-tool {
      position: absolute;
      width: 10%;
      bottom: 10px;
      right: 30px;
    }
    .ocr-tool {
      position: absolute;
      top: 30px;
      right: 60px;
      cursor: pointer;
      z-index: 300;
    }
    .ocr-tool-scan {
      width: 50px;
      height: 50px;
    }
  }
</style>
