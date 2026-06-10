export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | 'display' | 'hero';
export type TextSize = 'sm' | 'md' | 'lg' | 'xl';
export type TextTone = 'default' | 'muted' | 'accent';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ImageWidth = 'sm' | 'md' | 'lg' | 'full';
export type SectionBackground = 'default' | 'muted' | 'accent' | 'inverse';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type GridColumns = 1 | 2 | 3 | 4;
export type ColumnRatio = '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';

export interface CtaLink {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

export interface GridItem {
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
}

export interface ColumnSide {
  title?: string;
  body?: string;
  image?: string;
  button?: CtaLink;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
}

interface BaseBlock {
  id: string;
  type: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: TextTone;
  align?: TextAlign;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  body: string;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: ImageWidth;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: TextAlign;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle?: string;
  buttons?: CtaLink[];
  image?: string;
  align?: TextAlign;
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  heading?: string;
  body?: string;
  background?: SectionBackground;
  padding?: SectionPadding;
  anchor?: string;
}

export interface GridBlock extends BaseBlock {
  type: 'grid';
  heading?: string;
  items: GridItem[];
  columns?: GridColumns;
}

export interface TwoColumnBlock extends BaseBlock {
  type: 'two-column';
  left: ColumnSide;
  right: ColumnSide;
  ratio?: ColumnRatio;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  quote: string;
  author?: string;
  role?: string;
  image?: string;
}

export interface FormBlock extends BaseBlock {
  type: 'form';
  heading?: string;
  fields: FormField[];
  submitLabel?: string;
  action?: string;
}

export type Block =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | HeroBlock
  | SectionBlock
  | GridBlock
  | TwoColumnBlock
  | QuoteBlock
  | FormBlock;

export interface PageContent {
  contractVersion?: number;
  title: string;
  slug: string;
  description?: string;
  blocks: Block[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  siteName: string;
  nav: NavLink[];
  fonts?: {
    heading?: string;
    body?: string;
    pair?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  theme?: {
    preset?: string;
    appearance?: 'light' | 'dark';
  };
  motion?: {
    engine?: 'motion' | 'gsap';
    intensity?: 'none' | 'subtle' | 'moderate' | 'expressive';
  };
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
