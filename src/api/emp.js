// 导入封装好的axios实例（包含基础配置和响应拦截器）
import request from "@/utils/request";


// 查询员工列表数据
// 定义分页查询-那么我们要传递条件以及分页参数
// 请求示例/emps?name=张&gender=1&begin=2007-09-e1&end=2022-09-e1&page=1&pageSize=10
export const queryPageApi =(name,gender,begin,end,page,pageSize)=> 
    request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// 新增员工

export const addApi = (emp) => request.post('/emps', emp);
// 根据id查询部门信息
export const queryInfoApi = (id) => request.get(`/emps/${id}`);
//  修改部门信息

// 删除部门信息
