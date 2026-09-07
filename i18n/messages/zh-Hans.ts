const zhHans = {
  common: {
    about: "关于",
    all_posts: "所有文章",
    author: "作者",
    author_prefix: "作者：",
    category: "分类",
    categories: "分类",
    close_nav: "关闭导航菜单",
    close_toc: "关闭文章目录",
    company: "公司",
    directory: "目录",
    global_nav: "主导航",
    header_title: "Astro Plain",
    home: "首页",
    last_modified: "最后修改于：",
    latest_posts: "最新文章",
    link_to: "链接到{title}",
    minutes: "分钟",
    next_page: "下一页",
    next_post: "下一篇：{title}",
    no_posts_found: "未找到任何文章。",
    occupation: "职业",
    open_nav: "打开导航菜单",
    open_toc: "打开文章目录",
    opens_in_new_tab: "（在新窗口打开）",
    page_num: "第{num}页",
    pagination: "分页导航",
    prev_page: "上一页",
    prev_post: "上一篇：{title}",
    projects: "项目",
    published_on: "发布于：",
    reading_time: "阅读时间",
    related_post: "相关文章",
    scroll_to_top: "回到顶部",
    search: "搜索",
    site_description: "网站简介...",
    site_title: "Astro Plain",
    table_of_contents: "目录",
    tag: "标签",
    tags: "标签",
  },
  language_switcher: {
    language_switcher: "切换语言",
  },
  search: {
    placeholder: "搜索文章...",
    clear_search: "清除",
    load_more: "加载更多结果",
    search_label: "站内搜索",
    filters_label: "筛选",
    zero_results: "未找到相关结果：[SEARCH_TERM]",
    many_results: "找到 [COUNT] 条相关结果",
    one_result: "找到 [COUNT] 条相关结果",
    searching: "正在搜索：[SEARCH_TERM]...",
  },
  theme_switcher: {
    toggle_theme: "切换主题",
    system: "跟随系统",
    dark: "深色",
    light: "浅色",
  },
} as const;

export type Translation = typeof zhHans;

export type TranslationSchema = {
  [K in keyof Translation]: {
    [SubK in keyof Translation[K]]: string;
  };
};

export default zhHans;
