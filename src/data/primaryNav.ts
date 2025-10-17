export type PrimaryNavGroup = 'gin' | 'community' | 'blog';

export interface PrimaryNavOption {
  label: string;
  group: PrimaryNavGroup;
  target: string;
}

export const PRIMARY_NAV_OPTIONS: ReadonlyArray<PrimaryNavOption> = [
  { label: 'GIN', group: 'gin', target: '/about/about-us/' },
  { label: 'Community', group: 'community', target: '/user-resources/geoportal/' },
  { label: 'Blog', group: 'blog', target: '/blog/' },
] as const;

export const SIDEBAR_LABEL_GROUPS = new Map<string, PrimaryNavGroup>([
  ['About', 'gin'],
  ['Our Work', 'gin'],
  ['Scholarship', 'gin'],
  ['User Resources', 'community'],
  ['Big Ten Conference', 'community'],
  ['Blog', 'blog'],
]);

export const deriveGroupFromPath = (path: string): PrimaryNavGroup => {
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/user-resources') || path.startsWith('/conference')) return 'community';
  return 'gin';
};
