<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Combo' }"
          >套餐列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle" v-if="isEditType == 0"
          >新增套餐</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle" v-else
          >修改套餐</el-breadcrumb-item
        >
      </el-breadcrumb>
      <el-card>
        <el-form
          ref="revampPasswordRef"
          :rules="addFormRules"
          :model="revampPasswordForm"
          label-width="80px"
        >
          <el-form-item class="itemWidth" label="名称" prop="name">
            <el-input v-model="revampPasswordForm.name"></el-input>
          </el-form-item>
          <el-form-item class="itemWidth" label="描述" prop="remark">
            <el-input
              type="textarea"
              v-model="revampPasswordForm.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择量表" style="margin-left: 3%">
            <el-tree
              :data="treeList"
              :props="defaultProps"
              show-checkbox
              :default-expanded-keys="defKeys"
              :default-checked-keys="defKeys"
              node-key="value"
              ref="treeRef"
            ></el-tree>
          </el-form-item>
        </el-form>
        <div class="btnBox">
          <el-button type="danger" @click="clear">清 空</el-button>
          <el-button type="primary" @click="submit">保 存</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",
      isEditType: 0,
      revampPasswordForm: {
        name: "",
        remark: "",
      },
      treeList: [],
      defKeys: [],
      defaultProps: {
        children: "child",
        label: "name",
      },
      addFormRules: {
        name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.isEditType = this.$route.query.isEditType;
    this.id = this.$route.query.id;
    this.getTreeList();
    if (this.isEditType == 1) {
      this.getScaleList();
    }
  },
  methods: {
    // 获取区域列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/package/list", {
        id: this.id,
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      if (res.rows != null && res.rows.length > 0) {
        var info = res.rows[0];
        this.revampPasswordForm.name = info.name;
        this.revampPasswordForm.remark = info.remark;
        this.defKeys = info.sheetList;
      } else {
        this.$message.error("套餐信息获取失败");
        this.$router.push("Combo");
      }
    },
    // 获取量表树级列表
    async getTreeList() {
      const { data: res } = await this.$http.post(
        "dealer/getDealerTreeSheet",
        {}
      );
      console.log(res);
      if (res.code != 200) return this.$message.error("获取量表数据失败");
      this.treeList = res.data;
    },
    // 提交
    async submit() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      var sheetList = keys;
      sheetList = sheetList.filter((e) => !(e < 999));
      let httpUrl = "";
      let parm = {};
      if (this.isEditType == 1) {
        httpUrl = "/dealer/package/update ";
        parm = {
          id: this.id,
          name: this.revampPasswordForm.name,
          remark: this.revampPasswordForm.remark,
          sheetList: sheetList,
        };
      } else {
        httpUrl = "/dealer/package/add";
        parm = {
          name: this.revampPasswordForm.name,
          remark: this.revampPasswordForm.remark,
          sheetList: sheetList,
        };
      }
      this.$refs.revampPasswordRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(httpUrl, parm);
        if (res.code != 200) return this.$message.error(res.msg);
        this.$router.push("Combo");
      });
    },
    // 清空
    clear() {
      this.revampPasswordForm = {};
      this.defKeys = [];
      this.getTreeList();
    },

  },
};
</script>
<style lang='less' scoped>
.connect {
  height: 100%;
}
.el-form .itemWidth {
  width: 50%;
}
.card_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.btnBox {
  position: fixed;
  right: 200px;
  bottom: 200px;
}
</style>