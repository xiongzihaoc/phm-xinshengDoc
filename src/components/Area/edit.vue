<template>
  <div>
    <div class="card_box">
      <el-breadcrumb separator="/">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="currentTitle" :to="{ path: '/areaList' }"
            >区域列表</el-breadcrumb-item
          >
          <el-breadcrumb-item class="currentTitle">修改区域</el-breadcrumb-item>
        </el-breadcrumb>
      </el-breadcrumb>
    </div>
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
            <el-radio label="level-2" v-if="level == 'level-2'"
              >市级模式</el-radio
            >
            <el-radio
              label="level-3"
              v-if="level == 'level-2' || level == 'level-3'"
              >区/县级模式</el-radio
            >
            <el-radio
              label="level-4"
              v-if="
                level == 'level-2' ||
                level == 'level-3' ||
                level == 'level-4'
              "
              >乡级模式</el-radio
            >
            <!-- <el-radio label="level-5">机构模式</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域地质" prop="provinceData">
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
          <el-input v-model="addForm.username" disabled></el-input>
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
      console.log(value);
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
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
      },
      addForm: {
        dealerName: "",
        username: "",
        name: "",
        phone: "",
        levelRadio: "",
        provinceData: {},
        cityData: {},
        countyData: {},
        streetData: {},
      },
      editId: "",
      isdisabled: false,
      isdisabledCounty: false,
      isdisabledstreet: false,
      sysChecked: [],
      cityList: [],
      streetList: [],
      information: {},
      addressA: "",
      addressC: "",
      addressD: "",
      count: 0,
      num: 0,
      countyList: [],
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
    this.level = this.$route.query.level;
    this.editId = this.$route.query.id;
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.getScaleList();
    this.getAreaList();
  },
  methods: {
    // 上一级
    back() {
      this.$router.go(-1)
    },
    // 获取修改数据
    async getScaleList() {
      const { data: res } = await this.$http.post("dealer/getDealerById", {
        id: this.editId,
      });
      console.log(res);
      this.infoList = res.data;
      // 处理下开通系统的回显数据
      var checkedList = [];
      for (var i = 0; i < this.infoList.systemList.length; i++) {
        for (var j = 0; j < this.sysList.length; j++) {
          if (
            this.infoList.systemList[i].systemFlag == this.sysList[j].systemFlag
          ) {
            checkedList.push(this.sysList[j]);
          }
        }
      }
      this.addForm.dealerName = this.infoList.dealerName;
      this.addForm.username = this.infoList.username;
      this.addForm.name = this.infoList.name;
      this.addForm.phone = this.infoList.phone;
      this.addressTextarea = this.infoList.address;
      this.describeTextarea = this.infoList.remark;
      this.addForm.levelRadio = this.infoList.level;
      this.sysChecked = checkedList;
    },
    // 选择市
    cityChange(val) {
      this.countyList = val.child;
      this.addForm.countyData = "";
    },
    // 选择区/县
    countyChange(val) {
      console.log(val);
      this.streetList = val.child;
      this.addForm.streetData = "";
    },
    // 获取省市区数据
    async getAreaList() {
      const { data: res } = await this.$http.post("us/getCityInfo", {});
      this.areaList = res.data;
      if(this.level == "level-2" && (this.$route.query.addressP != undefined || this.$route.query.addressP != null)){
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.$route.query.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
            break;
          }
        }
        this.cityList = this.addForm.provinceData.child;
      }else if(this.level == "level-3"){
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
      } else if(this.level == "level-4"){
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
        console.log(this.streetList);
        console.log(this.$route.query.addressD);
        this.streetList.forEach(element=>{
          if(this.$route.query.addressD == element.code){
            this.addForm.streetData = element;
          }
        });
        
      }
    },
    // 选择开通系统
    sysCheckedChange(val) {
      for (let i = 0; i < this.sysChecked.length; i++) {
        // 如果勾选预警
        if (this.sysChecked[i].systemName == "预警系统") {
          this.count++;
          // 余0 取消勾选
          if (this.count % 2 == 0) {
            if (this.sysChecked.includes(this.sysList[0])) {
              console.log("已经勾选评估");
            } else {
              this.sysChecked.push(this.sysList[0]);
            }
          } else if (this.count % 2 == 1) {
            if (this.sysChecked.includes(this.sysChecked[i])) {
              this.sysChecked.push(this.sysList[0]);
            } else {
              console.log("未勾选预警随他去");
            }
          }
          if (this.count >= 2) {
            this.count = 0;
          }
          // 如果勾选评估
        } else if (this.sysChecked[i].systemName == "评估系统") {
          this.num++;
          // 取消勾选评估从数组中删除
          if (this.num % 2 == 0) {
            if (this.sysChecked.includes(this.sysList[0])) {
              this.sysChecked.pop(this.sysList[0]);
            }
          } else {
          }
          if (this.num >= 2) {
            this.num = 0;
          }
        }
      }
    },
    // 提交
    submit() {
      // 省市区格式转换
      console.log(this.addForm);
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
      // 发起请求提交
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("dealer/update", {
          id: this.editId,
          dealerName: this.addForm.dealerName,
          username: this.addForm.username,
          name: this.addForm.name,
          phone: this.addForm.phone,
          level: this.addForm.levelRadio,
          address: this.addressTextarea,
          remark: this.describeTextarea,
          addressP: addressP,
          addressC: addressC,
          addressA: addressA,
          addressD: addressD,
          systemList: this.sysChecked,
          systemOpen: sysString,
        });
        if (res.code != 200){
          if (res.code == 333) {
            return this.$message.error("机构名称已被占用");
          } else if (res.code == 222) {
            return this.$message.error("账号已被占用");
          }else {
            return this.$message.error("修改失败！请重试");
          }
        } 
        this.$router.push("areaList");
      });
    },
    // 清空
    clear() {
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
}
</style>