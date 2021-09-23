<template>
  <div>
    <el-dialog center title="分配资源" :visible.sync="permissionsDialog.show" width="40%" destroy-on-close @close='closeDialog' @open='openDialog'
               :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="false">
      <el-tree v-loading="loading" :data="data" :check-strictly='isCheck' show-checkbox node-key="id" :default-checked-keys="defaultkey"
               :props="defaultProps" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionsDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="giveRules">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTreeByTenantIdAndGroup } from "@/api/resource";
import arrayToTree from "array-to-tree"
export default {
  props: ['permissionsDialog', 'defaultkey'],
  data() {
    return {
      data: [],
      loading: false,
      isCheck: false,
      defaultProps: {
        label: 'permissionName',
        id:'id',
        parentId:'parentId'
      },
    }
  },
  methods: {
    closeDialog() {
      this.$emit('resetDefaultKey')
    },
    openDialog() {
      this.loading = true
       const query = {
        group: 'web',
        tenantId:this.sessionData("get","tenantId")
      }
      getTreeByTenantIdAndGroup(query).then(res => {
         this.data = arrayToTree(res.data, {
              parentProperty: 'parentId',
              customID: 'id'
            });
            this.loading = false
      })
    },
    giveRules() {
      let keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      if (keys.length == 0) {
        keys = []
      }
      this.$emit('giveRules', keys)
    }
  }
}
</script>

<style>
</style>