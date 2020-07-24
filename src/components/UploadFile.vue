<template>
  <div class="upload-file">
    <div class="upload-file-title">
      文件上传转换
    </div>
    <el-upload
      v-if="transStates === '1'"
      class="upload-input"
      drag
      :action="filePath"
      :data="fileInfo"
      :on-success="uploadSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">若转换异常请刷新重试</div>
    </el-upload>
    <div class="loading" v-else-if="transStates === '2'">
      <i class="loading-gif"></i>
      <div class="loading-info">
        正在转换
      </div>
    </div>
    <div class="load-finished" v-else>
      <i class="loaded-gif"></i>
      <div class="loaded-info">
        转换完成
      </div>
    </div>
    <div v-if="fileInfo.convertType === 'pdf2img' && uploadFileFinished">
      输入希望转换的图片分辨率(10-600)
      <el-input-number
        v-model="resolutionValue"
        :step="20"
        size="small">
      </el-input-number>
    </div>
    <div v-if="uploadFileFinished">
      <el-button @click="convertFile()" :disabled="transStates === '2'">开始转换</el-button>
    </div>
    <div v-if="downloadFileFinished">
      <el-button @click="downloadFile()">开始下载</el-button>
    </div>
  </div>
</template>

<script>
import CONFIG from '@/api/config.js'
import API from '@/api/api.js'
export default {
  name: 'UploadFile',
  mounted () {
    console.log('gsd', this.$route.query.type)
    this.fileInfo.convertType = this.$route.query.type
    this.fileInfo.uuid = this.genUuid()
  },
  data () {
    return {
      filePath: CONFIG.UPLOAD_FILE,
      uploadFileFinished: false,
      downloadFileFinished: false,
      transStates: '1', // 1：未转换 2：转换中 3：转换完成
      fileInfo: {
        uuid: '', // 标识本次上传的信息
        convertType: '' // 转换类型
      },
      percent: 0,
      resolutionValue: 100
    }
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      if (response.status === 1) {
        this.uploadFileFinished = true
      }
    },
    genUuid () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      this.uuidA = s.join('')
      return this.uuidA
    },
    async convertFile () {
      this.transStates = '2'
      this.percent = '0'
      if (this.fileInfo.uuid) {
        let params = {
          uuid: this.fileInfo.uuid
        }
        let convertRes
        if (this.fileInfo.convertType === 'pdf2img') {
          params['resolutionValue'] = this.resolutionValue + ''
          convertRes = await API.pdfToImg(params)
        } else if (this.fileInfo.convertType === 'img2pdf') {
        } else if (this.fileInfo.convertType === 'txt2pdf') {
          params['fileType'] = 'pdf'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'excel2pdf') {
          params['fileType'] = 'pdf'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'word2html') {
          params['fileType'] = 'html'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'excel2html') {
          params['fileType'] = 'html'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'html2word') {
          params['fileType'] = 'doc'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'html2pdf') {
          params['fileType'] = 'pdf'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'pdf2word') {
          params['fileType'] = 'docx'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'img2txt') {
          params['fileType'] = 'txt'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'removePage') {
          params['fileType'] = 'pdf'
          convertRes = await API.convertFile(params)
        }
        if (convertRes.data.status === 1) {
          if (convertRes.data.body !== '') {
            this.uploadFileFinished = false
            this.downloadFileFinished = true
            this.transStates = '3'
            this.$message.success('转换文件成功，总耗时：' + convertRes.data.body + '（s）')
          } else {
            this.$message.error('转换文件异常')
          }
        } else {
          this.$message.error('转换文件异常')
        }
      }
    },
    downloadFile () {
      let url = CONFIG.DOWNLOAD_FILE + '?uuid=' + this.fileInfo.uuid
      window.open(url)
      this.uploadFileFinished = false
      this.downloadFileFinished = false
      this.transStates = '1'
      this.fileInfo.uuid = this.genUuid()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .upload-file {
    text-align: center;
    .upload-file-title {
      font-size: 20px;
    }
    .upload-input {
      margin: 20px;
    }
    .loading {
      margin: 20px;
      text-align: center;
      .loading-gif {
        width: 80px;
        height: 80px;
        display: inline-block;
        background: url("../assets/progress_convert.gif") no-repeat center;
      }
      .loading-info {
        margin-bottom: 20px;
      }
    }
    .load-finished {
      margin: 20px;
      text-align: center;
      .loaded-gif {
        width: 80px;
        height: 80px;
        display: inline-block;
        background: url("../assets/finish.png") no-repeat center;
      }
      .loaded-info {
        margin-bottom: 20px;
      }
    }
  }
</style>
