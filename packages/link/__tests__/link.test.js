import { mount } from '@vue/test-utils'
import link from '../src/link.vue'

describe('Wang-Link', () => {
  test('link-disabled-underlined', () => {
    // 挂载组件 只是内存中的挂载 返回一个包裹器
    const wrapper = mount(link, {
      propsData: {
        disabled: true,
      },
    })
    expect(wrapper.html()).toContain('class="disabled underlined"')
  })
  test('link-disabled', () => {
    const wrapper = mount(link, {
      propsData: {
        disabled: true,
        underlined: true,
      },
    })
    expect(wrapper.html()).toContain('class="disabled"')
  })
  test('link-a', () => {
    const wrapper = mount(link, {
      propsData: {
        href: 'www.baidu.com',
      },
    })
    expect(wrapper.props('href')).toBe('www.baidu.com')
  })
  test('link-snapshot', () => {
    const wrapper = mount(link, {
      propsData: {
        href: 'www.baidu.com',
        disabled: true,
      },
    })
    // 快照 第一次运行会将wrapper.vm.$el的内容存储在./__snapshots__/link.test.js.snap中
    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
