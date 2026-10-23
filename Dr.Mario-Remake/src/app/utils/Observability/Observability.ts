export type Listener<T> = (value: Readonly<T>) => void;

export class Observable<T>
{
    private readonly listeners = new Set<Listener<T>>();
    private value: T;

    public constructor(value: T) {
        this.value = value;
    }



    public get(): Readonly<T>
    {
        return this.value
    }

    public set(value: T): void
    {
        this.value = value;
        this.listeners.forEach(listener => listener(value));
    }

    public subscribe(listener: Listener<T>): () => void
    {
        this.listeners.add(listener);
        listener(this.value);
        return () => this.listeners.delete(listener);
    }
}