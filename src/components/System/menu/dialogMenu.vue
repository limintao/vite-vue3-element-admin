<template>
  <div>
    <el-dialog :title="dialogMenu.title" :visible.sync="dialogMenu.show" width="40%" @open="openFun">
      <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="1" :disabled="formData.type != '1' && dialogMenu.option == 'edit'">目录</el-radio-button>
            <el-radio-button label="2" :disabled="formData.type != '2' && dialogMenu.option == 'edit'">菜单</el-radio-button>
            <el-radio-button label="3" :disabled="formData.type != '3' && dialogMenu.option == 'edit'">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 选择图标 -->
        <el-form-item label="选择图标" v-if="formData.type != 3" prop="icon">
          <e-icon-picker v-model="formData.icon" :options="options" style="width:76%;" />
        </el-form-item>
        <!-- 是否可见 ，菜单标题 -->
        <div class="flex" style="display: flex;" v-if="formData.type != 3">
          <el-form-item label="是否可见">
            <el-radio-group v-model="formData.hidden">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="目录标题" style="margin-left:15px;" prop="title">
            <el-input placeholder="请输入标题" v-model="formData.title"></el-input>
          </el-form-item>
        </div>
        <!-- 路由地址和菜单排序 -->
        <div class="flex" style="display: flex;" v-if="formData.type != 3">
          <el-form-item label="路由地址" prop="path">
            <el-input placeholder="路由地址(/:path)" v-model="formData.path"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" style="margin-left:15px;" prop="sort">
            <el-input-number placeholder="请排序" controls-position="right" v-model="formData.sort"></el-input-number>
          </el-form-item>
        </div>
        <!-- 组件名称 、组件路径 -->
        <div class="flex" style="display: flex;" v-if="formData.type == 2">
          <el-form-item label="组件名称" prop="name">
            <el-input placeholder="请输入组件name" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="组件路径" style="margin-left:15px;" prop="component">
            <el-input placeholder="请输入组件路径" v-model="formData.component"></el-input>
          </el-form-item>
        </div>
        <!-- 按钮名称、权限标识 -->
        <div class="flex" style="display: flex;" v-if="formData.type == 3">
          <el-form-item label="按钮名称" prop="title">
            <el-input placeholder="请输入按钮名称" v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" style="margin-left:15px;" prop="permissions">
            <el-input placeholder="请输入权限标识" v-model="formData.permissions"></el-input>
          </el-form-item>
        </div>
        <!-- 上级类目 -->
        <div class="flex" style="display: flex;">
          <el-form-item label="上级类目" prop="pid">
            <el-cascader :options="allMenu" v-model="formData.pid" :show-all-levels='false' :props="{ checkStrictly: true,label:'title',value:'_id' }"
                         clearable></el-cascader>
          </el-form-item>
          <el-form-item label="路由嵌套" v-if="formData.type==2">
            <el-radio-group v-model="nest">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="按钮排序" prop="sort" style="margin-left:15px;" v-if='formData.type == 3'>
            <el-input-number placeholder="请排序" controls-position="right" v-model="formData.sort"></el-input-number>
          </el-form-item>
        </div>
        <el-form-item label="是否缓存" v-if="formData.type==2">
          <el-radio-group v-model="formData.noCache">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- <pre>
        {{formData}}
      </pre> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMoveRouter } from "@/api/index";
export default {
  props: {
    dialogMenu: Object,
    formData: Object
  },
  data() {
    return {
      nest: "0",
      allMenu: [],//全部的路由
      options: {
        FontAwesome: false,
        ElementUI: true,
        eIcon: false,//自带的图标，来自阿里妈妈
        eIconSymbol: false,//是否开启彩色图标
        addIconList: [],
        removeIconList: []
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入组件name', trigger: 'blur' }],
        path: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
        pid: [{ required: true, message: '请选择上级类目', trigger: 'change' }],
        component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        permissions: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],

      }
    }
  },
  methods: {
    // 弹窗打开触发的方法
    openFun() {
      getMoveRouter().then(res => {
        console.log(res);
        if (this.formData.type == 1) {
          res.data.push({
            _id: "0",
            title: '顶级目录'
          })
        }
        this.allMenu = res.data
        if (this.dialogMenu.option == 'add') {
          this.$refs.form.resetFields()
        } else {
          if (this.formData.type == 2) { //同级不能绑定上下级关系
            res.data.forEach(item => {
              if (item.children) {
                item.children.forEach(ele => {
                  ele.disabled = true
                })
              }
            })
          }
        }
      })

    },
    // 点击确定按钮触发
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.formData.pid = this.formData.pid[this.formData.pid.length - 1]
          if (this.dialogMenu.option == 'add') {
            this.formData.pid = this.formData.pid[this.formData.pid.length - 1]
            this.$emit("handleSubmit")
          } else {
            if (typeof (this.formData.pid) != 'string') {
              this.formData.pid = this.formData.pid[this.formData.pid.length - 1]
            }
            this.$emit("handleSubmitEdit")
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 点击取消按钮触发
    resetForm(formName) {
      this.dialogMenu.show = false
      this.$refs[formName].resetFields();
    }
  },
  watch: {
    'formData.type': {
      handler: function() {
        if (this.formData.type == "1") {
          this.formData.redirect = 'noRedirect' //建议 必须是 ‘noRedirect’
          this.formData.alwaysShow = "1" //设置成1 意思是总是显示父级，如果没这个字段或者这个字段为0 意思就是当只有一个子菜单的时候，不显示父级
          this.formData.component = 'Layout' //必须是 Layout
          this.nest = "0"
        } else {
          this.formData.redirect = ""
          this.formData.alwaysShow = ""
          if (this.dialogMenu.option == 'add') {
            this.formData.component = ""
          }
        }
        if (this.formData.type == '3') {
          this.nest = "0"
        }
      },
      immediate: true
    },
    'nest': {
      handler: function() {
        if (this.nest == '1') {
          this.formData.redirect = "noRedirect"
          this.formData.alwaysShow = "1"
        } else {
          this.formData.redirect = ""
          this.formData.alwaysShow = ""
        }
      },
      immediate: true
    }
  }

}
</script>

<style lang="scss" scoped>
</style>