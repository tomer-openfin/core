import {writeToLog} from '../browser/log';
import ofEvents from '../browser/of_events';
import route from '../common/route';

export function initializeEventReporter(argo: any) {
    if (!argo.diagnostics) {
        return;
    }

    const windowEventsToLog =  [
        'not-responding',
        'resource-crashed',
        'resource-plugin-crashed',
        'resource-certificate-error',
        'resource-unresponsive',
        'resource-load-failed'
    ];

    const applicationEventsToLog =  [
        'not-responding',
        'crashed',
        'error'
    ];

    addEventsLogging(windowEventsToLog, 'window');
    addEventsLogging(applicationEventsToLog, 'application');
}

function addEventsLogging(eventsNames: string[], scope: string) {
    eventsNames.forEach((eventName: string) => {
        ofEvents.on(route[scope](eventName, '*'), payload => {
            const {name, uuid} = payload.data[0];
            writeToLog(
                'info',
                `"${eventName}" event was fired in ${scope}.
                uuid: ${uuid},
                ${name ? 'name: ' + name : ''}
                payload: ${JSON.stringify(payload.data[0])}`
            );
        });
    });
}