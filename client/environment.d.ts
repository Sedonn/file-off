declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_PORT: number;
    }
  }
}

export {};
