declare module '@maxklema/mie-api-tools' {
    
    interface globals {
        value: string;
    }

    //variables

    export const URL: globals;
    export const practice: globals;
    export const username: globals;
    export const password: globals;
    export const ledger: globals;
    export const GeminiKey: globals;
    export const cookie: globals;
    
    //methods

    export function retrieveRecord(endpoint: string, fields: string[], options: object): Promise<object>;
    export function updateRecord(endpoint: string, identifier: object, json_options: object): object;
    export function createRecord(endpoint: string, new_data: object): object;
    export function downloadDocs(queryString: object, directory: string, optimization: number): void;
    export function migrateData(configJSON: object): void;
    export function getAllPatientRecords(patID: number, options: object): Promise<string>;
    export function summarizePatient(patID: number, options: object): Promise<string>;
    export function queryPatient(patID: number, query: string, options: object): Promise<string>;
    export function createLedger(options: object): void;
    export function getCustomRecords(endpoint_list: string[], filters: string[], queryby: object, OmitErrors: number): Promise<object>;
    export function getCookie(): void;

}