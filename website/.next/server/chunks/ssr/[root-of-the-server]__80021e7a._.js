module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/content.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listPages",
    ()=>listPages,
    "loadPage",
    ()=>loadPage,
    "loadSiteConfig",
    ()=>loadSiteConfig
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const PAGES_DIR = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"])(process.cwd(), 'content/pages');
const SITE_CONFIG_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"])(process.cwd(), 'content/site.json');
const SLUG_RE = /^[a-z0-9-]{1,100}$/;
function assertInsidePages(resolved) {
    if (!resolved.startsWith(PAGES_DIR + '/')) {
        throw new Error('Path traversal detected');
    }
}
function loadPage(slug) {
    if (!SLUG_RE.test(slug)) return null;
    const filePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(PAGES_DIR, `${slug}.json`);
    assertInsidePages((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"])(filePath));
    try {
        const raw = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function loadSiteConfig() {
    try {
        const raw = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(SITE_CONFIG_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch  {
        return {
            siteName: 'Void Studio',
            nav: [
                {
                    label: 'Home',
                    href: '/'
                },
                {
                    label: 'Work',
                    href: '/work'
                },
                {
                    label: 'About',
                    href: '/about'
                },
                {
                    label: 'Contact',
                    href: '/contact'
                }
            ]
        };
    }
}
function listPages() {
    try {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readdirSync"])(PAGES_DIR).filter((f)=>f.endsWith('.json')).map((f)=>f.replace(/\.json$/, ''));
    } catch  {
        return [];
    }
}
}),
"[project]/lib/ui/Container.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Container-module__TNIhTW__container",
  "default": "Container-module__TNIhTW__default",
  "fluid": "Container-module__TNIhTW__fluid",
  "full": "Container-module__TNIhTW__full",
  "narrow": "Container-module__TNIhTW__narrow",
  "wide": "Container-module__TNIhTW__wide",
});
}),
"[project]/lib/ui/Container.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Container",
    ()=>Container
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/lib/ui/Container.module.css [app-rsc] (css module)");
;
;
function Container({ width = 'default', className, children, ...rest }) {
    const cls = [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].container,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][width],
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cls,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/ui/Container.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ui/Stack.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "align-center": "Stack-module__mrVwZW__align-center",
  "align-end": "Stack-module__mrVwZW__align-end",
  "align-start": "Stack-module__mrVwZW__align-start",
  "align-stretch": "Stack-module__mrVwZW__align-stretch",
  "gap-0": "Stack-module__mrVwZW__gap-0",
  "gap-1": "Stack-module__mrVwZW__gap-1",
  "gap-10": "Stack-module__mrVwZW__gap-10",
  "gap-12": "Stack-module__mrVwZW__gap-12",
  "gap-16": "Stack-module__mrVwZW__gap-16",
  "gap-2": "Stack-module__mrVwZW__gap-2",
  "gap-20": "Stack-module__mrVwZW__gap-20",
  "gap-24": "Stack-module__mrVwZW__gap-24",
  "gap-3": "Stack-module__mrVwZW__gap-3",
  "gap-4": "Stack-module__mrVwZW__gap-4",
  "gap-5": "Stack-module__mrVwZW__gap-5",
  "gap-6": "Stack-module__mrVwZW__gap-6",
  "gap-8": "Stack-module__mrVwZW__gap-8",
  "stack": "Stack-module__mrVwZW__stack",
});
}),
"[project]/lib/ui/Stack.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Stack",
    ()=>Stack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Stack$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/lib/ui/Stack.module.css [app-rsc] (css module)");
;
;
function Stack({ gap = 4, align, className, children, ...rest }) {
    const cls = [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Stack$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].stack,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Stack$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`gap-${gap}`],
        align ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Stack$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`align-${align}`] : null,
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cls,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/ui/Stack.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ui/Heading.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "align-center": "Heading-module__zHDV_a__align-center",
  "align-left": "Heading-module__zHDV_a__align-left",
  "align-right": "Heading-module__zHDV_a__align-right",
  "display": "Heading-module__zHDV_a__display",
  "heading": "Heading-module__zHDV_a__heading",
  "hero": "Heading-module__zHDV_a__hero",
  "lg": "Heading-module__zHDV_a__lg",
  "md": "Heading-module__zHDV_a__md",
  "sm": "Heading-module__zHDV_a__sm",
  "tone-accent": "Heading-module__zHDV_a__tone-accent",
  "tone-default": "Heading-module__zHDV_a__tone-default",
  "tone-muted": "Heading-module__zHDV_a__tone-muted",
  "xl": "Heading-module__zHDV_a__xl",
});
}),
"[project]/lib/ui/Heading.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heading",
    ()=>Heading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/lib/ui/Heading.module.css [app-rsc] (css module)");
;
;
const defaultSizeForLevel = {
    1: 'display',
    2: 'xl',
    3: 'lg',
    4: 'md',
    5: 'sm',
    6: 'sm'
};
function Heading({ level = 2, size, tone, align, className, children, ...rest }) {
    const Tag = `h${level}`;
    const resolvedSize = size ?? defaultSizeForLevel[level];
    const cls = [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].heading,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][resolvedSize],
        tone ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`tone-${tone}`] : null,
        align ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`align-${align}`] : null,
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: cls,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/ui/Heading.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ui/Text.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "align-center": "Text-module__C2Sjpa__align-center",
  "align-left": "Text-module__C2Sjpa__align-left",
  "align-right": "Text-module__C2Sjpa__align-right",
  "lg": "Text-module__C2Sjpa__lg",
  "md": "Text-module__C2Sjpa__md",
  "sm": "Text-module__C2Sjpa__sm",
  "text": "Text-module__C2Sjpa__text",
  "tone-accent": "Text-module__C2Sjpa__tone-accent",
  "tone-default": "Text-module__C2Sjpa__tone-default",
  "tone-muted": "Text-module__C2Sjpa__tone-muted",
  "weight-bold": "Text-module__C2Sjpa__weight-bold",
  "weight-medium": "Text-module__C2Sjpa__weight-medium",
  "weight-normal": "Text-module__C2Sjpa__weight-normal",
  "weight-semibold": "Text-module__C2Sjpa__weight-semibold",
  "xl": "Text-module__C2Sjpa__xl",
});
}),
"[project]/lib/ui/Text.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Text",
    ()=>Text
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/lib/ui/Text.module.css [app-rsc] (css module)");
;
;
function Text({ size = 'md', tone, weight, align, className, children, ...rest }) {
    const cls = [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].text,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][size],
        tone ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`tone-${tone}`] : null,
        weight ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`weight-${weight}`] : null,
        align ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][`align-${align}`] : null,
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: cls,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/ui/Text.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ui/Button.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "accent": "Button-module__rChCOW__accent",
  "button": "Button-module__rChCOW__button",
  "destructive": "Button-module__rChCOW__destructive",
  "ghost": "Button-module__rChCOW__ghost",
  "lg": "Button-module__rChCOW__lg",
  "md": "Button-module__rChCOW__md",
  "primary": "Button-module__rChCOW__primary",
  "secondary": "Button-module__rChCOW__secondary",
  "sm": "Button-module__rChCOW__sm",
});
}),
"[project]/lib/ui/Button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/lib/ui/Button.module.css [app-rsc] (css module)");
;
;
function Button({ variant = 'primary', size = 'md', href, label, children, className, ...rest }) {
    const cls = [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].button,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][variant],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][size],
        className
    ].filter(Boolean).join(' ');
    const content = children ?? label;
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            className: cls,
            ...rest,
            children: content
        }, void 0, false, {
            fileName: "[project]/lib/ui/Button.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: cls,
        ...rest,
        children: content
    }, void 0, false, {
        fileName: "[project]/lib/ui/Button.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ui/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Container.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Stack$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Stack.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Heading.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Text$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Text.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Button.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/site/shell.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer": "shell-module__F011Bq__footer",
  "footerCopy": "shell-module__F011Bq__footerCopy",
  "footerInner": "shell-module__F011Bq__footerInner",
  "footerLink": "shell-module__F011Bq__footerLink",
  "footerLogo": "shell-module__F011Bq__footerLogo",
  "footerNav": "shell-module__F011Bq__footerNav",
  "header": "shell-module__F011Bq__header",
  "headerInner": "shell-module__F011Bq__headerInner",
  "layout": "shell-module__F011Bq__layout",
  "logo": "shell-module__F011Bq__logo",
  "main": "shell-module__F011Bq__main",
  "nav": "shell-module__F011Bq__nav",
  "navCta": "shell-module__F011Bq__navCta",
  "navLink": "shell-module__F011Bq__navLink",
});
}),
"[project]/site/shell.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteShell",
    ()=>SiteShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/ui/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui/Container.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/site/shell.module.css [app-rsc] (css module)");
;
;
;
function SiteShell({ config, children }) {
    const year = new Date().getFullYear();
    const navLinks = config.nav.slice(0, -1);
    const ctaLink = config.nav[config.nav.length - 1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].layout,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                    width: "wide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].headerInner,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].logo,
                                children: config.siteName
                            }, void 0, false, {
                                fileName: "[project]/site/shell.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].nav,
                                children: [
                                    navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: link.href,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].navLink,
                                            children: link.label
                                        }, link.href, false, {
                                            fileName: "[project]/site/shell.tsx",
                                            lineNumber: 26,
                                            columnNumber: 17
                                        }, this)),
                                    ctaLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: ctaLink.href,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].navCta,
                                        children: ctaLink.label
                                    }, void 0, false, {
                                        fileName: "[project]/site/shell.tsx",
                                        lineNumber: 31,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/site/shell.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/site/shell.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/site/shell.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/site/shell.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].main,
                children: children
            }, void 0, false, {
                fileName: "[project]/site/shell.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                    width: "wide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footerInner,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footerLogo,
                                children: config.siteName
                            }, void 0, false, {
                                fileName: "[project]/site/shell.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footerNav,
                                children: config.nav.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: link.href,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footerLink,
                                        children: link.label
                                    }, link.href, false, {
                                        fileName: "[project]/site/shell.tsx",
                                        lineNumber: 50,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/site/shell.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].footerCopy,
                                children: [
                                    "© ",
                                    year,
                                    " ",
                                    config.siteName,
                                    " — your data stays on your device"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/site/shell.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/site/shell.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/site/shell.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/site/shell.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/site/shell.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/site/shell.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function generateMetadata() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadSiteConfig"])();
    return {
        title: {
            default: config.siteName,
            template: `%s — ${config.siteName}`
        },
        description: 'A quiet kanban board for Mac. Local-first, no accounts, no noise.'
    };
}
function RootLayout({ children }) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadSiteConfig"])();
    const theme = config.theme?.preset ?? 'warm';
    const appearance = config.theme?.appearance ?? 'light';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        "data-theme": theme,
        "data-appearance": appearance,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                        children: `
          :root {
            --font-heading: 'Fraunces', Georgia, serif;
            --font-body: 'Schibsted Grotesk', system-ui, sans-serif;
          }
        `
                    }, void 0, false, {
                        fileName: "[project]/app/layout.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/layout.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$site$2f$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SiteShell"], {
                    config: config,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/app/layout.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/layout.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/layout.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__80021e7a._.js.map