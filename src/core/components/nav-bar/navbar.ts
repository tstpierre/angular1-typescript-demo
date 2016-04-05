module app.core.components {
    
    interface INavBarController {
        collapsed: boolean;
        
        clicked (): void;
    }
    
    class NavBarController implements INavBarController {
        
        collapsed: boolean = true;
        
        clicked = (): void => {
            this.collapsed = true;
        }
    }
    
    function navBarDirective (): ng.IDirective {
        return {
            restrict: 'E',
            templateUrl: 'app/core/components/nav-bar/navbar.html',
            controller: NavBarController,
            controllerAs: 'vm',
            replace: true
        }
    }
    
    angular
        .module('app.core')
        .directive('navBar', navBarDirective);
}