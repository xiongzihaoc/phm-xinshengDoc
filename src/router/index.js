import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
console.log(JSON.parse(window.localStorage.getItem('message')));
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    children: [{
        path: '/areaList',
        name: "区域列表",
        component: () => import('@/components/Area/AreaList.vue'),
        meta: {
          title: '区域列表',
        }
      },
      {
        path: '/add',
        name: "新增合作商",
        component: () => import('@/components/Area/add.vue'),
        meta: {
          title: '新增合作商',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/edit',
        name: "修改合作商",
        component: () => import('@/components/Area/edit.vue'),
        meta: {
          title: '修改合作商',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      // 区域修改密码
      {
        path: '/changePass',
        name: "修改密码",
        component: () => import('@/components/Area/changePass.vue'),
        meta: {
          title: '修改密码',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/configuration',
        name: "配置量表",
        component: () => import('@/components/Area/configuration.vue'),
        meta: {
          title: '配置量表',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/sheetComboList',
        name: "配置量表套餐列表",
        component: () => import('@/components/Area/sheetComboList.vue'),
        meta: {
          title: '配置量表套餐列表',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/jumpCounty',
        name: "县/区",
        component: () => import('@/components/Area/jumpCounty.vue'),
        meta: {
          title: '县/区',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/jumpVillage',
        name: "乡镇",
        component: () => import('@/components/Area/jumpVillage.vue'),
        meta: {
          title: '乡镇',
          guidePath: true,
          jumpPath: '/areaList'
        }
      },
      {
        path: '/Organization',
        name: "机构列表",
        component: () => import('@/components/Organization/Organization.vue'),
        meta: {
          title: '机构列表',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      // 机构修改密码
      {
        path: '/editPass',
        name: "修改密码",
        component: () => import('@/components/Organization/EditPassword.vue'),
        meta: {
          title: '修改密码',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/AddOrganization',
        name: "新增机构",
        component: () => import('@/components/Organization/AddOrganization.vue'),
        meta: {
          title: '新增机构',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/SheetEditOrganization',
        name: "编辑量表",
        component: () => import('@/components/Organization/SheetEditOrganization.vue'),
        meta: {
          title: '编辑量表',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/SheetOrganization',
        name: "配置量表",
        component: () => import('@/components/Organization/SheetOrganization.vue'),
        meta: {
          title: '配置量表',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/LevelOneDepartment',
        name: "一级部门",
        component: () => import('@/components/Organization/LevelOneDepartment/LevelOneDepartment.vue'),
        meta: {
          title: '一级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/LevelTwoDepartment',
        name: "二级部门",
        component: () => import('@/components/Organization/LevelTwoDepartment/LevelTwoDepartment.vue'),
        meta: {
          title: '二级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/LevelThreeDepartment',
        name: "三级部门",
        component: () => import('@/components/Organization/LevelThreeDepartment.vue/LevelThreeDepartment.vue'),
        meta: {
          title: '三级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/AddDepartment',
        name: "增改一级部门",
        component: () => import('@/components/Organization/LevelOneDepartment/AddDepartment.vue'),
        meta: {
          title: '增改一级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/AddSecondDepartment',
        name: "增改二级部门",
        component: () => import('@/components/Organization/LevelTwoDepartment/AddSecondDepartment.vue'),
        meta: {
          title: '增改二级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/AddThreeDepartment',
        name: "增改三级部门",
        component: () => import('@/components/Organization/LevelThreeDepartment.vue/AddThreeDepartment.vue'),
        meta: {
          title: '增改三级部门',
          guidePath: true,
          jumpPath: '/Organization'
        }
      },
      {
        path: '/Combo',
        name: "套餐列表",
        component: () => import('@/components/Combo/Combo.vue'),
        meta: {
          title: '套餐列表',
        }
      },
      {
        path: '/AddCombo',
        name: "新增套餐",
        component: () => import('@/components/Combo/AddCombo.vue'),
        meta: {
          title: '新增套餐',
          guidePath: true,
          jumpPath: '/Combo'
        }
      },
      {
        path: '/User',
        name: "用户列表",
        component: () => import('@/components/User/User.vue'),
        meta: {
          title: '用户列表',
        }
      },
      {
        path: '/AddUser',
        name: "新增用户",
        component: () => import('@/components/User/AddUser.vue'),
        meta: {
          title: '新增用户',
          guidePath: true,
          jumpPath: '/User'
        }
      },
      {
        path: '/UserDetail',
        name: "用户详情",
        component: () => import('@/components/User/UserDetail.vue'),
        meta: {
          title: '用户详情',
          guidePath: true,
          jumpPath: '/User'
        }
      },
      {
        path: '/Team',
        name: "团队列表",
        component: () => import('@/components/Team/Team.vue'),
        meta: {
          title: '团队列表',
        }
      },
      {
        path: '/AddTeam',
        name: "新增检测",
        component: () => import('@/components/Team/AddTeamTest.vue'),
        meta: {
          title: '新增检测',
          guidePath: true,
          jumpPath: '/Team'
        }
      },
      {
        path: '/PersonnelList',
        name: "人员",
        component: () => import('@/components/Team/Personnel/PersonnelList.vue'),
        meta: {
          title: '人员',
          guidePath: true,
          jumpPath: '/Team'
        }
      },
      {
        path: '/TeamCombo',
        name: "检测套餐",
        component: () => import('@/components/Team/TeamCombo/TeamCombo.vue'),
        meta: {
          title: '检测套餐',
          guidePath: true,
          jumpPath: '/Team'
        }
      },
      {
        path: '/CodeCombo',
        name: "打印套餐",
        component: () => import('@/components/Team/TeamCombo/CodeCombo.vue'),
        meta: {
          title: '打印套餐',
          guidePath: true,
          jumpPath: '/Team'
        }
      },
      {
        path: '/Report',
        name: "报告列表",
        component: () => import('@/components/Report/Report.vue'),
        meta: {
          title: '报告列表',
        }
      },
      {
        path: '/ReportDetail',
        name: "报告详情",
        component: () => import('@/components/Report/ReportDetail.vue'),
        meta: {
          title: '报告详情',
          guidePath: true,
          jumpPath: '/Report'
        }
      },
      {
        path: '/AnsDetail',
        name: "答题详情",
        component: () => import('@/components/Report/AnsDetail.vue'),
        meta: {
          title: '答题详情',
          guidePath: true,
          jumpPath: '/Report'
        }
      },
      {
        path: '/Warning',
        name: "预警列表",
        component: () => import('@/components/Warning/Warning.vue'),
        meta: {
          title: '预警列表',
        }
      },
      {
        path: '/WarningDetail',
        name: "预警详情",
        component: () => import('@/components/Warning/WarningDetail.vue'),
        meta: {
          title: '预警详情',
          guidePath: true,
          jumpPath: '/Warning'
        }
      },
      {
        path: '/Statistics',
        name: "数据统计",
        component: () => import('@/components/Statistics/Statistics.vue'),
        meta: {
          title: '数据统计',
        }
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes,
  // 禁止使用浏览器后退
  // scrollBehavior: () => {
  //   history.pushState(null, null, document.URL)
  // }
})

router.beforeEach((to, from, next) => {
  //如果用户访问的路由是/login直接放行
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  //如果没有买票，让他去/login买票去
  if (!tokenStr) return next('/login');
  next();
})
export default router