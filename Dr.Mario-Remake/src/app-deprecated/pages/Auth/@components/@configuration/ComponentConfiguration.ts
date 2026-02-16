import {type CreateAccountStyleConfig, type ICreateAccountConfig } from './interfaces/ICreateAccountConfig.ts';

export const ComponentConfiguration: ICreateAccountConfig = {
    style: {
        initialVisibility: 'hidden',
        initialOpacity: '0',
        transition: 'opacity 0.3s ease-in-out',
        visibleOpacity: '1'
    },
    behavior: {
        debounceDelay: 4000,
        warningDuration: 8000
    }
};

export class ComponentAnimationHelper
{
    public static showComponent(element: HTMLElement, config: CreateAccountStyleConfig): void
    {
        element.style.transition = config.transition;

        requestAnimationFrame(() => {
            element.style.visibility = 'visible';
            element.style.opacity = config.visibleOpacity;
        })
    }

    public static hideComponent(element: HTMLElement, config: CreateAccountStyleConfig): void
    {
        element.style.opacity = config.initialOpacity;

        setTimeout(() => {
            element.style.visibility = config.initialVisibility;
        }, 300);
    }
}