/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_API_KEY: string
  readonly VITE_EMPLOYEE_LOGIN_EMAIL: string
  readonly VITE_EMPLOYEE_LOGIN_PASSWORD: string
  readonly VITE_NOTION_TOKEN: string
  readonly VITE_NOTION_DATABASE_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_GOOGLE_BUSINESS_ACCOUNT_ID: string
  readonly VITE_GEMINI_API_KEY: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}