import WangInput from '../'

export default {
  title: 'WangInput',
  component: WangInput
}

export const Text = () => ({
  components: { WangInput },
  template: `
    <div>
      <wang-input v-model="value"></wang-input>
    </div>
  `,
  data() {
    return {
      value: 'admin',
    }
  },
})
export const Password = () => ({
  components: { WangInput },
  template: `
    <div>
      <wang-input type="password" v-model="value"></wang-input>
    </div>
  `,
  data() {
    return {
      value: 'admin',
    }
  },
})