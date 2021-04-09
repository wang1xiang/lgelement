import WangFormitem from '../src/formitem.vue'

export default {
  title: 'WangFormitem',
  component: WangFormitem
}

export const Formitem = _ => ({
  components: { WangFormitem },
  template: `
    <div>
      <wang-formitem></wang-formitem>
    </div>
  `
})