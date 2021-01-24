<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="currentTitle" :to="{ path: '/Organization' }"
          >机构列表</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle" v-if="isEditType == 0"
          >新增机构</el-breadcrumb-item
        >
        <el-breadcrumb-item class="currentTitle" v-else
          >修改机构</el-breadcrumb-item
        >
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
        <el-form-item label="名称" class="formWidth" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" class="formWidth" prop="type">
          <el-select
            v-model="addForm.type"
            @change="typeChange"
            style="width: 100%"
          >
            <el-option
              v-for="item in OrganizationList"
              :key="item.dictValue"
              :label="item.name"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
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
        <el-form-item label="账号" class="formWidth" prop="userAccount">
          <el-input
            v-model="addForm.userAccount"
            :disabled="isEditType == 1"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          class="formWidth"
          prop="password"
          v-if="isEditType == 0"
        >
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员" class="formWidth" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="formWidth" prop="userPhone">
          <el-input v-model="addForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="区域地质" prop="provinceData">
          <!-- 省级数据 -->
          <span> 省: </span>
          <el-select
            v-model="addForm.provinceData"
            value-key="code"
            placeholder="请选择省"
            @change="provinceChange"
          >
            <el-option
              v-for="item in areaList"
              :label="item.name"
              :value="item"
              :key="item.code"
            ></el-option
          ></el-select>
          <!-- 市级数据 -->
          <span> 市: </span>
          <el-select
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
          <!-- 区/县级数据 -->
          <span> 区/县: </span>
          <el-select
            v-model="addForm.countyData"
            value-key="code"
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
          <!-- 乡镇数据 -->
          <span> 区/县: </span>
          <el-select
            v-model="addForm.streetData"
            value-key="code"
            placeholder="请选择乡镇"
          >
            <el-option
              v-for="item in streetList"
              :label="item.name"
              :value="item"
              :key="item.code"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item class="formWidth" label="详细地址">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addForm.address"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="formWidth" label="描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addForm.desc"
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
      cityList: [],
      areaList: [],
      countyList: [],
      streetList: [],
      // 新增表单验证规则
      addFormRules: {
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入管理员", trigger: "blur" },
        ],
        userPhone: [{ validator: checkPhone, trigger: "blur" }],
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
      information: {},
      addForm: {
        name: "",
        type: "",
        userName: "",
        password: "",
        userAccount: "",
        userPhone: "",
        desc: "",
        address: "",
        provinceData: {},
        cityData: "",
        countyData: "",
        streetData: "",
      },
      sysChecked: [],
      sysList: [
        { systemName: "评估系统", systemFlag: "system-assess" },
        { systemName: "预警系统", systemFlag: "system-warning" },
        { systemName: "干预系统", systemFlag: "system-intervene" },
      ],
      OrganizationList: [],
      isEditType: 0,
      editId: "",
    };
  },
  created() {
    this.information = JSON.parse(window.localStorage.getItem("message"));
    this.editId = this.$route.query.id;
    this.isEditType = this.$route.query.isEditType;
    this.getOrganizationList();
    this.getAreaList();
    if (this.isEditType == 1) {
      this.getOrganizationInfo();
    }
  },
  methods: {
    // 选择省
    provinceChange(val) {
      console.log(val);
      this.cityList = val.child;
      this.addForm.cityData = "";
      this.addForm.countyData = "";
      this.addForm.streetData = "";
    },
    // 选择市
    cityChange(val) {
      this.countyList = val.child;
      this.addForm.countyData = "";
      this.addForm.streetData = "";
    },
    countyChange(val) {
      this.streetList = val.child;
      this.addForm.streetData = "";
    },
    //选择类型
    typeChange(val) {
      console.log(val);
    },
    // 获取省市区数据
    async getAreaList(val) {
      const { data: res } = await this.$http.post("us/getCityInfo", {});
      this.areaList = res.data;
      // 新增使用登录存入local的信息回显省市区
      if (this.$route.query.isEditType == 0) {
        // 省
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.information.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
          }
        }
        // 市
        this.cityList = this.addForm.provinceData.child;
        for (var i = 0; i < this.cityList.length; i++) {
          if (this.information.addressC == this.cityList[i].code) {
            this.addForm.cityData = this.cityList[i];
          }
        }
        // 区/县
        this.countyList = this.addForm.cityData.child;
        for (var i = 0; i < this.countyList.length; i++) {
          if (this.information.addressA == this.countyList[i].code) {
            this.addForm.countyData = this.countyList[i];
          }
        }
        // 乡镇
        this.streetList = this.addForm.countyData.child;
        for (var i = 0; i < this.streetList.length; i++) {
          if (this.information.addressD == this.streetList[i].code) {
            this.addForm.streetData = this.streetList[i];
          }
        }
        // 编辑使用表格里的省市区数据回显
      } else {
        console.log(this.infoList);
        // 省
        for (var i = 0; i < this.areaList.length; i++) {
          if (this.infoList.addressP == this.areaList[i].code) {
            this.addForm.provinceData = this.areaList[i];
          }
        }
        // 市
        this.cityList = this.addForm.provinceData.child;
        for (var i = 0; i < this.cityList.length; i++) {
          if (this.infoList.addressC == this.cityList[i].code) {
            this.addForm.cityData = this.cityList[i];
          }
        }
        // 区/县
        this.countyList = this.addForm.cityData.child;
        for (var i = 0; i < this.countyList.length; i++) {
          if (this.infoList.addressA == this.countyList[i].code) {
            this.addForm.countyData = this.countyList[i];
          }
        }
        // 乡镇
        this.streetList = this.addForm.countyData.child;
        for (var i = 0; i < this.streetList.length; i++) {
          if (this.infoList.addressD == this.streetList[i].code) {
            this.addForm.streetData = this.streetList[i];
          }
        }
      }
    },
    // 获取修改数据
    async getOrganizationInfo() {
      const { data: res } = await this.$http.post("dealer/list", {
        id: this.editId,
      });
      this.infoList = res.rows[0];
      this.addForm.name = this.infoList.dealerName;
      this.addForm.type = this.infoList.type;
      this.addForm.userName = this.infoList.name;
      this.addForm.password = this.infoList.password;
      this.addForm.userAccount = this.infoList.username;
      this.addForm.userPhone = this.infoList.phone;
      this.addForm.desc = this.infoList.remark;
      this.addForm.address = this.infoList.address;
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
      this.sysChecked = checkedList;
    },
    // 获取机构类型列表
    async getOrganizationList() {
      const { data: res } = await this.$http.post("dict/getPreviewData", {
        dictValue: "dealer_type",
      });
      this.OrganizationList = res.data;
    },
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
    // 提交
    submit() {
      var addressP = this.addForm.provinceData.code;
      var addressC = this.addForm.cityData.code;
      var addressA = this.addForm.countyData.code;
      var addressD = this.addForm.streetData.code;
      var parentId = this.$route.query.id;
      if (parentId == undefined || parentId == null) {
        parentId = this.information.dealerId;
      }
      // 发起请求提交
      var sysString = "";
      this.sysChecked.forEach((item) => {
        console.log(item);
        sysString += item.systemName + ",";
      });
      sysString = sysString.slice(0, sysString.length - 1);
      var postData = {
        parentId: parentId,
        dealerName: this.addForm.name,
        username: this.addForm.userAccount,
        password: this.$md5(this.addForm.password),
        name: this.addForm.userName,
        phone: this.addForm.userPhone,
        address: this.addForm.address,
        remark: this.addForm.desc,
        addressP: addressP,
        addressC: addressC,
        addressA: addressA,
        addressD: addressD,
        type: this.addForm.type,
        systemList: this.sysChecked,
        systemOpen: sysString,
        level: "level-5",
      };
      var postUrl = "dealer/add";
      if (this.isEditType == 1) {
        postUrl = "dealer/update";
        postData = {
          id: this.editId,
          dealerName: this.addForm.name,
          name: this.addForm.userName,
          phone: this.addForm.userPhone,
          address: this.addForm.address,
          remark: this.addForm.desc,
          addressP: addressP,
          addressC: addressC,
          addressA: addressA,
          addressD: addressD,
          type: this.addForm.type,
          systemList: this.sysChecked,
          systemOpen: sysString,
          level: "level-5",
        };
      }
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(postUrl, postData);
        if(res != null && res.code == 200){
          if(this.isEditType != 1){
            if(res.data != null){
              this.configurationSheet(res.data.id);
            }else {
              return this.$message.error('添加失败,请重试!!!');
            }
          }else {
            this.addForm = {};
            this.sysChecked = [];
            this.$router.push("Organization");
          }
        }else if(res.code != 200) {
          if (res.code == 333) {
            return this.$message.error("机构名称已被占用");
          } else if (res.code == 222) {
            return this.$message.error("账号已被占用");
          } else {
            if(this.isEditType == 1){
              return this.$message.error('修改失败,请重试!!!');
            }else {
              return this.$message.error('添加失败,请重试!!!');
            }
          }
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
        this.addForm = {};
        this.sysChecked = [];
        this.$router.push("Organization");
      }else {
        return this.$message.error('添加失败,请重试!!!');
      }
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
</style>