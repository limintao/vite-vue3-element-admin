<template>
  <div class="institutions">
    <!-- <el-card class="box-card"> -->
    <!-- <el-collapse v-model="activeNames" @change="handleChange"> -->
      <!-- <el-collapse-item title="上海一芯管理平台" name="1"> -->
        <el-tree-v2
          ref="treeForm"
          :data="data"
          :props="defaultProp"
          :default-checked-keys="checkedIds"
          @check="handleCheckChange"
          :default-expand-all="expandAll"
          check-strictly
          show-checkbox
          accordion
          node-key="id"
          highlight-current
        >
        </el-tree-v2>
      <!-- </el-collapse-item> -->
    <!-- </el-collapse> -->
    <!-- </el-card> -->
  </div>
</template>

<script>
import goods from "@/api/commodity";
import getListData from "@/utils/formatTree";
export default {
  name: "departmentTree",
  components: {},
  props: {
    // 展开所有
    expandAll: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      activeNames: [],
      deptName: "",
      checkedIds: [],
      lists: [],
      data: [],
      ruleForm: {
        deptId: "", //机构id
      },
      defaultProp: {
        label: "deptName",
        id: "id",
        parentId: "parentId",
      },
    };
  },

  created() {
    this.getcurrentTreeList();
  },
  mounted() {},
  methods: {
    handleChange(val) {},
    //获取当前部门数据
    getcurrentTreeList() {
      goods.getcurrentTree().then((res) => {
        if (res.status == 200) {
          this.data = res.data;
          this.formatTreeData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    formatTreeData() {
      this.data.sort((a, b) => a.id - b.id);
      this.data = getListData(this.data, this.data[0].parentId, this.defaultProp);
      this.$refs.treeForm.setCheckedKeys([this.data[0].id]);
      this.$emit("deptId", this.data[0].id, this.data[0].deptName);
    },
    handleCheckChange(data, tree) {
      if (tree.checkedKeys.includes(data.id)) {
        this.ruleForm.deptId = data.id;
        this.deptName = data.deptName;
        this.$refs.treeForm.setCheckedKeys([data.id]);
      } else {
        this.ruleForm.deptId = '';
        this.deptName = '';
        this.$refs.treeForm.setCheckedKeys([]);
      }
      this.$emit("deptId", this.ruleForm.deptId, this.deptName);
    },
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.institutions {
  overflow: auto;
}
</style>
