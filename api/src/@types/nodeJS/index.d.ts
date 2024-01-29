declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      PORT: string;
      JWT_TOKEN_SECRET: string;
      CORS_ALLOW_ORIGINS: string;
    }
  }
}

export {};
