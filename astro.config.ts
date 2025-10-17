import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightFullViewMode from 'starlight-fullview-mode';
import react from '@astrojs/react';
import starlightImageZoom from 'starlight-image-zoom';
import icon from 'astro-icon';
import { NAV_GROUPS, type NavSidebarEntry } from './navigation.config';

const mapSidebarEntry = (entry: NavSidebarEntry) => {
  switch (entry.kind) {
    case 'autogenerate':
      return {
        label: entry.label,
        collapsed: entry.collapsed ?? true,
        autogenerate: { directory: entry.directory },
      };
    case 'group':
      return {
        label: entry.label,
        collapsed: entry.collapsed ?? true,
        items: entry.items,
      };
    case 'link':
      return {
        label: entry.label,
        link: entry.link,
      };
  }
};

const starlightSidebar = NAV_GROUPS.flatMap((group) => group.sidebar.map(mapSidebarEntry));

export default defineConfig({
  integrations: [
    starlight({
      title: 'BTAA-GIN',
      logo: {
        src: '/src/assets/images/btaa-gin-logo.svg',
        alt: 'BTAA-GIN',
        replacesTitle: true,
      },
      customCss: ['./src/styles/global.css', './src/styles/tables.css'],
      components: {
        Footer: './src/components/FooterWithBar.astro',
        Header: './src/components/HeaderWithCompactSearch.astro',
        Sidebar: './src/components/SidebarWithFilters.astro',
        PageTitle: './src/components/PageTitleWithMeta.astro',
      },
      plugins: [
        starlightImageZoom({
          selector: 'img[src*="/src/assets/images/"], figure img',
        }),
        starlightFullViewMode(),
      ],
      sidebar: starlightSidebar,
    }),
    react(),
    icon(),
  ],
});
