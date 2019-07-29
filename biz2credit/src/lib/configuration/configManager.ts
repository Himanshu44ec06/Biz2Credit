import { GetterEnviromentOptions } from './configManager.model';
import { configStore } from './config.store';

export const  getDynamicEnviroments  = (options: GetterEnviromentOptions) => {

      return new Promise<any>((resolve, reject) => {
             fetch(options.dynamicEnviromentInjectedSrc)
             .then( response => {
                return response.status === 200 ? response.json() : null;
             })
             .then( enviroment => {
                    if (enviroment) {
                        if (!options.appEnvironmentSchema
                        ) {
                            configStore.enviromentAppVars = enviroment;
                            resolve(enviroment);
                        } else {
                          reject(`The content of the file ${options.dynamicEnviromentInjectedSrc} is not a valid instance:`);
                        }
                    } else {
                        reject(`The file ${options.dynamicEnviromentInjectedSrc} was not found`);
                    }
             });
      });

};

