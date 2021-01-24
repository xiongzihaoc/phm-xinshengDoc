<template>
  <div class="connect">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="currentTitle">区域列表</el-breadcrumb-item>
      <!-- <el-breadcrumb-item
        class="currentTitle"
        :to="{ path: '/sheetComboList?id=' + id }"
        >配置量表</el-breadcrumb-item
      >
      <el-breadcrumb-item class="currentTitle">编辑量表</el-breadcrumb-item> -->
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
      <div class="combo" v-if="comboList != null && comboList.length > 0">
        <p>选择套餐</p>
        <!-- 套餐 -->
        <el-radio-group
          @change="comboChange"
          v-model="comboCheck"
          style="display: block"
        >
          <el-radio style="display: block" label="all">全部</el-radio>
          <el-radio style="display: block; margin-top: 20px" label="other"
            >其他</el-radio
          >
        </el-radio-group>
        <el-checkbox-group v-model="comboCheckList" style="margin: 20px 0">
          <el-checkbox
            :disabled="isDisabled"
            v-for="item in comboList"
            :label="item"
            :key="item.uuid"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <!-- 树级 -->
      <div class="treeBox" v-if="treeList != null && treeList.length > 0">
        <p>选择量表</p>
        <el-radio-group
          @change="radioChange"
          v-model="radioCheck"
          style="display: inline-block"
        >
          <el-radio style="display: block" label="all">全部</el-radio>
          <el-radio style="display: block; margin-top: 20px" label="other"
            >其他</el-radio
          >
        </el-radio-group>
        <el-tree
          :data="treeList"
          :props="defaultProps"
          show-checkbox
          :default-expanded-keys="defKeys"
          :default-checked-keys="defKeys"
          node-key="value"
          ref="treeRef"
        ></el-tree>
      </div>
      <div v-if="(treeList == null || treeList.length==0) && (comboList == null || comboList.length==0)" style="margin-top: 15%;margin-left: 50%;">
        <span style="font-size:20px;font-weight: 700;">未有量表信息</span>
      </div>
      <div class="btnBox">
        <el-button type="danger" @click="clear">清 空</el-button>
        <el-button type="primary" @click="btnSave">保 存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",
      comboList: [],
      radioCheck: "other",
      comboCheck: "other",
      comboCheckList: [],
      isDisabled: false,
      treeTitle: "",
      defKeys: [],
      treeList: [],
      defaultProps: {
        children: "child",
        label: "name",
      },
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getTreeList();
  },
  methods: {
     // 上一级
     back() {
      this.$router.go(-1)
    },
    // 获取量表树级列表
    async getTreeList() {
      const { data: res } = await this.$http.post(
        "dealer/getTreePackageAndSheet",
        {id:this.id});
      console.log(res);
      if (res.code != 200) return this.$message.error("获取量表数据失败");
      this.treeList = res.data.sheets;
      this.comboList = res.data.packages;
      console.log(this.treeList);
      this.getChooseTreeList();
    },
    // 获取选中数据
    async getChooseTreeList() {
      console.log(this.comboList);
      const { data: res } = await this.$http.post("dealer/getPackageAndSheet", {
        id: this.id,
      });
      if (res.data == null) {
        console.log("无选中数据");
        return;
      } else {
        // 套餐多选回显
        var packageList = res.data.packageList;
        console.log(packageList);
        console.log(this.comboList);
        var choosePackage = [];
        packageList.forEach((ele) => {
          this.comboList.forEach((item) => {
            if (ele == item.uuid) {
              choosePackage.push(item);
            }
          });
        });
        console.log(choosePackage);
        // 处理树级回显数据
        var sheetList = res.data.sheetList;
        sheetList = sheetList.filter((e) => !(e < 999));
        this.defKeys = sheetList;
        this.radioCheck = res.data.sheetFlag;
        this.comboCheckList = choosePackage;
        this.comboCheck = res.data.packageFlag;
        this.treeTitle = res.data.sheetFlag;
        if (this.comboCheck == "all") {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
        if(this.treeTitle == "all"){
          for (var i=0;i<this.treeList.length;i++) {
            if(this.treeList[i] != null){
              this.$set(this.treeList[i],'disabled',true);
              this.updateThreeList(this.treeList[i].child,true);
            }
          }
        }
      }
    },
    // 全部或者其他
    radioChange(val) {
      this.treeTitle = val;
      console.log(this.treeTitle);
      var nodes = this.$refs.treeRef.store.nodesMap;
      if (val == "all") {
        for (var i=0;i<this.treeList.length;i++) {
          if(this.treeList[i] != null){
            this.$set(this.treeList[i],'disabled',true);
            this.updateThreeList(this.treeList[i].child,true);
          }
        }
        this.$refs.treeRef.setCheckedKeys([]);
      } else {
        for (var i=0;i<this.treeList.length;i++) {
          if(this.treeList[i] != null){
            this.$set(this.treeList[i],'disabled',false);
            this.updateThreeList(this.treeList[i].child,false);
          }
        }
      };
    },
    updateThreeList(child,check){
      if(child != null && child.length>0){
        child.forEach(element=>{
          this.$set(element,'disabled',check);
          this.updateThreeList(element.child,check);
        });
      }
    },
    comboChange(val) {
      console.log(val);
      if (val == "all") {
        this.comboCheckList = [];
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    // 保存
    async btnSave() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      if (this.radioCheck == "all") {
        keys = [];
      }
      var comboCheckList = [];
      this.comboCheckList.forEach((e) => {
        comboCheckList.push(e.uuid);
      });
      let parameter = {
        id: this.id,
        sheetFlag: this.radioCheck,
        sheetList: keys,
        packageFlag: this.comboCheck,
        packageList: comboCheckList,
      };
      const { data: res } = await this.$http.post(
        "dealer/allocatePackageAndSheet ",
        parameter
      );
      this.defKeys = [];
      this.$router.go(-1)
      // this.$router.push("AreaList");
    },
    clear() {
      this.$refs.treeRef.setCheckedKeys([]);
      this.comboCheckList = [];
      this.radioCheck = null;
      this.comboCheck = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.treeBox,
.combo {
  margin-left: 10%;
}
.el-tree {
  margin-top: 20px;
}
p {
  margin: 20px 0;
  margin-left: -80px;
  font-weight: 700;
}
.btnBox {
  position: fixed;
  right: 200px;
  bottom: 200px;
}
</style>