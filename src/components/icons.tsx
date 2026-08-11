type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/**
 * The mark: three written lines, each fainter than the one above it, and a nib
 * still resting on the first. `docs/media/mark.svg` is the same drawing with
 * real gradients — at 20px in the header, stepped opacity reads identically and
 * costs no gradient definitions.
 */
export function InklingMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      className={className}
    >
      <path
        d="M14 30 C 26 24, 34 36, 46 30 C 56 25, 66 33, 82 28"
        strokeWidth="5.4"
      />
      <path
        d="M14 50 C 28 44, 38 56, 52 49 C 62 44, 70 51, 82 47"
        strokeWidth="5"
        strokeOpacity="0.52"
      />
      <path
        d="M14 70 C 26 65, 36 75, 50 69 C 58 65, 66 70, 78 67"
        strokeWidth="4.6"
        strokeOpacity="0.22"
      />
      <circle cx="14" cy="30" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  );
}

export function AutoIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PenIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20.5 5 17l9.6-9.6a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 20.5Z" />
      <path d="M13.2 8.8 16.7 12.3" />
    </svg>
  );
}

export function KeyboardIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M6.5 13.4h.01M10 13.4h.01M13.5 13.4h.01M17 13.4h.01M8.5 16.6h7" />
    </svg>
  );
}

/** Sliders rather than a cog — a cog at 16px is indistinguishable from a sun. */
export function SettingsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7.5h9M17.5 7.5H20M4 16.5h3.5M12 16.5h8" />
      <circle cx="15" cy="7.5" r="2.2" />
      <circle cx="9.5" cy="16.5" r="2.2" />
    </svg>
  );
}

export function EraserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.6 19.5H20M4.9 16.3l6.2-6.2a2 2 0 0 1 2.8 0l3.6 3.6a2 2 0 0 1 0 2.8l-3 3H8.2l-3.3-3.2Z" />
    </svg>
  );
}

export function UndoIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9h9.5a5 5 0 0 1 0 10H8" />
      <path d="M7.5 5.5 4 9l3.5 3.5" />
    </svg>
  );
}

export function InkDropIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5s5.8 6.1 5.8 9.9a5.8 5.8 0 0 1-11.6 0C6.2 9.6 12 3.5 12 3.5Z" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
