import http from '../utils/http'
import CONFIG from './config'

export default{
  convertFile (params) {
    return http.post(`${CONFIG.CONVERT_FILE}`, params)
  },
  pdfToImg (params) {
    return http.post(`${CONFIG.PDF_IMG}`, params)
  },
  proposeApi (params) {
    return http.post(`${CONFIG.PROPOSE}`, params)
  },
  postFormAPI (params) {
    return http.post(`${CONFIG.LOGIN}`, params)
  }
}
