const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatatistics: (callback) => {
        ipcRendererOn('statistics', (statistics) => {
            callback(statistics);
        });
    },
    getStaticData: () => {  
        return ipcRendererInvoke('getStaticData');
    },
} satisfies Window['electron']);

function ipcRendererInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcRendererOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    return electron.ipcRenderer.on(key, (_, payload) => callback(payload));
}
