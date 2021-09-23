/*
 * @Author: limit
 * @Date: 2021-09-17 16:06:30
 * @LastEditTime: 2021-09-22 17:48:59
 * @LastEditors: limit
 * @FilePath: /basic-services/src/components/ProTable/ProTable.tsx
 * @Description: 由limit创建！
 */
import { defineComponent, reactive, getCurrentInstance, onMounted, withModifiers } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElRow,
  ElCol,
  ElIcon,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
} from "element-plus";
import { TableQueryBaseParams, AnyObject } from "./types";
import { ColumnOptions } from "./types";
import styles from "./index.module.scss";
import { useExpose } from "./use-expose";

declare interface RequestData {
  success: boolean;
  data: any[];
  total: number;
};

export default defineComponent({
  name: "ProTable",
  inheritAttrs: false,
  props: Object.assign({}, ElTable.props, {
    // 表格列的配置
    columns: {
      type: Array,
      required: true,
      default: () => new Array(),
    },
    // 分页的对象，可选的属性为 el-pagination 的所有属性
    page: {
      type: Object,
      default: () => new Object(),
    },
    // 是否显示加载动画
    listLoading: {
      type: Boolean,
      default: true,
    },
    // 请求接口获取数据
    request: {
      type: Function,
      requried: true,
    },
    // 是否显示全部字段，true显示所有字段，没有展开收起按钮
    showAllSearch: {
      type: Boolean,
      default: false,
    },
    // 是否加载组件后立即加载数据。需要手动触发数据时传为false；
    initLoadData: {
      type: Boolean,
      default: true,
    },
  }),
  setup(props, { slots, attrs }) {
    const state = reactive<any>({
      loading: false,
      showMore: false,
      colSpan: 6,
      displayCol: 3,
      offsetCol: 0,
      listQuery: {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      },
      tableData: [],
      tableProps: {},
      clientWidth: innerWidth,
      statusText: "暂无数据！",
    });

    const init = (e: any) => {
      state.clientWidth = e ? e.currentTarget?.innerWidth : window.innerWidth;
      const search = props.columns.filter((item: ColumnOptions) => item.search);
      const colSpan = getWidthCorrespSpan();
      const displayCol = 24 / colSpan - 1;
      const offsetCol = (displayCol - (search.length % displayCol)) * colSpan;
      
      state.colSpan = colSpan;
      state.displayCol = displayCol;
      state.offsetCol = offsetCol;
    };

    // 获取数据
    const getData = async () => {
      state.loading = true;
      const result: RequestData = await props.request({ ...delUselessField() });
      state.tableData = result.data || [];
      state.listQuery.total = result.total || 0;
      state.statusText = result.success
        ? "暂无数据！"
        : "加载出错，请稍后重试！";
      state.loading = false;
    };
    //查询
    const handleFilter = () => {
      state.listQuery.pageNumber = 1;
      getData();
    };
    // 刷新
    const refresh = () => {
      state.listQuery = Object.assign({}, getCurrentInstance()?.data?.listQuery);
      getData();
    };
    // 获取默认的表格设置
    const getDefaultTableProps = () => {
      return {
        data: state.tableData,
        fit: true,
        border: true,
        "empty-text": state.statusText,
      };
    };
    // 删除查询参数中需要删除的字段
    const delUselessField = () => {
      const query: TableQueryBaseParams = { ...state.listQuery };
      for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
          if (key.startsWith("__del__")) delete query[key];
        }
      }
      return query;
    };
    // 获取默认设置的分页配置
    const getDefaultPageProps = (): any => {
      return {
        background: true,
        hideOnSinglePage: true,
        pageSizes: [10, 20, 30, 50],
        layout: "total, sizes, prev, pager, next, jumper",
        onSizeChange: (val: number) => {
          state.listQuery.pageSize = val;
          getData();
        },
        onCurrentChange: (val: number) => {
          state.listQuery.pageNumber = val;
          getData();
        },
      };
    };
    // 获取筛选组件模板
    const getSearchTemplate = (): JSX.Element | null => {
      const searchData = props.columns.filter(
        (search: ColumnOptions) => search.search
      );
      searchData.sort(
        (firstEl: ColumnOptions, secondEl: ColumnOptions) =>
          (secondEl.order ?? 1) - (firstEl.order ?? 1)
      );
      return searchData.length ? (
        <ElRow gutter={20}>
          {searchData.map((item: ColumnOptions, index: number) => {
            const props = Object.assign({}, item.props);
            console.log(item);
            
            return (
              <ElCol
                key={index}
                xs={state.colSpan}
                sm={state.colSpan}
                style={{
                  display:
                    props.showAllSearch ||
                    state.showMore ||
                    index < state.displayCol
                      ? "block"
                      : "none",
                }}
              >
                {/* 输入框 */}
                {(!item.valueType || item.valueType == "input") && (
                  <ElInput
                    v-model={state.listQuery[item.formField || props.prop]}
                    placeholder={item.label ? item.label : ("请输入" + props.label)}
                    class={styles["filter-item"]}
                    clearable
                    {...item.fieldProps}
                  />
                )}
                {/* 下拉框 */}
                {item.valueType == "select" && (
                  <ElSelect
                    v-model={state.listQuery[item.formField || props.prop]}
                    placeholder={item.label ? item.label : ("请选择" + props.label)}
                    clearable
                    {...item.fieldProps}
                    class={styles["filter-item"]}
                  >
                    {item.options?.map((it) => (
                      <ElOption
                        key={it[item.fieldMap?.value || "value"]}
                        label={it[item.fieldMap?.label || "label"]}
                        value={it[item.fieldMap?.value || "value"]}
                      />
                    ))}
                  </ElSelect>
                )}
                {/* 时间选择器 */}
                {item.valueType == "date" && (
                  <ElDatePicker
                    v-model={
                      state.listQuery[
                        Array.isArray(item.formField)
                          ? "__del__" + props.prop
                          : item.formField || props.prop
                      ]
                    }
                    type={item.dateType || "date"}
                    class={styles["filter-item"]}
                    clearable
                    onChange={(val: string[] | string) =>
                      handleRangeDate(val, item.formField)
                    }
                    value-format={item.dateFormat || "yyyy-MM-dd"}
                    placeholder={item.label ? item.label : props.label}
                    start-placeholder={
                      (item.label ? item.label : props.label) + "开始时间"
                    }
                    end-placeholder={
                      (item.label ? item.label : props.label) + "结束时间"
                    }
                    {...item.fieldProps}
                  />
                )}
                {/* 自定义筛选框 */}
                {item.valueType == "custom" &&
                  item.customFilter?.(state.listQuery)}
              </ElCol>
            );
          })}
          <ElCol
            sm={{ span: state.colSpan, offset: state.offsetCol}}
            xs={{ span: state.colSpan, offset: state.offsetCol}}
            class={styles["search-btn-view"]}
          >
            {!props.showAllSearch && searchData.length > state.displayCol && (
              <div
                class={styles["show-more"]}
                onClick={() => (state.showMore = !state.showMore)}
              >
                <small>{state.showMore ? "收起" : "展开"}</small>
                <i
                  class={
                    state.showMore
                      ? "el-icon-caret-top"
                      : "el-icon-caret-bottom"
                  }
                />
              </div>
            )}
            <ElButton type="primary" onClick={handleFilter}>
              查 询
            </ElButton>
            {slots.toolbar?.()}
          </ElCol>
        </ElRow>
      ) : null;
    };
    // 获取表格列模板
    const getColumnTemplate = (item: ColumnOptions): JSX.Element | null => {
      const itemProps = Object.assign(
        {},
        {
          formatter: (row: AnyObject) =>
            row[item.props.prop] ?? "--",
        },
        item.props
      );
      const scopedSlots = (item.template || item.type == "actions") && {
        default: item.template ?? slots[item.slotName || "actions"],
      };
      return item.hidden ? null : (
        <ElTableColumn { ...itemProps } v-slots={scopedSlots || null} />
      );
    };
    // 获取浏览器宽度返回当前列的占比
    const getWidthCorrespSpan = (): number => {
      let colSpan = 6;
      const deviceWidth = window.innerWidth;
      if (deviceWidth >= 1920) colSpan = 4;
      if (deviceWidth <= 1200) colSpan = 8;
      if (deviceWidth <= 740) colSpan = 12;
      return colSpan;
    };
    // 处理范围选择的事件
    const handleRangeDate = (
      val: string[] | string | undefined,
      field: string | string[] | undefined
    ) => {
      if (Array.isArray(field)) {
        (state.listQuery as TableQueryBaseParams)[field[0]] = val && val[0];
        (state.listQuery as TableQueryBaseParams)[field[1]] = val && val[1];
      }
    };

    // 导出方法
    useExpose({ refresh });

    onMounted(() => {
      init(null);
      if (props.initLoadData) getData();
      window.addEventListener('resize', init);
    });

    const tableProps: AnyObject = new Object();
    // 循环 el-table 组件的属性
    Object.keys(ElTable.props).forEach((k) => {
      if (k == "data") return;
      props[k] && (tableProps[k] = props[k]);
      return tableProps[k];
    });

    // render函数
    return () => (
      <div class={styles["table-layout"]} v-loading={state.loading}>
        <div class={styles["filter-view"]}>{getSearchTemplate()}</div>
        {slots["table-before"]?.()}
        <div class={styles["table-view"]}>
          <ElTable
            v-slots={slots}
            {...getDefaultTableProps()}
            {...tableProps}
            {...attrs}
          >
            {props.columns.map((item: ColumnOptions) => getColumnTemplate(item))}
          </ElTable>
        </div>
        <div
          class={styles["table-pagination"]}
          style={{ textAlign: props.page.align }}
        >
          <ElPagination
            {...getDefaultPageProps()}
            {...props.page}
            total={state.listQuery.total}
            pageSize={state.listQuery.pageSize}
          />
        </div>
      </div>
    );
  },
});