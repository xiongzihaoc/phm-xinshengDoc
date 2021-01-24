<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle">机构列表</el-breadcrumb-item>
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
            >新增</el-button
          >
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
            prop="dealerName"
          >
            <template slot-scope="scope">
              <a
                href="javascript:;"
                @click="jumpLevelOneDepartment(scope.row)"
                >{{ scope.row.dealerName }}</a
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="地址"
            prop="pcad"
          >
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="描述"
            prop="remark"
          >
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
                size="mini"
                @click="configuration(scope.row)"
                type="warning"
                icon="el-icon-s-order"
                >配置量表</el-button
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
import EleTable from "../commonModule/table";

export default {
  components: { EleTable },
  data() {
    return {
      infoList: [],
      tableHeaderBig: [
        { prop: "levelName", label: "级别" },
        { prop: "username", label: "账号" },
        { prop: "name", label: "联系人" },
        { prop: "phone", label: "电话" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    if (
      this.information.level == "level-5" &&
      this.information.identify == "1"
    ) {
      this.$router.push(
        "LevelOneDepartment?id=" +
          this.information.dealerId +
          "&name=" +
          this.information.dealerName +
          "&identify=" +
          this.information.identify
      );
    } else if (
      this.information.level == "level-5" &&
      this.information.identify == "2"
    ) {
      this.$router.push(
        "LevelTwoDepartment?id=" +
          this.information.id +
          "&name=" +
          this.information.dealerName +
          "&identify=" +
          this.information.identify
      );
    } else if (this.information.identify == "3") {
      this.$router.push(
        "LevelThreeDepartment?id=" +
          this.information.id +
          "&name=" +
          this.information.dealerName +
          "&identify=" +
          this.information.identify
      );
    } else {
      this.getScaleList();
    }
  },
  methods: {
    // 获取机构列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/list", {
        pageSize: this.pageSize,
        level: "level-5",
        pageNum: this.pageNum,
        name: this.input,
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 新增合作商
    addUsers() {
      this.$router.push("AddOrganization?isEditType=0");
    },
    // 修改合作商信息
    showEditdialog(info) {
      this.$router.push("AddOrganization?id=" + info.id + "&isEditType=1");
    },
    // 修改密码
    revampPassword(info) {
      console.log(info);
      this.$router.push(
        "editPass?id=" + info.id + "&name=" + info.username + "&type=org"
      );
    },
    // 配置量表
    configuration(info) {
      console.log(info);
      this.$router.push("SheetOrganization?id=" + info.id);
    },
    // 点击名称跳转下一级
    jumpLevelOneDepartment(info) {
      this.$router.push(
        "LevelOneDepartment?id=" + info.id + "&name=" + info.dealerName
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
      const { data: res } = await this.$http.post("dealer/remove", {
        id: info.id,
      });
      if (res.code != 200) return this.$message.error("删除失败");
      this.getScaleList();
    },
    // 搜索
    searchin() {},
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
