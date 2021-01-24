<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle">用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="searchBox">
          <el-input
            placeholder="请输入姓名/手机号/身份证"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            v-if="identify == 4"
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
          <!-- 操作 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="lookOver(scope.row)"
                >查看</el-button
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
  </div>
</template>
<script>
import EleTable from "../commonModule/table";

export default {
  components: { EleTable },
  data() {
    return {
      revampPasswordDialog: false,
      infoList: [],
      identify: "",
      tableHeaderBig: [
        { prop: "name", label: "姓名" },
        { prop: "sex", label: "性别" },
        { prop: "phone", label: "手机号" },
        { prop: "idCard", label: "身份证" },
        { prop: "job", label: "职业" },
        { prop: "edu", label: "文化" },
        { prop: "marriage", label: "婚姻状况" },
        { prop: "birth", label: "出生日期" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
    };
  },
  created() {
    this.identify = JSON.parse(localStorage.getItem("message")).identify;

    this.getScaleList();
  },
  methods: {
    // 获取列表
    async getScaleList() {
      const { data: res } = await this.$http.post("us/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input,
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 查看
    lookOver(val) {
      this.$router.push("UserDetail?id=" + val.id + "&idCard=" + val.idCard);
    },
    // 新增
    addUsers() {
      this.$router.push("AddUser");
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
      this.getScaleList();
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
