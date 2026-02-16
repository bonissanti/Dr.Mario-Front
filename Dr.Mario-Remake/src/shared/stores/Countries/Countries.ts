import { countries, getEmojiFlag } from "countries-list";
import {CountryType} from "./CountryType.ts";

export class Countries
{
    private static instance: Countries;
    public static CountriesList: CountryType[] | null = null;

    constructor (){}

    public static getInstance(): Countries
    {
        if (!Countries.instance)
            Countries.instance = new Countries();

        return Countries.instance;
    }

    public get CountryNames(): CountryType[]
    {
        if (Countries.CountriesList == null)
            Countries.CountriesList = this.mapCountries();

        return Countries.CountriesList;
    }

    private mapCountries(): CountryType[]
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