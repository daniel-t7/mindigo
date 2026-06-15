import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle', // Тук автоматично ще се генерират SQL миграциите ти
    schema: './lib/db/schema.ts', // Пътят до твоята схема
    dialect: 'turso', // Казваме директно, че ще ползваме Turso
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
});