<template>
  <div class="upload-file">
    <div class="upload-file-title">
      文件上传转换
    </div>
    <el-upload
      class="upload-input"
      drag
      :action="filePath"
      :on-success="uploadSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div v-if="uploadFilePath">
      <el-button @click="convertFile()">开始转换</el-button>
    </div>
    <div v-if="downloadFilePath">
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
  },
  data () {
    return {
      filePath: CONFIG.UPLOAD_FILE,
      uploadFilePath: '',
      downloadFilePath: ''
    }
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      if (response.status === 1) {
        this.uploadFilePath = response.body
      }
    },
    async convertFile () {
      if (this.uploadFilePath) {
        let params = {
          filePath: this.uploadFilePath,
          convertType: this.$route.query.type
        }
        let convertRes = await API.convertFile(params)
        console.log('gsd2', convertRes)
        if (convertRes.data.status === 1) {
          this.uploadFilePath = ''
          this.downloadFilePath = convertRes.data.body
        }
        console.log('gsd', convertRes)
      }
    },
    downloadFile () {
      let url = CONFIG.DOWNLOAD_FILE + '?filePath=' + this.downloadFilePath
      window.open(url)
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
  }
</style>
