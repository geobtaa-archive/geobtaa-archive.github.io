import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightVideos from 'starlight-videos'
import starlightFullViewMode from 'starlight-fullview-mode';
// import starlightLinksValidator from 'starlight-links-validator'
import starlightBlog from 'starlight-blog';
import react from '@astrojs/react';
import starlightImageZoom from 'starlight-image-zoom'
// import starlightSidebarTopics from 'starlight-sidebar-topics'
import icon from 'astro-icon';

export default defineConfig({
  integrations: [starlight({
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
      starlightFullViewMode({}),
      starlightImageZoom({
          selector: 'img[src*="/src/assets/images/"], figure img',
        }),
      starlightBlog({title: 'Blog',}),
      // starlightLinksValidator(),
      ],
    sidebar: [

      { label: 'Geospatial Information Network',
        items: [
          { label: 'About', autogenerate: { directory: 'about' } },
          { label: 'Projects', autogenerate: { directory: 'projects' } },
          {label: 'Scholarship',
              items: [
                { label: 'Document Library', link: '/library/' },
                { label: 'Publications', link: '/scholarship/publications/' },
              ],
          },  
        ],
      },
      { label: 'Community',
        items: [
        { label: 'User Resources', autogenerate: { directory: 'user-resources' } },
        { label: 'Big Ten Conference', autogenerate: { directory: 'conference' } },
        ]
      },

    ]
  }), // <-- THIS IS THE MISSING CLOSING PARENTHESIS
  react(), 
  icon()
],
});