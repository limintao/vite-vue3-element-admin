/*
 * @Author: limit
 * @Date: 2021-09-18 14:31:04
 * @LastEditTime: 2021-09-22 18:02:20
 * @LastEditors: limit
 * @FilePath: /basic-services/src/api/system.ts
 * @Description: 由limit创建！
 */

import request from "../utils/request";
import { System } from "./types";

// 新增资源权限
export const addPermission = (data: System.PermissionAdd) =>
  request({
    url: "upms/permission/save",
    method: "POST",
    data,
  });

// 删除资源权限
export const deletePermission = (id: number) =>
  request({
    url: `upms/permission/delete/${id}`,
    method: "POST",
  });

// 修改资源权限
export const updatePermission = (data: System.PermissionUpdate) =>
  request({
    url: `upms/permission/update`,
    method: "POST",
    data,
  });

// 根据租户id和分组获取所有资源 前端构建树
export const getTreeByTenantIdAndGroup = (params: {
  group: string;
  tenantId: number;
}) =>
  request({
    url: `upms//permission/getTreeByTenantIdAndGroup`,
    method: "GET",
    params,
  });

// 移动资源权限列表
export const movePermission = (data: { fid: number; sid: number }) =>
  request({
    url: `upms/permission/move`,
    method: "POST",
    data,
  });

// 获取当前登录人的资源权限列表
export const currentPermission = () =>
  request({
    url: `upms/permission/currentTreeByGroup/web`,
    method: "GET",
  });

// 添加机构
export const addMechanism = (data: System.DeptDataAdd) =>
  request({
    url: `upms/dept/add`,
    method: "post",
    data,
  });

// 删除机构
export const deleteMechanism = (data: { id: number }) =>
  request({
    url: `upms/dept/delete`,
    method: "POST",
    data,
  });

// 修改机构
export const updateMechanism = (data: System.DeptDataUpdate) =>
  request({
    url: `upms/dept/update`,
    method: "PUT",
    data,
  });

// 排序机构
export const orderMechanism = (data: { fid: number; sid: number }) =>
  request({
    url: `upms/dept/order`,
    method: "PUT",
    data,
  });

// 获取机构列表
export const getMechanismList = () =>
  request({
    url: `upms/dept/currentTree`,
    method: "GET",
  });

// 获取的部门数据根据名称模糊查询
export const getMechanismListByName = (params: { name: string }) =>
  request({
    url: "/upms/dept/currentTreeByName",
    params,
  });

// 获取当前人的部门数据
export const getcurrentTree = () =>
  request({
    url: `upms/dept/currentTree`,
    method: "GET",
  });

// 租户列表
export const gettenantList = (query: System.TentanList) =>
  request({
    url: `upms/tenant/list`,
    method: "GET",
    params: query,
  });

// 新增租户
export const addtenant = (data: System.AddTentan) =>
  request({
    url: "upms/tenant/save",
    method: "POST",
    data,
  });

// 切换租户启用状态
export const switchTenant = (id: number) =>
  request({
    url: "upms/tenant/" + id,
    method: "PUT",
  });

// 修改租户
export const updateTenant = (data: System.UpdateTentan) =>
  request({
    url: `upms/tenant`,
    method: "PUT",
    data,
  });

//删除租户
export const deletetenant = (id: number) =>
  request({
    url: "upms/tenant/" + id,
    method: "DELETE",
  });

// 日志分页查询
export const getlogList = (query: System.LogList) =>
  request({
    url: `upms/log/list`,
    method: "GET",
    params: query,
  });

//删除日志
export const deletelog = (id: number) =>
  request({
    url: "upms/log/delete/" + id,
    method: "DELETE",
  });

//删除日志
export const batchDelete = (data: number[]) =>
  request({
    url: "upms/log/batchDelete",
    method: "DELETE",
  });
  
  // 日志界面租户下拉(平台看所有 非平台只看自己) 
export const tenantlistForLog = (tenantId: number) =>
  request({
    url: `upms/tenant/listForLog/${tenantId}`,
    method: "GET",
  });