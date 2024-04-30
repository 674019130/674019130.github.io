import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  siteConfig: {
    // 启用评论
    comment: {
      enable: true
    },
  },

  addons: [
    addonWaline({
      serverURL: 'https://vercel-waline-c111rx0gg-674019130.vercel.app/'
    }),
  ],

  themeConfig: {
    banner: {
      enable: true,
      title: '陪我去看海',
      cloud: {
        enable: true,
      },
    },



    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
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
