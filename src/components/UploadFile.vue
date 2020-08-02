<template>
  <div class="upload-file">
    <div class="upload-file-title">
      {{convertName}}
    </div>
    <media-file-uploader
      v-if="transStates === '1' && fileInfo.uuid"
      style="margin: 0 auto"
      :fileUploadParams="fileUploadParams"
      :uuid="fileInfo.uuid"
      @uploadSuccess="uploadChunkSuccess">
    </media-file-uploader>
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
    <div style="width: 60%;margin: 0 auto">
      <el-input
        style="margin-top: 160px"
        type="textarea"
        :rows="6"
        placeholder="在使用过程中遇到问题，希望拥有的转换功能，或其他好的改善建议都可在此留言"
        v-model="problemText">
      </el-input>
      <div style="text-align: right;margin-top: 10px">
        <el-button @click="submitPropose">提交</el-button>
      </div>
    </div>
    <div style="margin-top: 20px">作者：上官墨涵 386083520@qq.com</div>
  </div>
</template>

<script>
import MediaFileUploader from './MediaFileUploader'
import CONFIG from '@/api/config.js'
import API from '@/api/api.js'
import $ from 'jquery'
export default {
  name: 'UploadFile',
  components: {
    MediaFileUploader
  },
  mounted () {
    console.log('gsd', this.$route.query.type)
    let getConvertType = this.$route.query.type
    this.fileInfo.convertType = getConvertType
    this.fileInfo.uuid = this.genUuid()
    if (getConvertType === 'pdf2img') {
      this.convertName = 'pdf转图片'
      this.convertTips = '只能上传单份pdf'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'img2pdf') {
      this.convertName = '图片转pdf'
      this.convertTips = '将上传的多张图片转化为pdf，可同时上传多张图片'
      this.allowMultiple = true
      this.limitFile = 100
    }
    if (getConvertType === 'excel2pdf') {
      this.convertName = 'excel转pdf'
      this.convertTips = '只能上传单份excel文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'word2html') {
      this.convertName = 'word转html'
      this.convertTips = '只能上传单份word文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'excel2html') {
      this.convertName = 'excel转html'
      this.convertTips = '只能上传单份excel文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'txt2pdf') {
      this.convertName = 'txt转pdf'
      this.convertTips = '只能上传单份txt文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'html2word') {
      this.convertName = 'html转word'
      this.convertTips = '只能上传单份html文件,只适用于文本类型的html转换'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'html2pdf') {
      this.convertName = 'html转pdf'
      this.convertTips = '只能上传单份html文件,只适用于文本类型的html转换'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'pdf2word') {
      this.convertName = 'pdf转word'
      this.convertTips = '只能上传单份pdf文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'img2txt') {
      this.convertName = 'img转txt'
      this.convertTips = '只能上传单份图片文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'pdf2word') {
      this.convertName = 'pdf转word'
      this.convertTips = '只能上传单份pdf文件，大文件的转换时间较长，请耐心等待'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'removePage') {
      this.convertName = 'pdf去除指定页'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'word2pdf') {
      this.convertName = 'word转pdf'
      this.convertTips = '只能上传单份word文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
    if (getConvertType === 'pdfCompress') {
      this.convertName = 'pdf压缩'
      this.convertTips = '只能上传单份pdf文件'
      this.allowMultiple = false
      this.limitFile = 1
    }
  },
  data () {
    return {
      fileUploadParams: {
        uploadUrl: CONFIG.CHUNK_UPLOAD_FILE,
        chunked: true,
        accept: {
          title: 'Files',
          extensions: '*',
          mimeTypes: '*'
        }
      },
      filePath: CONFIG.UPLOAD_FILE,
      uploadFileFinished: false,
      downloadFileFinished: false,
      transStates: '1', // 1：未转换 2：转换中 3：转换完成
      fileInfo: {
        uuid: '', // 标识本次上传的信息
        convertType: '' // 转换类型
      },
      percent: 0,
      resolutionValue: 100,
      convertName: '文件上传转换',
      convertTips: '',
      allowMultiple: false,
      limitFile: 1,
      problemText: ''
    }
  },
  methods: {
    uploadChunkSuccess (file, ccurrentChunk, response, uploader) {
      this.mergeChunks(file)
    },
    async mergeChunks (file) {
      let params = {
        'uuid': this.fileInfo.uuid,
        'fileName': file.name,
        'convertType': this.fileInfo.convertType
      }
      let proposeRes = await API.mergeFile(params)
      if (proposeRes.data.status === 1) {
        $('#' + file.id).find('.media-detail .process-percentage').text('').removeClass('merge-loading').addClass('success')
        this.uploadFileFinished = true
        this.$message.success('文件合并成功')
      }
    },
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
    async submitPropose () {
      if (this.problemText === '') {
        this.$message.warning('内容不能为空')
        return
      }
      let params = {
        textInfo: this.problemText
      }
      let proposeRes = await API.proposeApi(params)
      if (proposeRes.data.status === 1) {
        this.$message.success('反馈成功')
      }
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
        } else if (this.fileInfo.convertType === 'word2pdf') {
          params['fileType'] = 'pdf'
          convertRes = await API.convertFile(params)
        } else if (this.fileInfo.convertType === 'pdfCompress') {
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
        background: url("../assets/loading.gif") no-repeat center;
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
