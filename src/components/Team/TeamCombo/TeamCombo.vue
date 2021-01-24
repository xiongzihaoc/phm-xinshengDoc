<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: 'Team' }"
          >团队列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">团队套餐</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- 打印按钮 -->
        <el-button
          @click="codeComboBtn"
          type="primary"
          size="mini"
          class="codeComboBtn"
          >打印套餐</el-button
        >
        <p class="personalTitle">团队资料</p>
        <div class="userDetail">
          <div class="option">
            <span>团队名称：{{ this.$route.query.teamName }}</span>
            <span>录入人数：{{ this.$route.query.teamNumber }}</span>
            <span>检测人数：{{ this.$route.query.checkNumber }}</span>
            <span style="visibility: hidden"></span>
          </div>
          <div class="option">
            <span>检测编号：{{ this.$route.query.teamNo }}</span>
            <span>创建时间：{{ this.$route.query.createTime }}</span>
            <span style="visibility: hidden"></span>
            <span style="visibility: hidden"></span>
          </div>
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
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="comboCode(scope.row)"
                >套餐二维码</el-button
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
        <el-button type="primary" @click="revampPasswordEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../../commonModule/table";
import vueQr from "vue-qr";
export default {
  components: { EleTable, vueQr },
  data() {
    return {
      revampPasswordDialog: false,
      infoList: [],
      qrcodeUrl: "",
      tableHeaderBig: [
        { prop: "packageName", label: "套餐名称" },
        { prop: "useNum", label: "使用人数" },
        { prop: "sheetName", label: "量表" },
        { prop: "remark", label: "描述" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      teamNo: "",
      personal: {},
    };
  },
  created() {
    this.teamNo = this.$route.query.teamNo;
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.post("team/check_list_package", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        teamNo: this.teamNo,
      });
      if (res.code != 200) return this.$message.error("数据获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 查看
    lookOverReport(val) {
      console.log(val);
    },
    revampPasswordClosed() {
      this.revampPasswordDialog = false;
    },
    // 确定新增或修改
    revampPasswordEnter() {
      this.revampPasswordDialog = false;
      this.qrcodeUrl = "";
    },
    // 套餐二维码
    comboCode(info) {
      console.log(info);
      this.qrcodeUrl = this.$code+"?type=1&orderNo="+info.uuid+this.$route.query.teamCode+"&teamNo="+this.teamNo;
      this.revampPasswordDialog = true;
      console.log(this.$code+"?type=1&orderNo="+info.uuid+"&teamCode="+this.$route.query.teamCode+"&teamNo="+this.teamNo);
    },
    // 打印套餐
    codeComboBtn() {
      this.$router.push(
        "CodeCombo?teamNo=" +
          this.$route.query.teamNo +
          "&teamName=" +
          this.$route.query.teamName +
          "&teamNumber=" +
          this.$route.query.teamNumber +
          "&checkNumber=" +
          this.$route.query.checkNumber +
          "&createTime=" +
          this.$route.query.createTime
      );
    },
    // 搜索
    searchin() {
      this.getUserList();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getUserList();
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
  // overflow: hidden;
}
.el-card {
  position: relative;
  width: 100%;
  height: 100%;
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
.personalTitle {
  font-weight: 700;
}
.userDetail {
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.userDetail .option {
  display: flex;
  color: #c1c2c9;
  padding: 2% 0 0 5%;
  box-sizing: border-box;
}
.option span {
  flex: 1;
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
.codeComboBtn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
