import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                heading: ['var(--font-heading)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                body: ['var(--font-body)', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                accent: ['var(--font-body)', 'DM Sans', 'ui-sans-serif', 'sans-serif'],
                sans: ['var(--font-body)', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                // Editorial accent face. 'font-serif' is used ~12x in markup and
                // resolved to Times New Roman until this was registered.
                display: ['var(--font-display)', 'Instrument Serif', 'Georgia', 'serif'],
                serif: ['var(--font-display)', 'Instrument Serif', 'Georgia', 'serif'],
                // Technical labels. 'font-mono' is used ~73x in markup and
                // resolved to Consolas until this was registered.
                mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                deep: "hsl(var(--deep))",
                surface: {
                    DEFAULT: "hsl(var(--surface))",
                    light: "hsl(var(--surface-light))",
                },
                "text-dark": "hsl(var(--text-dark))",
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                // American Flag Colors - Direct hex values for custom use
                american: {
                    red: "#E32B2B",
                    navy: "#1A2A4A",
                    white: "#FFFFFF",
                    blue: "#002664", // Deeper navy blue option
                    scarlet: "#B22234", // Alternative red
                },
                // Complete Trinity Palette
                trinity: {
                    ink: "var(--trinity-ink)",
                    navy: "var(--trinity-navy)",
                    paper: "var(--trinity-paper)",
                    concrete: "var(--trinity-concrete)",
                    white: "var(--trinity-white)",
                    gold: "var(--trinity-gold)",
                    bronze: "var(--trinity-bronze)",
                    text: "var(--trinity-text)",
                    muted: "var(--trinity-muted)",
                },
                gold: {
                    DEFAULT: "#C98A2E",
                    ink: "#8A5A24",   // small text on light surfaces (AA)
                    soft: "#E0AC5F",  // small text on dark surfaces (AA)
                    deep: "#6F4718",
                    dark: "#8A5A24",
                    hover: "#B57924",
                    light: "#E0AC5F",
                    muted: "rgba(201, 138, 46, 0.08)",
                },
                dark: {
                    DEFAULT: "var(--color-dark)",
                    2: "var(--color-dark-2)",
                    3: "var(--color-dark-3)",
                    4: "var(--color-dark-4)",
                },
                ink: {
                    DEFAULT: "#0B1726",
                    900: "#0B1726",
                    800: "#0F1D2E",
                    700: "#14243A",
                    600: "#1C304A",
                    500: "#24405F",
                },
                paper: {
                    DEFAULT: "#FBFAF7",
                    pure: "#FFFFFF",
                    alt: "#F2F0EA",
                },
                line: {
                    DEFAULT: "#E5E2DA",
                    strong: "#D5D1C6",
                    dark: "rgba(255, 255, 255, 0.10)",
                },
                "warm-white": "var(--color-warm-white)",
                "warm-cream": "var(--color-warm-cream)",
                "card-bg": "var(--color-card-bg)",
                "warm-gray": "var(--color-warm-gray)",
                "off-white": "var(--color-off-white)",
                body: "var(--color-body)",
                "border-light": "var(--color-border-light)",
                "border-dark": "var(--color-border-dark)",
                "border-dark-2": "var(--color-border-dark-2)",
                "brand-bg-light": "var(--color-brand-bg-light)",
                "brand-border-light": "var(--color-brand-border-light)",
                "brand-border-muted": "var(--color-brand-border-muted)",
                "brand-hover-cream": "var(--color-brand-hover-cream)",

            },
            borderRadius: {
                none: "0px",
                sm: "2px",
                DEFAULT: "3px",
                md: "4px",
                lg: "5px",
                xl: "6px",
                "2xl": "8px",
                "3xl": "10px",
                full: "9999px",
            },
            boxShadow: {
                // Hairline-first elevation. No coloured glows.
                xs: "0 1px 2px rgba(11, 23, 38, 0.04)",
                sm: "0 1px 3px rgba(11, 23, 38, 0.05)",
                DEFAULT: "0 2px 8px rgba(11, 23, 38, 0.05)",
                md: "0 4px 16px rgba(11, 23, 38, 0.06)",
                lg: "0 10px 32px rgba(11, 23, 38, 0.07)",
                xl: "0 20px 56px rgba(11, 23, 38, 0.09)",
                "2xl": "0 28px 72px rgba(11, 23, 38, 0.11)",
                none: "none",
            },
            letterSpacing: {
                label: "0.16em",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0", opacity: "0" },
                    to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
                    to: { height: "0", opacity: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "slide-up": {
                    from: { transform: "translateY(20px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
                "pulse-subtle": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.8" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "accordion-up": "accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-up": "slide-up 0.6s ease-out",
                "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
    ],
} satisfies Config;