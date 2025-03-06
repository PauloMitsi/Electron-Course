import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import path from 'path';
import { ipcMainHandle, isDev } from './util.js';
import { getStaticData, pollResources } from './resourceManager.js';
import { getPreloadPath } from './pathResolver.js';

app.on('ready', () => {
    const mainwindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
    });
    if (isDev()) {
        mainwindow.loadURL('http://localhost:2357');
    } else {
        mainwindow.loadFile(
            path.join(app.getAppPath(), '/dist-react/index.html')
        );
    }

    pollResources(mainwindow);

    // ipcMain.on e ipcMain.send geralmente são usados para comunicação entre processos onde NÃO esperam que a resposta seja retornada
    // ipcMain.handle e ipcMain.invoke ESPERA que a resposta seja retornada

    ipcMainHandle('getStaticData', () => {
        return getStaticData();
    });
});
