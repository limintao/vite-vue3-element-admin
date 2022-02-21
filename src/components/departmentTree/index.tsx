import { defineComponent, reactive, ref } from "vue";
import { getcurrentTree } from "@/api/system";
import getListData from "@/utils/formatTree";
import type { CheckedInfo } from 'element-plus/es/components/tree-v2/src/types';
import type { ElTreeV2 } from 'element-plus';
import { ElMessage } from 'element-plus'

type DeptBase = {
  value: number;
  parentId: number;
  deptName: string;
};

type DepartmentTree = {
  data: DeptBase[];
  checkedIds: number[];
  deptId: number | null;
  deptName: string;
};

export default defineComponent({
  name: "DepartmentTree",
  setup(props, context) {
    const state = reactive<DepartmentTree>({
      data: [],
      checkedIds: [],
      deptId: null,
      deptName: "",
    });
    const defaultProp = {
      label: "deptName",
      value: "id",
      parentId: "parentId",
    };
    const treeRef = ref<InstanceType<typeof ElTreeV2>>();

    // 将数据转为树的结构
    const formatTreeData = () => {
      state.data.sort((a, b) => a.value - b.value);
      state.data = getListData(state.data, state.data[0].parentId, defaultProp);
      // @ts-expect-error
      treeRef.value!.setCheckedKeys([state.data[0].id]);
      context.emit("deptId", state.data[0].value, state.data[0].deptName);
    };

    /* 树选择事件 */
    const handleCheckChange = (data: DeptBase, tree: CheckedInfo) => {
      if (tree.checkedKeys.includes(data.value)) {
        state.deptId = data.value;
        state.deptName = data.deptName;
        // @ts-expect-error
        treeRef.value!.setCheckedKeys([data.id]);
      } else {
        state.deptId = null;
        state.deptName = '';
        // @ts-expect-error
        treeRef.value!.setCheckedKeys([]);
      }
      context.emit("deptId", state.deptId, state.deptName);
    };
    
    //获取当前部门数据
    const getcurrentTreeList = () => {
      getcurrentTree().then((res: any) => {
        if (res.status == 200) {
          state.data = res.data;
          formatTreeData();
        } else {
          ElMessage.error(res.msg);
        }
      });
    };

    getcurrentTreeList();

    return () => (
      <div style="overflow: auto;">
        <el-tree-v2
          ref={treeRef}
          data={state.data}
          props={defaultProp}
          default-checked-keys={state.checkedIds}
          onCheck={handleCheckChange}
          check-strictly
          show-checkbox
          accordion
          node-key="id"
          highlight-current
        >
        </el-tree-v2>
      </div>
    )
  }
});