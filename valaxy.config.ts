import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonLightGallery } from 'valaxy-addon-lightgallery'
import { addonWaline } from 'valaxy-addon-waline'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
  'i-ri-arrow-right-line',
  'i-ri-arrow-right-up-line',
  'i-ri-arrow-down-s-line',
  'i-ri-bilibili-line',
  'i-ri-brain-line',
  'i-ri-check-line',
  'i-ri-chat-3-line',
  'i-ri-close-line',
  'i-ri-database-2-line',
  'i-ri-file-text-line',
  'i-ri-github-line',
  'i-ri-mail-line',
  'i-ri-robot-2-line',
  'i-ri-rss-line',
  'i-ri-search-eye-line',
  'i-ri-star-line',
  'i-ri-tools-line',
  'i-simple-icons-cursor',
  'i-simple-icons-claude',
  'i-simple-icons-docker',
  'i-simple-icons-elasticsearch',
  'i-simple-icons-github',
  'i-simple-icons-kubernetes',
  'i-simple-icons-linux',
  'i-simple-icons-nextdotjs',
  'i-simple-icons-openai',
  'i-simple-icons-openjdk',
  'i-simple-icons-postgresql',
  'i-simple-icons-python',
  'i-simple-icons-redis',
  'i-simple-icons-supabase',
  'i-simple-icons-typescript',
  'i-simple-icons-vercel',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  build: {
    ignoreDeadLinks: true,
  },

  theme: 'yun',

  siteConfig: {
    // 启用评论
    comment: {
      enable: true
    },
  },

  markdown: {
    // default material-theme-palenight
    // theme: 'material-theme-palenight',
    theme: {
      light: 'material-theme-lighter',
      // light: 'github-light',
      dark: 'material-theme-darker',
      // dark: 'github-dark',
    },

    blocks: {
      tip: {
        icon: 'i-carbon-thumbs-up',
        text: 'ヒント',
        langs: {
          'zh-CN': '提示',
        },
      },
      warning: {
        icon: 'i-carbon-warning-alt',
        text: '注意',
      },
      danger: {
        icon: 'i-carbon-warning',
        text: '警告',
      },
      info: {
        text: 'información',
      },
    },
  },


  addons: [
    addonWaline({
      serverURL: 'https://mine-waline.vercel.app/',
      pageview: true,
      comment: true
    }),
    addonLightGallery(),
  ],

  themeConfig: {
    bg_image: {
      enable: true,
      url: 'https://w.wallhaven.cc/full/qz/wallhaven-qzp8dr.png',
      dark: 'https://s2.loli.net/2024/05/01/zgRmHkITt9w6ju7.jpg',
      opacity: 0.7
    },

    banner: {
      enable: true,
      title: ['Push yourself','harder.'],
      cloud: {
        enable: true,
      },
    },

    notice: {
      enable: true,
      hideInPages: true,
      content: '要变强，要变成更好的人！'
    },


    pages: [
      // {
      //   name: '我的小伙伴们',
      //   url: '/links/',
      //   icon: 'i-ri-genderless-line',
      //   color: 'dodgerblue',
      // },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2022,
      // liveTime: {
      //   enable: true,
      //   prefix: '风已经走了',
      //   suffix: '(●\'◡\'●)',
      //   start_time: '2022-10-31T00:00:00'
      // }
      beian: {
        enable: false,
        icp: '苏ICP备17038157号',
      },
    },
  },

  unocss: { safelist },
})
