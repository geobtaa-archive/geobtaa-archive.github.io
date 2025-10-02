import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightVideos from 'starlight-videos'
import starlightFullViewMode from 'starlight-fullview-mode';
// import starlightLinksValidator from 'starlight-links-validator'
import starlightBlog from 'starlight-blog';
import react from '@astrojs/react';



export default defineConfig({
  integrations: [
    starlight({
      title: 'BTAA-GIN',
      logo: {
        src: '/src/assets/images/btaa-gin-logo.svg',
        alt: 'BTAA-GIN',
        replacesTitle: true,
      },
      // social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/geobtaa',}],
      customCss: [
        './src/styles/global.css',
      ],
      components: {
        Footer: './src/components/FooterWithBar.astro',
      },
      plugins: [
        starlightFullViewMode({
        }),
        starlightBlog({
          title: 'Blog',
        }),
        // starlightLinksValidator(),
      ],
      sidebar: [
        {
          label: 'About',
          autogenerate: { directory: 'about' },
        },
        {
          label: 'Projects',
          autogenerate: { directory: 'projects' },
        },
        {
          label: 'Big Ten GIS Conference',
          link: '/conference/',
        },
        {
          label: 'Document Library',
          link: '/library/',
        },
      ],
    }),
    react(),
  ],
});
