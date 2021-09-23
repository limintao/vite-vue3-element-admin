import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from "vue";
import { useStore } from "@/store";
import { getlogList, deletelog, batchDelete, tenantlistForLog } from "@/api/system";
import { TableQueryBaseParams, AnyObject } from "@/components/ProTable/types";
import BlogDialog from "./dialog";

export default defineComponent({
  name: "SystemBlog",
  setup(props) {
    const store = useStore();
    const proTableRef = ref<AnyObject>();
    const dialogVisible = ref<boolean>(false);
    const temporary = ref<AnyObject>({});
    const multipleSelectionAll = ref<AnyObject[]>([]);
    const app = getCurrentInstance()?.appContext.config.globalProperties;

    const paramsTemp = (row: AnyObject): JSX.Element => (
      <el-popover
        placement="right"
        title="请求参数"
        width={450}
        trigger="hover"
        content={row.params}
        v-slots={{
          reference: () => (
            <el-link underline={false} type="primary">
              参数详情
            </el-link>
          ),
        }}
      />
    );

    // 查看日志详情
    const viewShow = (row: AnyObject) => {
      temporary.value = row;
      dialogVisible.value = true;
    };

    // 删除日志
    const deleteLog = (row: AnyObject) => {
      app?.$confirm("确认删除该日志信息？", "操作提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        deletelog(row.id).then((result: any) => {
          if (result.status == 200) {
            app?.$message.success({ message: "删除成功！" });
            proTableRef.value?.refresh();
          } else {
            app?.$message.error({ message: result.msg });
          }
        });
      }).catch();
    };

    // 批量删除日志
    const handelBatchDelete = () => {
      const selectData = multipleSelectionAll.value.map(e => e.id);
      if (!selectData.length) {
        app?.$message.error({ message: "请先勾选要删除的日志" });
        return ;
      };
      app?.$confirm("确认删除该日志信息？", "操作提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        batchDelete(selectData).then((result: any) => {
          if (result.status == 200) {
            app?.$message.success({ message: "删除成功！" });
            proTableRef.value?.refresh();
          } else {
            app?.$message.error({ message: result.msg });
          }
        });
      })
      .catch();
    };

    const data = reactive({
      columns: [
        {
          props: { type: "selection", align: "center", reserveSelection: true },
        },
        {
          props: { prop: "tenantName", label: "租户名称", filterable: true },
          valueType: "select",
          search: true,
          formField: "tenantId",
          fieldMap: { label: "tenantName", value: "id" },
          options: [],
        },
        { props: { prop: "operator", label: "操作人" } },
        { props: { prop: "ip", label: "请求ip" } },
        { props: { prop: "method", label: "请求接口" } },
        {
          props: { prop: "module", label: "模块" },
          search: true,
          label: "请输入模块名称",
        },
        { props: { prop: "params", label: "请求参数" }, template: paramsTemp },
        {
          props: { prop: "success", label: "是否成功", align: "center" },
          search: true, valueType: "select",
          options: [{label: "成功", value: 1},{label: "失败", value: 0}],
          template: ({ row }: AnyObject) => (
            <i
              class={"el-icon-" + (row.success ? "success" : "error")}
              style={{
                color: `var(--el-color-${row.success ? "success" : "error"})`,
                fontSize: "19px",
              }}
            />
          ),
        },
        {
          props: { prop: "createTime", label: "创建时间" },
          label: " ",
          search: true,
          valueType: "date",
          dateType: "datetimerange",
        },
        { props: { prop: "time", label: "执行时间(毫秒)" } },
        {
          props: { label: "操作", align: "center" },
          type: "actions",
          template: ({ row }: AnyObject) => (
            <>
              <el-button
                type="primary"
                size="mini"
                onClick={() => viewShow(row)}
              >
                查看
              </el-button>
              <el-button
                type="danger"
                v-permission={{ code: "base:blog:delete" }}
                size="mini"
                onClick={() => deleteLog(row)}
              >
                删除
              </el-button>
            </>
          ),
        },
      ],
      page: {
        hideOnSinglePage: false,
      },
    });

    const handleSelectionChange = (selection: any) => {
      multipleSelectionAll.value = selection;
    };

    const getListData = async (query: TableQueryBaseParams) => {
      const params: TableQueryBaseParams = query;
      const response = await getlogList(params).catch(() => null);
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

    onMounted(() => {
      tenantlistForLog(app?.$sessionData("get", "tenantId")).then((result) => {
        data.columns[1].options = result.data;
      });
    });

    return () => (
      <div class="main-content">
        <pro-table
          ref={proTableRef}
          row-key={(row: AnyObject) => row.id}
          request={getListData}
          page={data.page}
          onSelectionChange={handleSelectionChange}
          columns={data.columns}
          v-slots={{
            toolbar: () => (
              <el-button
                v-permission={{ code: "base:blog:delete" }}
                type="primary"
                onClick={handelBatchDelete}
              >批量删除</el-button>
            ),
          }}
        ></pro-table>
        {BlogDialog(dialogVisible, temporary.value)}
      </div>
    );
  },
});
