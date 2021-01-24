<template>
  <div class="connect">
    <el-breadcrumb separator="/" v-if="information.level == 'level-5' && information.identify==1">
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">{{information.org.level1}}列表</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/LevelTwoDepartment?id='+this.$route.query.firstId+'&orgName='+this.$route.query.orgName+'&orgId='+this.$route.query.orgId+'&firstName='+this.$route.query.firstName }">{{this.$route.query.firstName}}</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/LevelThreeDepartment?id='+this.$route.query.secondId+'&orgName='+this.$route.query.orgName+'&orgId='+this.$route.query.orgId+'&firstName='+this.$route.query.firstName+'&firstId='+this.$route.query.firstId }">{{this.$route.query.secondName}}</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator="/" v-else-if="information.level == 'level-5' && information.identify==2">
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">{{information.org.level2}}列表</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/LevelThreeDepartment?id='+this.$route.query.secondId+'&name='+this.$route.query.secondName+'&orgId='+this.$route.query.orgId+'&firstName='+this.$route.query.firstName+'&firstId='+this.$route.query.firstId }">{{this.$route.query.secondName}}</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator="/" v-else-if="information.level == 'level-5' && information.identify==3">
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator="/" v-else>
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">机构列表</el-breadcrumb-item>
      <!-- 机构 -->
      <el-breadcrumb-item class="currentTitle" :to="{path: '/LevelOneDepartment?id='+this.$route.query.orgId+'&name='+this.$route.query.orgName }">{{this.$route.query.orgName}}</el-breadcrumb-item>
      <!-- 第一级部门 -->
      <el-breadcrumb-item class="currentTitle" :to="{path: '/LevelTwoDepartment?id='+this.$route.query.firstId+'&firstName='+this.$route.query.firstName+'&orgId='+this.$route.query.orgId+'&orgName='+this.$route.query.orgName }">{{this.$route.query.firstName}}</el-breadcrumb-item>
      <!-- 第二级部门 -->
      <el-breadcrumb-item class="currentTitle" :to="{path: '/LevelThreeDepartment?id='+this.$route.query.secondId+'&firstId='+this.$route.query.firstId+'&firstName='+this.$route.query.firstName+'&orgId='+this.$route.query.orgId+'&orgName='+this.$route.query.orgName }">{{this.$route.query.secondName}}</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
      <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 返回上一级 -->
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="返回上一级"
        placement="top-start"
      >
        <span class="iconfont icon-fanhui11" @click="back"></span>
      </el-tooltip> -->
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
        class="addForm"
      >
        <p class="addForm_title">基本信息</p>
        <el-form-item label="名称" class="formWidth" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" class="formWidth" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          v-show="!this.isEditType"
          label="密码"
          class="formWidth"
          prop="password"
        >
          <el-input
            type="password"
            show-password
            v-model="addForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="formWidth" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="描述" class="formWidth" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="danger" @click="clear()">清空</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-card>
  </div>
</template>
  <script>
export default {
  data() {
    // 手机号码验证规则
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      // 新增表单验证规则
      addFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
      addForm: {
        name: "",
        username: "",
        phone: "",
        remark: "",
        password: "",
      },
      isEditType: 0,
      secondId: "",
      editId: "",
      information:{},
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.secondId = this.$route.query.secondId;
    this.editId = this.$route.query.id;
    this.isEditType = this.$route.query.isEditType;
    if (this.isEditType == 1) {
      this.getOrganizationInfo();
    }
  },
  methods: {
    // 获取修改数据
    async getOrganizationInfo() {
      const { data: res } = await this.$http.post("operator/list", {
        id: this.editId,
      });
      var info = res.rows[0];
      this.addForm = info;
    },
    // 提交
    submit() {
      var postData = {
        secondId: this.secondId,
        name: this.addForm.name,
        password: this.$md5(this.addForm.password),
        username: this.addForm.username,
        phone: this.addForm.phone,
        remark: this.addForm.remark,
      };
      var postUrl = "operator/add";
      if (this.isEditType == 1) {
        postUrl = "operator/update";
        postData = {
          id: this.editId,
          name: this.addForm.name,
          username: this.addForm.username,
          phone: this.addForm.phone,
          remark: this.addForm.remark,
        };
      }
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(postUrl, postData);
        if (res.code != 200) return this.$message.error("保存失败请重试");
        console.log(res);
        this.addForm = {};
        this.$router.go(-1);
      });
    },
    // 清空
    clear() {
      this.addForm = {};
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
  <style scoped>
.title {
  padding: 10px 0;
  /* border-bottom: 1px solid #ccc; */
  font-weight: 700;
  font-size: 20px;
}
.addForm {
  margin: 10px 0;
}
.addForm_title {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
}
.formWidth {
  width: 600px;
}
.submit {
  display: flex;
  justify-content: center;
}
.connect {
  height: 100%;
  overflow: hidden;
}
</style>