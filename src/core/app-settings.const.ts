module app.core {
    
    export interface IAppSettings {
        version: string;
    }
    
    class AppSettings implements IAppSettings {
        version: string = "1.0.0";
    }
    
    angular
        .module('app.core')
        .constant('AppSettings', AppSettings);
}