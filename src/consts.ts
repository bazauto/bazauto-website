/** Exact casing matters: rendered as written, never text-transformed. */
export const SITE_TITLE = 'BAZAutomation';
export const SITE_DESCRIPTION =
	'Westgate Hollow Yard, a small OO gauge test layout, and the control system being proven on it: progress, projects and the reasons behind the decisions.';
export const GITHUB_ORG = 'https://github.com/bazauto';

export const NAV = [
	{ href: '/projects/', label: 'Projects' },
	{ href: '/decisions/', label: 'Decisions' },
	{ href: '/log/', label: 'Log' },
	{ href: '/faq/', label: 'FAQ' },
	{ href: '/about/', label: 'About' },
] as const;
