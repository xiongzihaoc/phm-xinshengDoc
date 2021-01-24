<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/" v-if="information.level == 'level-5' && information.identify == 1">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">{{information.org.level1}}列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }">机构列表</el-breadcrumb-item>
        <el-breadcrumb-item class="currentTitle">{{this.$route.query.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="searchBox">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="addUsers"
            style="margin-left: 2%"
            >新增</el-button>
          <!-- <el-button
            type="primary"
            size="small"
            @click="back"
            style="margin-left: 2%"
            >返回上一级</el-button
          > -->
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="infoList"
          :header="tableHeaderBig"
          style="margin-top: 1%"
        >
          <el-table-column
            align="center"
            slot="fixed"
            fixed="left"
            label="名称"
            prop="deptName"
          >
            <template slot-scope="scope">
              <a
                href="javascript:;"
                @click="jumpLevelOneDepartment(scope.row)"
                >{{ scope.row.deptName }}</a
              >
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
            width="370"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="showEditdialog(scope.row)"
                type="primary"
                icon="el-icon-edit"
                >编辑信息</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="revampPassword(scope.row)"
                >修改密码</el-button
              >
              <el-button
                size="mini"
                @click="deleteBtn(scope.row)"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
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
  </div>
</template>
<script>
import EleTable from "../../commonModule/table";

export default {
  components: { EleTable },
  data() {
    return {
      infoList: [],
      tableHeaderBig: [
        { prop: "username", label: "账号" },
        { prop: "name", label: "联系人" },
        { prop: "phone", label: "电话" },
        { prop: "remark", label: "描述" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      information:{},
      org:{},//机构类型数据
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.id = this.$route.query.id;
    if(this.information != null && this.information.org != null) {
      this.org = this.information.org;
    }
    this.getScaleList();
  },
  methods: {
    // 获取机构列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/getFirstDept", {
        dealerId: this.id,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        deptName: this.input,
      });
      console.log(res);
      if (res.code != 200) return this.$message.error("数获取失败");
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 新增
    addUsers() {
      var orgId = this.$route.query.id;
      var orgName = this.$route.query.name;
      this.$router.push(
        "AddDepartment?orgId=" + orgId + "&orgName=" + orgName
      );
    },
    // 修改信息
    showEditdialog(info) {
     var orgId = this.$route.query.id;
      var orgName = this.$route.query.name;
      this.$router.push(
        "AddDepartment?id=" +
          info.id +
          "&isEditType=1" +
          "&orgId=" +
          orgId +
          "&orgName=" +
          orgName
      );
    },
    // 修改密码
    revampPassword(info) {
      console.log(info);
      this.$router.push(
        "editPass?id=" + info.id + "&name=" + info.username + "&type=firstDept"
      );
    },
    // 点击名称跳转下一级
    jumpLevelOneDepartment(info) {
      var organName = this.$route.query.name;
      var organId = this.$route.query.id;
      var firstName = info.deptName;
      this.org = info.org;
      window.localStorage.setItem('org',JSON.stringify(this.org));
      this.$router.push(
        "LevelTwoDepartment?id=" +
          info.id +
          "&orgName=" +
          organName +
          "&orgId=" +
          organId +
          "&firstName=" +
          firstName
      );
    },
    // 删除
    async deleteBtn(info) {
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
      const { data: res } = await this.$http.post("dealer/firstDept/del", {
        id: info.id,
      });
      if (res.code != 200) return this.$message.error("删除失败");
      this.getScaleList();
    },
    back: function () {
      this.$router.go(-1);
    },
    // 搜索

    searchin() {
      this.getScaleList();
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
<style lang="scss" scoped>
a {
  text-decoration: underline;
  font-weight: 700;
  color: #73deb3;
}
.connect {
  height: 100%;
}
.card_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-card {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.searchBox {
  display: -webkit-flex;
  display: flex;
}
.searchInput {
  width: 25%;
  max-width: 300px;
}
</style>
