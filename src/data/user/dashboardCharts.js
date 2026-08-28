import { barOption, lineOption, pieOption } from '../chartPresets.js'
export const pageMeta = { title: '图表总览', description: '集中查看岗位趋势、排行和岗位类别结构', meta: '统计周期：2024-09 至 2025-05' }
export const charts = [
  { title: '岗位数量趋势', option: lineOption(['9月','10月','11月','12月','1月','2月','3月','4月','5月'],[64120,70840,78314,85621,92486,101843,111657,120089,128764]) },
  { title: '热门岗位 Top10', option: barOption(['软件开发','销售代表','产品经理','测试工程师','数据分析','运维工程师'],[12842,8763,6591,5184,4932,4126],'岗位数',true) },
  { title: '热门城市 Top10', option: barOption(['北京','上海','深圳','杭州','广州','南京'],[23541,19872,15642,8721,7985,6412],'岗位数',true) },
  { title: '高薪岗位 Top10', option: barOption(['算法工程师','高级软件工程师','数据科学家','AI 工程师','架构师','安全工程师'],[22860,20540,19800,18200,16800,15870],'平均薪资') },
  { title: '岗位类别占比', option: pieOption(['开发类','测试类','算法类','产品类','运维类','其他'],[41,14,12,11,9,13]) },
]
export function handleRangeChange(range) { return range || '近一年' }
