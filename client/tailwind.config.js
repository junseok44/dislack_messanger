/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 기본 색상 팔레트
        primary: {
          light: "#6D28D9", // 라이트 모드 색상
          dark: "#1E1F22", // 다크 모드 색상
        },
        secondary: {
          light: "#10B981",
          dark: "#2A2D31",
        },
        tertiary: {
          light: "#3B82F6",
          dark: "#93C5FD",
        },

        // 배경 색상 그룹
        background: {
          light: {
            DEFAULT: "#FFFFFF",
            subtle: "#F3F4F6",
            muted: "#E5E7EB",
          },
          dark: {
            DEFAULT: "#303338",
            subtle: "#374151",
            muted: "#4B5563",
          },
        },

        // 텍스트 색상 그룹
        text: {
          light: {
            DEFAULT: "#111827",
            subtle: "#6B7280",
            muted: "#9CA3AF",
          },
          dark: {
            DEFAULT: "#F9FAFB",
            subtle: "#D1D5DB",
            muted: "#9CA3AF",
          },
        },

        warning: {
          light: "#F59E0B",
          dark: "#D97706",
        },
        success: {
          light: "#10B981",
          dark: "#059669",
        },
        info: {
          light: "#3B82F6",
          dark: "#2563EB",
        },
        danger: {
          light: "#EF4444",
          dark: "#DC2626",
        },
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-out-right": "slide-out-right 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
