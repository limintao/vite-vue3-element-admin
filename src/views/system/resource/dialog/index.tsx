import type { Ref } from "vue";
declare type ComponentParams = {
  state: Record<string, any>;
  conform(): void;
  closed(): void;
  ref: Ref<any>;
};

export default ({ ref, state, conform, closed }: ComponentParams) => {
  return (
    <el-dialog
      title={
        (state.modalEdit ? "修改" : "新增") +
        (!state.addMenuLevel ? "一级" : "") +
        "节点"
      }
      v-model={state.dialogVisible}
      v-slots={{
        footer: () => (
          <span>
            <el-button onClick={() => (state.dialogVisible = false)}>
              取消
            </el-button>
            <el-button v-db-click type="primary" onClick={conform}>
              保存
            </el-button>
          </span>
        ),
      }}
      center
      width="550px"
      onClosed={closed}
    >
      <div class="box">
        <el-form
          model={state.form}
          ref={ref}
          rules={state.rules}
          label-width="120px"
          label-suffix="："
        >
          {state.institutionName ? (
            <el-form-item label="上级节点名称">
              {state.detailInfo.permissionName || state.detailInfo.name}
            </el-form-item>
          ) : null}
          <el-form-item label="节点名称" prop="permissionName">
            <el-input maxlength="30" v-model={state.form.permissionName} />
          </el-form-item>
          {state.addMenuLevel ? (
            <el-form-item label="节点类型" prop="permissionType">
              <el-select
                v-model={state.form.permissionType}
                onChange={(value: number) => (state.nodeShow = value != 2)}
                placeholder="请选择类型"
                clearable
              >
                <el-option label="菜单折叠" value={0} />
                <el-option label="页面" value={1} />
                <el-option label="按钮" value={2} />
              </el-select>
            </el-form-item>
          ) : null}
          {state.nodeShow ? (
            <>
              <el-form-item label="跳转地址" prop="path">
                <el-input v-model={state.form.path} />
              </el-form-item>
              <el-form-item label="组件地址" prop="component">
                <el-input v-model={state.form.component} />
              </el-form-item>
              <el-form-item label="选择图标" prop="icon">
                <e-icon-picker v-model={state.form.icon} />
              </el-form-item>
            </>
          ) : (
            <el-form-item label="权限标识" prop="permissionCode">
              <el-input v-model={state.form.permissionCode} />
            </el-form-item>
          )}
        </el-form>
      </div>
    </el-dialog>
  );
};
