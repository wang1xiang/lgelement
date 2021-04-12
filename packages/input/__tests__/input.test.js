import input from '../src/input.vue'
import { mount } from '@vue/test-utils'

// 创建代码块 将input相关测试都添加到这里
describe('wang-input', () => {
  test('input-text', () => {
    // 挂载组件 只是内存中的挂载 返回一个包裹器
    const wrapper = mount(input)
    expect(wrapper.html()).toContain('input type="text"')
  })

  test('input-password', () => {
    const wrapper = mount(input, {
      propsData: {
        type: 'password',
      },
    })
    expect(wrapper.html()).toContain('input type="password"')
  })

  test('input-password', () => {
    const wrapper = mount(input, {
      propsData: {
        type: 'password',
        value: 'admin',
      },
    })
    expect(wrapper.props('value')).toBe('admin')
  })

  // 快照
  test('input-snapshot', () => {
    const wrapper = mount(input, {
      propsData: {
        type: 'password',
        value: 'admin',
      },
    })
    // 快照 第一次运行会将wrapper.vm.$el的内容存储在./__snapshots__/input.test.js.snap中
    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
