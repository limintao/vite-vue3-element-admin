/*
 * @Author: limit
 * @Date: 2021-09-24 11:17:00
 * @LastEditTime: 2021-09-26 10:51:18
 * @LastEditors: limit
 * @FilePath: /basic-services/src/components/ProTable/search-item.tsx
 * @Description: 由limit创建！
 */
import { ColumnOptions } from "./types";
import { ElInput, ElSelect, ElOption, ElDatePicker } from "element-plus";

export default (item: ColumnOptions, state: any): JSX.Element | undefined => {
  const props = Object.assign({}, item.props);
  item.valueType = item.valueType ?? "input";
  // 输入框
  if (item.valueType == "input") {
    return (
      <ElInput
        v-model={state.listQuery[item.formField || props.prop]}
        placeholder={item.label ? item.label : "请输入" + props.label}
        class="pro-table-filter-item"
        clearable
        maxlength={50}
        {...item.fieldProps}
      />
    );
  }
  // 下拉框
  if (item.valueType == "select") {
    return (
      <ElSelect
        v-model={state.listQuery[item.formField || props.prop]}
        placeholder={item.label ? item.label : "请选择" + props.label}
        clearable
        {...item.fieldProps}
        class="pro-table-filter-item"
      >
        {item.options?.map((it) => (
          <ElOption
            key={it[item.fieldMap?.value || "value"]}
            label={it[item.fieldMap?.label || "label"]}
            value={it[item.fieldMap?.value || "value"]}
          />
        ))}
      </ElSelect>
    );
  }
  // 时间选择器
  if (item.valueType == "date") {
    return (
      <ElDatePicker
        v-model={
          state.listQuery[
            Array.isArray(item.formField)
              ? "__del__" + props.prop
              : item.formField || props.prop
          ]
        }
        type={item.dateType || "date"}
        class="pro-table-filter-item"
        clearable
        onChange={(val: string[] | string) => {
          if (Array.isArray(item.formField)) {
            state.listQuery[item.formField[0]] = val && val[0];
            state.listQuery[item.formField[1]] = val && val[1];
          }
        }}
        value-format={item.dateFormat || "YYYY-MM-DD"}
        placeholder={item.label ? item.label : props.label}
        start-placeholder={(item.label ? item.label : props.label) + "开始时间"}
        end-placeholder={(item.label ? item.label : props.label) + "结束时间"}
        {...item.fieldProps}
      />
    );
  }
  // 自定义筛选
  if (item.valueType == "custom") {
    return item.customFilter?.(state.listQuery);
  }
  return;
};
