import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonLightGallery } from 'valaxy-addon-lightgallery'
import { addonWaline } from 'valaxy-addon-waline'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  ignoreDeadLinks: true,

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
      // light: 'material-theme-lighter',
      light: 'github-light',
      // dark: 'material-theme-darker',
      dark: 'github-dark',
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
      serverURL: 'https://vercel-waline-cuuf-674019130s-projects.vercel.app/',
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
      title: ['难道你','无台风会决定留下'],
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
