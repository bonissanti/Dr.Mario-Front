export interface IStorage {
    get<T>(key: string, parse: (raw: unknown) => T, fallback: T): T;
    set(key: string, value: unknown): void;
}