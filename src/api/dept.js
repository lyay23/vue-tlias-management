// 导入封装好的axios实例（包含基础配置和响应拦截器）
import request from "@/utils/request";

/**
 * @description 查询全部部门数据信息
 * @returns {Promise} 返回Promise对象，成功时返回部门列表数据
 * @example
 * queryAllApi().then(data => {
 *   console.log('部门列表:', data);
 * }).catch(error => {
 *   console.error('获取部门列表失败:', error);
 * });
 */
// 发起GET请求，路径为基础URL（/api）拼接/depts，即/api/depts
export const queryAllApi = () => request.get('/depts');
