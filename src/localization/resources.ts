export const resources = {
  'zh-CN': {
    'navigation.map': '地图',
    'navigation.library': '内容库',
    'navigation.addEntry': '添加',
    'map.title': '心愿地图',
    'map.configureToken': '请配置 Mapbox public token 以加载地图。',
    'map.configureTokenHint': '复制 .env.example 为 .env，并填写 EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN。',
    'library.title': '内容库',
    'library.emptyTitle': '还没有内容',
    'library.emptyBody': '把一本书、一部电影，或一个与你有关的地方放进地图。',
    'addEntry.title': '添加 Entry',
    'addEntry.foundationOnly': '录入流程将在下一阶段实现。',
    'common.close': '关闭',
    'common.loading': '正在准备本地数据…',
  },
  en: {
    'navigation.map': 'Map',
    'navigation.library': 'Library',
    'navigation.addEntry': 'Add',
    'map.title': 'Wish Map',
    'map.configureToken': 'Configure a public Mapbox token to load the map.',
    'map.configureTokenHint': 'Copy .env.example to .env and set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN.',
    'library.title': 'Library',
    'library.emptyTitle': 'Nothing here yet',
    'library.emptyBody': 'Place a book, a film, or somewhere meaningful to you on the map.',
    'addEntry.title': 'Add Entry',
    'addEntry.foundationOnly': 'The capture flow will be implemented in the next phase.',
    'common.close': 'Close',
    'common.loading': 'Preparing local data…',
  },
} as const;

export type SupportedLocale = keyof typeof resources;
export type TranslationKey = keyof (typeof resources)['en'];
