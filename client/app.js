var app = angular.module('mainApp', ['ngRoute', 'ngMap', 'googlechart','ui.bootstrap']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html'
        })
        .when('/electricien', {
            templateUrl: 'views/electricien.html'
        })
        .when('/entreprise', {
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.login)
                        $location.path('/');
                }
            },
            templateUrl: 'views/entreprise.html'
        })
        .when('/add', {
            templateUrl: 'views/add.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});