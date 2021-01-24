<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Report' }"
          >检测报告</el-breadcrumb-item
        >
        <el-breadcrumb-item>报告详情</el-breadcrumb-item>
        <el-breadcrumb-item>答题详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="searchBox">
          <el-button type="primary" size="small" @click="back"
            >返回上一级</el-button
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
            label="序号"
            prop="quesOrder"
          >
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="left"
            label="题目"
            prop="quesContent"
          >
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="left"
            label="答案"
            prop="optContent"
          >
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
      tableHeaderBig: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
    };
  },
  created() {
    this.getScaleList();
  },
  methods: {
    // 获取列表
    async getScaleList() {
      const { data: res } = await this.$http.post(
        "dealer_check/getAnswerRecord",
        {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          ansUuid: this.$route.query.ansUuid,
        }
      );
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    back: function () {
      this.$router.go(-1);
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
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
