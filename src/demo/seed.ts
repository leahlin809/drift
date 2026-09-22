import type { DemoEntry, DemoLocation } from './types';

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: 'france', name: 'France', localName: '法国', type: 'country', latitude: 46.2, longitude: 2.2, countryCode: 'FR', ancestorIds: [] },
  { id: 'ile-de-france', name: 'Île-de-France', localName: '法兰西岛', type: 'region', latitude: 48.7, longitude: 2.4, countryCode: 'FR', ancestorIds: ['france'], parentLabel: 'France' },
  { id: 'paris', name: 'Paris', localName: '巴黎', type: 'city', latitude: 48.8566, longitude: 2.3522, countryCode: 'FR', ancestorIds: ['ile-de-france', 'france'], parentLabel: 'France' },
  { id: 'louvre-pyramid', name: 'Louvre Pyramid', localName: '卢浮宫玻璃金字塔', type: 'point', latitude: 48.8606, longitude: 2.3376, countryCode: 'FR', ancestorIds: ['paris', 'ile-de-france', 'france'], parentLabel: 'Paris, France' },

  { id: 'china', name: 'China', localName: '中国', type: 'country', latitude: 35.8617, longitude: 104.1954, countryCode: 'CN', ancestorIds: [] },
  { id: 'jiangsu', name: 'Jiangsu', localName: '江苏', type: 'region', latitude: 32.9711, longitude: 119.455, countryCode: 'CN', ancestorIds: ['china'], parentLabel: 'China' },
  { id: 'suzhou', name: 'Suzhou', localName: '苏州', type: 'city', latitude: 31.2989, longitude: 120.5853, countryCode: 'CN', ancestorIds: ['jiangsu', 'china'], parentLabel: 'Jiangsu, China' },
  { id: 'suzhou-museum', name: 'Suzhou Museum', localName: '苏州博物馆', type: 'point', latitude: 31.323, longitude: 120.627, countryCode: 'CN', ancestorIds: ['suzhou', 'jiangsu', 'china'], parentLabel: 'Suzhou, China' },
  { id: 'beijing', name: 'Beijing', localName: '北京', type: 'city', latitude: 39.9042, longitude: 116.4074, countryCode: 'CN', ancestorIds: ['china'], parentLabel: 'China' },
  { id: 'forbidden-city', name: 'Forbidden City', localName: '故宫博物院', type: 'point', latitude: 39.9163, longitude: 116.3972, countryCode: 'CN', ancestorIds: ['beijing', 'china'], parentLabel: 'Beijing, China' },

  { id: 'united-states', name: 'United States', localName: '美国', type: 'country', latitude: 39.8, longitude: -98.6, countryCode: 'US', ancestorIds: [] },

  { id: 'japan', name: 'Japan', localName: '日本', type: 'country', latitude: 37.5, longitude: 138.2, countryCode: 'JP', ancestorIds: [] },
  { id: 'hokkaido', name: 'Hokkaido', localName: '北海道', type: 'region', latitude: 43.2, longitude: 142.8, countryCode: 'JP', ancestorIds: ['japan'], parentLabel: 'Japan' },
  { id: 'otaru', name: 'Otaru', localName: '小樽', type: 'city', latitude: 43.1907, longitude: 140.9947, countryCode: 'JP', ancestorIds: ['hokkaido', 'japan'], parentLabel: 'Hokkaido, Japan' },
];

export const DEMO_ENTRIES: DemoEntry[] = [
  {
    id: 'the-little-prince', title: '小王子', type: 'book', creator: '安托万·德·圣埃克苏佩里', year: 1943,
    note: '小时候读的是童话，长大后再看，才发现它也在讨论告别、责任与远方。', source: '个人书架',
    externalLink: 'https://en.wikipedia.org/wiki/The_Little_Prince',
    locationIds: ['france'], tags: ['文学', '想象力'], topics: ['法国文学想象'],
    createdAt: '2026-06-03T10:00:00.000Z', updatedAt: '2026-08-28T09:12:00.000Z',
  },
  {
    id: 'amelie', title: '天使爱美丽', type: 'movie', creator: '让-皮埃尔·热内', year: 2001,
    note: '电影把巴黎拍成一座由咖啡馆、街角和偶然相遇组成的想象城市。', source: '电影资料馆',
    externalLink: 'https://en.wikipedia.org/wiki/Am%C3%A9lie',
    locationIds: ['paris'], tags: ['电影', '巴黎'], topics: ['城市与银幕'],
    createdAt: '2026-05-21T12:00:00.000Z', updatedAt: '2026-08-25T08:00:00.000Z',
  },
  {
    id: 'love-letter', title: '情书', type: 'movie', creator: '岩井俊二', year: 1995,
    note: '雪、小樽与两段记忆共同构成了电影最难忘的空间气质。', source: '朋友推荐',
    externalLink: 'https://en.wikipedia.org/wiki/Love_Letter_(1995_film)',
    locationIds: ['otaru'], tags: ['电影', '冬日'], topics: ['城市与银幕'],
    createdAt: '2026-05-02T09:00:00.000Z', updatedAt: '2026-08-20T16:00:00.000Z',
  },
  {
    id: 'im-pei', title: '贝聿铭', type: 'person', creator: '建筑师', year: 1917,
    note: '从苏州到巴黎与纽约，他的建筑把现代主义与不同地方的文化语境连接起来。', source: '建筑阅读笔记',
    externalLink: 'https://en.wikipedia.org/wiki/I._M._Pei',
    locationIds: ['china', 'france', 'united-states'], tags: ['建筑', '现代主义'], topics: ['贝聿铭的建筑地图'],
    createdAt: '2026-04-18T10:00:00.000Z', updatedAt: '2026-08-18T11:20:00.000Z',
  },
  {
    id: 'suzhou-museum-entry', title: '苏州博物馆', type: 'place_space', creator: '贝聿铭', year: 2006,
    note: '白墙、灰瓦、庭院与几何结构，让传统园林语言进入了当代博物馆。', source: '旅行清单',
    externalLink: 'https://en.wikipedia.org/wiki/Suzhou_Museum',
    locationIds: ['suzhou-museum'], tags: ['建筑', '博物馆'], topics: ['贝聿铭的建筑地图'],
    createdAt: '2026-04-12T10:00:00.000Z', updatedAt: '2026-08-27T14:30:00.000Z',
  },
  {
    id: 'louvre-pyramid-entry', title: '卢浮宫玻璃金字塔', type: 'place_space', creator: '贝聿铭', year: 1989,
    note: '一座现代入口如何与历史宫殿共存，是理解建筑与城市关系的好例子。', source: '建筑课程',
    externalLink: 'https://en.wikipedia.org/wiki/Louvre_Pyramid',
    locationIds: ['louvre-pyramid'], tags: ['建筑', '博物馆'], topics: ['贝聿铭的建筑地图'],
    createdAt: '2026-04-01T10:00:00.000Z', updatedAt: '2026-08-16T16:40:00.000Z',
  },
  {
    id: 'paris-exposition-1889', title: '1889 巴黎世界博览会', type: 'history_event', year: 1889,
    note: '从埃菲尔铁塔到新的展览方式，这场博览会塑造了人们对现代城市的想象。', source: '城市史课程',
    externalLink: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)',
    locationIds: ['paris'], tags: ['设计', '技术'], topics: ['城市空间设计'],
    createdAt: '2026-03-11T09:00:00.000Z', updatedAt: '2026-08-12T12:40:00.000Z',
  },
  {
    id: 'forbidden-city-spatial-design', title: '故宫的空间设计', type: 'article_podcast', creator: '建筑与城市笔记',
    note: '沿中轴线理解院落、门与视线关系，空间本身也能成为阅读历史的方法。', source: '播客收藏',
    externalLink: 'https://en.wikipedia.org/wiki/Forbidden_City',
    locationIds: ['forbidden-city'], tags: ['建筑', '历史'], topics: ['城市空间设计'],
    createdAt: '2026-02-08T09:00:00.000Z', updatedAt: '2026-08-10T13:00:00.000Z',
  },
];
