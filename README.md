#### 处理组件边界情况

[官方网站](https://cn.vuejs.org/v2/guide/components-edge-cases.html)

- 访问根实例`$root`

  小型应用中可以在 vue 根实例里存储共享数据，组件中可以通过 `$root` 访问根实例，不过这个模式扩展到中大型应用来说就不然了

  ```html
  <!-- 01-root.vue -->
  <div>
      <!--
      小型应用中可以在 vue 根实例里存储共享数据
      组件中可以通过 $root 访问根实例
      -->
      $root.title：{{ $root.title }}
      <br>
      <button @click="$root.handle">获取 title</button>&nbsp;&nbsp;
      <button @click="$root.title = 'Hello $root'">改变 title</button>
  </div>
  ```

  ```js
  // main.js
  new Vue({
    render: (h) => h(App),
    data: {
      title: '根实例 - Root',
    },
    methods: {
      handle () {
        console.log(this.title)
      }
    }
  }).$mount('#app')
  ```

- 访问父组件实例

  和 `$root` 类似，`$parent` 可以用来从一个子组件访问父组件的实例，触达父级组件会使得你的应用更难调试和理解

  ```vue
  <!-- parent.vue -->
  <script>
  export default {
    data () {
      return {
        title: '获取父组件实例'
      }
    },
    methods: {
      handle () {
        console.log(this.title)
      }
    }
  }
  </script>
  <!-- child.vue -->
  <template>
    <div class="child">
      child<br>
      $parent.title：{{ $parent.title }}<br>
      <button @click="$parent.handle">获取 $parent.title</button>
      <button @click="$parent.title = 'Hello $parent.title'">改变 $parent.title</button>
    
      <grandson></grandson>
    </div>
  </template>
  <!-- grandson.vue -->
  <template>
    <div class="grandson">
      grandson<br>
      $parent.$parent.title：{{ $parent.$parent.title }}<br>
      <button @click="$parent.$parent.handle">获取 $parent.$parent.title</button>
      <button @click="$parent.$parent.title = 'Hello $parent.$parent.title'">改变 $parent.$parent.title</button>
    </div>
  </template>
  ```

  在更底层组件中，可以使用`$parent.$parent`获取更高级组件实例

- 访问子组件实例或子元素

  可以通过使用`ref`为子组件赋予一个ID，可以在JavaScript中直接访问子组件或元素

  - 通过`ref`获取子组件

    ```vue
    <template>
      <div>
        <myinput ref="mytxt"></myinput>
        <button @click="focus">获取焦点</button>
      </div>
    </template>
    
    <script>
    import myinput from './02-myinput'
    export default {
      components: {
        myinput
      },
      methods: {
        focus () {
          this.$refs.mytxt.focus()
        }
      }
    }
    </script>
    ```

  - 通过`ref`获取DOM元素

    ```vue
    <template>
      <div>
        <input v-model="value" type="text" ref="txt">
      </div>
    </template>
    
    <script>
    export default {
      data () {
        return {
          value: 'default'
        }
      },
      methods: {
        focus () {
          this.$refs.txt.focus()
        }
      }
    }
    </script>
    ```

- 依赖注入`provide&inject`

  使用 `$parent` 无法很好的扩展到更深层级的嵌套组件上，所以就需要使用依赖注入：`provide` 和 `inject`。

  `provide` 选项允许我们指定我们想要提供给后代组件的数据/方法

  ```vue
  <!-- parent.vue -->
  <template>
    ...
  </template>
  
  <script>
  export default {
    provide () {
      return {
        title: this.title,
        handle: this.handle
      }
    },
    data () {
      return {
        title: '父组件 provide'
      }
    },
    methods: {
      handle () {
        console.log(this.title)
      }
    }
  }
  </script>
  ```

  然后再任何后代组件里，可以使用 `inject` 选项来接收指定 property

  ```js
  inject: ['title', 'handle']
  ```

- [$attrs/$listeners](https://cn.vuejs.org/v2/api/#vm-attrs)

  `$attrs`：把父组件中非prop属性绑定到内部组件

  `$listeners`：把父组件中的DOM对象的原生事件绑定到内部组件

  如果不希望组件的根元素继承 attribute，在组件的选项中设置 `inheritAttrs: false`

  ```vue
  <!-- parent.vue -->
  <template>
    <div>
      <myinput
        required
        placeholder="Enter your username"
        class="theme-dark"
        @focus="onFocus"
        @input="onInput"
        data-test="test">
      </myinput>
      <button @click="handle">按钮</button>
    </div>
  </template>
  <script>
  import myinput from './02-myinput'
  export default {
    components: {
      myinput
    },
    methods: {
      handle () {
        console.log(this.value)
      },
      onFocus (e) {
        console.log(e)
      },
      onInput (e) {
        console.log(e.target.value)
      }
    }
  }
  </script>
  <!-- child.vue -->
  <template>
    <!--
      1. 从父组件传给自定义子组件的属性，如果没有 prop 接收
         会自动设置到子组件内部的最外层标签上
         如果是 class 和 style 的话，会合并最外层标签的 class 和 style 
    -->
    <!-- <input type="text" class="form-control" :placeholder="placeholder"> -->
  
    <!--
      2. 如果子组件中不想继承父组件传入的非 prop 属性，可以使用 inheritAttrs 禁用继承
         然后通过 v-bind="$attrs" 把外部传入的非 prop 属性设置给希望的标签上
  
         但是这不会改变 class 和 style
    -->
    <!-- <div>
      <input type="text" v-bind="$attrs" class="form-control">
    </div> -->
  
  
    <!--
      3. 注册事件
    -->
  
    <!-- <div>
      <input
        type="text"
        v-bind="$attrs"
        class="form-control"
        @focus="$emit('focus', $event)"
        @input="$emit('input', $event)"
      >
    </div> -->
  
  
    <!--
      4. $listeners 父组件传过来原生的dom事件
    -->
  
    <div>
      <input
        type="text"
        v-bind="$attrs"
        class="form-control"
        v-on="$listeners"
      >
    </div>
  </template>
  
  <script>
  export default {
    // props: ['placeholder', 'style', 'class']
    // props: ['placeholder']
    inheritAttrs: false
  }
  </script>
  ```

#### 快速原型开发

VueCli提供一个插件可以进行[原型快速开发](https://cli.vuejs.org/zh/guide/prototyping.html)

- 安装

  ```bash
  npm install -g @vue/cli-service-global
  ```

- 使用 `vue serve`

  ```text
  在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器
  
  Options:
  
    -o, --open  打开浏览器
    -c, --copy  将本地 URL 复制到剪切板
    -h, --help  输出用法信息
  ```

- 创建App.vue文件

  ```vue
  <template>
    <h1>Hello!</h1>
  </template>
  ```

- 运行

  ```bash
  vue serve
  ```

  vue serve会在当前目录自动推导入口文件——入口可以是 `main.js`、`index.js`、`App.vue` 或 `app.vue` 中的一个

  可以显式地指定入口文件：

  ```bash
  vue serve MyComponent.vue
  ```

##### 安装ElementUI

- 创建文件，初始化package.json

  ```bash
  mkdir custom-component
  cd custom-component
  yarn init -y
  ```

- 安装ElementUI

  ```bash
  vue add element
  ```

- 创建main.js，加载ElementUI，使用Vue.use()安装插件

  ```js
  import Vue from 'vue'
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  import Login from './src/Login.vue'
  
  Vue.use(ElementUI)
  
  new Vue({
    el: '#app',
    render: h => h(Login)
  })
  ```

- 创建src/Login.vue，并使用vue serve运行

  ```vue
  <template>
    <el-form class="form" ref="form" :model="user" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登 录</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 6,
              max: 12,
              message: '请输入6-12位密码',
            },
          ],
        },
      }
    },
    methods: {
      login() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            alert('验证成功')
          } else {
            alert('验证失败')
            return false
          }
        })
      },
    },
  }
  </script>
  
  <style>
  .form {
    width: 30%;
    margin: 150px auto;
  }
  </style>
  ```

##### 组件开发

##### 步骤条组件

- 创建Steps.vue

  ```vue
  <template>
    <div class="lg-steps">
      <div class="lg-steps-line"></div>
      <div
        class="lg-step"
        v-for="index in count"
        :key="index"
        :style="{ color: active >= index ? activeColor : defaultColor }"
      >
        {{ index }}
      </div>
    </div>
  </template>
  
  <script>
  import './steps.css'
  export default {
    name: 'LgSteps',
    props: {
      count: {
        type: Number,
        default: 3,
      },
      active: {
        type: Number,
        default: 0,
      },
      activeColor: {
        type: String,
        default: 'red',
      },
      defaultColor: {
        type: String,
        default: 'green',
      },
    },
  }
  </script>
  <style></style>
  ```

  使用`vue serve ./Steps.vue`运行，打开页面访问此组件

- 创建Steps-test.vue组件，进行测试

  ```vue
  <template>
    <div>
      <steps :count="count" :active="active"></steps>
      <button @click="next">下一步</button>
    </div>
  </template>
  
  <script>
  import Steps from './Steps.vue'
  export default {
    components: {
      Steps,
    },
    data() {
      return {
        count: 4,
        active: 0,
      }
    },
    methods: {
      next() {
        if (this.active < this.count) {
          this.active++
        }
      },
    },
  }
  </script>
  <style></style>
  ```

##### 表单组件

- 模仿Element的Form组件，在src下创建form文件夹

- 创建Form.vue、FormItem.vue、Input.vue以及Button.vue组件

  ```vue
  <!-- Form.vue -->
  <template>
    <form>
      <slot></slot>
    </form>
  </template>
  
  <script>
  export default {
    name: 'wangForm',
    props: {
      model: {
        type: Object
      },
      rules: {
        type: Object
      }
    }
  }
  
  </script>
  <style>
  </style>
  <!-- FormItem.vue -->
  <template>
    <div>
      <label>{{ label }}</label>
      <div>
        <slot></slot>
        <p v-if="errMessage">{{ errMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'wangFormItem',
    props: {
      label: {
        type: String
      },
      prop: {
        type: String
      }
    },
    data () {
      return {
        errMessage: ''
      }
    }
  }
  </script>
  
  <style>
  </style>
  <!-- Input.vue -->
  <template>
    <div>
      <input v-bind="$attrs" :type="type" :value="value" @input="handleInput">
    </div>
  </template>
  
  <script>
  export default {
    name: 'wangInput',
    // 禁用父组件默认属性
    inheritAttrs: false,
    props: {
      value: {
        type: String
      },
      type: {
        type: String,
        default: 'text'
      }
    },
    methods: {
      handleInput (evt) {
        this.$emit('input', evt.target.value)
      }
    }
  }
  </script>
  <style>
  </style>
  <!-- Button.vue -->
  <template>
    <div>
      <button @click="handleClick"><slot></slot></button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'wangButton',
    methods: {
      handleClick (evt) {
        this.$emit('click', evt)
        evt.preventDefault()
      }
    }
  }
  </script>
  <style></style>
  ```

- 创建Form-test.vue测试组件

  ```vue
  <template>
    <wang-form class="form" ref="form" :model="user" :rules="rules">
      <wang-form-item label="用户名" prop="username">
        <!-- <wang-input v-model="user.username"></wang-input> -->
        <wang-input :value="user.username" @input="user.username=$event" placeholder="请输入用户名"></wang-input>
      </wang-form-item>
      <wang-form-item label="密码" prop="password">
        <wang-input type="password" v-model="user.password"></wang-input>
      </wang-form-item>
      <wang-form-item>
        <wang-button type="primary" @click="login">登 录</wang-button>
      </wang-form-item>
    </wang-form>
  </template>
  
  <script>
  import WangForm from './form/Form'
  import WangFormItem from './form/FormItem'
  import WangInput from './form/Input'
  import WangButton from './form/Button'
  export default {
    components: {
      WangForm,
      WangFormItem,
      WangInput,
      WangButton
    },
    data () {
      return {
        user: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码'
            },
            {
              min: 6,
              max: 12,
              message: '请输入6-12位密码'
            }
          ]
        }
      }
    },
    methods: {
      login () {
        console.log('button')
        // this.$refs.form.validate(valid => {
        //   if (valid) {
        //     alert('验证成功')
        //   } else {
        //     alert('验证失败')
        //     return false
        //   }
        // })
      }
    }
  }
  </script>
  
  <style>
    .form {
      width: 30%;
      margin: 150px auto;
    }
  </style>
  
  ```

  `vue serve ./src/Form-test.vue`运行

- 设置表单验证

  表单验证原则：input组件中触发自定义事件validate、FormItem渲染完毕注册自定义事件validate

  修改Input.vue

  ```vue
  ...
  <script>
  export default {
    ...
    methods: {
      // input组件中触发自定义事件validate
      // FormItem渲染完毕注册自定义事件validate
      handleInput (evt) {
        this.$emit('input', evt.target.value)
        // 找input的父组件
        const findParent = parent => {
          while (parent) {
            if (parent.$options.name === 'LgFormItem') {
              break
            } else {
              parent = parent.$parent
            }
          }
          return parent
        }
        const parent = findParent(this.$parent)
        // 如果找到就触发自定义事件
        if (parent) {
          parent.$emit('validate')
        }
      }
    }
  }
  </script>
  ```

  需要在Fome.vue中将Form组件实例注册依赖

  ```vue
  provide () {
      return {
        form: this
      }
    }
  ```

  修改FormItem.vue，使用[async-validator](https://www.npmjs.com/package/async-validator)进行验证

  ```vue
  ...
  <script>
  import AsyncValidator from 'async-validator'
  export default {
    name: 'WangFormItem',
    inject: ['form'],
    ...
    mounted () {
      this.$on('validate', () => {
        this.validate()
      })
    },
    methods: {
      validate () {
        // 如果没有prop 就不需要验证
        if (!this.prop) return
        const value = this.form.model[this.prop]
        const rules = this.form.rules[this.prop]
  
        const descriptor = { [this.prop]: rules }
        const validator = new AsyncValidator(descriptor)
        return validator.validate({ [this.prop]: value }, errors => {
          if (errors) {
            this.errMessage = errors[0].message
          } else {
            this.errMessage = ''
          }
        })
      }
    }
  }
  </script>
  
  <style>
  </style>
  
  ```

  修改Form.vue，提供validate方法

  ```js
  methods: {
      validate (cb) {
        // 过滤出含有prop验证的节点 执行validate方法 返回promise对象
        const tasks = this.$children
          .filter(child => child.prop)
          .map(child => child.validate())
  
        Promise.all(tasks)
          .then(() => cb(true))
          .catch(() => cb(false))
      }
  }
  ```

- 此时重新运行，开启表单验证

[项目地址](https://github.com/wang1xiang/custom-component/)

#### Monorepo——大型前端项目代码管理方式

两种项目组织方式

- Multirepo(Multiple Repository)：每一个包对应一个项目
- Monorepo(Monolithic Repository)：一个项目仓库中管理多个模块/包

像[Babel](https://github.com/babel/babel)、[create-react-app](https://github.com/facebook/create-react-app)、[react-router](https://github.com/ReactTraining/react-router)等都在使用这种方式，主要目录都早packages目录中、分多个package进行管理：

![image-20210407141542143](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210407141542143.png)

- 优点

  只需要搭建一套脚手架，就能管理（构建、测试、发布）多个package

- 缺陷

  repo体积较大，各个package都是独立的，需要维护各自的dependencies，可能会存在相同依赖，会出现重复安装

#### StoryBook

[StoryBook](https://storybook.js.org/)是一个开源工具，用于独立开发React、Vue和Angular的UI组件。它能有组织和高效地构建UI组件。

- 优点

  - 可视化组件展示平台
  - 在隔离的开发环境中，以交互式的方式展示组件
  - 独立开发组件
  - 适用于React、vue、Angualar等

- 安装

  ```bash
  npm i -g storybook # 全局安装StoryBook
  
  mkdir lgelement # 创建空项目
  
  npx -p @storybook/cli sb init --type vue
  yarn add vue
  yarn add vue-loader vue-template-compiler --dev
  ```

  安装完成，`yarn storybook`即可浏览

- 打包，使用`yarn build-storybook`打包为静态文件

- 使用packages中的组件，修改.storebook/main.js

  ```js
  module.exports = {
    stories: [
      '../packages/**/*.stories.js', // 默认是'../stories/**/*.stories.js',修改为packages下的任意目录
      '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  }
  ```

- 在packages中根据storyBook目录添加input组件

  ![image-20210408084519181](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210408084519181.png)

  这里可以使用plop自动创建，省去手动创建的过程

  安装plop `npm i plop`

  创建plopfile.js文件

  ```js
  module.exports = plop => {
    plop.setGenerator('component', {
      description: 'create a custom component',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'component name',
          default: 'MyComponent'
        }
      ],
      actions: [
        {
          type: 'add',
          path: 'packages/{{name}}/src/{{name}}.vue',
          templateFile: 'plop-template/component/src/component.hbs'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/__tests__/{{name}}.test.js',
          templateFile: 'plop-template/component/__tests__/component.test.hbs'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/stories/{{name}}.stories.js',
          templateFile: 'plop-template/component/stories/component.stories.hbs'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/index.js',
          templateFile: 'plop-template/component/index.hbs'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/LICENSE',
          templateFile: 'plop-template/component/LICENSE'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/package.json',
          templateFile: 'plop-template/component/package.hbs'
        },
        {
          type: 'add',
          path: 'packages/{{name}}/README.md',
          templateFile: 'plop-template/component/README.hbs'
        }
      ]
    })
  }
  ```

  在scripts中配置 `"plop": "plop"`

  以后使用`yarn plop`命令输入添加的组件名称就可以帮助我们自动创建

- 运行项目，打开浏览器，此时可以看到已经添加的组件

  ![image-20210408084948449](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210408084948449.png)

- 将写好的form、formItem、button等依次添加到packages查看

##### yarn workspaces

Workspace 能更好的统一管理有多个项目的仓库，既可在每个项目下使用独立的 package.json 管理依赖，又可便利的享受一条 yarn 命令安装或者升级所有依赖等。更重要的是可以使多个项目共享同一个 `node_modules` 目录，提升开发效率和降低磁盘空间占用。

- 项目依赖

  ![image-20210409082539273](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210409082539273.png)

  如果没有yarn workspaces，需要分别在每个目录下执行yarn install安装各自依赖，产生如下问题：

  1. 相同依赖会多次下载，耗时且占用控件
  2. 没有统一入口进行全部项目的构建

- 开启yarn工作区

  项目根目录的package.json

  ```json
  "private": true,
  "workspaces":[
      "packages/*" // 工作区子目录
  ]
  ```

- 使用

  给工作区根目录安装开发依赖

  `yarn add jest -D -W`

  给指定工作区安装依赖

  `yarn workspacee wang-button add lodash@4`

  给所有工作区安装依赖‘

  `yarn install`

  可以分别给packages中的目录添加不同项目依赖，`wang-form`等都是项目package.json中的name

  ```bash
  yarn workspace wang-form add  lodash@4
  yarn workspace wang-input add  lodash@3
  yarn workspace wang-button add  lodash@4
  ```

  安装完成后，删除各自项目下的`node-modules`，yarn install统一安装，此时可以看到，form和button中的相同的ladash已经被安装到项目根目录下的`node_modules`中，而input中不相同的依赖则安装到当前的项目`node_modeuls`中

  ![image-20210409083809728](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210409083809728.png)

##### Lerna介绍

[Lerna](https://github.com/lerna/lerna) 是一个优化使用 git 和 npm 管理多包存储库的工作流工具，用于管理具有多个包的 JavaScript 项目，可以一键把代码提交到git和npm仓库

- Lerna使用

  全局安装 `yarn global add lerna`

  初始化 `lerna init`

  初始化完成会在项目根目录创建lerna.json文件

  ```json
  {
    "packages": [
      "packages/*"
    ],
    "version": "0.0.0"
  }
  ```

  同时在package.json中添加lerna的开发依赖

  ```json
  "scripts": {
      ...
      "lerna": "lerna publish"
    },
  ```

- 发布，同时发布到github和npm仓库 `lerna publish`

  将当前项目提交到git仓库

  查看当前npm登陆状况 `npm whoami`，执行命令前先切回`npm`官方仓库

  执行`yarn lerna`

  ![image-20210409092913166](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210409092913166.png)

##### 单元测试

在组件开发完成并发布之前，需要对组件进行[单元测试](https://www.liaoxuefeng.com/wiki/897692888725344/953546675792640)，单元测试是使用断言的方式判断实际的输出与预测的输出是否相同，目的是发现可能存在的问题；组件的单元测试是指使用单元测试工具对组件的各种状态及行为进行测试，确保组件发布后在使用过程中不会出现错误。

[Vue组件的单元测试](https://cn.vuejs.org/v2/cookbook/unit-testing-vue-components.html)

- 组件的单元测试有很多好处：
  - 提供描述组件行为的文档
  - 节省手动测试的时间
  - 减少研发新特性时产生的 bug
  - 改进设计
  - 促进重构

- 用 Jest 测试单文件组件

  [官方文档](https://vue-test-utils.vuejs.org/zh/installation/testing-single-file-components-with-jest.html)

  首先需要安装 Jest 和 Vue Test Utils

  ```bash
  yarn add jest @vue/test-utils -D -W
  ```

  然后需要在 `package.json` 中定义一个单元测试的脚本

  ```json
  // package.json
  {
    "scripts": {
      "test": "jest" // 修改test为jest
    }
  }
  ```

  为了告诉 Jest 如何处理 `*.vue` 文件，需要安装和配置 `vue-jest` 预处理器：

  ```
  yarn add vue-jest -D -W
  ```

  创建jext.config.js配置文件

  ```json
  module.exports = {
    "testMatch": ["**/__tests__/**/*.[jt]s?(x)"],
    "moduleFileExtensions": [
      "js",
      "json",
      // 告诉 Jest 处理 `*.vue` 文件
      "vue"
    ],
    "transform": {
      // 用 `vue-jest` 处理 `*.vue` 文件
      ".*\\.(vue)$": "vue-jest",
      // 用 `babel-jest` 处理 js
      ".*\\.(js)$": "babel-jest" 
    }
  }
  ```

  需要安装 `babel-jest`处理es6语法

  ```
  yarn add babel-jest -D -W
  ```

  babel配置文件

  ```js
  // babel.config.js
  module.exports = {
    presets: [
      [
        '@babel/preset-env'
      ]
    ]
  }
  ```

  Babel 的桥接

  ```bash
  yarn add babel-core@bridge -D -W
  ```

- Jest常用API

  [中文文档](https://www.jestjs.cn/docs/using-matchers)

  - 全局函数

    describe(name, fn)  把相关测试组合在一起

    test(name, fn) 测试方法

    expect(value) 断言

  - 匹配器

    toBe(value) 判断值是否相等

    toEqual(obj) 判断对象是否相等

    toContain(value)  判断数组或字符串是否包含

  - 快照

    toMatchSnapshot()

- vue-jest常用API

  [中文文档](https://vue-test-utils.vuejs.org/zh/api/#mount)

  - mount() 创建一个包含被挂载和渲染的Vue组件的Wrapper
  - Wrapper
    - vm wrapper包裹的组件实例
    - props() 返回Vue实例选项中的props对象
    - html() 组件生成的HTML标签
    - find() 通过选择器返回匹配的组件中的DOM元素
    - trigger() 触发DOM原生事件，自定义事件wrapper.vm.$emit()
    - ...

- 创建`packages/input/__tests__/input.test.js`文件

  @vue/test-utils提供API用于挂载组件，Jest不需要导入因为测试文件是被jest加载执行的

  ```js
  import input from '../src/input.vue'
  import { mount } from '@vue/test-utils'
  
  // 创建代码块 将input相关测试都添加到这里
  describe('wang-input', () => {
    test('input-text', () => {
      // 挂载组件 只是内存中的挂载 返回一个包裹器
      const wrapper = mount(input)
      // 测试生成的html中是否包含type=text
      expect(wrapper.html()).toContain('input type="text"')
    })
  })
  
  ```

- 使用`yarn test`测试

  ![image-20210412082210659](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412082210659.png)

- 添加更多测试

  ```js
  ...
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
  ...
  ```

  如果以后生成的快照和第一次生成的不同，会测试失败，如下所示：

  ![image-20210412082559674](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412082559674.png)

  可以通过`yarn test -u`删除旧的快照文件，并重新生成

##### Rollup打包

- 特点

  - Rollup是一个模块打包器
  - Rollup支持Tree-shaking
  - 打包结果比webpack小
  - 开发框架/组件库使用Rollup更合适，如Vue、React等

- 安装

  - Rollup
  - rollup-plugin-terser 对代码进行压缩
  - Rollup-plugin-vue@5.1.9 将单文件组件编译成js代码，最新版本适用于vue3.x，内部需要使用到vue-template-compiler
  - vue-template-compiler

- 设置Rollup配置文件

  ```js
  import { terser } from 'rollup-plugin-terser'
  import vue from 'rollup-plugin-vue'
  
  module.exports = [
    {
      input: 'index.js',
      output: [
        {
          file: 'dist/index.js',
          format: 'es'
        }
      ],
      plugins: [
        vue({
          // Dynamically inject css as a <style> tag
          css: true, 
          // Explicitly convert template to render function
          compileTemplate: true
        }),
        terser()
      ]
    }
  ]
  ```

- 单独打包button组件

  在button组件中添加`rollup.config.js`

  配置`package.json`添加脚本

  ```json
  "build": "rollup -c"
  ```

  使用yarn workspace执行所有包中的命令

  ```bash
  yarn workspace wang-button run build
  ```

  打包完成，可以看到dist中生成的js文件

  ![image-20210412083944432](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412083944432.png)

- 打包所有组件

  需要额外安装的插件

  @rollup/plugin-json 让rollup可以把json文件作为模块加载

  rollup-plugin-postcss 

  @rollup/plugin-node-resolve 打包过程会将依赖的第三方包进行打包

  执行命令

  ```bash
  yarn add @rollup/plugin-json rollup-plugin-postcss @rollup/plugin-node-resolve -D -W
  ```

- 项目根目录创建rollup.config.js

  ```js
  import fs from 'fs'
  import path from 'path'
  import json from '@rollup/plugin-json'
  import vue from 'rollup-plugin-vue'
  import postcss from 'rollup-plugin-postcss'
  import { terser } from 'rollup-plugin-terser'
  import { nodeResolve } from '@rollup/plugin-node-resolve'
  
  const isDev = process.env.NODE_ENV !== 'production'
  
  // 公共插件配置
  const plugins = [
    vue({
      // Dynamically inject css as a <style> tag
      css: true,
      // Explicitly convert template to render function
      compileTemplate: true
    }),
    json(),
    nodeResolve(),
    postcss({
      // 把 css 插入到 style 中
      // inject: true,
      // 把 css 放到和js同一目录
      extract: true
    })
  ]
  
  // 如果不是开发环境，开启压缩
  isDev || plugins.push(terser())
  
  // packages 文件夹路径
  const root = path.resolve(__dirname, 'packages')
  
  module.exports = fs.readdirSync(root)
    // 过滤，只保留文件夹
    .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
    // 为每一个文件夹创建对应的配置
    .map(item => {
      const pkg = require(path.resolve(root, item, 'package.json'))
      return {
        input: path.resolve(root, item, 'index.js'),
        output: [
          {
            exports: 'auto',
            file: path.resolve(root, item, pkg.main),
            format: 'cjs'
          },
          {
            exports: 'auto',
            file: path.join(root, item, pkg.module),
            format: 'es'
          },
        ],
        plugins: plugins
      }
    })
  ```

- 配置package.json添加build命令

- 对每个packages中的package.json设置`main`和`module`，打包的出口，使用包的入口

  ```json
  ...
  "main": "dist/cjs/index.js",
  "module": "dist/es/index.js",
  ...
  ```

- 使用`yarn build`进行打包

  打包完成，可以看到在packages中每个组件都生成了cjs和es模块

  ![image-20210412084909815](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412084909815.png)

- 设置环境变量

  ```bash
  yarn add cross-env -D -W 
  ```

  配置package.json

  ```json
  "build:prod": "cross-env NODE_ENV=production rollup -c",
  "build:dev": "cross-env NODE_ENV=development rollup -c"
  ```

  分别执行不同的打包模式，dev模式下是不会进行代码压缩的

- 清理所有包中的node_modules和dist

  删除node_module直接使用`lerna clean`即可

  ![image-20210412085521460](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412085521460.png)

  删除dist需要使用第三方包rimraf

  安装

  ```bash
  yarn add rimraf -D -W
  ```

  在每个组件的package.json中添加del命令

  ```json
  "del": "rimraf dist"
  ```

  执行`yarn workspaces run del`

##### 发布

使用`yarn plop`新增link组件

- 发布之前需要先添加测试文件，测试组件所有状态和对外公布方法

  ```js
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
  ```

- 运行生成环境打包

- 发布之前检查npm登陆状态

  ```bash
  npm whoami
  ```

- 使用`yarn lerna`进行发布

  发布完成，打开[npm](https://www.npmjs.com/~wang1xiang)

  ![image-20210412094537562](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210412094537562.png)

[项目地址](https://github.com/wang1xiang/lgelement)