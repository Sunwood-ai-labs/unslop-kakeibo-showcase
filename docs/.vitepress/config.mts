import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Masu — Unslop Kakeibo Showcase',
  description:
    'Four distinct Japanese household ledger (Kakeibo) web applications built under the strict 5-Line Direction and 9 Passes of the unslop UI design skill.',
  base: '/unslop-kakeibo-showcase/',
  cleanUrls: false,
  ignoreDeadLinks: [
    /^\/demo\//,
    /^\/(masu|shiori|pulse|tokonoma)\//,
    /^\/unslop-kakeibo-showcase\/demo\//,
    /^\/unslop-kakeibo-showcase\/(masu|shiori|pulse|tokonoma)\//
  ],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/unslop-kakeibo-showcase/assets/icon.svg' }]
  ],
  themeConfig: {
    logo: '/assets/icon.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sunwood-ai-labs/unslop-kakeibo-showcase' }
    ],
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Masu — Unslop Kakeibo',
      description:
        'A multi-concept Japanese household ledger showcase verifying the unslop UI design methodology (5-Line Direction & 9 Passes).',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Overview', link: '/guide/overview' },
          { text: '4 Concepts', link: '/guide/concepts' },
          { text: '9 Passes & Subtraction', link: '/guide/nine-passes' },
          {
            text: 'Live Demos (4 Apps)',
            items: [
              { text: '00 Masu (枡) — Quiet Graphite', link: '/demo/index.html', target: '_blank' },
              { text: '01 Kakei Shiori (家計栞) — Archival Paper', link: '/demo/concepts/shiori/index.html', target: '_blank' },
              { text: '02 Pulse (パルス) — Telemetry', link: '/demo/concepts/pulse/index.html', target: '_blank' },
              { text: '03 Tokonoma (床の間) — Swiss Grid', link: '/demo/concepts/tokonoma/index.html', target: '_blank' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Overview & 5-Line Direction', link: '/guide/overview' },
              { text: '4 Design Concepts & Gallery', link: '/guide/concepts' },
              { text: '9 Passes & UI Subtraction', link: '/guide/nine-passes' }
            ]
          },
          {
            text: 'Interactive Live Apps',
            items: [
              { text: '00 Masu (枡) — Quiet Graphite', link: '/demo/index.html', target: '_blank' },
              { text: '01 Shiori (家計栞) — Archival Paper', link: '/demo/concepts/shiori/index.html', target: '_blank' },
              { text: '02 Pulse (パルス) — Telemetry', link: '/demo/concepts/pulse/index.html', target: '_blank' },
              { text: '03 Tokonoma (床の間) — Swiss Grid', link: '/demo/concepts/tokonoma/index.html', target: '_blank' }
            ]
          }
        ],
        footer: {
          message:
            'Code licensed under MIT. UI design methodology based on <a href="https://heydamir.design/unslop" target="_blank" rel="noopener">unslop</a> by <a href="https://x.com/heydamir" target="_blank" rel="noopener">Damir Sokolovsky (@heydamir)</a> under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.',
          copyright: 'Copyright © 2026 Sunwood-ai-labs'
        }
      }
    },
    ja: {
      label: '日本語',
      lang: 'ja-JP',
      link: '/ja/',
      title: '枡 (Masu) — Unslop 家計簿ショーケース',
      description:
        'UI設計スキル「unslop」（5行のDirectionと9つのPass）を検証する、4つのデザインコンセプトによる日本語家計簿ウェブアプリケーション集。',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { text: '概要・設計指針', link: '/ja/guide/overview' },
          { text: '4つのコンセプト', link: '/ja/guide/concepts' },
          { text: '9つのPassと引き算', link: '/ja/guide/nine-passes' },
          {
            text: 'ライブデモ（4アプリ）',
            items: [
              { text: '00 枡 (Masu) — 静謐なグラファイト', link: '/demo/index.html', target: '_blank' },
              { text: '01 家計栞 (Shiori) — 書斎のコットン紙', link: '/demo/concepts/shiori/index.html', target: '_blank' },
              { text: '02 パルス (Pulse) — 高精度テレメトリ', link: '/demo/concepts/pulse/index.html', target: '_blank' },
              { text: '03 床の間 (Tokonoma) — 1pxスイスグリッド', link: '/demo/concepts/tokonoma/index.html', target: '_blank' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'ガイド',
            items: [
              { text: '概要と5行のDirection', link: '/ja/guide/overview' },
              { text: '4つのコンセプトと全画面一覧', link: '/ja/guide/concepts' },
              { text: '9つのPassと「引き算」の知見', link: '/ja/guide/nine-passes' }
            ]
          },
          {
            text: 'ライブアプリ（全画面で起動）',
            items: [
              { text: '00 枡 — 静謐なグラファイト台帳', link: '/demo/index.html', target: '_blank' },
              { text: '01 家計栞 — 書斎のコットン紙台帳', link: '/demo/concepts/shiori/index.html', target: '_blank' },
              { text: '02 パルス — 高精度テレメトリ台帳', link: '/demo/concepts/pulse/index.html', target: '_blank' },
              { text: '03 床の間 — 建築的スイスグリッド台帳', link: '/demo/concepts/tokonoma/index.html', target: '_blank' }
            ]
          }
        ],
        footer: {
          message:
            'アプリケーションコードは MIT License。UI設計メソドロジーは <a href="https://x.com/heydamir" target="_blank" rel="noopener">Damir Sokolovsky (@heydamir)</a> 氏による <a href="https://heydamir.design/unslop" target="_blank" rel="noopener">unslop</a>（<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>）に基づきます。',
          copyright: 'Copyright © 2026 Sunwood-ai-labs'
        }
      }
    }
  }
});
