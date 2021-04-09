import WangButton from './src/button.vue'

WangButton.install = Vue => {
  Vue.component(WangButton.name, WangButton)
}

export default WangButton
