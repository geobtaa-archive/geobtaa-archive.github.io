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
  items: Array<{ label: string; link: string }>;
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

export const NAV_GROUPS = [
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
    label: 'Community',
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
] satisfies ReadonlyArray<NavGroup>;

export const PRIMARY_NAV_OPTIONS = NAV_GROUPS.map(({ id, label, landing }) => ({
  group: id,
  label,
  target: landing,
})) satisfies ReadonlyArray<{ group: NavGroupId; label: string; target: string }>;

export const SIDEBAR_LABEL_GROUPS = new Map<string, NavGroupId>(
  NAV_GROUPS.flatMap(({ id, sidebar }) => sidebar.map((item) => [item.label, id] as const)),
);

export const deriveGroupFromPath = (path: string): NavGroupId => {
  const normalized = path.toLowerCase();
  if (
    normalized.startsWith('/blog') ||
    normalized.startsWith('/posts') ||
    normalized.startsWith('/updates')
  ) {
    return 'blog';
  }
  if (normalized.startsWith('/user-resources') || normalized.startsWith('/conference')) {
    return 'community';
  }
  return 'gin';
};
