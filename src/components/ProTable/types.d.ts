/*
 * @Author: limit
 * @Date: 2021-09-17 17:18:45
 * @LastEditTime: 2021-09-26 09:26:55
 * @LastEditors: limit
 * @FilePath: /basic-services/src/components/ProTable/types.d.ts
 * @Description: 由limit创建！
 */

import { ElTableColumn } from "element-plus";
import type { Plugin } from 'vue';
import type { IDatePickerType } from "element-plus/lib/components/date-picker/src/date-picker.type";
import type { IPaginationProps } from "element-plus/lib/components/pagination/src/pagination";
import type { TableProps } from "element-plus/lib/components/table/src/table/defaults"

declare type SelectFieldMap = {
  value?: string;
  label?: string;
}

export declare type RequestData = {
  success: boolean;
  data?: any[];
  total?: number;
};

export declare type ColumnOptions = {
  customFilter?(query: {[name: string]: any}): JSX.Element;
  dateFormat?: string;
  dateType?: IDatePickerType;
  fieldMap?: SelectFieldMap;
  fieldProps?: string;
  formField?: string | string[];
  hidden?: boolean;
  label?: string;
  options?: {[name: string]: string}[];
  order?: number;
  props?: typeof ElTableColumn.props;
  slotName?: string;
  search?: boolean;
  template?(a: {[name: string]: any}, b: number): JSX.Element;
  type?: "actions";
  valueType?: "input" | "date" | "select" | "custom";
};

export declare type AnyObject = {
  [name: string]: any;
};

export declare type TableQueryBaseParams = AnyObject & {
  pageSize: number;
  pageNumber: number;
}

export declare const ProTable: import("vue").DefineComponent<{
  request(): RequestData;
  columns: ColumnOptions[];
  page?: IPaginationProps;
  "show-all-search"?: boolean;
  "init-load-data"?: boolean;
} & TableProps<AnyObject>> & Plugin