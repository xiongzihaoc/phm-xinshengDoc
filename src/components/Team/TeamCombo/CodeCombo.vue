<template>
  <div class="connect">
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: 'Team' }"
          >团队列表</el-breadcrumb-item
        >
        <el-breadcrumb-item
          class="currentTitle"
          :to="{
            path:
              'TeamCombo?teamNo=' +
              this.$route.query.teamNo +
              '&teamName=' +
              this.$route.query.teamName +
              '&teamNumber=' +
              this.$route.query.teamNumber +
              '&checkNumber=' +
              this.$route.query.checkNumber +
              '&createTime=' +
              this.$route.query.createTime,
          }"
          >团队套餐</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">打印套餐</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card id="printMe">
        <!-- 打印按钮 -->
        <el-button
          @click="codeComboBtn"
          type="primary"
          size="mini"
          class="codeComboBtn"
          v-show="codeComboBtnShow"
          v-print="printObj"
          >打印</el-button
        >
        <p class="personalTitle">团队资料</p>
        <ul class="content personalInfo">
          <li class="testNum">
            <span>
              团队名称：:
              <i>{{ this.$route.query.teamName }}</i>
            </span>
            <span>
              录入人数：:
              <i>{{ this.$route.query.teamNumber }}</i>
            </span>
            <span>
              检测人数：:
              <i>{{ this.$route.query.checkNumber }}</i>
            </span>
          </li>
          <li class="testNum">
            <span>
              检测编号：:
              <i>{{ this.$route.query.teamNo }}</i>
            </span>
            <span>
              创建时间：:
              <i>{{ this.$route.query.createTime }}</i>
            </span>
            <span style="visibility: hidden">
              职业:
              <i>{{ this.$route.query.createTime }}</i>
            </span>
          </li>
        </ul>
        <ul class="packagebox">
          <li v-for="item in infoList" :key="item.uuid">
            <h2>{{ item.packageName }}</h2>
            <div class="codebox">
              <p class="title">套餐量表</p>
              <div class="content">
                {{ item.sheetName }}
              </div>
            </div>
            <div class="codebox">
              <p class="title">套餐二维码</p>
              <vue-qr :text="item.uuid" :size="300" class="qrcode"></vue-qr>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>
<script>
import vueQr from "vue-qr";
export default {
  components: { vueQr },
  data() {
    return {
      infoList: [],
      teamNo: "",
      personal: {},
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

      codeComboBtnShow: true,
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
      this.infoList = res.rows;
      console.log(res);
    },
    // 打印套餐
    codeComboBtn() {
      this.codeComboBtnShow = false;
      setTimeout(this.codeBtnShowF, 0);
    },
    codeBtnShowF() {
      this.codeComboBtnShow = true;
      clearTimeout();
    },
    codeBtnShowF() {
      this.codeComboBtnShow = true;
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
  font-size: 18px;
  font-weight: 700;
}
.qrcode {
  margin-left: 40px;
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
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.codebox .title {
  margin: 10px 0;
  font-weight: 700;
  font-size: 18px;
}
.codebox .content {
  padding-left: 60px;
  box-sizing: border-box;
}
.codebox .content span {
  margin-right: 15px;
}
.packagebox li {
  margin-top: 20px;
  border-bottom: 1px solid #f5f5f5;
}
.personalInfo {
  border-bottom: 1px solid #f5f5f5;
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
</style>
