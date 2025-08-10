export interface IRepository<T = any>
{
   create(dto: T): Promise<T>;
   update(uuid: string, dto: T): Promise<T>;
   delete(uuid: string, dto: T): Promise<T>;
   get(uuid: string): Promise<T>;
}