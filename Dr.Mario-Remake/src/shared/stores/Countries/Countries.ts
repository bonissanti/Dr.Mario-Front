import { countries, getEmojiFlag } from "countries-list";



export class Countries
{
    private static instance: Countries;
    private static CountriesList: { name: any; code: string; continent: any; emoji: any }[] = [];


    public static getInstance(): Countries
    {
        if (!Countries.instance)
            Countries.instance = new Countries();

        return Countries.instance;
    }

    public get CountryNames(): { name: any; code: string; continent: any; emoji: any }[]
    {
        Countries.CountriesList ??= this.mapCountries();

        return Countries.CountriesList;
    }

    private mapCountries(): { name: any; code: string; continent: any; emoji: any }[]
    {
        const countryCodes = Object.keys(countries) as Array<keyof typeof countries>

        return countryCodes.map(code => {
            const country = countries[code];

            return {
                name: country.name,
                code: code,
                continent: country.continent,
                emoji: getEmojiFlag(code)
            }
        });
    }
}