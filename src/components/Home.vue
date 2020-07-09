<template>
  <div>
    <div class="home-title">在线转换工具</div>
    <div class="home-content">
      <el-row>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('pdf2img')">
            <div class="home-item-img pdf2img"></div>
            <div class="home-item-title">pdf转图片</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item">
            <div class="home-item-img pdf2word"></div>
            <div class="home-item-title">pdf转word</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item">
            <div class="home-item-img word2pdf" @click="uploadFile('word2pdf')"></div>
            <div class="home-item-title">word转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item">
            <div class="home-item-img img2pdf" @click="uploadFile('img2pdf')"></div>
            <div class="home-item-title">图片转pdf</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item" @click="uploadFile('pdfCompress')">
            <div class="home-item-img pdfCompress"></div>
            <div class="home-item-title">pdf压缩</div>
          </div>
        </el-col>
        <el-col :span="4" :xs="8">
          <div class="home-item">
            <div class="home-item-img pdfMerge"></div>
            <div class="home-item-title">pdf合并</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :xs="8">
          <div class="home-item">
            <div class="home-item-img word2pdf" @click="uploadFile('txt2pdf')"></div>
            <div class="home-item-title">txt转pdf</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
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
        width: 80px;
        height: 80px;
        display: inline-block;
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
      .pdfCompress {
        background: url("../assets/pdfCompress.svg") no-repeat center;
      }
      .pdfMerge {
        background: url("../assets/pdfMerge.svg") no-repeat center;
      }
      .home-item-title {
        width: 100%;
        display: inline-block;
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
