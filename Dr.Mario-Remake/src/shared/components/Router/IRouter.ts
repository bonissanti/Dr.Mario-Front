export interface IRouter {
   path: string;
   component: string;
   name?: string;
}

export type RouteHandler = () => Promise<void> | void;