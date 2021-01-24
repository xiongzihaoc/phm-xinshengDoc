<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="currentTitle" :to="{ path: '/areaList' }"
        >区域列表</el-breadcrumb-item
      >
      <el-breadcrumb-item class="currentTitle">修改密码 </el-breadcrumb-item>
    </el-breadcrumb>
    <h3>修改密码</h3>
    <el-form
      :model="addForm"
      ref="addFormRef"
      label-width="80px"
      :rules="addFormRules"
    >
      <el-form-item label="账号" class="formWidth" prop="username">
        <el-input disabled v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="原密码" class="formWidth" prop="oldPassword">
        <el-input
          show-password
          type="password"
          v-model="addForm.oldPassword"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" class="formWidth" prop="newPassword">
        <el-input
          show-password
          type="password"
          v-model="addForm.newPassword"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" class="formWidth" prop="submitPassword">
        <el-input
          show-password
          type="password"
          v-model="addForm.submitPassword"
        ></el-input>
      </el-form-item>
      <el-form-item class="submitBox">
        <el-button type="danger" @click="clear">取消</el-button>
        <el-button type="primary" @click="revampPasswordEnter">确认</el-button>
      </el-form-item>
    </el-form>
    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addForm: {
        id: "",
        username: "",
        oldPassword: "",
        newPassword: "",
        submitPassword: "",
      },
      addFormRules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        submitPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.addForm.id = this.$route.query.id;
    this.addForm.username = this.$route.query.name;
  },
  methods: {
    revampPasswordEnter() {
      if (this.addForm.submitPassword != this.addForm.newPassword) {
        this.$message.error("两次密码输入不一致");
        return;
      } else {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;

          const { data: res } = await this.$http.post("dealer/updatePwd", {
            id: this.addForm.id,
            oldPwd: this.$md5(this.addForm.oldPassword),
            newPwd: this.$md5(this.addForm.newPassword),
          });
          console.log(res);
          if (res.code != 200) return this.$message.error("修改密码失败");
          this.$message.success("修改密码成功");
          this.$router.go(-1);
        });
      }
    },
    clear() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
.formWidth {
  width: 600px;
}
h3 {
  text-align: center;
  margin: 100px 0 20px 0;
}
.el-form-item {
  margin-left: 50%;
  transform: translateX(-50%);
}
.submitBox {
  text-align: center;
}
</style>