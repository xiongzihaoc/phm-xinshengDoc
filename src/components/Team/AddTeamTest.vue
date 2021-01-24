<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Team' }"
          >团队列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">新增检测</el-breadcrumb-item>
      </el-breadcrumb>
    </el-breadcrumb>
    <el-card>
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
        class="addForm"
      >
        <p class="addForm_title">基本信息</p>
        <el-form-item label="检测编号" class="formWidth" prop="CheckNo">
          <el-input disabled v-model="addForm.CheckNo"></el-input>
        </el-form-item>
        <el-form-item label="限定人数" class="formWidth" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
        <el-form-item label="检测团队" class="formWidth" prop="testTeam">
          <el-select
            style="width: 100%"
            v-model="addForm.testTeam"
            placeholder="请选择检测团队"
          >
            <el-option
              v-for="item in this.testTeamList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="配置套餐"
          class="formWidth configCombo"
          prop="combo"
        >
          <div class="comboBox_Box">
            <div class="comboBox" v-if="this.configCombo.length > 0">
              <span v-for="(item, index) in this.configCombo" :key="index"
                >{{ item.packageName }}
                <i
                  @click.prevent.stop="deleteCombo(index, item)"
                  class="iconfont icon-guanbi"
                ></i>
              </span>
            </div>
            <span class="iconfont icon-tianjia2" @click="addCombo"></span>
          </div>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="danger" @click="clear()">清空</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-card>
    <!-- 配置套餐弹框 -->
    <el-dialog
      title="新增套餐"
      :visible.sync="teamAddDialog"
      width="40%"
      @closed="teamAddDialogClosed"
      v-dialogDrag
    >
      <el-form
        :rules="teamListFormRules"
        ref="teamListFormRef"
        :model="teamListForm"
        label-width="80px"
      >
        <el-form-item prop="packageName" label="套餐名称">
          <el-input
            v-model="teamListForm.packageName"
            placeholder="请输入团队名称"
          />
        </el-form-item>
        <el-form-item prop="remark" label="描述">
          <el-input
            type="textarea"
            v-model="teamListForm.remark"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item prop="package" label="选择量表">
          <el-input
            class="selectInt"
            @focus="chooseSheet"
            placeholder="请选择量表"
          >
          </el-input>
          <i
            v-show="clearShow"
            @click.prevent.stop="clearchoose"
            class="iconfont icon-close-o"
          ></i>
          <div
            class="addComboSheet"
            v-for="item in checkComboList"
            @click="chooseSheet"
            :key="item.uuid"
          >
            {{ item.name }}
          </div>
          <div
            class="addComboSheet"
            @click="chooseSheet"
            v-for="item in checksheetList"
            :key="item.value"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="teamAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="teamAddDialogEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择量表弹框 -->
    <el-dialog
      title="选择量表"
      :visible.sync="revampPasswordDialog"
      width="40%"
      @closed="revampPasswordClosed"
      v-dialogDrag
    >
      <div class="chooseCombobox">
        <div
          class="chooseCombo"
          v-if="comboList != null && comboList.length > 0"
        >
          <p class="title">选择套餐</p>
          <!-- 套餐多选 -->
          <el-checkbox-group v-model="checkComboListbox">
            <el-checkbox
              v-for="item in comboList"
              :label="item"
              :key="item.uuid"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <!-- 量表多选 -->
        <ul>
          <li v-for="(item, index) in sheetList" :key="index">
            <p class="title">{{ item.name }}</p>
            <div v-for="(sheetItem, index) in item.child" :key="index">
              <p>{{ sheetItem.name }}</p>
              <el-checkbox-group v-model="checksheetListbox">
                <el-checkbox
                  v-for="subItem in sheetItem.child"
                  :label="subItem"
                  :key="subItem.id"
                  >{{ subItem.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revampPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="revampPasswordEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  <script>
export default {
  data() {
    // 只能输入数字
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      } else {
        const reg = /^[0-9]+$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入整数"));
        }
      }
    };
    return {
      // 新增表单验证规则
      addFormRules: {
        number: [{ validator: checkPhone, trigger: "blur" }],
        testTeam: [
          { required: true, message: "请选择检测团队", trigger: "blur" },
        ],
      },
      teamListFormRules: {
        packageName: [
          { required: true, message: "请输入团队名称", trigger: "blur" },
        ],
      },
      addForm: {
        CheckNo: "",
        number: "",
        testTeam: "",
        phone: "",
      },
      teamAddDialog: false,
      teamListForm: {
        remark: "",
        packageName: "",
        package: [],
      },
      clearShow: false,
      codeDialog: false,
      revampPasswordDialog: false,
      comboList: [],
      sheetList: [],
      checkComboListbox: [],
      checksheetListbox: [],
      checkComboList: [],
      checksheetList: [],
      testTeamList: [],
      configCombo: [],
      sheetList: [],
      orgId: "",
      editId: "",
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.orgId = this.$route.query.orgId;
    this.editId = this.$route.query.id;
    this.getCheckNo();
    this.getTestTeamList();
    this.getTreeList();
  },
  methods: {
    // 获取随机编号
    async getCheckNo() {
      const { data: res } = await this.$http.post(
        "dealer_check/getCheckNo",
        {}
      );
      this.addForm.CheckNo = res.data;
    },
    // 获取量表树级列表
    async getTreeList() {
      const { data: res } = await this.$http.post(
        "dealer/getTreePackageAndSheet",
        {
          id: this.information.dealerId,
        }
      );
      if (res.code != 200) return this.$message.error("获取量表数据失败");
      this.comboList = res.data.packages;
      var sheet = res.data.sheets;
      this.sheetList = sheet;
    },
    // 获取检测团队列表
    async getTestTeamList() {
      const { data: res } = await this.$http.post("team/check_dept", {});
      console.log(res);
      this.testTeamList = res.data;
    },
    // 删除配置套餐
    deleteCombo(index, val) {
      this.configCombo.splice(index, 1);
    },
    // 提交
    submit() {
      console.log(this.configCombo);
      if (this.configCombo.length <= 0) {
        this.$message.error("请配置套餐");
        return;
      } else {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;
          const { data: res } = await this.$http.post("team/check_add", {
            teamNo: this.addForm.CheckNo,
            teamNumber: this.addForm.number,
            paramList: this.configCombo,
            teamDept: this.addForm.testTeam,
          });
          if (res.code != 200) return this.$message.error("保存失败请重试");
          console.log(res);
          this.$router.go(-1);
        });
      }
    },
    // 添加套餐
    addCombo() {
      this.teamListForm = {};
      this.teamAddDialog = true;
    },
    teamAddDialogEnter() {
      this.checkComboList = this.checkComboList.map((e) => {
        return {
          name: e.name,
          type: 1,
          uuid: e.uuid,
        };
      });
      this.checksheetList = this.checksheetList.map((e) => {
        return {
          name: e.name,
          type: 0,
          uuid: e.value,
        };
      });
      if (this.checkComboList.length <= 0 && this.checksheetList.length <= 0) {
        this.$message.error("请选择量表或套餐");
        return;
      } else {
        // 解构套餐数组和量表数组
        var mergeArr = [...this.checkComboList, ...this.checksheetList];
        var remark = "";
        if(this.teamListForm.remark != null && this.teamListForm.remark != undefined && this.teamListForm.remark != ''){
          remark=this.teamListForm.remark;
        }
        var mergObj = {
          packageName: this.teamListForm.packageName,
          package: mergeArr,
          remark: remark,
        };
        console.log(mergObj);
        this.configCombo.push(mergObj);
        this.teamAddDialog = false;
      }
    },
    teamAddDialogClosed() {
      this.clearShow = false;
      this.checkComboListbox = [];
      this.checksheetListbox = [];
      this.checkComboList = [];
      this.checksheetList = [];
      // this.$refs.teamListFormRef.resetFields();
    },

    revampPasswordEnter() {
      this.checkComboList = this.checkComboListbox;
      this.checksheetList = this.checksheetListbox;
      // 有选择量表清空按钮显示
      if (this.checkComboList.length > 0 || this.checksheetList.length > 0) {
        this.clearShow = true;
      }
      this.revampPasswordDialog = false;
    },
    revampPasswordClosed() {},
    chooseSheet() {
      this.revampPasswordDialog = true;
    },
    clearchoose() {
      this.clearShow = false;
      this.checkComboListbox = [];
      this.checksheetListbox = [];
      this.checkComboList = [];
      this.checksheetList = [];
    },
    // 清空
    clear() {
      this.getCheckNo();
      this.addForm = {};
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
.back {
  cursor: pointer;
}
.icon-tianjia2 {
  margin-left: 10px;
  font-size: 40px;
}
.icon-tianjia2:hover {
  cursor: pointer;
}
.comboBox_Box {
  display: flex;
  align-items: center;
}
.comboBox span {
  position: relative;
  padding: 7px 15px;
  box-sizing: border-box;
  margin-right: 10px;
  color: #fff;
  border-radius: 30px;
  background-color: #409eff;
}
.icon-guanbi {
  position: absolute;
  top: -15px;
  right: -5px;
  font-size: 22px;
  color: #000;
}
.icon-guanbi:hover {
  cursor: pointer;
}
.addComboSheet {
  font-weight: 700;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top: none;
}
.chooseCombo .title {
  font-size: 18px;
  font-weight: 700;
  color: #000;
}
.chooseCombo {
  padding-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
}
.chooseCombobox {
  height: 60vh;
  overflow: auto;
}
ul {
  list-style: none;
}
ul .title {
  font-weight: 700;
  font-size: 18px;
  color: #000;
}
.el-checkbox {
  width: 42%;
  margin: 5px 30px 5px 0;
}
ul >>> .el-checkbox__label {
  width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.selectInt {
  position: relative;
}
.icon-close-o {
  position: absolute;
  top: 0;
  right: 10px;
}
.icon-close-o:hover {
  cursor: pointer;
}
</style>