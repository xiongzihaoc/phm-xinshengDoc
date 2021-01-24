import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 应用初始状态
const state = {
  options: [{
    name: "区域列表",
    route: "/areaList",
    // isLevel: false,
  }],
  tabs : [
    {
      name:'/areaList'
    },
    {
      name:'/Organization'
    },
    {
      name:'/Combo'
    },
    {
      name:'/User'
    },
    {
      name:'/Team'
    },
    {
      name:'/Report'
    },
    {
      name:'/Warning'
    },
    {
      name:'/Statistics'
    },
    // {
    //   name:'/changePass'
    // }
  ],
  activeIndex: '/areaList'
}

// 定义所需的 mutations
const mutations = {
  // 添加tabs
  add_tabs(state, data) {
    console.log(data);
    for (let index = 0; index < this.state.tabs.length; index++) {
      const element = this.state.tabs[index].name;
      // console.log(element);
      if(data.route == element){
        this.state.options.push(data);
        return;
      }
    }
  },
  // 删除tabs
  delete_tabs(state, route) {
    let index = 0;
    for (let option of state.options) {
      if (option.route === route) {
        break;
      }
      index++;
    }
    this.state.options.splice(index, 1);
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    for (let i = 0; i < this.state.tabs.length; i++) {
      const element = this.state.tabs[i].name;
      if(index == element){
        this.state.activeIndex = index
        return;
      }
    }
  }
}

// 创建 store 实例
export default new Vuex.Store({
  state,
  mutations
})