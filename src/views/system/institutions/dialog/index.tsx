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
      title={(state.modalEdit ? "修改" : "新增") + "机构"}
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
            <el-form-item label="上级机构名称">
              {state.detailInfo.deptName}
            </el-form-item>
          ) : null}
          <el-form-item label="机构名称" prop="deptName">
            <el-input maxlength="30" v-model={state.form.deptName} />
          </el-form-item>
          <el-form-item label="状态" prop="usable">
            <el-select
              v-model={state.form.usable}
              placeholder="请选择"
              clearable
            >
              <el-option label="启用" value={1} />
              <el-option label="禁用" value={0} />
            </el-select>
          </el-form-item>
          <el-form-item label="机构编码" prop="deptCode">
            <el-input v-model={state.form.deptCode} />
          </el-form-item>
          <el-form-item label="描述" prop="deptDesc">
            <el-input
              type="textarea"
              rows="3"
              v-model={state.form.deptDesc}
              placeholder="请输入描述"
              maxlength="200"
              show-word-limit
              resize="none"
              autosize={{ minRows: 3, maxRows: 5 }}
            />
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  );
};
