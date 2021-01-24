<template>
  <div style="height: 100%" class="reportContent">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Report' }"
        >检测报告</el-breadcrumb-item
      >
      <el-breadcrumb-item>报告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="print_box">
      <div style="float: right">
        <!-- <el-button
          type="primary"
          size="mini"
          v-if="this.infoObj.checkState == 0"
          @click.prevent.stop="hasConfirm"
          >确认审核</el-button
        > -->
        <el-button
          type="primary"
          size="mini"
          style="margin-bottom: 5px"
          v-show="codeBtnShow"
          v-print="printObj"
          @click.prevent.stop="hiddenAnsDetail"
          >打印</el-button
        >
      </div>
      <div id="printMe">
        <div class="titleFlex">
          <span class="orangeYuan"></span>
          <span class="dataStat">个人资料</span>
        </div>
        <!-- 个人信息部分 -->
        <el-card>
          <ul class="content personalInfo">
            <li class="testNum">
              <span>
                姓名:
                <i>{{ infoObj.name }}</i>
              </span>
              <span>
                性别:
                <i>{{ infoObj.sex }}</i>
              </span>
              <span>
                手机:
                <i>{{ infoObj.phone }}</i>
              </span>
              <span>
                年龄:
                <i>{{ infoObj.age }}</i>
              </span>
            </li>
            <li class="testNum">
              <span>
                婚姻状况:
                <i>{{ infoObj.marriage }}</i>
              </span>
              <span>
                文化程度:
                <i>{{ infoObj.edu }}</i>
              </span>
              <span>
                所属:
                <i v-text="this.infoObj.source == 0 ? '个人' : '团队'"></i>
              </span>
              <span>
                职业:
                <i>{{ infoObj.job }}</i>
              </span>
            </li>
            <li class="testNum">
              <span style="display: flex">
                检测卡号:
                <i>{{ this.Number }}</i>
              </span>
              <span>
                医生:
                <i>{{ infoObj.docName }}</i>
              </span>
              <span>
                报告时间:
                <i>{{ infoObj.reportTime }}</i>
              </span>
              <span>
                检测时间:
                <i>{{ infoObj.checkTime }}</i>
              </span>
            </li>
          </ul>
        </el-card>
        <div class="titleFlex" style="margin: 1% 0">
          <span class="orangeYuan"></span>
          <span class="dataStat" style="font-size: 18px">检测结果</span>
        </div>
        <!-- 已整合量表  -->
        <ul class="reportInfo" v-if="isZh == 1 && conformityList.length > 0">
          <el-card>
            <li v-for="item in conformityList" :key="item.id">
              <!-- 量表名称 查看答题详情按钮 -->
              <div class="reportList">
                <div class="reportNameCss">
                  <!-- <img src="../../assets/images/reportName.png" /> -->
                  <span class="reportName">{{ item.sheetName }}</span>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  v-show="codeBtnShow"
                  @click="jumpAnsDet(item)"
                  >查看答题详情</el-button
                >
              </div>
              <!-- 总分 -->
              <div class="total">
                <span v-if="item.resultType == 0"
                  >总得分：{{ item.score }}</span
                >
                <span v-else>
                  <a v-if="item.score == 1.0">阳性</a>
                  <a v-else>阴性</a>
                </span>
              </div>
              <!-- 量表 评语 -->
              <div class="mainContentBox">
                <div class="mainContentBox_right">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 5px;
                    "
                  >
                    <!-- <img src="../../assets/images/pingyu.png" /> -->
                    <span
                      style="color: #fe9a00; margin-left: 5px; font-weight: 700"
                      >评语：</span
                    >
                  </div>
                  <span style="font-weight: 700; color: #1b2338">
                    {{ item.comment }}
                  </span>
                </div>
              </div>
            </li>
            <!-- 检测建议 -->
            <div class="titleFlex" style="margin-top: 10px">
              <span class="orangeYuan"></span>
              <span class="dataStat">检测建议</span>
            </div>
            <li
              class="testAdvice adviceCard"
              v-if="generaladvice != null"
              v-html="generaladvice"
            ></li>
          </el-card>
        </ul>
        <!-- 未整合量表-->
        <ul class="reportInfo" v-if="unconformityList.length > 0">
          <li v-for="item in unconformityList" :key="item.id">
            <el-card>
              <!-- 量表名称 查看答题详情按钮 -->
              <div class="reportList">
                <div class="reportNameCss">
                  <!-- <img src="../../assets/images/reportName.png" /> -->
                  <span class="reportName">{{ item.sheetName }}</span>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  v-show="codeBtnShow"
                  @click="jumpAnsDet(item)"
                  >查看答题详情</el-button
                >
              </div>
              <div class="total">
                <span v-if="item.resultType == 0"
                  >总得分：{{ item.score }}</span
                >
                <span v-else>
                  <a v-if="item.score == 1.0">阳性</a>
                  <a v-else>阴性</a>
                </span>
              </div>
              <!-- 量表 评语 -->
              <div class="mainContentBox">
                <div class="mainContentBox_right">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 5px;
                    "
                  >
                    <!-- <img src="../../assets/images/pingyu.png" /> -->
                    <span
                      style="color: #fe9a00; margin-left: 5px; font-weight: 700"
                      >评语：</span
                    >
                  </div>
                  <span style="font-weight: 700; color: #1b2338">
                    {{ item.comment }}
                  </span>
                </div>
              </div>
              <!-- 检测建议 -->
              <div class="titleFlex" style="margin-top: 10px">
                <span class="orangeYuan"></span>
                <span class="dataStat">检测建议</span>
              </div>
              <li class="testAdvice adviceCard" v-html="item.suggestion"></li>
            </el-card>
            <ul></ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
export default {
  components: { vueQr },
  data() {
    return {
      Number: "",
      advice: "",
      infoObj: {},
      reportList: [],
      codeBtnShow: true,
      conformityList: [],
      unconformityList: [],
      generaladvice: "",
      isZh: "",
      printObj: {
        id: "printMe", // 这里是要打印元素的ID
        popTitle: "", // 打印的标题
        extraCss: "", // 打印可引入外部的一个 css 文件
        ignoreClass: "noprint",
        extraHead: "", // 打印头部文字
        endCallback() {
          alert("3333");
          this.codeComboBtnShow = true;
        },
      },
    };
  },
  created() {
    this.Number = this.$route.query.orderNo;
    this.getReportList();
    this.getUserDetail();
  },
  methods: {
    // 获取报告
    async getReportList() {
      const { data: res } = await this.$http.post("dealer_check/getReport", {
        orderNo: this.Number,
      });
      console.log(res);
      if (res.code !== 200) return this.$message("获取数据失败");
      console.log(res);
      this.unconformityList = res.data.unconformity;
      this.conformityList = res.data.conformity;
      this.generaladvice = res.data.suggestion.advice;
      this.isZh = res.data.isZh;
    },
    // 获取个人详情信息
    async getUserDetail() {
      const { data: res } = await this.$http.post("dealer_check/getCheckInfo", {
        orderNo: this.$route.query.orderNo,
      });
      console.log(res);
      if (res.code != 200) return this.$message.error("数据获取失败");
      this.infoObj = res.data;
      console.log(res);
    },
    jumpAnsDet(info) {
      console.log(info);
      this.$router.push({
        path: "AnsDetail?ansUuid=" + info.ansUuid,
      });
    },
    // 点击打印隐藏查看答题详情按钮
    hiddenAnsDetail(info) {
      this.codeBtnShow = false;
      setTimeout(this.codeBtnShowF, 0);
    },
    codeBtnShowF() {
      this.codeBtnShowF = true;
      clearTimeout();
    },
    codeBtnShowF() {
      this.codeBtnShow = true;
    },
  },
};
</script>
<style lang="scss" scope>
[v-cloak] {
  display: none;
}
li {
  list-style: none;
}
h4 {
  text-align: center;
  padding-bottom: 20px;
}
.title {
  font-weight: 700;
}
.sheetName {
  text-align: center;
  font-weight: 700;
  padding: 10px 0;
  box-sizing: border-box;
}
.score {
  display: inline-block;
  border-radius: 5px;
  color: #ff9a00;
  font-size: 12px;
  padding: 4px 10px;
  margin: 5px;
  border: 1px solid #ff9a00;
}
.answer {
  text-align: center;
}
.TitleContent {
  padding: 10px 0;
}
.buttonBox {
  display: flex;
}
.adviceCard {
  margin-top: 20px;
}
.adviceCard .content {
  box-sizing: border-box;
  margin-top: 10px;
  border: 1px dashed #409eff;
  padding: 10px;
  border-radius: 7px;
}
.dataStat {
  color: #1b2338;
  font-family: PingFang SC !important;
  font-weight: 700;
  font-size: 18px;
  line-height: normal;
  padding-left: 5px;
  box-sizing: border-box;
}
.titleFlex {
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.personalInfo li {
  margin: 1% 0;
  display: flex;
  color: #c1c2c9;
  font-size: 16px;
  font-weight: 400;
}
.personalInfo li span {
  flex: 1;
}

.testNum span:nth-child(1) {
  flex: 1.4;
}
.personalInfo li i {
  color: #2c3e50;
  font-weight: 700;
  font-style: normal;
}
.reportInfo li {
  margin-bottom: 20px;
}
.reportList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reportNameCss {
  display: flex;
  align-items: center;
}
.reportContent img {
  width: 32px;
  height: 32px;
}
.reportName {
  font-size: 22px;
  color: #2c8cf0;
  margin-left: 5px;
}
.reportInstr {
  font-size: 16px;
  color: #b4b5bf;
}
.total {
  color: #fe9a00;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 3px;
}
.mainContentBox {
  display: flex;
  align-items: flex-start;
}
.mainContentBox_left {
  // padding-right: 20px;
  // box-sizing: border-box;
  flex: 1;
}
.mainContentBox_right {
  flex: 1;
  padding: 15px;
  background: #fff9eb;
  border-radius: 10px;
}
.testAdvice .testAdvice_title {
  font-size: 22px;
  color: #fe9a00;
  margin-left: 5px;
}
.testAdvice_content {
  padding: 15px;
  box-sizing: border-box;
  margin-top: 10px;
  background: #fff9eb;
  border-radius: 10px;
  color: #1b2338;
  font-weight: 700;
}
.reportContent .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  border-radius: 15px;
  margin: 10px 0;
}
.print_box {
  padding-top: 20px;
  box-sizing: border-box;
}
.orangeYuan {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: orange;
}
</style>
