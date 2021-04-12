import WangLink from '../src/link.vue'

export default {
  title: 'WangLink',
  component: WangLink,
}

export const Link = () => ({
  components: { WangLink },
  template: `
    <div>
      <wang-link href="https://www.baidu.com">baidu</wang-link>
    </div>
  `,
})
