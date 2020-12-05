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
        <div class="ocr-lines" :style='{opacity: !isHiddenImg ? 0 : "unset"}'></div>
      </div>
    </div>
    <div class="scale-tool">
      <el-slider
        :min="50"
        :max="200"
        v-model="imgScale">
      </el-slider>
    </div>
    <div class="ocr-tool">
      <svg class="ocr-tool-scan icon" aria-hidden="true" v-if="imageRes.attachPath && ocrResult.length === 0"  @click="getOcrResult">
        <use xlink:href="#icon-saomiaoguanli"></use>
      </svg>
      <svg class="ocr-tool-scan icon" aria-hidden="true" v-if="isHiddenImg" @click="isShowOcrText = false">
        <use xlink:href="#icon-icon-eye-open"></use>
      </svg>
      <svg class="ocr-tool-scan icon" aria-hidden="true" v-if="!isHiddenImg" @click="isShowOcrText = true">
        <use xlink:href="#icon-icon-eye-close"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
      }
    }
  },
  methods: {
    imageOnLoad () {
      let ocrImg = this.$refs.ocrImg
      this.imageRes.attachWidth = ocrImg.naturalWidth
      this.imageRes.attachHeight = ocrImg.naturalHeight
    },
    getOcrResult () {
      axios.get('../../static/response.json').then(res => {
        if (res.data.status === 1) {
          let ocrResultTemp = JSON.parse(res.data.body)
          if (ocrResultTemp && ocrResultTemp.words_result) {
            this.ocrResult = ocrResultTemp.words_result
            let imgWidth = this.$refs.ocrImg.getClientRects()[0].width
            this.imageRes.height = this.imageRes.attachHeight * imgWidth / this.imageRes.attachWidth
            this.initOcr()
          }
        }
      })
    },
    initOcr () {
      let scale = this.$refs.ocrImg.getClientRects()[0].width / Number(this.imageRes.attachWidth)
      this.textArray = this.dealOcrResult(scale)
      this.activeOcrObj()
    },
    dealOcrResult (scale) {
      let textArray = []
      let ocrData = this.ocrResult
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
            char: charObj.char
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
          html += '<span class="ocr-word" style="width: ' + textObj.width + 'px;height: ' + textObj.height + 'px;left: ' + textObj.left + 'px;top: ' + textObj.top + 'px;font-size: ' + textObj.fontSize + 'px;color: ' + this.ocrConfig.color + '"> ' + textObj.char + ' </span>'
        }
        html += '</div>'
      }
      $('.ocr-lines').empty().append(html)
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
