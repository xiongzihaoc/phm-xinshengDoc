<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }"
          >机构列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">配置量表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="searchBox">
          <el-input
            placeholder="请输入量表名称"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>
          <el-select
            placeholder="请选择类型"
            prefix-icon="el-icon-search"
            size="small"
            class="searchInput"
            v-model="type1"
            @change="type1Change"
          >
            <el-option
              v-for="item in sheetType1"
              :key="item.dictValue"
              :label="item.name"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
          <el-select
            placeholder="请选择种类"
            prefix-icon="el-icon-search"
            size="small"
            class="searchInput"
            v-model="type2"
            @change="type2Change"
          >
            <el-option
              v-for="item in sheetType2"
              :key="item.dictValue"
              :label="item.name"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
          <el-button
            type="danger"
            size="small"
            @click.prevent.stop="clear"
            style="margin-left: 2%"
            >清空</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="addUsers"
            style="margin-left: 2%"
            >编辑</el-button
          >
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="infoList"
          :header="tableHeaderBig"
          style="margin-top: 1%"
        >
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
        { prop: "name", label: "名称" },
        { prop: "type1Name", label: "类型" },
        { prop: "type2Name", label: "种类" },
        { prop: "remark", label: "描述" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      type1: "",
      type2: "",
      sheetType1: [],
      sheetType2: [],
    };
  },
  created() {
    this.sheetId = this.$route.query.id;
    this.getScaleList();
    this.getSheetType1List();
    this.getSheetType2List();
  },
  methods: {
    // 获取区域列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/getDealerSheetList", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        id: this.sheetId,
        name: this.input,
        type: this.type1,
        type2: this.type2,
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 数据字典量表类型列表
    async getSheetType1List() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "SHEET_TYPE",
      });
      console.log(res);
      this.sheetType1 = res.data;
    },
    // 数据字典量表类型列表
    async getSheetType2List() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "sheet_type2",
      });
      console.log(res);
      this.sheetType2 = res.data;
    },
    // 编辑跳转
    addUsers() {
      this.$router.push("SheetEditOrganization?id=" + this.sheetId);
    },
    type1Change(val) {
      this.type1 = val;
      this.getScaleList();
    },
    type2Change(val) {
      this.type2 = val;
      this.getScaleList();
    },
    clear() {
      this.input = "";
      this.type1 = "";
      this.type2 = "";
      this.getScaleList();
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
  width: 20%;
  margin-right: 15px;
  max-width: 200px;
}
</style>
  