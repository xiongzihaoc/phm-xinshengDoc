<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle">套餐列表</el-breadcrumb-item>
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
          <!-- 操作 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
            width="300"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="revampPassword(scope.row)"
                type="primary"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                size="mini"
                @click="comboCode(scope.row)"
                type="warning"
                icon="el-icon-present"
                >套餐二维码</el-button
              >
              <el-button
                size="mini"
                @click="deleteBtn(scope.row)"
                type="danger"
                icon="el-icon-delete"
                >删除</el-button
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
      <!-- 二维码弹框 -->
      <el-dialog
        title="套餐二维码"
        :visible.sync="revampPasswordDialog"
        width="40%"
        @closed="revampPasswordClosed"
        v-dialogDrag
      >
        <vue-qr :text="qrcodeUrl" :size="300" class="qrcode"></vue-qr>
        <div class="qrcodeTxt">【使用微信扫一扫进行检测】</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="revampPasswordDialog = false">取 消</el-button>
          <el-button type="primary" @click="revampPasswordEnter"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import EleTable from "../commonModule/table";
import vueQr from "vue-qr";
export default {
  components: { EleTable, vueQr },
  data() {
    return {
      revampPasswordDialog: false,
      infoList: [],
      qrcodeUrl: "",
      tableHeaderBig: [
        { prop: "name", label: "名称" },
        { prop: "sheetName", label: "量表" },
        { prop: "remark", label: "描述" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      teamListForm: {},
    };
  },
  created() {
    this.getScaleList();
  },
  methods: {
    // 获取区域列表
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/package/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input,
      });
      if (res.code != 200) return this.$message.error("数获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 套餐二维码
    comboCode(info) {
      this.qrcodeUrl = info.uuid;
      this.revampPasswordDialog = true;
    },
    // 新增套餐
    addUsers() {
      this.$router.push("AddCombo?isEditType=0");
    },
    // 修改套餐
    revampPassword(info) {
      this.$router.push("AddCombo?isEditType=1&id=" + info.id);
    },
    revampPasswordClosed() {
      this.revampPasswordDialog = false;
    },
    // 确定新增或修改
    revampPasswordEnter() {
      this.revampPasswordDialog = false;
      this.qrcodeUrl = "";
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
      const { data: res } = await this.$http.post("/dealer/package/del", {
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
.qrcode {
  margin-left: 50%;
  transform: translateX(-50%);
}
.qrcodeTxt {
  text-align: center;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
