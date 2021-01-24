<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/areaList' }"
          >区域列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle">新增区域</el-breadcrumb-item>
      </el-breadcrumb>
    </el-breadcrumb>
    <el-card>
      <!-- 返回上一级 -->
      <el-tooltip
        class="item"
        effect="dark"
        content="返回上一级"
        placement="top-start"
      >
        <span class="iconfont icon-fanhui11" @click="back"></span>
      </el-tooltip>
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
        class="addForm"
      >
        <p class="addForm_title">基本信息</p>
        <el-form-item label="名称" class="formWidth" prop="dealerName">
          <el-input v-model="addForm.dealerName"></el-input>
        </el-form-item>
        <p class="addForm_title">权限信息</p>
        <el-form-item prop="levelRadio" label="开通等级">
          <el-radio-group v-model="addForm.levelRadio">
            <el-radio label="level-2" v-if="level == 'level-1'"
              >市级模式</el-radio
            >
            <el-radio
              label="level-3"
              v-if="level == 'level-1' || level == 'level-2'"
              >区/县级模式</el-radio
            >
            <el-radio
              label="level-4"
              v-if="level == 'level-1' || level == 'level-2' || level == 'level-3'"
              >乡级模式</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域地址" prop="provinceData">
          <!-- 省级数据 -->
          <div style="display: flex;">
            <div>
              <span style="margin-right: 10px;"> 省: </span>
              <el-select
                v-model="addForm.provinceData"
                value-key="code"
                placeholder="请选择省"
                disabled
              >
                <el-option
                  v-for="item in areaList"
                  :label="item.name"
                  :value="item"
                  :key="item.code"
                ></el-option
              ></el-select>
            </div>
         
            <!-- 市级数据 -->
            <div>
              <span style="margin-left: 10px;margin-right: 10px;"> 市: </span>
            <el-select
              :disabled="isdisabled"
              v-model="addForm.cityData"
              value-key="code"
              placeholder="请选择市"
              @change="cityChange"
            >
              <el-option
                v-for="item in cityList"
                :label="item.name"
                :value="item"
                :key="item.code"
              ></el-option
            ></el-select>
            </div>
            
            <!-- 区/县级数据 -->
            <div v-if="addForm.levelRadio=='level-3' || addForm.levelRadio=='level-4' || addForm.levelRadio==''">
              <span style="margin-left: 10px;margin-right: 10px;"> 区/县: </span>
              <el-select
                v-model="addForm.countyData"
                value-key="code"
                :disabled="isdisabledCounty"
                placeholder="请选择区/县"
                @change="countyChange"
              >
                <el-option
                  v-for="item in countyList"
                  :label="item.name"
                  :value="item"
                  :key="item.code"
                ></el-option
              ></el-select>
            </div>
            
            <!-- 乡镇数据 -->
            <div v-if="addForm.levelRadio=='level-4' || addForm.levelRadio==''">
              <span style="margin-left: 10px;margin-right: 10px;"> 乡镇/街道: </span>
              <el-select
                v-model="addForm.streetData"
                value-key="code"
                :disabled="isdisabledstreet"
                placeholder="请选择乡镇/街道"
              >
                <el-option
                  v-for="item in streetList"
                  :label="item.name"
                  :value="item"
                  :key="item.code"
                ></el-option
              ></el-select>
            </div>
          </div>
          
          
        </el-form-item>
        <el-form-item label="开通系统" prop="sysChecked">
          <el-checkbox-group
            v-model="sysChecked"
            @change="sysCheckedChange"
            style="display: inline-block; margin-left: 10px"
          >
            <el-checkbox
              v-for="item in sysList"
              :label="item"
              :key="item.systemFlag"
              >{{ item.systemName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <p class="addForm_title">账号信息</p>
        <el-form-item label="账号" class="formWidth" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="formWidth" prop="password">
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员" class="formWidth" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="formWidth" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item class="formWidth" label="详细地址">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addressTextarea"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="formWidth" label="描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="describeTextarea"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="danger" @click="clear()">清空</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
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
      // 省市区数据
      areaList: [],
      // 新增表单验证规则
      addFormRules: {
        dealerName: [
          { required: true, message: "请输入合作商名称", trigger: "blur" },
        ],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入管理员", trigger: "blur" }],
        levelRadio: [
          { required: true, message: "请选择开通等级", trigger: "blur" },
        ],
        provinceData: [
          { required: true, message: "请选择区域地质", trigger: "blur" },
        ],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
      addForm: {
        dealerName: "",
        username: "",
        password: "",
        name: "",
        phone: "",
        Villages: "",
        levelRadio: "",
        provinceData: {},
        cityData: {},
        countyData: {},
        streetData: {},
      },
      isdisabled: false,
      isdisabledCounty: false,
      isdisabledstreet: false,
      sysChecked: [],
      cityList: [],
      streetList: [],
      count: 0,
      num: 0,
      information: {},
      countyList: [],
      OrganizationList: [],
      sysList: [
        { systemName: "评估系统", systemFlag: "system-assess" },
        { systemName: "预警系统", systemFlag: "system-warning" },
        { systemName: "干预系统", systemFlag: "system-intervene" },
      ],
      addressTextarea: "",
      describeTextarea: "",
      level:''
    };
  },
  created() {
    console.log(this.addForm.levelRadio);
    this.level = this.$route.query.level;
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.getOrganizationList();
    this.getAreaList();
  },
  methods: {
    // 上一级
    back() {
      this.$router.go(-1)
    },
    // 选择市
    cityChange(val) {
      console.log(this.addForm);
      this.countyList = val.child;
      this.addForm.countyData = "";
    },
    // 选择区/县
    countyChange(val) {
      this.streetList = val.child;
      this.addForm.streetData = "";
    },
    // 选择开通系统
    sysCheckedChange(val) {
      var flag = 0;
      if (this.sysChecked != null && this.sysChecked.length > 0) {
        this.sysChecked.forEach((element) => {
          if (element.systemName == "预警系统") {
            flag = 1;
          }
        });
        this.sysChecked.forEach((element) => {
          if (element.systemName == "评估系统" && flag == 1) {
            flag = 2;
          }
        });
      }
      if (flag == 1 && flag != 2) {
        this.sysChecked.push(this.sysList[0]);
      }
    },
    // 获取机构类型列表
    async getOrganizationList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "dealer_type",
      });
      this.OrganizationList = res.data;
    },
    // 获取省市区数据
    async getAreaList() {
      const { data: res } = await this.$http.post("us/getCityInfo", {});
      this.areaList = res.data;
      if(this.level == "level-1" && (this.$route.query.addressP != undefined || this.$route.query.addressP != null)){
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.$route.query.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
            break;
          }
        }
        this.cityList = this.addForm.provinceData.child;
      }else if(this.level == "level-2"){
        this.isdisabled = true;
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.$route.query.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
          }
        }
        this.cityList = this.addForm.provinceData.child;
        this.cityList.forEach(element=>{
          if(this.$route.query.addressC == element.code){
            this.addForm.cityData = element;
            this.countyList = element.child;
            console.log(this.countyList);
          }
        });
      } else if(this.level == "level-3"){
        this.isdisabled = true;
        this.isdisabledCounty = true;
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.$route.query.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
          }
        }
        this.cityList = this.addForm.provinceData.child;
        this.cityList.forEach(element=>{
          if(this.$route.query.addressC == element.code){
            this.addForm.cityData = element;
            this.countyList = element.child;
            console.log(this.countyList);
          }
        });
        this.countyList.forEach(element=>{
          if(this.$route.query.addressA == element.code){
            this.addForm.countyData = element;
            this.streetList = element.child;
          }
        });
      }
    },
    // 提交
    submit() {
      var addressP = this.addForm.provinceData.code;
      var addressC = this.addForm.cityData.code;
      var addressA = this.addForm.countyData.code;
      var addressD = this.addForm.streetData.code;
      if(this.addForm.levelRadio == 'level-2' || this.addForm.levelRadio == 'level-3' || this.addForm.levelRadio == 'level-4'){
        if(addressC == '' || addressC == undefined){
          this.$message.error("请选择所在市区");
          return;
        }
      }
      if(this.addForm.levelRadio == 'level-3' || this.addForm.levelRadio == 'level-4'){
        if(addressA == '' || addressA == undefined){
          this.$message.error("请选择所在区县");
          return;
        }
      }
      if(this.addForm.levelRadio == 'level-4'){
        if(addressD == '' || addressD == undefined){
          this.$message.error("请选择所在乡镇街道");
          return;
        }
      }
      // 开通系统转换
      var sysString = "";
      if (this.sysChecked.length <= 0) {
        this.$message.error("请选择开通系统");
        return;
      }
      this.sysChecked.forEach((item) => {
        console.log(item);
        sysString += item.systemName + ",";
      });
      sysString = sysString.slice(0, sysString.length - 1);
      var parentId = this.$route.query.id;
      if (parentId == undefined || parentId == null) {
        parentId = this.information.dealerId;
      }
      // 发起请求提交
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("dealer/add", {
          dealerName: this.addForm.dealerName,
          parentId: parentId,
          username: this.addForm.username,
          password: this.$md5(this.addForm.password),
          name: this.addForm.name,
          phone: this.addForm.phone,
          level: this.addForm.levelRadio,
          address: this.addressTextarea,
          remark: this.describeTextarea,
          addressP: addressP,
          addressC: addressC,
          addressD: addressD,
          addressA: addressA,
          systemList: this.sysChecked,
          systemOpen: sysString,
        });
        if (res != null && res.code == 200 && res.data != null){
            this.configurationSheet(res.data.id);
        }else {
          if (res.code == 333) {
            return this.$message.error("机构名称已被占用");
          } else if (res.code == 222) {
            return this.$message.error("账号已被占用");
          }
          return this.$message.error('添加失败,请重试!!!');
        }
      });
    },
    async configurationSheet(id){
      var sheetList = [];
      var packageList = [];
      let parameter = {
        id: id,
        sheetFlag: 'all',
        sheetList: sheetList,
        packageFlag: 'all',
        packageList: packageList,
      };
      const { data: res } = await this.$http.post(
        "dealer/allocatePackageAndSheet ",
        parameter
      );
      if(res != null && res.code == 200){
        this.$router.go(-1);
      }else {
        return this.$message.error('添加失败,请重试!!!');
      }
    },
    // 清空
    clear() {
      console.log(this.addForm.levelRadio);
      this.addForm = {};
      this.sysChecked = [];
    },
  },
};
</script>
<style scoped>
.title {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
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
  padding: 20px 0;
  box-sizing: border-box;
}
.connect {
  height: 100%;
  overflow: hidden;
}
</style>