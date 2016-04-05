module app.core.components {
    
    class NavBarController {
        
    }
    
    function navBarComponent (): ng.IComponentOptions {
        return {
            templateUrl: 'app/core/components/nav-bar/navbar.html',
            controller: NavBarController,
            controllerAs: 'vm'
        }
    }
    
    angular
        .module('app.core')
        .component('navBar', navBarComponent());
}