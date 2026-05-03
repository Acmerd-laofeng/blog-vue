import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置进度条
NProgress.configure({ 
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
  minimum: 0.1
})

export default NProgress
