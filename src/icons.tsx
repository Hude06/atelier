import type { ReactNode, SVGProps } from "react";

export type IconName =
  // project glyphs
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hex"
  | "star"
  | "bolt"
  | "leaf"
  | "book"
  | "flask"
  // ui
  | "plus"
  | "x"
  | "check"
  | "dots"
  | "sliders"
  | "arrowLeft"
  | "trash"
  | "broom";

export const PROJECT_GLYPHS: IconName[] = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "hex",
  "star",
  "bolt",
  "leaf",
  "book",
  "flask",
];

const PATHS: Record<IconName, ReactNode> = {
  circle: <circle cx="12" cy="12" r="7.5" />,
  square: <rect x="5" y="5" width="14" height="14" rx="3" />,
  triangle: <path d="M12 4.8 19.6 18.4H4.4L12 4.8Z" />,
  diamond: <path d="M12 4 20 12 12 20 4 12 12 4Z" />,
  hex: <path d="M12 3.6 19.3 7.8V16.2L12 20.4 4.7 16.2V7.8L12 3.6Z" />,
  star: (
    <path d="M12 4.2 14.3 8.9l5.2.76-3.76 3.66.89 5.18L12 16.06l-4.63 2.44.89-5.18L4.5 9.66l5.2-.76L12 4.2Z" />
  ),
  bolt: <path d="M13.2 3.2 5.4 13.6h5.4l-1 7.2 7.8-10.4h-5.4l1-7.2Z" />,
  leaf: (
    <>
      <path d="M5 19C5 10.5 11 5 20 5c0 8.5-6 14-15 14Z" />
      <path d="M5 19c2.6-5.4 6.4-9.2 11-11" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.2C10 4.6 7.5 4.4 4.8 5.4V18.6c2.7-1 5.2-.8 7.2.8V6.2Z" />
      <path d="M12 6.2c2-1.6 4.5-1.8 7.2-.8V18.6c-2.7-1-5.2-.8-7.2.8V6.2Z" />
    </>
  ),
  flask: (
    <>
      <path d="M10 4h4" />
      <path d="M11 4v5.2l-5.1 8.4A2 2 0 0 0 7.6 20.7h8.8a2 2 0 0 0 1.7-3.1L13 9.2V4" />
      <path d="M8.4 14.5h7.2" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </>
  ),
  x: (
    <>
      <path d="M6.5 6.5 17.5 17.5" />
      <path d="M17.5 6.5 6.5 17.5" />
    </>
  ),
  check: <path d="M5 12.8 9.7 17.3 19 7" />,
  dots: (
    <>
      <circle cx="5.4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.6" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h8.5" />
      <path d="M18.5 8H20" />
      <circle cx="15.5" cy="8" r="2.4" />
      <path d="M4 16h2" />
      <path d="M11 16h9" />
      <circle cx="8.5" cy="16" r="2.4" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5.5" />
      <path d="M11.5 5.5 5 12l6.5 6.5" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7h14" />
      <path d="M9.5 7V4.8h5V7" />
      <path d="M7 7l.8 13h8.4L17 7" />
    </>
  ),
  broom: (
    <>
      <path d="M14.5 3.5 10.8 10" />
      <path d="M10.8 10c-3.2 1.8-4.6 4.6-5.3 9 4.6-.2 7.6-1.2 9.6-4.3" />
      <path d="M10.8 10l4.3 4.7" />
    </>
  ),
};

type IconProps = { name: IconName; size?: number } & SVGProps<SVGSVGElement>;

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
