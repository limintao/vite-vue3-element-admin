<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <span>
          <el-input v-model="searchKey" clearable placeholder="输入关键字搜索" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
          <span class="filter-item">
            <el-button type="success" icon="el-icon-search">搜索</el-button>
            <el-button type="warning" icon="el-icon-refresh-left">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="Add" v-permission="{code: AddBtnAuth}">新增</el-button>
          </span>
        </span>
        <span>
          <el-button-group>
            <el-button icon="el-icon-search"></el-button>
            <el-button icon="el-icon-refresh"></el-button>
          </el-button-group>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['AddBtnAuth'],
  data() {
    return {
      searchKey: ""
    }
  },
  methods: {
    toQuery() { },
    Add() {
      this.$emit("handleAdd")
    }
  }
};
</script>

<style lang="scss" scoped>
// 工具栏
.head {
  &-container {
    text-indent: -10px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        display: flex;
        align-items: center;
      }
      .filter {
        &-item {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>