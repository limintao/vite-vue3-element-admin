## 基于element table封装的表格


### TableLayout Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- |  ---- |  ---- | ---- | ---- |
| colums  | 每一列的配置项，详细配置见 [Table-column](#colums) | Array | - | []  |
| page  | 分页的配置项，所有配置为 `el-pagination` 的配置，传入 `page-size`、`current-page`、`total` 三个字段无效，传入 `align` 字段可配置分页垂直对齐方式，可选值有 `left`、`center`、`right` | Object  | - | {} |
| request | 调取接口时执行的方法，参数 `paramas` 为发送请求时的参数，返回一个对象。对象中必须要有 `data` 和 `success`，如果需要手动分页 `total` 也是必需的。 | Function(params) => {data, success, total} | - | -  |
| show-all-search | 是否展示所有的搜索项，设为false会有展开收起操作 | Boolean | - | false |
| init-load-data | 是否初始化时加载远程数据，设为false后需要手动调方法获取数据 | Boolean | - | true |


### Table Events

| 参数 | 说明 | 参数 |
| ---- |  ---- |  ---- |

### Table Methods

| 参数 | 说明 | 参数 |
| getData |  获取数据的方法 |  -- |
| refresh |  重新加载数据的方法 |  -- |

### Table Slot

| name | 说明 |
| ---- |  ---- |
| table-before | 插入至表格之前筛选之后的内容，需要对表格内容标注说明时，可能需要用到这个slot。  |
| toolbar | 插入至查询按钮之后的内容，筛选需要其他操作时（比如放置添加按钮），可能需要用到这个slot。  |
| *  | 可任意指定插槽名称，与 colums 属性项的 `slotName` 字段相同即可放置在操作列，不匹配则不生效。 |
| append | 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。 |


### Table-column Attributes <a name="colums">#</a>

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- |  ---- |  ---- | ---- | ---- |
| customFilter | 自定义筛选条件的内容，返回 vue 模板  | Function(params):h  | - | -  |
| dateFormat | 仅当 `valueType` 参数的值为 `date` 时，设定日期格式，格式为Element UI的日期选择器格式  | String  | - | yyyy-MM-dd |
| dateType | 仅当 `valueType` 参数的值为 `date` 时，设定日期选择器的类型  | String  | year/month/date/dates/week/datetime/datetimerange/daterange/monthrange | date |
| fieldMap  | 用于做下拉列表的字段映射；`fieldMap.value`：作为 value 的键名，`fieldMap.label`：作为 label 的键名  | Object  | - | { label: 'label', value: 'value' } |
| fieldProps | 查询表单的 props，会透传给表单项,如果渲染出来是 Input,就支持 input 的所有 props，同理如果是 select，也支持 select 的所有 props。也支持方法传入 | ()=>Object() | - | - |
| formField | 搜索项的字段，如果搜索时的字段与表格显示所用的 `props.prop` 字段不同时使用，当筛选项是范围选择器时传入一个数组  | String/Array  | - | - |
| hidden  | 是否隐藏当前列，用于筛选条件中的项不在表格中显示  | Boolean | - | - |
| label | 搜索项的名称，默认搜索想的名称取 `props.label` 的值，传入此项可自定义名称  | String  | - | - |
| options | 对应列为下拉选择是的下拉项  | Array | - | - |
| order | 查询表单中的权重，权重大排序靠前，默认所有权重都是1 | Number | - | 1 |
| props | 当前列的配置项，与 `element Table-column` 的配置相同  | Object | - | {} |
| slotName | 当 `type` 的值为 `actions` 时生效，用于指定操作列的插槽名称  | String  | - | actions  |
| search  | 对应列是否为搜索项  | Boolean | - | false |
| template  | 自定义列内容的模板方法，返回 Vue 的虚拟 DOM ，示例 `() => return (<el-link>自定义列</el-link>)`  | (Function(row, index))):h | - | - |
| type | 表格对应列的类型，只有一个 actions 项，当传入时当前列为操作列  | String  | actions | - |
| valueType | 对应列的搜索类型，当值为 `custom`  时 `customFilter` 必传，可用 `customFilter` 返回自定义的元素模板 | String  | input/date/select/custom | input |


### 特别说明
TableLayout 的其他属性和事件与 `el-table` 的属性和事件一致，`el-table` 文档上有的属性和事件都可以直接用在此组件上。