import { barOption, pieOption } from '../chartPresets.js';
import { createAnalysisState, fields } from './analysisFactory.js';
export const pageMeta = {
  title: '城市与区域分析',
  description: '分析不同城市和区域对计算机类毕业生的岗位需求',
  meta: '演示数据 · 全国主要城市',
};
export const filterFields = fields('city', 'level', 'category', 'range');
export const defaultFilters = { city: '', level: '', category: '', range: '近一年' };
export const charts = [
  {
    title: '城市岗位数量 TopN',
    option: barOption(
      ['北京', '上海', '深圳', '杭州', '广州', '南京', '成都', '武汉'],
      [23541, 19872, 15642, 8721, 7985, 6412, 5930, 5280],
      '岗位数',
      true,
    ),
  },
  {
    title: '不同区域岗位分布',
    option: pieOption(['华东', '华北', '华南', '西南', '华中', '东北'], [31, 25, 21, 10, 9, 4]),
  },
  {
    title: '区域招聘需求差异',
    option: barOption(
      ['华东', '华北', '华南', '西南', '华中'],
      [39850, 32140, 27860, 12800, 11040],
    ),
  },
  {
    title: '一线 vs 新一线岗位数量',
    option: barOption(['一线城市', '新一线城市'], [67040, 42360]),
  },
  {
    title: '城市就业吸引力',
    option: barOption(
      ['深圳', '杭州', '北京', '上海', '南京', '成都'],
      [92, 89, 87, 86, 82, 79],
      '吸引力评分',
      true,
    ),
  },
];
export function createPageState() {
  return createAnalysisState(defaultFilters);
}
export function handleSearch(state) {
  return state.apply();
}
export function handleReset(state) {
  return state.reset();
}
