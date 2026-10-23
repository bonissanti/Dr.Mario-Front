import type {SettingsDTO} from "./SettingsDTO.ts";
import {type Listener, Observable} from "../Observability/Observability.ts";

export class SettingsService {
    private readonly state: Observable<SettingsDTO>
    private readonly storage: Storage

    public constructor(private readonly storage: Storage = localStorage)
    {
        this.state = new Observable(this.load());
        this.storage = storage;
    }

    public get = () => this.state.get()
    public subscribe = (l: Listener<SettingsDTO>) => this.state.subscribe(l);

    public set<k extends keyof SettingsDTO>(key: k, value: SettingsDTO[k]): void
    {
        const next = { ...this.state.get(), [key]: value};
        this.save(next);
        this.state.set(next);
    }
}