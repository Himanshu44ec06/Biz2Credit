import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { getLogger, LogLevel, setLevelForStackLoggers, getDynamicEnviroments } from './lib';
import { SRC_ENVIROMENTS_INJECTED } from './app/app.constant';

const configAppAndRun = () => {
  const logger = getLogger();
  const bootstrapApp = () => {
      platformBrowserDynamic()
          .bootstrapModule(AppModule)
          .catch(err => logger.error(err));
  };

  const setUpAppMode = (isProduction: boolean, debugMode: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF') => {
    if (isProduction) {
        logger.info('PRODUCTION MODE');
        enableProdMode();
    } else {
        logger.info('DEVELOPMENT MODE');
    }

    let modDebugValue = LogLevel.INFO;
    switch (debugMode) {
        case 'DEBUG':
            modDebugValue = LogLevel.DEBUG;
            break;
        case 'INFO':
            modDebugValue = LogLevel.INFO;
            break;
        case 'WARN':
            modDebugValue = LogLevel.WARN;
            break;
        case 'ERROR':
            modDebugValue = LogLevel.ERROR;
            break;
        case 'OFF':
            modDebugValue = LogLevel.OFF;
            break;
    }
    getLogger().setLevel(modDebugValue);
    setLevelForStackLoggers(modDebugValue);
  };

  getDynamicEnviroments({
      dynamicEnviromentInjectedSrc: SRC_ENVIROMENTS_INJECTED
  }).then((appEnvs: any) => {
    setUpAppMode(appEnvs.production, appEnvs.debugMode);
    bootstrapApp();
  },
  err => {
    logger.error('App could not start because the enviroment vars were not loaded:');
    logger.error(err);
  }
  );

};


configAppAndRun();
