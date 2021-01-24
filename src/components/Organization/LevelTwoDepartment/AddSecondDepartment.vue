<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb separator="/" v-if="information.level == 'level-5' && information.identify==1">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">{{information.org.level1}}列表</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/LevelTwoDepartment?id='+this.$route.query.firstId+'&orgName='+this.$route.query.orgName+'&orgId='+this.$route.query.orgId+'&firstName='+this.$route.query.firstName}">{{this.$route.query.firstName}}</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else-if="information.level == 'level-5' && information.identify==2">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">{{information.org.level2}}列表</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">机构列表</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" :to="{path: '/LevelOneDepartment?id='+this.$route.query.orgId+'&name='+this.$route.query.orgName }">{{this.$route.query.orgName}}</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" :to="{path: '/LevelTwoDepartment?id='+this.$route.query.firstId+'&firstName='+this.$route.query.firstName+'&orgId='+this.$route.query.orgId+'&orgName='+this.$route.query.orgName}">{{this.$route.query.firstName}}</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-if="isEditType == 1">修改</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle" v-else>新增</el-breadcrumb-item>
      </el-breadcrumb>
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
        class="addForm"
      >
        <el-form-item
          v-show="!isAdd"
          class="formWidth"
          prop="deptName"
          
        >
        <div style="display: flex;">
          <span style="width: 80px;">选择{{org.level2}}</span>
          <el-select
            style="width: 100%;margin-left: 10px;"
            v-model="deptvalue"
            multiple
            placeholder="请选择"
            @focus="selectFocus"
          >
            <el-option
              v-for="item in infoList"
              :key="item.value"
              :label="item.deptName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        
        </el-form-item>
        <div v-show="isAdd">
          <el-form-item label="名称" class="formWidth" prop="deptName">
            <el-input v-model="addForm.deptName"></el-input>
          </el-form-item>
          <el-form-item label="账号" class="formWidth" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" class="formWidth" prop="password">
            <el-input show-password v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="联系人" class="formWidth" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" class="formWidth" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="描述" class="formWidth" prop="remark">
            <el-input type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="submit">
        <el-button type="danger" @click="clear()" v-show="!isAdd"
          >新增{{org.level2}}</el-button
        >
        <!-- 表單提交 -->
        <el-button type="primary" @click="submit()" v-show="isAdd"
          >提交</el-button
        >
        <!-- select提交 -->
        <el-button type="primary" @click="selectSubmit()" v-show="!isAdd"
          >提交</el-button
        >
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
        name: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        deptName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
      isAdd: false,
      addForm: {
        name: "",
        deptName: "",
        username: "",
        phone: "",
        remark: "",
        password: "",
      },
      deptvalue: [],
      infoList: [],
      isEditType: 0,
      orgId: 0,
      firstId: 0,
      editId: "",
      information:{},
      org:{},//机构类型数据
    };
  },
  created() {
    var orgStr = window.localStorage.getItem('org');
    if(orgStr != null && orgStr != undefined){
      this.org = JSON.parse(orgStr);
    }
    this.information = JSON.parse(window.localStorage.getItem("message"));
    // 机构id
    this.orgId = this.$route.query.orgId;
    this.firstId = this.$route.query.firstId;
    this.editId = this.$route.query.id;
    this.isEditType = this.$route.query.isEditType;
    this.getScaleList();
    if (this.isEditType == 1) {
      this.getOrganizationInfo();
    }
  },
  methods: {
    // 获取修改数据
    async getOrganizationInfo() {
      const { data: res } = await this.$http.post("dealer/getFirstDept", {
        id: this.editId,
      });
      var info = res.rows[0];
      this.addForm = info;
    },
    // 获取部门列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/getSecondDept2", {
        dealerId: parseInt(this.orgId),
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      this.infoList = res.rows;
      console.log(res);
    },
    // 下拉事件
    selectFocus() {
      this.getScaleList();
    },
    // 提交
    submit() {
      var postData = {
        dealerId: parseInt(this.orgId),
        firstId: parseInt(this.firstId),
        name: this.addForm.name,
        deptName: this.addForm.deptName,
        username: this.addForm.username,
        password: this.$md5(this.addForm.password),
        phone: this.addForm.phone,
        remark: this.addForm.remark,
      };
      var postUrl = "dealer/secondDept/add";
      if (this.isEditType == 1) {
        postUrl = "dealer/secondDept/update";
        postData = {
          id: this.editId,
          name: this.addForm.name,
          deptName: this.addForm.deptName,
          username: this.addForm.username,
          phone: this.addForm.phone,
          remark: this.addForm.remark,
        };
      }
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(postUrl, postData);
        if (res.code != 200) return this.$message.error("保存失败请重试");
        this.addForm = {};
        this.getScaleList();
        this.isAdd = false;
      });
    },
    async selectSubmit() {
      const { data: res } = await this.$http.post("dealer/secondDept/add2", {
        dealerId: this.deptvalue,
        firstId: parseInt(this.firstId),
      });
      if (res.code != 200) return this.$message.error("保存失败请重试");
      this.$router.go(-1);
    },
    // 新增科室
    clear() {
      this.isAdd = true;
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
  margin: 50px 0 0 260px;
}
.connect {
  height: 100%;
  overflow: hidden;
}
</style>