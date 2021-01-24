<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/User' }"
          >用户列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">新增</el-breadcrumb-item>
      </el-breadcrumb>
    </el-breadcrumb>
    <el-card>
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
        class="addForm"
      >
        <p class="addForm_title">基本信息</p>
        <el-form-item label="检测卡号" class="formWidth" prop="CheckNo">
          <el-input v-model="addForm.checkNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择套餐" class="formWidth" prop="deptName">
          <el-input
            class="selectInt"
            @focus="chooseSheet"
            placeholder="请选择量表"
          >
          </el-input>
          <i
            v-show="clearShow"
            @click.prevent.stop="clearchoose"
            class="iconfont icon-close-o"
          ></i>
          <!-- <div
            class="addComboSheet"
            v-for="item in checkComboList"
            @click="chooseSheet"
            :key="item.uuid"
          >
            {{ item.name }}
          </div> -->
          <div
            class="addComboSheet"
            @click="chooseSheet"
            v-for="item in checkAllSheetList"
            :key="item.value"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="danger" @click="clear()">取消</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-card>
    <!-- 选择量表弹框 -->
    <el-dialog
      title="选择量表"
      :visible.sync="revampPasswordDialog"
      width="40%"
      @closed="revampPasswordClosed"
      v-dialogDrag
    >
      <div class="chooseCombobox">
        <div
          class="chooseCombo"
          v-if="comboList != null && comboList.length > 0"
        >
          <p class="title">选择套餐</p>
          <el-checkbox-group v-model="checkComboListbox">
            <el-checkbox
              v-for="item in comboList"
              :label="item"
              :key="item.uuid"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <ul>
          <li v-for="(item, index) in sheetList" :key="index">
            <p class="title">{{ item.name }}</p>
            <div v-for="(sheetItem, index) in item.child" :key="index">
              <p>{{ sheetItem.name }}</p>
              <el-checkbox-group v-model="checksheetListbox">
                <el-checkbox
                  v-for="subItem in sheetItem.child"
                  :label="subItem"
                  :key="subItem.id"
                  >{{ subItem.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revampPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="revampPasswordEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码弹框 -->
    <el-dialog
      title="套餐二维码"
      :visible.sync="codeDialog"
      width="40%"
      @closed="codeDialogClosed"
      v-dialogDrag
    >
      <vue-qr :text="qrcodeUrl" :size="300" class="qrcode"></vue-qr>
      <div class="qrcodeTxt">【使用微信扫一扫进行检测】</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="codeDialog = false">取 消</el-button>
        <el-button type="primary" @click="codeEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 安装c-lodop打印驱动 -->
    <el-dialog
      title="安装c-lodop打印驱动"
      :visible.sync="cLodopDailog"
      width="40%"
      v-dialogDrag
    >
      <div>根据检查您为安装打印机驱动，请点击下方链接进行安装</div>
      <a
        href="https://zykj-resource.oss-cn-hangzhou.aliyuncs.com/C-Lodop/Lodop6.226_Clodop4.118.zip"
        >下载驱动</a
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="cLodopDailog = false">取 消</el-button>
        <el-button type="primary" @click="cLodopDailog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
  <script>
import vueQr from "vue-qr";
import { getLodop, isLodopInstall } from "../../assets/js/lodop/LodopFuncs.js";
export default {
  components: { vueQr },
  data() {
    // 手机号码验证规则
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      // 新增表单验证规则
      addFormRules: {
        name: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
      revampPasswordDialog: false,
      codeDialog: false,
      comboList: [],
      sheetList: [],
      checkComboListbox: [],
      checksheetListbox: [],
      checkComboList: [],
      checksheetList: [],
      clearShow: false,
      addForm: {
        checkNo: "",
      },
      qrcodeUrl: "",
      information:{},
      cLodopDailog:false,
      checkAllSheetList:[]
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.getCheckNo();
    this.getTreeList();
  },
  methods: {
    // 获取量表树级列表
    async getTreeList() {
      const { data: res } = await this.$http.post(
        "dealer/getTreePackageAndSheet",
        {
          id: this.information.dealerId,
        }
      );
      if (res.code != 200) return this.$message.error("获取量表数据失败");
      this.comboList = res.data.packages;
      var sheet = res.data.sheets;
      // var sheetBox = [];
      // sheet.forEach((item) => {
      //   item.child.forEach((e) => {
      //     sheetBox.push(e);
      //   });
      // });
      this.sheetList = sheet;
      console.log(this.sheetList);
    },
    // 获取随机编号
    async getCheckNo() {
      const { data: res } = await this.$http.post(
        "dealer_check/getCheckNo",
        {}
      );
      console.log(res);
      this.addForm.checkNo = res.data;
    },
    // 提交
    submit() {
      var checkComboUUid=[];
      var checkSheetUUid=[];
      this.checkComboList.forEach(element=>{
        checkComboUUid.push(element.uuid);
      });
      this.checksheetList.forEach(element=>{
        checkSheetUUid.push(element.value);
      });
      // 跳转地址
      // this.checkComboList = this.checkComboList.map((e) => {
      //   return e.uuid;
      // });
      // this.checksheetList = this.checksheetList.map((e) => {
      //   return e.value;
      // });
      // 未选量表 阻止
      if (checkSheetUUid.length <= 0 && checkComboUUid.length <= 0) {
        this.$message.error("请选择量表或套餐");
        return;
      }
      // 请求
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "dealer_check/saveCheckList",
          {
            orderNo: this.addForm.checkNo,
            packageSheet: {
              dpackage: checkComboUUid,
              sheet: checkSheetUUid,
            },
          }
        );
        if (res.code != 200) return this.$message.error("保存失败请重试");
        // this.checkAllSheetList = [];
        // this.checkComboListbox = [];
        // this.checksheetListbox = [];
        // this.checkComboList = [];
        // this.checksheetList = [];
        // this.codeDialog = true;
        // 地址栏参数拼接
        this.qrcodeUrl =
          this.$code + "?type=0" + "&orderNo=" + this.addForm.checkNo;
        console.log(this.qrcodeUrl);
        this.printOrder(this.addForm.checkNo);
      });
    },
    printOrder(checkCardNum) {
      var checkSheetName = [];
      this.checkAllSheetList.forEach(element=>{
        checkSheetName.push(element.name);
      })
      var iCurLine = checkSheetName.length*20;
      var LODOP = getLodop();
      if (!isLodopInstall()) {
        this.cLodopDailog = true;
      } else {
          var a = localStorage.getItem('loginUrl');
          var b = localStorage.getItem('num');
          var qCodeUrl = this.$code + "?type=0" + "&orderNo=" + this.addForm.checkNo;
          LODOP.PRINT_INIT("检测套餐打印");
          LODOP.SET_PRINT_PAGESIZE(3, 600, 45, '');
          //设置纸张高度   
          LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
          LODOP.ADD_PRINT_HTM(50, 55, 100, 50, "检测套餐");
          LODOP.ADD_PRINT_HTM(70, 1, 160, iCurLine * 0.8, "打印时间:");
          LODOP.ADD_PRINT_HTM(90, 10, 160, iCurLine * 1.2, this.getDate());
          LODOP.ADD_PRINT_HTM(110, 1, 150, 10, "检测卡号:");
          LODOP.ADD_PRINT_TEXT(130, 10, 160, 50, this.addForm.checkNo);
          LODOP.ADD_PRINT_HTM(150, 1, 400, 10, "检测量表:");
          for (var i=0;i<checkSheetName.length;i++) {
            LODOP.ADD_PRINT_TEXT(180+i*20, 20, 400, 50, checkSheetName[i]);
          }
          // 套餐内容
          LODOP.ADD_PRINT_HTM(180+checkSheetName.length*20, 1, 400, 10, '检测二维码:');
          // 打印的二维码患者扫描二维码直接登录测试
          LODOP.SET_PRINT_STYLEA(0, "QRCodeVersion", 14);
          LODOP.ADD_PRINT_BARCODE(220+checkSheetName.length*20, 1, 200, 200, 'QRCode', qCodeUrl);
          //直接打印
          LODOP.PRINT();
          this.checkAllSheetList = [];
          this.checkComboListbox = [];
          this.checksheetListbox = [];
          this.checkComboList = [];
          this.checksheetList = [];
          this.$router.go(-1);
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      console.log(currentdate);
      return currentdate;
    },
    // 选择量表弹框确定
    revampPasswordEnter() {
      this.checkAllSheetList = [];
      this.checkComboList = this.checkComboListbox;
      this.checksheetList = this.checksheetListbox;
      if(this.checksheetList != null && this.checksheetList.length > 0){
        this.checksheetList.forEach(element => {
          this.checkAllSheetList.push(element);
        });
      }
      if(this.checkComboList != null && this.checkComboList.length > 0){
        this.checkComboList.forEach(element => {
          this.getPackageSheet(element.uuid);
        });
      } 
      // 有选择量表清空按钮显示
      if (this.checkComboList.length > 0 || this.checksheetList.length > 0) {
        this.clearShow = true;
      }
      this.revampPasswordDialog = false;
    },
    async getPackageSheet(packageUUid){//获取套餐中的量表信息
      const { data: res } = await this.$http.post(
        "dealer_check/getOrderSheet",
        {packageUuid:packageUUid}
      );
      if(res != null && res.code == 200){
        if(res.data != null && res.data.length > 0){
          var shetList = res.data;
          shetList.forEach(element => {
            var sheetInfo = {};
            sheetInfo.value = element.uuid;
            sheetInfo.name = element.name;
            this.checkAllSheetList.push(sheetInfo);
          });
          
        }
      }
      console.log(res);
    },
    revampPasswordClosed() {},
    chooseSheet() {
      this.revampPasswordDialog = true;
    },
    // 二维码弹框确定
    codeEnter() {
      this.$router.go(-1);
    },
    codeDialogClosed() {
      this.$router.go(-1);
    },
    clearchoose() {
      this.checkAllSheetList = [];
      this.clearShow = false;
      this.checkComboListbox = [];
      this.checksheetListbox = [];
      this.checkComboList = [];
      this.checksheetList = [];
    },
    // 清空
    clear() {
      this.$router.go(-1);
    },
  },
};
</script>
  <style scoped>
.title {
  padding: 10px 0;
  /* border-bottom: 1px solid #ccc; */
  font-weight: 700;
  font-size: 20px;
}
.addForm {
  margin: 10px 0;
}
.addForm_title {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
}
.formWidth {
  width: 600px;
}
.submit {
  display: flex;
  justify-content: center;
}
.connect {
  height: 100%;
  overflow: hidden;
}
.back {
  cursor: pointer;
}
.el-select {
  width: 100%;
}
.addComboSheet {
  font-weight: 700;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top: none;
}
.chooseCombo .title {
  font-size: 18px;
  font-weight: 700;
  color: #000;
}
.chooseCombo {
  padding-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
}
.chooseCombobox {
  height: 60vh;
  overflow: auto;
}
ul {
  list-style: none;
}
ul .title {
  font-weight: 700;
  font-size: 18px;
  color: #000;
}
.el-checkbox {
  width: 42%;
  margin: 5px 30px 5px 0;
}
ul >>> .el-checkbox__label {
  width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.selectInt {
  position: relative;
}
.icon-close-o {
  position: absolute;
  top: 0;
  right: 10px;
}
.icon-close-o:hover {
  cursor: pointer;
}
.qrcode {
  margin-left: 50%;
  transform: translateX(-50%);
}
.qrcodeTxt {
  text-align: center;
}
</style>