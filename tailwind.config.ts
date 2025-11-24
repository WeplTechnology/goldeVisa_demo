import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        // STAG Brand Colors
        stag: {
          navy: "#1B365D",
          "navy-light": "#2d4a7c",
          blue: "#6B9BD1",
          "blue-light": "#8fb3dc",
          light: "#E8F0F9",
          gold: "#D4A017",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        "premium-sm": "0 1px 3px rgba(27, 54, 93, 0.06), 0 1px 2px rgba(27, 54, 93, 0.04)",
        "premium-md": "0 4px 12px rgba(27, 54, 93, 0.08), 0 2px 6px rgba(27, 54, 93, 0.04)",
        "premium-lg": "0 10px 30px rgba(27, 54, 93, 0.12), 0 4px 12px rgba(27, 54, 93, 0.06)",
        "premium-xl": "0 20px 50px rgba(27, 54, 93, 0.15), 0 8px 20px rgba(27, 54, 93, 0.08)",
        "glow-blue": "0 0 20px rgba(107, 155, 209, 0.4)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.4)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1B365D 0%, #2d4a7c 100%)",
        "gradient-accent": "linear-gradient(135deg, #6B9BD1 0%, #4a8ac7 100%)",
        "gradient-success": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "gradient-radial": "radial-gradient(circle at top right, rgba(107, 155, 209, 0.1) 0%, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "shimmer": "shimmer 1.5s infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
      transitionDuration: {
        "400": "400ms",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
