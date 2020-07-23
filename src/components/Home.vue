<template>
  <div>
    <div class="home-title">在线转换工具</div>
    <div class="home-content">
      <el-row>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('pdf2img')" title="pdf转图片">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanPDF"></use>
            </svg>
            <div class="home-item-title">pdf转图片</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('pdf2word')" title="pdf转word">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-fbpdfzhuanword"></use>
            </svg>
            <div class="home-item-title">pdf转word</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('word2pdf')" title="word转pdf">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-wordzhuanPDF"></use>
            </svg>
            <div class="home-item-title">word转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('img2pdf')" title="图片转pdf">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-pdf"></use>
            </svg>
            <div class="home-item-title">图片转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('pdfCompress')" title="pdf压缩">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-PDFyasuo"></use>
            </svg>
            <div class="home-item-title">pdf压缩</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" title="pdf合并">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-PDFhebing"></use>
            </svg>
            <div class="home-item-title">pdf合并</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('excel2pdf')" title="excel转pdf">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-PDF_"></use>
            </svg>
            <div class="home-item-title">excel转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('txt2pdf')" title="txt转pdf">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-pdf"></use>
            </svg>
            <div class="home-item-title">txt转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('word2html')" title="word转html">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-html"></use>
            </svg>
            <div class="home-item-title">word转html</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('excel2html')" title="excel转html">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-HTML"></use>
            </svg>
            <div class="home-item-title">excel转html</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('html2word')" title="html转word">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-word"></use>
            </svg>
            <div class="home-item-title">html转word</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('html2pdf')" title="html转pdf">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-pdf1"></use>
            </svg>
            <div class="home-item-title">html转pdf</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('img2txt')" title="图片转文本">
            <svg class="home-item-img icon" aria-hidden="true">
              <use xlink:href="#icon-wenben"></use>
            </svg>
            <div class="home-item-title">图片转文本</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import '../assets/icon/iconfont'
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods: {
    uploadFile (type) {
      this.$router.push({path: '/uploadFile', query: {type: type}})
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .home-title {
    text-align: center;
    font-size: 20px;
  }
  .home-content {
    position: relative;
    margin-left: 30px;
    margin-right: 30px;
    .home-item {
      margin: 10px;
      padding: 20px;
      text-align: center;
      border: 1px solid #ccc;
      .home-item-img {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-bottom: 15px;
      }
      .pdf2img {
        background: url("../assets/pdf2img.svg") no-repeat center;
      }
      .pdf2word {
        background: url("../assets/pdf2word.svg") no-repeat center;
      }
      .word2pdf {
        background: url("../assets/word2pdf.svg") no-repeat center;
      }
      .img2pdf {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .txt2pdf {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .word2html {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .excel2html {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .html2word {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .html2pdf {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .excel2pdf {
        background: url("../assets/img2pdf.svg") no-repeat center;
      }
      .pdfCompress {
        background: url("../assets/pdfCompress.svg") no-repeat center;
      }
      .pdfMerge {
        background: url("../assets/pdfMerge.svg") no-repeat center;
      }
      .img2txt {
        background: url("../assets/pdfMerge.svg") no-repeat center;
      }
      .home-item-title {
        width: 100%;
        display: inline-block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .home-item:hover
    {
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      color: #2b78e4;
      background-color: #2b78e430;;
    }
  }
</style>
