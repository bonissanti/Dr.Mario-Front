export class ProxyData
{
    //reactive one-way binding
    createProxy<T extends object>(target: T, onChange?: (property: string, value: any) => void): T
    {
        return new Proxy(target, {
            get: (target: any, property: string): any => {
                return target[property];
            },

            set: (target: any, property: string, value: any): boolean =>
            {
                target[property] = value;

                if (onChange)
                    onChange(property, value);

                return true;
            }
        })
    }
}