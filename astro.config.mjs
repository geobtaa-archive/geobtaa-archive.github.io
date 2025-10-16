import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightFullViewMode from 'starlight-fullview-mode';
import starlightBlog from 'starlight-blog';
import react from '@astrojs/react';
import starlightImageZoom from 'starlight-image-zoom'
import icon from 'astro-icon';


export default defineConfig({
  integrations: [
  
    starlight({
      title: 'BTAA-GIN',
      logo: {
        src: '/src/assets/images/btaa-gin-logo.svg',
        alt: 'BTAA-GIN',
        replacesTitle: true,
      },
      customCss: ['./src/styles/global.css', './src/styles/tables.css' ],
      components: {
        Footer: './src/components/FooterWithBar.astro',
      },
      plugins: [
        starlightImageZoom({
          selector: 'img[src*="/src/assets/images/"], figure img',
        }),
        starlightBlog({ title: 'News & Updates', recentPostCount: 5 }),
        starlightFullViewMode( {leftSidebarEnabled: false} ),
      ], // Closes plugins[]
      
      sidebar: [
        { label: 'About', collapsed: true, autogenerate: { directory: 'about' } },
        { label: 'Our Work', collapsed: true, autogenerate: { directory: 'projects' } },
        { label: 'Scholarship', collapsed: true, 
            items: [
              { label: 'Presentations', link: '/scholarship/presentations/' },
              { label: 'Posters', link: '/scholarship/posters/' },
              { label: 'Publications', link: '/scholarship/publications/' },
              { label: 'Document Library', link: '/library/' },
            ],
        },  
        { label: 'User Resources', collapsed: true, autogenerate: { directory: 'user-resources' } },
        { label: 'Big Ten Conference', collapsed: true, 
            items: [
                { label: 'About', link: '/conference/' },
                { label: 'Map Gallery', link: '/conference/map-gallery/' },
              ],

        },
    ]
    }), // Closes starlight()
    
    // react() and icon() are Astro integrations, not Starlight plugins.
    react(),
    icon(),

  ], // Closes integrations[]

}); // Closes defineConfig()
