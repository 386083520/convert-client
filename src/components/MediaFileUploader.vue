<template>
  <div class="file-upload-wrp">
     <div class="ready-upload" id="file-upload">
       <svg class="upload-img" aria-hidden="true">
         <use xlink:href="#icon-shangchuan"></use>
       </svg>
       <p>将文件拖到此处或<span id="upload-btn" class="upload-btn">点击上传</span></p>
       <marquee scrollamount="2"><div class="upload-tip">{{convertTips}}</div></marquee>
     </div>
    <div class="upload-progress" id="fileList">
    </div>
  </div>
</template>

<script>
import WebUploader from 'webuploader'
import $ from 'jquery'
export default {
  name: 'MediaFileUploader',
  props: {
    fileUploadParams: {
      type: Object
    },
    uuid: '',
    convertTips: ''
  },
  mounted () {
    this.$nextTick(() => {
      this.initWebUpload()
    })
  },
  data () {
    return {
      uploader: null,
      currentChunk: null,
      currentFile: {
        id: ''
      },
      percentage: 0
    }
  },
  methods: {
    initWebUpload () {
      let self = this
      let $list = $('#fileList')
      this.uploader = WebUploader.create({
        auto: true,
        chunked: true,
        chunkSize: 1024 * 1024 * 5,
        server: self.fileUploadParams.uploadUrl,
        swf: 'static/plugins/Uploader.swf',
        pick: {
          id: '#upload-btn',
          multiple: true
        },
        dnd: '#file-upload',
        disableGlobalDnd: true,
        method: 'POST',
        threads: 5,
        accept: self.fileUploadParams.accept,
        fileNumLimit: 5,
        fileSizeLimit: 1024 * 1024 * 1024,
        fileSingleSizeLimit: 1024 * 1024 * 1024,
        fileVal: 'file',
        compress: false,
        formData: {
          uuid: this.uuid
        }
      })
      self.uploader.on('uploadBeforeSend', function (obj, data, headers) {
        $.extend(headers, {
          Accept: '*/*'
        })
        self.currentChunk = data
      })
      self.uploader.on('beforeFileQueued', function (file) {
        let filesTargets = $('.media-detail')
        let isDuplicate = false
        if (filesTargets.length) {
          filesTargets.each(function () {
            if (file.name === $(this)[0].dataset.name) {
              isDuplicate = true
              self.$message.warning('存在重复的文件')
            }
          })
        }
        return !isDuplicate
      })
      self.uploader.on('fileQueued', function (file) {
        self.currentFile = file
        $list.append(
          '<div id="' + file.id + '" class="progress-item">' +
          '<div class="media-detail" data-name="' + file.name + '">' +
          '<i>' + file.name + '</i>' +
          '<span class="process-percentage"></span>' +
          '</div>' +
          '</div>'
        )
      })
      self.uploader.on('uploadStart', (file) => {
        let $li = $('#' + file.id)
        self.uploader.option('formData', {
          guid: WebUploader.guid()
        })
        $li.find('.media-detail .process-percentage').text('等待上传')
      })
      self.uploader.on('error', function (type) {
      })
      self.uploader.on('uploadProgress', function (file, percentage) {
        self.percentage = parseInt(percentage * 100)
        let $li = $('#' + file.id)
        let $percent = $li.addClass('bar-progress-item').find('.progress .progress-bar')
        if (!$percent.length) {
          $percent = $(
            '<div class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            '</div>' +
            '</div>'
          ).appendTo($li).find('.progress-bar')
        }
        if (self.percentage !== 100) {
          $li.find('.media-detail .process-percentage').text(self.percentage + '%')
        } else {
          $li.find('.media-detail .process-percentage').text('').addClass('merge-loading')
        }
        $percent.css('width', percentage * 100 + '%')
      })
      self.uploader.on('uploadError', function (file, reason) {
        self.$emit('uploadError', file, reason, self.uploader)
      })
      self.uploader.on('uploadSuccess', function (file, response) {
        self.$emit('uploadSuccess', file, self.currentChunk, response, self.uploader)
      })
      self.uploader.on('uploadComplete', function (file) {
        self.$emit('uploadComplete', file, self.uploader)
      })
      self.uploader.on('uploadFinished', function () {
        self.initWebUpload()
        self.$emit('uploadFinished', self.uploader)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss">

  .file-upload-wrp {
    font-size: 14px;
    width: 60%;
    border: 1px dashed #c0ccda;
    padding: 30px;
    .ready-upload {
      .upload-img {
        width: 60px;
        height: 80px;
      }
      .upload-btn {
        height: 32px;
        cursor: pointer;
        line-height: 32px;
        color: #66b1ff;
      }
      .upload-tip {
        height: 42px;
        line-height: 42px;
      }
    }
    .upload-progress {
      max-height: 200px;
      overflow-y: scroll;
      .progress-item {
        height: 40px;
        .media-detail {
          height: 30px;
          line-height: 30px;
          text-indent: 24px;
          background: url("../assets/file.png") no-repeat center left;
          i {
            width: calc(100% - 80px);
            float: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          span {
            float: right;
            background-size: contain;
            min-width: 16px;
            height: 16px;
          }
          .process-percentage {
            font-size: 12px;
            margin-right: 8px;
          }
          .success.process-percentage {
            background: url("../assets/downfinish.png") no-repeat;
            margin-top: 6px;
          }
          .merge-loading.process-percentage {
            background: url("../assets/loading2.gif") no-repeat;
            margin-top: 6px;
            background-size: contain;
          }
        }
      }
      .progress-bar {
        background: #66b1ff;
        height: 2px;
      }
      .bar-progress-item {
        width: 100%;
      }
      .progress-striped {
        width: 100%;
        height: 2px;
        background-color: #f2f2f2;
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  .upload-btn.webuploader-container{
    .webuploader-element-invisible{
      display: none;
    }
  }
</style>
