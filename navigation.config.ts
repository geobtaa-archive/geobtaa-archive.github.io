export type NavGroupId = 'about' | 'resources' | 'scholarship' |'conference' |'blog';

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

// NAV_GROUPS enumerates each primary navigation group with its landing page and sidebar setup.
export const NAV_GROUPS = [
  {
    id: 'about',
    label: 'About',
    landing: '/about/about-us/',
    sidebar: [
      { kind: 'autogenerate', label: 'About', directory: 'about', collapsed: false },
      { kind: 'autogenerate', label: 'Team', directory: 'team', collapsed: false },
      
    ],
  },

    {
    id: 'resources',
    label: 'Find & Use Data',
    landing: '/resources/geoportal/',
    sidebar: [
      { kind: 'autogenerate', label: 'Resources', directory: 'resources', collapsed: false },
    ],
  },

    {
    id: 'scholarship',
    label: 'Research',
    landing: '/scholarship/publications/',
    sidebar: [
      { kind: 'autogenerate', label: 'Scholarship', directory: 'scholarship', collapsed: false },
      { kind: 'link', label: 'Document Library', link: '/library/' }
    ],
  },

  {
    id: 'conference',
    label: 'Conference',
    landing: '/conference/',
    sidebar: [
            {
        kind: 'group',
        label: 'Big Ten GIS Conference',
        collapsed: true,
        items: [
          { label: 'About', link: '/conference/' },
          { label: 'Map Gallery', link: '/conference/map-gallery/' }
        ],
      },
    ],
  },

      {
    id: 'blog',
    label: 'News & Stories',
    landing: '/blog/',
    sidebar: [
      { kind: 'link', label: 'News & Stories', link: '/blog/' }
    ],
  },


] satisfies ReadonlyArray<NavGroup>;

// PRIMARY_NAV_OPTIONS feeds the header/navigation bar with label + target pairs derived from NAV_GROUPS.
export const PRIMARY_NAV_OPTIONS = NAV_GROUPS.map(({ id, label, landing }) => ({
  group: id,
  label,
  target: landing,
})) satisfies ReadonlyArray<{ group: NavGroupId; label: string; target: string }>;

// SIDEBAR_LABEL_GROUPS links sidebar section labels back to their owning nav group for quick lookups.
export const SIDEBAR_LABEL_GROUPS = new Map<string, NavGroupId>(
  NAV_GROUPS.flatMap(({ id, sidebar }) => sidebar.map((item) => [item.label, id] as const)),
);

// deriveGroupFromPath infers which nav group to activate based on the current URL path.
export const deriveGroupFromPath = (path: string): NavGroupId | undefined => {
  const normalized = path.toLowerCase();
  if (normalized === '/' || normalized === '') {
    return undefined;
  }

// 1. About
  if (
    normalized.startsWith('/about') ||
    normalized.startsWith('/team') ||
    normalized.startsWith('/technology')

     
  ) {
    return 'about';
  }


// 2. Resources
  if (
    normalized.startsWith('/resources') ||
    normalized.startsWith('/tutorials') ||
    normalized.startsWith('/guides')
  ) {
    return 'resources';
  }

// 3. Scholarship

    if (
    normalized.startsWith('/library') ||
    normalized.startsWith('/scholarship')
  ) {
    return 'scholarship';
  }

// 4. Conference

    if (
    normalized.startsWith('/conference')
  ) {
    return 'conference';
  }

      if (
    normalized.startsWith('/blog') ||
    normalized.startsWith('/updates')
  ) {
    return 'blog';
  }


  // Default to the "About" collection when we cannot infer a more specific group.
  return 'about';
};


    