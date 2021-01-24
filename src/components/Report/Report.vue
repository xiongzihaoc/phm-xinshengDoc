<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: 'User' }"
          >报告列表</el-breadcrumb-item
        >
      </el-breadcrumb>
      <el-card>
        <!-- <div class="searchBox"> -->
          <!-- <el-select
            placeholder="请选择类型"
            prefix-icon="el-icon-search"
            size="small"
            class="searchInput"
            v-model="choosetype"
            @change="typeChange"
          >
            <el-option
              v-for="item in sheetTypeFisrt"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <!-- <el-select
            placeholder="请选择机构"
            prefix-icon="el-icon-search"
            size="small"
            class="searchInput"
            v-model="orgType"
            @focus="orgFocus"
            @change="orgChange"
          >
            <el-option
              v-for="item in sheetTypeSecond"
              :key="item.id"
              :label="item.dealerName"
              :value="item.id"
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
        </div> -->
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="infoList"
          :header="tableHeaderBig"
          style="margin-top: 1%"
        >
          <el-table-column
            align="center"
            slot="fixed"
            prop="orderNo"
            fixed="left"
            label="检测卡号"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="dealerName"
            slot="fixed"
            fixed="left"
            label="检测机构"
          >
          </el-table-column>
          <!-- <el-table-column
            align="center"
            slot="fixed"
            fixed="left"
            label="机构所属"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.cityList.length > 0">
                <span v-for="item in scope.row.cityList" :key="item.id"
                  >{{ item.packageName }}
                </span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            prop="packageName"
            slot="fixed"
            fixed="left"
            label="检测套餐"
          >
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            prop="orderNo"
            fixed="right"
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">未检测</span>
              <span v-if="scope.row.status == 1">已检测</span>
              <span style="color: red" v-if="scope.row.status == 2">预警</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <!-- 0 未检测  不能查看报告 -->
              <el-button
                v-if="scope.row.status == 0"
                size="mini"
                type="info"
                disabled
                >查看</el-button
              >
              <!-- 其他可以查看报告 -->
              <el-button
                v-else
                size="mini"
                type="primary"
                @click="lookOverReport(scope.row)"
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
import vueQr from "vue-qr";
export default {
  components: { EleTable, vueQr },
  data() {
    return {
      revampPasswordDialog: false,
      orgType: "",
      infoList: [],
      qrcodeUrl: "",
      sheetTypeSecond: [],
      tableHeaderBig: [
        { prop: "createTime", label: "录入时间" },
        { prop: "checkTime", label: "检测时间" },
        { prop: "reportTime", label: "报告时间" },
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      lookOverId: null,
      idCard: null,
      personal: {},
    };
  },
  created() {
    this.lookOverId = this.$route.query.id;
    this.idCard = this.$route.query.idCard;
    this.getDetail();
    this.getUserList();
  },
  methods: {
    // 获取个人详情信息
    async getDetail() {
      const { data: res } = await this.$http.post("us/list", {
        id: this.lookOverId,
        idCard: this.idCard,
      });
      if (res.code != 200) return this.$message.error("数据获取失败");
      this.personal = res.rows[0];
    },
    async getUserList() {
      const { data: res } = await this.$http.post("dealer_check/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        dealerId: this.orgType,
        // status: this.choosetype,
        idCard: this.idCard,
      });
      if (res.code != 200) return this.$message.error("数据获取失败");
      console.log(res);
      this.infoList = res.rows;
      this.total = res.total;
    },
    // 机构列表
    async getOrgList() {
      const { data: res } = await this.$http.post("dealer/list", {
        level: "level-5",
      });
      if (res.code != 200) return this.$message.error("数据获取失败");
      this.sheetTypeSecond = res.rows;
    },
    // 查看
    lookOverReport(val) {
      console.log(val);
      this.$router.push(
        "ReportDetail?orderNo=" +
          val.orderNo +
          "&id=" +
          val.id +
          "&idCard=" +
          val.idCard
      );
    },
    revampPasswordClosed() {
      this.revampPasswordDialog = false;
    },
    // 确定新增或修改
    revampPasswordEnter() {
      this.revampPasswordDialog = false;
      this.qrcodeUrl = "";
    },
    // 清空搜索条件
    clear() {
      this.orgType = "";
      this.getUserList();
    },
    // 获取机构列表
    orgFocus() {
      this.getOrgList();
    },
    // 选择机构更新列表
    orgChange(val) {
      this.orgType = val;
      this.getUserList();
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
</style>
