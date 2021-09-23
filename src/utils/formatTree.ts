/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-09-17 10:30:46
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/utils/formatTree.ts
 * @Description: 由limit创建！
 */
/*
  格式化树形
  datas需要过滤的数据
  最外层节点的parentId
  defaultProp为树形数据的默认配置
  */
interface Props {
  label: string;
  id: string | number;
  parentId: number | string;
}

const getListData = function getListData(
  datas: any[],
  bigPid: number,
  defaultProp: Props
) {
  if (!defaultProp) {
    defaultProp = {
      label: "deptName",
      id: "id",
      parentId: "parentId",
    };
  }
  let dataArray: any[] = [];
  datas.forEach((data: { [name: string]: string | number }) => {
    const pid = data[defaultProp.parentId];
    if (pid == bigPid) {
      let objTemp: { [name: string]: string | number } = {};
      for (const pl in data) {
        //数组对象遍历
        objTemp[pl] = data[pl];
      }
      dataArray.push(objTemp);
    }
  });
  return data2treeDG(datas, dataArray, defaultProp);
};
function data2treeDG(
  datas: any[],
  dataArray: any[],
  defaultProp: Props
) {
  for (let j = 0; j < dataArray.length; j++) {
    let dataArrayIndex = dataArray[j];
    let childrenArray = [];
    let Id = dataArrayIndex[defaultProp.id];
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i];
      let pid = data[defaultProp.parentId];
      if (pid == Id) {
        //判断是否为儿子节点
        let objTemp: { [name: string]: string | number } = {};
        for (var pl in data) {
          //数组对象遍历
          objTemp[pl] = data[pl];
        }
        childrenArray.push(objTemp);
      }
    }
    dataArrayIndex.children = childrenArray;
    if (childrenArray.length > 0) {
      //有儿子节点则递归
      data2treeDG(datas, childrenArray, defaultProp);
    } else if (childrenArray.length < 1) {
      dataArrayIndex.children = undefined;
    }
  }
  return dataArray;
}

export default getListData;
