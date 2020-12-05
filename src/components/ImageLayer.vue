<template>
  <div class="content-wrapper">
    <ocr-paper :imageRes="imageRes"></ocr-paper>
  </div>

</template>

<script>
import API from '@/api/api.js'
import OcrPaper from './OcrPaper'
export default {
  name: 'ImageLayer',
  components: {
    OcrPaper
  },
  mounted () {
    this.uuid = this.$route.params.uuid
    this.getTheImageUrl()
  },
  data () {
    return {
      uuid: '',
      imageRes: {}
    }
  },
  methods: {
    async getTheImageUrl () {
      let params = {
        'uuid': this.uuid
      }
      let proposeRes = await API.getImageUrl(params)
      if (proposeRes.data.status === 1) {
        this.imageRes = proposeRes.data.body
      }
    }
  }
}
</script>

<style scoped lang="scss" type="text/scss">
  .content-wrapper {
    width: 100%;
    height: 100%;
    background: #c0c4cc;
  }
</style>
