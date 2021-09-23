/*
 * @Author: limit
 * @Date: 2021-09-15 13:19:28
 * @LastEditTime: 2021-09-22 15:49:02
 * @LastEditors: limit
 * @FilePath: /basic-services/src/api/types/index.d.ts
 * @Description: 由limit创建！
 */


declare type TableQueryBase = {
  pageNumber?: number;
  pageSize?: number;
};

declare type DeptQueryBase = {
  deptName: string;
};

// 用户相关接口参数类型；
export namespace User {

  export type LoginParams = {
    username: string,
    password: string,
  }

  export type UpdatePassword = {
    newPwd: string,
    oldPwd: string,
    userId: number,
  };
}

// 系统设置相关接口参数类型；
export namespace System {
  export type LogList = TableQueryBase & {
    beginTime?: string;
    endTime?: string;
    module?: string;
    success?: 1 | 0;
    tenantId?: number;
  }
  
  export type AddTentan = {
    tenantCode?: string;
    tenantDesc?: string;
    tenantName?: string;
    usable?: 1 | 0;
  }

  export type UpdateTentan = AddTentan & {
    id: number;
  }

  export type TentanList = {
    current: number;
    size: number;
    name?: string;
    usable?: 1 | 0;
  }

  export type DeptDataUpdate = {
    deptCode: number;
    deptDesc: string;
    deptName: string;
    id?: number;
    parentId?: number;
    usable?: 1 | 0;
  }

  export type DeptDataAdd = Required<DeptDataUpdate> & {
    tenantId: number;
  }

  export type PermissionAdd = {
    component: string;
    icon: string;
    parentId: number;
    path: string;
    permissionCode: string;
    permissionGroup: string;
    permissionName: string;
    permissionType: 0 | 1 | 2;
  }

  export type PermissionUpdate = Partial<PermissionAdd> & {
    id: number;
  }
}