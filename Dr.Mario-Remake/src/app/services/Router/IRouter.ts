export interface IRouter {
   path: string;
   component: string;
   controller?: () => Promise<any>;
   guardRoute: boolean;
}
