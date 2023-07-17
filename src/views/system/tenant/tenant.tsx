import {
  defineComponent,
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

import {
  gettenantList,
  updateTenant,
  addtenant,
  switchTenant,
  deletetenant,
} from "@/api/system";

import type { TableQueryBaseParams } from "@/components/ProTable/types";
declare type PageParams = TableQueryBaseParams & {
  current: number;
  size: number;
};

export default defineComponent({
  name: "SystemTenant",
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive<Record<string, any>>({
      columns: [
        {
          props: { prop: "tenantName", label: "租户名称" },
          search: true,
          formField: "name",
        },
        { props: { prop: "tenantCode", label: "租户编码", width: 150 } },
        {
          props: {
            prop: "usable",
            label: "状态",
            width: 100,
            formatter: (row: Record<string, any>) =>
              row.usable ? "启用" : "禁用",
          },
          search: true,
          valueType: "select",
          options: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
        },
        { props: { prop: "tenantDesc", label: "描述", width: 200 } },
        {
          props: { label: "操作", align: "center", width: 180 },
          type: "actions",
          template: ({ row }: Record<string, any>) => (
            <>
              <el-button
                type="primary"
                size="mini"
                onClick={() => editTenant(row)}
              >
                编辑
              </el-button>
              <el-button
                type="warning"
                size="mini"
                onClick={() => switchTenantStatus(row)}
              >
                {!row.usable ? "启用" : "禁用"}
              </el-button>
            </>
          ),
        },
      ],
      page: {
        hideOnSinglePage: false,
      },
      dialogInfoVisible: false,
      ruleForm: {
        //新增角色表单
        id: "", //主键id
        tenantName: "", // 租户名称
        tenantDesc: "", //租户描述
        tenantCode: "", //租户编码
        usable: "", //是否可用
      },
      rules: {
        tenantName: [
          { required: true, message: "请输租户名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        tenantCode: [
          { required: true, message: "请输入租户编码", trigger: "blur" },
        ],
        usable: [
          { required: true, message: "请选择租户状态", trigger: "change" },
        ],
      },
      isEditDialog: false,
      dialogInfoTitle: "新增",
    });
    const app = getCurrentInstance()?.proxy;
    const proTableRef = ref<Record<string, any>>();
    const formRef = ref<Record<string, any>>();

    const getListData = async (query: PageParams) => {
      const params = query;
      
      params.current = params.pageNumber;
      params.size = params.pageSize;
      const response = await gettenantList(params).catch(() => null);
      if (response) {
        return {
          success: true,
          data: response.data.records,
          total: response.data.total,
        };
      } else {
        return { success: false };
      }
    };

    // 修改租户
    const editTenant = (row?: Record<string, any>) => {
      state.isEditDialog = Boolean(row);
      
      if (row) {
        state.dialogInfoTitle = "编辑";
        for (const key in state.ruleForm) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            state.ruleForm[key] = row[key];
          }
        }
      }
      state.dialogInfoVisible = true;
    };

    // 切换账号状态
    const switchTenantStatus = (row: Record<string, any>) => {
      const statusText = row.usable ? "禁用" : "启用";
      app?.$confirm(statusText + "该租户，是否继续？", "租户状态", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          switchTenant(row.id).then((result: Record<string, any>) => {
            if (result.status == 200) {
              app.$notify.success({
                title: "操作结果",
                message: statusText + "租户成功！",
              });
              proTableRef.value?.refresh();
            } else {
              app.$notify.error({ title: "操作结果", message: result.msg });
            }
          });
        })
        .catch(() => {
          app?.$message.info("已取消！");
        });
    };

    // 添加或修改租户
    const onSubmit = async () => {
      const params = state.ruleForm;
      let result: any = null;
      if (state.isEditDialog) {
        delete params.tenantCode;
        result = await updateTenant(params).catch(() => null);
      } else {
        delete params.id;
        result = await addtenant(params).catch(() => null);
      };
      if (result && result.status == 200) {
        app?.$notify.success({
          title: "操作结果",
          message: state.dialogInfoTitle + "租户成功！",
        });
        proTableRef.value?.refresh();
        state.dialogInfoVisible = false;
      } else {
        app?.$notify.error({ title: "操作结果", message: result?.msg });
      }
    };

    onMounted(() => {});

    return () => (
      <div class="main-content">
        <pro-table
          ref={proTableRef}
          row-key={(row: Record<string, any>) => row.id}
          request={getListData}
          page={state.page}
          columns={state.columns}
          v-slots={{
            toolbar: () => (
              <el-button
                v-permission={{ code: "base:tenant:add" }}
                type="primary"
                // icon="el-icon-plus"
                onClick={() => editTenant()}
              >新增租户</el-button>
            ),
          }}
        ></pro-table>
        {/* 模态框 */}
        <el-dialog
          center
          title={state.dialogInfoTitle + "租户"}
          width="600px"
          v-model={state.dialogInfoVisible}
          onClosed={() => formRef.value?.resetFields()}
          v-slots={{
            footer: () => (
              <span>
                <el-button onClick={() => (state.dialogInfoVisible = false)}>
                  取消
                </el-button>
                <el-button v-db-click type="primary" onClick={onSubmit}>
                  保存
                </el-button>
              </span>
            ),
          }}
          destroy-on-close
        >
          <div class="box">
            <el-form
              ref={formRef}
              model={state.ruleForm}
              rules={state.rules}
              label-width="110px"
              label-suffix="："
            >
              <el-form-item prop="tenantName" label="租户名称">
                <el-input
                  size="small"
                  maxlength="30"
                  placeholder="请输入租户名称"
                  v-model={state.ruleForm.tenantName}
                ></el-input>
              </el-form-item>
              <el-form-item prop="tenantCode" label="租户编码">
                <el-input
                  size="small"
                  maxlength="30"
                  placeholder="请输入租户编码"
                  disabled={state.isEditDialog}
                  v-model={state.ruleForm.tenantCode}
                ></el-input>
              </el-form-item>
              <el-form-item prop="usable" label="状态">
                <el-select
                  v-model={state.ruleForm.usable}
                  clearable
                  placeholder="请选择状态"
                >
                  <el-option label="启用" value={1} />
                  <el-option label="禁用" value={0} />
                </el-select>
              </el-form-item>
              <el-form-item prop="tenantDesc" label="描述">
                <el-input
                  type="textarea"
                  rows="3"
                  placeholder="请输入描述"
                  v-model={state.ruleForm.tenantDesc}
                  maxlength="200"
                  show-word-limit
                  resize="none"
                  autosize={{ minRows: 3, maxRows: 5 }}
                />
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
      </div>
    );
  },
});
