<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="currentTitle">团队列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cardBox">
      <el-card class="teamList">
        <el-table
          :data="teamList"
          @cell-click="handleTeam"
          :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
          :header-cell-style="{
            background: '#5BAEFF',
            height: '50px',
            color: '#fff',
          }"
          row-key="code"
          ref="singleTable"
        >
          <el-table-column
            align="left"
            prop="name"
            label="团队列表"
            label-class-name="ccc"
          ></el-table-column>
          <el-table-column align="center" width="100" v-if="identify == 4">
            <template slot="header" slot-scope="scope">
              <el-button
                plain
                type="primary"
                size="mini"
                @click="teamAdd(scope.row)"
                >新增团队</el-button
              >
            </template>
            <template slot-scope="scope">
              <div class="cell">
                <span
                  @click.prevent.stop="iconEdit(scope.row)"
                  class="iconfont icon-xiugai"
                ></span>
                <span
                  v-if="scope.row.code.length < 9"
                  @click.prevent.stop="iconAdd(scope.row)"
                  class="iconfont icon-tianjia1"
                ></span>
                <span
                  @click.prevent.stop="iconDel(scope.row)"
                  class="iconfont icon-shanchu"
                ></span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="teamInfo">
        <div v-if="messageList">
          <div class="cardR_title_box">
            <p class="cardR_title">{{ messageList.name }}</p>
            <el-button
              v-if="identify == 4"
              type="primary"
              plain
              size="mini"
              @click="addTeamTest"
              >新增检测</el-button
            >
          </div>
          <div class="info_box">
            <span>名称：{{ messageList.name }}</span>
            <span>账号：{{ messageList.account }}</span>
            <span>联系人：{{ messageList.leader }}</span>
            <span>联系电话：{{ messageList.phone }}</span>
          </div>
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="infoList"
          :header="tableHeaderBig"
          style="margin-top: 1%"
        >
          <!-- 状态 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state == 0">未检测</span>
              <span v-if="scope.row.state == 1">已检测</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="personnel(scope.row)"
                type="primary"
                >人员</el-button
              >
              <el-button
                size="mini"
                @click="DetectionPackage(scope.row)"
                type="primary"
                >检测套餐</el-button
              >
            </template>
          </el-table-column>
        </EleTable>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangev"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
    </div>
    <!-- 增改团队弹框 -->
    <el-dialog
      :title="teamTitle"
      :visible.sync="teamAddDialog"
      width="40%"
      @closed="teamAddDialogClosed"
      v-dialogDrag
    >
      <el-form
        ref="teamListFormRef"
        :model="teamListForm"
        :rules="teamListFormRules"
        label-width="80px"
      >
        <el-form-item prop="name" label="团队名称">
          <el-input v-model="teamListForm.name" placeholder="请输入团队名称" />
        </el-form-item>
        <el-form-item
          prop="account"
          v-if="this.teamTitle == '新增团队'"
          label="团队账号"
        >
          <el-input
            v-model="teamListForm.account"
            placeholder="请输入团队账号"
          />
        </el-form-item>
        <el-form-item prop="account" v-else label="团队账号">
          <el-input
            disabled
            v-model="teamListForm.account"
            placeholder="请输入团队账号"
          />
        </el-form-item>
        <el-form-item
          v-if="this.teamTitle == '新增团队'"
          prop="password"
          label="团队密码"
        >
          <el-input
            type="password"
            v-model="teamListForm.password"
            placeholder="请输入团队密码"
          />
        </el-form-item>
        <el-form-item prop="leader" label="联系人">
          <el-input v-model="teamListForm.leader" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item prop="phone" label="联系号码">
          <el-input v-model="teamListForm.phone" placeholder="请输入联系号码" />
        </el-form-item>

        <el-form-item
          prop="pcd"
          label="地址信息"
          v-if="this.teamTitle == '新增团队'"
        >
            <el-cascader
              style="width: 100%"
              v-model="teamListForm.pcd"
              :options="areaList"
              :props="{ children: 'child', label: 'name', value: 'code' }"
              @change="handleChange"
            ></el-cascader>
        </el-form-item>
        <el-form-item prop="address" label="详细地址">
          <el-input
            type="textarea"
            v-model="teamListForm.address"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="teamAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="teamAddDialogEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增改部门小组弹框 -->
    <el-dialog
      :title="deptTitle"
      :visible.sync="deptAddDialog"
      width="40%"
      @closed="deptAddDialogClosed"
      v-dialogDrag
    >
      <el-form
        :rules="deptListFormRules"
        ref="deptListFormRef"
        :model="deptListForm"
        label-width="80px"
      >
        <el-form-item prop="name" label="名称">
          <el-input v-model="deptListForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item prop="account" label="账号">
          <el-input
            :disabled="accountDisabled"
            v-model="deptListForm.account"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item
          v-if="this.deptTitle != '修改'"
          prop="password"
          label="密码"
        >
          <el-input
            show-password
            v-model="deptListForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="leader" label="联系人">
          <el-input v-model="deptListForm.leader" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="deptListForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deptAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="deptAddDialogEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../commonModule/table";
export default {
  components: { EleTable },
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
      teamAddDialog: false,
      deptAddDialog: false,
      identify: "",
      areaList: [],
      teamTitle: "",
      teamList: [],
      teamListId: "",
      teamListForm: {
        name: "",
        phone: "",
        account: "",
        password: "",
        leader: "",
        address: "",
        pcd: [],
      },
      deptListForm: {
        name: "",
        account: "",
        leader: "",
        phone: "",
      },
      deptTitle: "",
      accountDisabled: false,
      messageList: [],
      teamListFormRules: {
        name: [
          { required: true, message: "请输入团队名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        account: [
          { required: true, message: "请输入团队账号", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        leader: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        address: [{ required: true, message: "请选择地址", trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
      deptListFormRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        leader: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
      infoList: [],
      tableHeaderBig: [
        { prop: "teamNo", label: "检测编号" },
        { prop: "teamNumber", label: "限定人数" },
        { prop: "recordNumber", label: "已录入人数" },
        { prop: "checkNumber", label: "已检测" },
        { prop: "state", label: "未检测" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      // 右侧取左侧第一条数据code为参数加载列表
      firstCode: 0,
    };
  },
  created() {
    this.identify = JSON.parse(localStorage.getItem("message")).identify;
    this.getTeamList();
  },
  methods: {
    // 左侧列表
    async getTeamList() {
      const { data: res } = await this.$http.post("team/dept/list", {});
      if (res.code != 200) return this.$message.error("获取团队列表失败");
      console.log(res);
      this.teamList = res.data;
      this.messageList = res.data[0];
      this.firstCode = res.data[0].code;
      this.getTeamInfoList();
    },
    // 右侧列表
    async getTeamInfoList() {
      const { data: res } = await this.$http.post("team/check_list", {
        teamDept: this.firstCode,
      });
      if (res.code != 200) return this.$message.error("获取数据失败");
      this.infoList = res.rows;
    },
    // 省市区列表
    async getAreaList() {
      const { data: res } = await this.$http.post("us/getCityInfo", {});
      var jsondata = JSON.parse(
        JSON.stringify(res.data).replace(/\"child"\:\[]/g, '"no":0')
      );
      this.areaList = jsondata;
    },
    // 团队列表增删改
    teamAdd() {
      this.getAreaList();
      this.teamAddDialog = true;
      this.teamTitle = "新增团队";
    },
    teamAddDialogEnter() {
      var addressP = "";
      var addressC = "";
      var addressA = "";
      var addressD = "";
      if (this.teamListForm.pcd != null && this.teamListForm.pcd.length > 0) {
        addressP = this.teamListForm.pcd[0];
        if(this.teamListForm.pcd.length > 1){
          addressC = this.teamListForm.pcd[1];
        }
        if(this.teamListForm.pcd.length > 2){
          addressA = this.teamListForm.pcd[2];
        }
        if(this.teamListForm.pcd.length > 3){
          addressD = this.teamListForm.pcd[3];
        }
      }
      var postUrl = "team/dept/add";
      var postData = {
        name: this.teamListForm.name,
        password: this.$md5(this.teamListForm.password),
        account: this.teamListForm.account,
        leader: this.teamListForm.leader,
        phone: this.teamListForm.phone,
        addressP: addressP,
        addressC: addressC,
        addressA: addressA,
        addressD: addressD,
        address: this.teamListForm.address,
      };
      if (this.teamTitle == "修改团队") {
        postUrl = "team/dept/update";
        postData = {
          id: this.teamListId,
          name: this.teamListForm.name,
          account: this.teamListForm.account,
          leader: this.teamListForm.leader,
          phone: this.teamListForm.phone,
          address: this.teamListForm.address,
        };
      }
      this.$refs.teamListFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(postUrl, postData);
        console.log(res);
        if (res.code != 200) return this.$message.error("保存失败请重试");
        this.getTeamList();
        this.getTeamInfoList();
        this.teamAddDialog = false;
      });
    },
    teamAddDialogClosed() {
      this.teamListForm = {};
      this.$refs.teamListFormRef.resetFields();
    },
    iconEdit(val) {
      console.log(val);
      this.teamListId = val.id;
      // 团队修改
      if (val.code.length <= 3) {
        this.teamListForm = JSON.parse(JSON.stringify(val));
        this.teamAddDialog = true;
        this.teamTitle = "修改团队";
      } else {
        // 部门小组修改
        this.accountDisabled = true;
        this.deptAddDialog = true;
        this.deptListForm = JSON.parse(JSON.stringify(val));
        this.deptTitle = "修改";
      }
    },
    iconAdd(val) {
      this.parentCode = val.code;
      this.deptTitle = "新增";
      this.deptAddDialog = true;
      this.accountDisabled = false;
      console.log(val.parentCode);
    },
    deptAddDialogEnter() {
      var postUrl = "team/dept/add";
      var postData = {
        parentCode: this.parentCode,
        name: this.deptListForm.name,
        account: this.deptListForm.account,
        password: this.$md5(this.deptListForm.password),
        leader: this.deptListForm.leader,
        phone: this.deptListForm.phone,
      };
      if (this.deptTitle == "修改") {
        postUrl = "team/dept/update";
        postData = {
          id: this.teamListId,
          name: this.deptListForm.name,
          account: this.deptListForm.account,
          // password: this.$md5(this.deptListForm.password),
          leader: this.deptListForm.leader,
          phone: this.deptListForm.phone,
        };
      }
      this.$refs.deptListFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(postUrl, postData);
        console.log(res);
        if (res.code != 200) return this.$message.error("保存失败请重试");
        this.getTeamList();
        this.getTeamInfoList();
        this.deptAddDialog = false;
      });
    },
    deptAddDialogClosed() {
      this.deptListForm = {};
      this.$refs.deptListFormRef.resetFields();
    },
    handleTeam(row) {
      console.log(row);
      this.messageList = row;
      this.firstCode = row.code;
      this.getTeamInfoList();
      console.log(this.firstCode);
    },
    // 新增检测
    addTeamTest() {
      this.$router.push("AddTeam");
    },
    // 人员
    personnel(val) {
      this.$router.push(
        "PersonnelList?teamNo=" +
          val.teamNo +
          "&teamName=" +
          val.teamName +
          "&teamNumber=" +
          val.recordNumber +
          "&checkNumber=" +
          val.checkNumber +
          "&createTime=" +
          val.createTime +
          "&teamCode=" +
          this.firstCode
      );
    },
    // 检测套餐
    DetectionPackage(val) {
      console.log(val);
      this.$router.push(
        "TeamCombo?teamNo=" +
          val.teamNo +
          "&teamName=" +
          val.teamName +
          "&teamNumber=" +
          val.teamNumber +
          "&checkNumber=" +
          val.checkNumber +
          "&createTime=" +
          val.createTime +
          "&teamCode=" +
          this.firstCode
      );
    },
    // 删除左侧团队列表
    async iconDel(val) {
      const confirmResult = await this.$confirm(
        "你确定要执行此操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.post("team/dept/del", {
        id: val.id,
      });
      if (res.code != 200) return this.$message.error(res.data);
      this.getTeamList();
    },
    // 省市区选择
    handleChange(val) {
      console.log(val);
    },

    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
    },
  },
};
</script>
<style scoped>
.cardBox {
  height: 100%;
  display: flex;
}
.teamList {
  width: 29%;
  margin-right: 2%;
}
.teamInfo {
  width: 69%;
}
.cell {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.icon-xiugai,
.icon-tianjia1,
.icon-shanchu {
  cursor: pointer;
}
.cardR_title_box {
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #5baeff;
}
.cardR_title {
  color: #fff;
  font-weight: 700;
}
.info_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ccc;
  padding: 20px;
  box-sizing: border-box;
}
</style>