<template>
  <div>
    <div>
      <el-dialog :title="dialogUser.title" :visible.sync="dialogUser.show" width="30%" destroy-on-close @open='openDialog'
                 :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="false">
        <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="登录账号" prop="loginame">
            <el-input v-model="formData.loginame" placeholder="登录账号" style="width:90%;" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password" v-if="dialogUser.option == 'add'">
            <el-input v-model="formData.password" type="password" placeholder="登录密码" style="width:90%;" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="formData.phone" placeholder="手机号码" type="phone" style="width:90%;" />
          </el-form-item>
          <el-form-item label="分配角色" prop="rules">
            <!-- <el-input v-model="formData.rules" placeholder="分配角色" style="width:90%;" /> -->
            <el-select v-model="formData.rules" placeholder="请选择角色" style="width:90%;">
              <el-option v-for="(item,index) in roleList" :key="index" :label="item.title" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <pre>
          {{formData}}
        </pre> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogUser.show = false">取 消</el-button>
          <el-button type="primary" v-if="dialogUser.option == 'add'" @click="addUser('form')">确 定</el-button>
          <el-button type="primary" v-if="dialogUser.option == 'edit'" @click="editUser('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesList } from "@/api/system";
export default {
  props: ['dialogUser', 'formData'],
  data() {
    return {
      rules: {
        loginame: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入负责人手机号码', trigger: 'blur' }],
        rules: [{ required: true, message: '请为该用户分配角色', trigger: 'change' }],
      },
      roleList: []
    }
  },
  methods: {
    openDialog() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate();//解决dialog打开自动触发了下拉选择框的校验
        // 获取角色列表
        getRolesList().then(res => {
          this.roleList = res.data
        })
      })
    },
    addUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("addUser")
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("updateUser")
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
</style>