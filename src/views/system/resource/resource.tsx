import {
  defineComponent,
  reactive,
  ref,
  getCurrentInstance,
  withModifiers,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import getListData from "@/utils/formatTree";
import {
  movePermission,
  addPermission,
  deletePermission,
  updatePermission,
  currentPermission,
  getPermissionApp,
  getTreeByTenantIdAndGroup,
} from "@/api/system";
import "./system.scss";

import ResourceDialog from "./dialog";

declare type TreeNode = {
  node: Record<string, any>;
  data: Record<string, any>;
};

export default defineComponent({
  name: "SystemResource",
  setup() {
    const store = useStore();
    const router = useRouter();
    const getInitialData = (): Record<string, any> => ({
      filterText: "",
      lists: [],
      modalEdit: false,
      form: {
        component: "", //组件
        path: "", //路由
        id: "", //主键id
        parentId: "", //父id 不传则为0 根节点
        permissionCode: "", //权限编码
        permissionGroup: "web", //分组(app,web)
        permissionName: "", //名称
        permissionType: "", //权限类型 不传默认为菜单 1-菜单 2-按钮,示例值(1)
        icon: "", //ico字体图标
      },
      nodeShow: true, //节点类型显示
      addMenuLevel: 0,
      dialogTitle: "新增",
      dialogVisible: false,
      institutionName: false,
      addNew: 0,
      rules: {
        permissionName: [{ required: true, message: "节点名称是必填的" }],
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
      label: "permissionName",
      id: "id",
      parentId: "parentId",
    };
    const app = getCurrentInstance()?.proxy;
    const formRef = ref<Record<string, any>>();
    const treeRef = ref<Record<string, any>>();

    // 获取部门树的数据
    const getTreeList = () => {
      getTreeByTenantIdAndGroup({
        group: "web",
        tenantId: Number(app?.$sessionData("get", "tenantId")),
      }).then((result) => {
        state.lists = getListData(result.data, 0, defaultProp);
      });
    };

    const addMenu = () => {
      state.addNew = 1;
      state.modalEdit = false;
      state.nodeShow = true;
      state.addMenuLevel = 1;
      state.institutionName = false;
      state.edit = false;
      state.dialogVisible = true;
    };

    // 显示模态框
    const showDialogModal = (row: Record<string, any>, edit: boolean) => {
      if (edit) {
        for (const key in state.form) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            state.form[key] = row[key];
          }
        };
      };
      state.nodeShow = row.permissionType != 2;
      state.addNew = 0;
      state.modalEdit = edit;
      state.addMenuLevel = Number(!(row.parentId == 0 && edit));
      state.institutionName = !edit;
      state.detailInfo = row;
      state.dialogVisible = true;
    };

    // 删除资源
    const deleteResource = (id: number) => {
      app?.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deletePermission(id).then((res) => {
          app?.$notify.success({
            title: "操作结果",
            message: "删除成功！",
          });
          getTreeList();
        });
      })
      .catch(() => {});
    };

     // 判断是否允许放置
    const allowDrop = (draggingNode: Record<string, any>, dropNode: Record<string, any>): boolean => {
      return draggingNode.data.parentId === dropNode.data.parentId;
    };

    // 数拖动事件
    const handleDrop = (draggingNode: Record<string, any>, dropNode: Record<string, any>) => {
      let params = {
        fid: draggingNode.data.id,
        sid: dropNode.data.id
      }
      movePermission(params).then(res => {
        getTreeList();
      });
    }

    const filterNode = (value: string, data: Record<string, any>): boolean => {
      if (!value) return true;
      return data.permissionName.indexOf(value) !== -1;
    };

    // 渲染数的右边
    const renderContent = ({ node, data }: TreeNode) => {
      return (
        <div class="custom-tree-node-view">
          <span>{data.permissionName}</span>
          <div>
            {data.permissionType == 1 || data.permissionType == 0 ? (
              <el-link
                type="primary"
                v-permission={{ code: "base:resource:add" }}
                onClick={withModifiers(() => showDialogModal(data, false), ["stop"])}
              >
                新增子菜单
              </el-link>
            ) : null}
            {data.operable == 1 ? (
              <span>
                <el-link
                  type="primary"
                  v-permission={{ code: "base:resource:update" }}
                  onClick={withModifiers(() =>
                    showDialogModal({ parentName: node.parent.data.name, ...data }, true), ["stop"])
                  }
                >
                  编辑
                </el-link>
                <el-link
                  type="primary"
                  v-permission={{ code: "base:resource:delete" }}
                  onClick={withModifiers(() => deleteResource(data.id), ["stop"])}
                >
                  删除
                </el-link>
              </span>
            ) : null}
          </div>
        </div>
      );
    };

    // 提交表单
    const saveForm = () => {
      let res = null;
      formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
          let params = {
            ...state.form,
            parentId: state.addMenuLevel && state.detailInfo.id,
          }
          if (state.modalEdit) {
            params.id = state.detailInfo.id;
            params.parentId = state.detailInfo.parentId;
            res = await updatePermission(params);
          }else if(state.addNew == 1){
            params.parentId = 0;
            res = await addPermission(params);
          }else {
            res = await addPermission(params);
          }
          if (res) {
            app?.$notify.success({
              title: "操作结果",
              message: "保存成功！",
            });
            getTreeList();
            state.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    };

    // 模态框关闭
    const dialogClose = () => {
      state.form = getInitialData().form;
      formRef.value?.resetFields();
    };

    getTreeList();

    return () => (
      <div class="main-content system-module">
        <div class="flexbox flex-fill flex-vertical">
          <div class="tree-filter-view">
            <div class="flexbox flex-between">
              <div>
                <el-input
                  v-model={state.filterText}
                  placeholder="请输入节点名称"
                  clearable
                ></el-input>
              </div>
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
                  v-permission={{ code: "base:resource:add" }}
                  onClick={addMenu}
                >
                  新增一级菜单
                </el-button>
              </div>
            </div>
          </div>
          <div class="flex-fill tree-content-view">
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

        {ResourceDialog({ref: formRef, state, conform: saveForm, closed: dialogClose})}

      </div>
    );
  },
});
