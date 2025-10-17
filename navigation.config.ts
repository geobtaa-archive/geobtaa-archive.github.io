export type NavGroupId = 'gin' | 'community' | 'blog';

export interface NavSidebarAutogenerate {
  kind: 'autogenerate';
  label: string;
  directory: string;
  collapsed?: boolean;
}

export interface NavSidebarGroup {
  kind: 'group';
  label: string;
  collapsed?: boolean;
  items: ReadonlyArray<{ label: string; link: string }>;
}

export interface NavSidebarLink {
  kind: 'link';
  label: string;
  link: string;
}

export type NavSidebarEntry = NavSidebarAutogenerate | NavSidebarGroup | NavSidebarLink;

export interface NavGroup {
  id: NavGroupId;
  label: string;
  landing: string;
  sidebar: ReadonlyArray<NavSidebarEntry>;
}

export const NAV_GROUPS: ReadonlyArray<NavGroup> = [
  {
    id: 'gin',
    label: 'GIN',
    landing: '/about/about-us/',
    sidebar: [
      { kind: 'autogenerate', label: 'About', directory: 'about', collapsed: true },
      { kind: 'autogenerate', label: 'Our Work', directory: 'projects', collapsed: true },
      {
        kind: 'group',
        label: 'Scholarship',
        collapsed: true,
        items: [
          { label: 'Presentations', link: '/scholarship/presentations/' },
          { label: 'Posters', link: '/scholarship/posters/' },
          { label: 'Publications', link: '/scholarship/publications/' },
          { label: 'Document Library', link: '/library/' },
        ],
      },
    ],
  },
  {
    id: 'community',
    label: 'Resources',
    landing: '/user-resources/geoportal/',
    sidebar: [
      { kind: 'autogenerate', label: 'User Resources', directory: 'user-resources', collapsed: true },
      {
        kind: 'group',
        label: 'Big Ten Conference',
        collapsed: true,
        items: [
          { label: 'About', link: '/conference/' },
          { label: 'Map Gallery', link: '/conference/map-gallery/' },
        ],
      },
    ],
  },
  {
    id: 'blog',
    label: 'Blog',
    landing: '/blog/',
    sidebar: [{ kind: 'link', label: 'Blog', link: '/blog/' }],
  },
] as const;

export const PRIMARY_NAV_OPTIONS = NAV_GROUPS.map(({ id, label, landing }) => ({
  group: id,
  label,
  target: landing,
})) as ReadonlyArray<{ group: NavGroupId; label: string; target: string }>;

export const SIDEBAR_LABEL_GROUPS = new Map<string, NavGroupId>(
  NAV_GROUPS.flatMap(({ id, sidebar }) =>
    sidebar.map((item) => {
      switch (item.kind) {
        case 'autogenerate':
        case 'group':
        case 'link':
          return [item.label, id] as const;
      }
    }),
  ),
);

export const deriveGroupFromPath = (path: string): NavGroupId => {
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/user-resources') || path.startsWith('/conference')) return 'community';
  return 'gin';
};
