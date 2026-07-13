import { Logo } from './Logo';

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/hassan25bd',
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com',
    icon: (
      <path d="M6.94 8.5H3.56V20.5h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20.5h-3.37v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.33v6.41H9.18V8.5h3.24v1.64h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.77 2.16 4.77 5.4v6.73Z" />
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com',
    icon: (
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.25-1.5 1.55-1.5H16.7V3.4C16.4 3.36 15.4 3.27 14.24 3.27c-2.4 0-4.05 1.47-4.05 4.16v2.27H7.5v3.2h2.69V21h3.31Z" />
    ),
  },
];

export const Footer = () => (
  <footer className="border-t border-gray-100 bg-gray-50">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
      <Logo />
      <p className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CrowdNest. Helping ideas find their people.
      </p>
      <div className="flex items-center gap-4">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.name}
            className="text-gray-400 transition-colors hover:text-brand-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {s.icon}
            </svg>
          </a>
        ))}
      </div>
    </div>
  </footer>
);
