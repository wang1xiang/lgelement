import WangButton from '../src/button.vue'

export default {
  title: 'WangButton',
  component: WangButton
}

export const Button = _ => ({
  components: { WangButton },
  template: `
    <div>
      <wang-button></wang-button>
    </div>
  `
})