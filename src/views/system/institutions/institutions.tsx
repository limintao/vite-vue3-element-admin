import {
  defineComponent,
  reactive,
  ref,
  getCurrentInstance,
  withModifiers,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import arrayToTree from "array-to-tree";
import "../resource/system.scss";
import InstitutionDialog from "./dialog";

import {
  orderMechanism,
  addMechanism,
  deleteMechanism,
  updateMechanism,
  getcurrentTree,
  currentPermission,
} from "@/api/system";

declare type TreeNode = {
  node: Record<string, any>;
  data: Record<string, any>;
};

export default defineComponent({
  name: "SystemInstitutions",
  setup() {
    const store = useStore();
    const router = useRouter();

    const app = getCurrentInstance()?.appContext.config.globalProperties;
    const formRef = ref<Record<string, any>>();
    const treeRef = ref<Record<string, any>>();
    const getInitialData = (): Record<string, any> => ({
      filterText: "",
      filterUsable: null,
      lists: [],
      modalEdit: false,
      form: {
        deptName: "",
        usable: 1,
        deptDesc: "",
        deptCode: "",
        tenantId: app?.$sessionData("get", "tenantId"), // 当前租户id
      },
      loading: false,
      addMenuLevel: 0,
      dialogTitle: "新增",
      dialogVisible: false,
      institutionName: false,
      addNew: 0,
      rules: {
        deptName: [{ required: true, message: "节点名称是必填的" }],
        permissionType: [{ required: true, message: "菜单类型必填的" }],
        component: [{ required: true, message: "组件地址必填的" }],
        icon: [{ required: true, message: "icon图标是必填的" }],
      },
      detailInfo: {},
      activeName: "first",
      roleName: "",
    });
    const state = reactive(getInitialData());
    const defaultProp = {
      label: "deptName",
      id: "id",
      parentId: "parentId",
    };

    // 获取数据
    const getInstitutionList = () => {
      state.loading = true;
      getcurrentTree({ tenantId: app?.$sessionData("get", "tenantId") })
        .then((result) => {
          state.lists = arrayToTree(result.data, {
            parentProperty: "parentId",
            customID: "id",
          });
        })
        .finally(() => {
          state.loading = false;
        });
    };

    // 显示模态框
    const showDialogModal = (row: Record<string, any>, edit: boolean) => {
      if (edit) {
        for (const key in state.form) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            state.form[key] = row[key];
          }
        }
      }
      state.nodeShow = row.permissionType != 2;
      state.addNew = 0;
      state.modalEdit = edit;
      state.addMenuLevel = Number(!(row.parentId == 0 && edit));
      state.institutionName = !edit;
      state.detailInfo = row;
      state.dialogVisible = true;
    };

    // 新增一级机构
    const openAddMechanismDialog = () => {
      state.addMenuLevel = 0;
      state.institutionName = false;
      state.dialogVisible = true;
      state.modalEdit = false;
    };

    // 删除资源
    const deleteResource = (id: number) => {
      app
        ?.$confirm("此操作将永久删除该机构, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deleteMechanism({ id }).then((res) => {
            app?.$notify.success({
              title: "操作结果",
              message: "删除成功！",
            });
            getInstitutionList();
          });
        })
        .catch(() => {});
    };

    const filterNode = (value: string, data: Record<string, any>): boolean => {
      if (typeof state.filterUsable !== "number" && state.filterText)
        return data.deptName?.indexOf(state.filterText) !== -1;
      else if (!state.filterText && typeof state.filterUsable === "number")
        return data.usable === state.filterUsable;
      else if (!state.filterText && typeof state.filterUsable !== "number")
        return true;
      else
        return (
          data.name?.indexOf(state.filterText) !== -1 &&
          data.usable === state.filterUsable
        );
    };
    // 判断是否允许放置
    const allowDrop = (
      draggingNode: Record<string, any>,
      dropNode: Record<string, any>
    ): boolean => {
      return draggingNode.data.parentId === dropNode.data.parentId;
    };
    // 拖拽事件
    const handleDrop = (
      draggingNode: Record<string, any>,
      dropNode: Record<string, any>
    ) => {
      const params = {
        fid: draggingNode.data.id,
        sid: dropNode.data.id,
      };
      orderMechanism(params).then((res) => {
        getInstitutionList();
      });
    };

    // 提交表单
    const saveForm = () => {
      let res = null;
      formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
          let params = {
            parentDeptDeep:
              (state.addMenuLevel && state.detailInfo.deptDeep) || 0,
            ...state.form,
            parentId: (state.addMenuLevel && state.detailInfo.id) || 0,
            tenantId: state.sessionData("get", "tenantId"),
          };
          if (state.modalEdit) {
            delete params.parentDeptDeep;
            params.id = state.detailInfo.id;
            params.parentId = state.detailInfo.parentId;
            res = await updateMechanism(params);
          } else {
            res = await addMechanism(params);
          }
          if (res) {
            app?.$notify.success({
              title: "操作结果",
              message: "保存成功！",
            });
            getInstitutionList();
            state.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    };

    // 渲染树的右边
    const renderContent = ({ node, data }: TreeNode) => {
      return (
        <div class="custom-tree-node-view">
          {!data.usable ? <s>{data.deptName}</s> : <span>{data.deptName}</span>}
          <span>
            <el-link
              type="primary"
              v-permission={{ code: "base:institutions:add" }}
              onClick={withModifiers(
                () => showDialogModal(data, false),
                ["stop"]
              )}
            >
              新增下级机构
            </el-link>
            {data.operable ? (
              <span>
                <el-link
                  type="primary"
                  v-permission={{ code: "base:institutions:update" }}
                  onClick={withModifiers(
                    () =>
                      showDialogModal(
                        { parentName: node.parent.data.name, ...data },
                        true
                      ),
                    ["stop"]
                  )}
                >
                  编辑
                </el-link>
                <el-link
                  type="primary"
                  v-permission={{ code: "base:institutions:delete" }}
                  onClick={withModifiers(
                    () => deleteResource(data.id),
                    ["stop"]
                  )}
                >
                  删除
                </el-link>
              </span>
            ) : null}
          </span>
        </div>
      );
    };

    // 模态框关闭
    const dialogClose = () => {
      state.form = getInitialData().form;
      formRef.value?.resetFields();
    };

    getInstitutionList();

    return () => (
      <div class="main-content system-module">
        <div class="flexbox flex-fill flex-vertical">
          <div class="tree-filter-view">
            <div class="flexbox flex-between">
              <el-space size={20}>
                <el-input
                  v-model={state.filterText}
                  placeholder="请输入机构名称"
                  clearable
                ></el-input>
                <el-select
                  v-model={state.filterUsable}
                  placeholder="请选择状态"
                  clearable
                >
                  <el-option label="启用" value={1} />
                  <el-option label="禁用" value={0} />
                </el-select>
              </el-space>
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  onClick={() => treeRef.value?.filter(state.filterText)}
                >
                  查询
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-permission={{ code: "base:institutions:add" }}
                  onClick={openAddMechanismDialog}
                >
                  新增一级机构
                </el-button>
              </div>
            </div>
          </div>
          <div class="flex-fill tree-content-view" v-loading={state.loading}>
            <el-tree
              props={defaultProp}
              data={state.lists}
              ref={treeRef}
              node-key="id"
              draggable
              allow-drop={allowDrop}
              onNodeDrop={handleDrop}
              filter-node-method={filterNode}
              v-slots={{ default: renderContent }}
            ></el-tree>
          </div>
        </div>

        {InstitutionDialog({state, ref: formRef, conform: saveForm, closed: dialogClose})}
      </div>
    );
  },
});
