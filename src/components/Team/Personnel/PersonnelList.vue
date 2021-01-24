<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: 'Team' }"
          >团队列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">人员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
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
        <div>
          <!--  -->
          <el-button
            type="primary"
            size="mini"
            @click="importPrient"
            v-if="deptCode.length == 3"
            >导入员工</el-button
          >
          <el-button type="primary" size="mini" @click="exportPrient">导出员工</el-button>
        </div>
        <!-- 调用公用表格组件 -->
        <el-table
          id="exportTab"
          ref="exportTab"
          :data="patientList"
          style="margin-top:1%;"
          :header-cell-style="{
            background: '#5BAEFF',
            height: '50px',
            color: '#fff',
          }"
        >
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="ordrNo"
            label="检测卡号"
          />
          <el-table-column align="center" prop="name" label="姓名" />
          <el-table-column
            align="center"
            prop="idCard"
            show-overflow-tooltip
            label="身份证"
          />
          <el-table-column align="center" prop="sex" label="性别" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="phone"
            label="手机"
          />
          <el-table-column
            align="center"
            prop="birth"
            show-overflow-tooltip
            label="生日"
          />
          <el-table-column align="center" prop="marriage" label="婚姻" />
          <el-table-column align="center" prop="edu" label="文化" />
          <el-table-column align="center" prop="job" label="职业" />
          <!--  -->
          <el-table-column
            v-if="deptCode.length == 3 || deptCode.length == 6"
            align="center"
            show-overflow-tooltip
            label="组织">
            <template slot-scope="scope">
              {{scope.row.dept}}-{{scope.row.deptGroup}}
            </template>
          </el-table-column>
          <!-- <el-table-column
                  align="center"
                  prop="teamNo"
                  label="检测套餐"/> -->
                <el-table-column
                  align="center"
                  prop="checkTime"
                  label="检测时间">
                    <template slot-scope="scope">
                      <div v-if="scope.row.checkTime == null"></div>
                      <div v-else>{{timesChangeDate(scope.row.checkTime)}}</div>
                    </template>
                  </el-table-column>
                <el-table-column
                  align="center"
                  prop="state"
                  label="结果">
                    <template slot-scope="scope">
                      <div v-if="scope.row.state==1">已检测</div>
                      <div v-else-if="scope.row.state==2">预警</div>
                      <div v-else>未检测</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.state==1 || scope.row.state==2"
                      type="primary"
                      size="mini"
                      @click.prevent.stop="checkPatientReport(scope.row)">报告</el-button>
                    <el-button v-else type="info"  size="mini" disabled>未检测</el-button>
                  </template>
                </el-table-column>
            </el-table>
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
    <el-dialog 
        title="导入人员信息"
        :visible.sync="dialogPrient"
        v-dialogDrag
        center>
        <div class="fileUpload">
          <a href="https://zykj-resource.oss-cn-hangzhou.aliyuncs.com/Patienttemplate/PhmTemplate.xls"><el-button size="small" type="success">下载模板</el-button></el-button></a>
          <!-- :headers="config" -->
          <el-upload
            style="margin-top: 20px;"
            class="upload-demo"
            ref="upload"
            :headers="config"
            action="http://192.168.0.111:8085/zhuoya-web/team/importTeamMember"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="upload_success"
            :on-error="upload_error"
            :multiple="false"
            :limit="1"
            :data="fileData"
            :file-list="fileList"
            :before-upload="fileUploadBefore">
          <div>
            上传文件
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传Excel文件，且不超过5M
            </div>
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPrient = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../../commonModule/table";
import vueQr from "vue-qr";
import { timesChangeDate } from "../../../assets/js/util";
export default {
  components: { EleTable, vueQr },
  data() {
    return {
      config: {},
      fileData: {},
      fileList: [],
      dialogPrient: false,
      timesChangeDate,
      deptCode: "",
      teamInfo: "",
      deptCheckInfo: {}, //检测信息
      patientList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      teamNo:'',
    };
  },
  created() {
    this.teamNo = this.$route.query.teamNo;
    this.config.Authorization = window.sessionStorage.getItem("token");
    this.deptCode = this.$route.query.teamCode;
    // this.deptCheckInfo = JSON.parse(this.$route.query.packageInfo);
    this.fileData.teamDept = this.deptCode;
    this.fileData.teamNo = this.teamNo;
    // this.getTeamInfo();
    this.getDeptPatient();
  },
  methods: {
    submitUpload() {
      this.dialogPrient = false;
      // this.getTeamInfo();
    },
    fileUploadBefore(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!extension && !extension2) {
        this.$message.warning("上传模板只能是 xls、xlsx格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 5MB!");
        return false;
      }
      return; // 返回false不会自动上传
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    upload_success(response) {
      console.log(response);
      if(response.code == 200){
        this.$message.success('文件上传成功');
        return;
      }else if(response.code == 300){
        this.fileList = [];
        var error = response.data.error;
        var errorData = "";
        if (error != null && error.length > 0) {
          error.forEach((element) => {
            errorData += element + "<br>";
          });
        }
        this.$alert(errorData, '错误信息', {
          dangerouslyUseHTMLString: true
        });
      }else {
        this.fileList = [];
        this.$message.success('文件上传失败');
      }
    },
    upload_error(err) {
      console.log(err);
    },
    //导入人员信息
    importPrient() {
      this.dialogPrient = true;
    },
    //导出员工信息
    exportPrient() {
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendor/Export2Excel");
        const tHeader = [
          "检测卡号",
          "身份证",
          "性别",
          "手机",
          "生日",
          "婚姻",
          "文化",
          "职业",
          "组织",
          "检测时间",
          "结果",
        ];
        const filterVal = [
          "orderNo",
          "idCard",
          "sex",
          "phone",
          "birth",
          "marriage",
          "edu",
          "job",
          "teamDept",
          "checkTime",
          "state",
        ];
        const list = this.patientList;
        const data = this.formatJson(filterVal, list);
        // console.log(data);
        export_json_to_excel(tHeader, data, "员工信息");
      });
    },
    formatJson(filterVal, jsonData) {
      // 　var datas  = jsonData.map(v => filterVal.map(j =>  v[j]));
      var data = []; //= jsonData.map(v => filterVal.map(j => v[j]));
      jsonData.forEach((element) => {
        var prient = [];
        filterVal.forEach((e) => {
          if (e == "state") {
            if (element[e] == 3) {
              prient.push("已检测");
            } else {
              prient.push("未检测");
            }
          } else if (e == "checkTime") {
            prient.push(this.timesChangeDate(element[e]));
          } else {
            prient.push(element[e]);
          }
        });
        data.push(prient);
      });
      return data;
    },
    // async getTeamInfo() {
    //   //获取团队详情
    //   const { data: res } = await this.$http.post("teamList/dept/info", {
    //     code: this.deptCode,
    //   });
    //   this.teamInfo = res.data;
    //   this.getDeptPatient();
    // },
    async getDeptPatient() {
      const { data: res } = await this.$http.post("team/getImportMember", {
        teamNo: this.teamNo,
        teamDept: this.deptCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
      console.log(res);
      this.patientList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getDeptPatient();
    },
    checkPatientReport(info) {
      this.$router.push(
        "ReportDetail?orderNo=" +
          info.ordrNo +
          "&idCard=" +
          info.idCard
      );
      // this.$router.push({
      //   path: "/home/examiningReport/examiningDetail",
      //   query: { orderNo: info.orderNo },
      // });
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
