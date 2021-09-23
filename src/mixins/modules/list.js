/*
 * @Author: limit
 * @Date: 2021-03-30 13:34:19
 * @LastEditTime: 2021-06-01 14:00:44
 * @LastEditors: limit
 * @FilePath: /active-degree-statistics/src/mixins/modules/list.js
 * @Description: 由limit创建！
 */

import TableLayout from '@/components/TableLayout';
import { getToken } from '@/utils/auth';

export default {
  components: { TableLayout },
  data () {
    return {
      lists: [],
      listQuery: {},
      dialogType: 0,
      typeList: ['添加', '修改', '查看'],
      userId: this.sessionData("get", "userId"), // 当前登录人Id
      deptId: this.sessionData("get", "deptId"), // 当前部门id
      tenantId: this.sessionData("get", "tenantId"), // 当前租户id
      listLoading: false,
      dialogVisible: false,
      uploadHeader: { Authorization: 'bearer ' + getToken() },
      uploadData: { tenantId: this.sessionData("get", "tenantId") },
      pages: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      temporary: {},
    }
  },
  provide () {
    return {
      userId: this.userId,
      deptId: this.deptId,
      tenantId: this.tenantId,
      getListData: this.getListData,
    }
  },
  created() {
    this.getListData();
  },
  methods: {
    // 条件过滤
    handleFilter() {
      this.pages.pageNumber = 1
      this.getListData();
    },
    // 重置表单
    restFormData (formObj) {
      let newForm = {};
      for (const key in formObj) {
        if (Object.hasOwnProperty.call(formObj, key)) {
          const element = formObj[key];
          if (typeof element == 'number') newForm[key] = 1;
          if (typeof element == 'string') newForm[key] = '';
          if (Object.prototype.toString.call(element) == '[object Object]') newForm[key] = {};
          if (Object.prototype.toString.call(element) == '[object Array]') newForm[key] = [];
        }
      }
      return newForm;
    },
    // 批量上传
    onBatchSuccess(response) {
      if (response.status == 200) {
        this.getListData();
        this.$message.success("导入成功");
      } else {
        this.$message.error(response.message);
      }
    },
  }
}