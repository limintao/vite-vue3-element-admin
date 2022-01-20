import type { Ref } from "vue";

export default (show: Ref<boolean>, data: Record<string, any>) => {
  return (
    <el-dialog
      center
      top="7vh"
      width="50%"
      title="查看日志详情"
      v-model={show.value}
      v-slots={{
        default: () => (
          <div class="dialog-box">
            <el-form label-position="left" label-suffix=" ：" label-width="100px">
              <el-form-item label="租户名称">
                <span>{data.tenantName}</span>
              </el-form-item>
              <el-form-item label="服务名">
                <span>{data.serviceName}</span>
              </el-form-item>
              <el-form-item label="模块">
                <span>{data.module}</span>
              </el-form-item>
              <el-form-item label="是否成功">
                <span>{data.success == 1 ? "成功" : "失败"}</span>
              </el-form-item>
              <el-form-item label="操作人">
                <span>{data.operator}</span>
              </el-form-item>
              <el-form-item label="执行时间">
                <span>{data.time}ms</span>
              </el-form-item>
              <el-form-item label="请求参数">
                <span>{data.params}</span>
              </el-form-item>
              <el-form-item label="操作IP">
                <span>{data.ip}</span>
              </el-form-item>
              <el-form-item label="异常信息">
                <span>{data.stackTrace}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{data.createTime}</span>
              </el-form-item>
            </el-form>
          </div>
        ),
      }}
    ></el-dialog>
  );
};
