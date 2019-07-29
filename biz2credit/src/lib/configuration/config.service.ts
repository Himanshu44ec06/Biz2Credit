import { Injectable, Inject } from '@angular/core';
import { IsJson } from '../utils';
import { configStore } from './config.store';

const STORAGE_APP_KEY = '';
const APP_NAME = '';

@Injectable()
export class ConfigService {
    appConfig = null;
    storageAppKey = 'appkey';
    appName = 'appName';

    constructor(@Inject(STORAGE_APP_KEY) storageAppKey: string, @Inject(APP_NAME) appName: string) {
        this.storageAppKey = storageAppKey;
        this.appName = appName;
        this.initConfig();
    }

    private initConfig() {
        const initValue = sessionStorage.getItem(`${this.storageAppKey}.${this.appName}`);
        this.appConfig = initValue && IsJson(atob(initValue)) ? JSON.parse(atob(initValue)) : {};
    }

    getEnvironment() {
        return configStore.enviromentAppVars;
    }

    get(keyVar: string) {
        if (this.appConfig === null) {
            this.initConfig();
        }
        return keyVar in this.appConfig ? this.appConfig[keyVar] : null;
    }

    getAll() {
        if (this.appConfig === null) {
            this.initConfig();
        }
        return this.appConfig;
    }
}

export function configFactory(storageAppKey: string, appName: string) {
    return () => {
        return new ConfigService(storageAppKey, appName);
    };
}
