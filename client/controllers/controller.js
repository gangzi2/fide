"use strict";


//url have to change when move to server
app.controller('loginCtrl', function ($scope, $location, $rootScope, $http, $q) {
    $scope.submit = function () {
        var loginName = $scope.username;
        var loginPassword = $scope.password;
        $http.get('/api/members/' + loginName)
            .success(function (response) {
                $scope.member = response;
                if ($scope.member && $scope.member != "" && $scope.member[0].password == loginPassword) {
                    $rootScope.login = true;
                    if ($scope.member[0].status == "electricien") {
                        $location.path('/electricien');
                    }
                    else {
                        $location.path('/entreprise');
                    }
                }
            });
    };
});

app.controller('appElectricien', function ($scope, $location, $rootScope, $http, $q, NgMap) {
    function getData(url) {
        var defer = $q.defer();
        $http.get(url)
            .success(function (response) {
                defer.resolve(response);
            });
        return defer.promise;
    }
    var promise = getData('http://localhost:8082/database/date.json');
    promise.then(function (date) {
        $scope.date = date.dates;
    });
    $scope.add = function () {
        $location.path('/add');
    };
    //for google map application
    NgMap.getMap().then(function (map) {
        $scope.map = map;
    });
    $scope.currentPin = {title: ""};
    $scope.markerData = [];
    $scope.cityMetaData = [];

    $scope.showDetail = function (e, pin) {
        $scope.currentPin = pin;
        if (pin.level == 0)
            $scope.map.showInfoWindow('in', this);
        else
            $scope.map.showInfoWindow('iw', this);
    };
    $scope.hideDetail = function () {
        if ($scope.currentPin.level == 0)
            $scope.map.hideInfoWindow('in');
        else
            $scope.map.hideInfoWindow('iw');
    };
    var getCityInfo = function () {
        var promise = getData('http://localhost:8082/database/customer.json');
        promise.then(function (data) {
            if (data.customers && data.customers.length !== 0) {
                data.customers.forEach(function (item) {
                    var cityData = item;
                    $scope.cityMetaData.push(cityData);
                    $scope.addressMarker(cityData);
                });
            }
        });
    };
    $scope.addressMarker = function (customer) {
        var customerData = {};
        var address = customer.address;
        switch (customer.level) {
            case 0:
                customerData.icon = "../images/greenmarker.png";
                break;
            case 1:
                customerData.icon = "../images/blackmarker.png";
                break;
            case 2:
                customerData.icon = "../images/redmarker.png";
                break;
            default:
                customerData.icon = "../images/greenmarker.png";
        }
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.$apply(function () {
                    customerData.latitude = results[0].geometry.location.lat();
                    customerData.longitude = results[0].geometry.location.lng();
                    customerData.title = customer.title;
                    customerData.level = customer.level;
                    customerData.address = customer.address;
                    customerData.telephone = customer.telephone;
                    customerData.contact = customer.contact;
                    if (customer.entretien)
                        customerData.entretien = customer.entretien;
                    if (customer.detail)
                        customerData.detail = customer.detail;
                    $scope.markerData.push(customerData);
                });
            } else {
                $log.info('Geocode was not successful for the following reason:' + status);
            }
        });
    };
    getCityInfo();
//for chart


//line chart
    $scope.myChartObject = {};

    $scope.secondRow = [
        {v: new Date(2314, 2, 16)},
        {v: 13},
        {v: 'Lalibertines'},
        {v: 'They are very tall'},
        {v: 25},
        {v: 'Gallantors'},
        {v: 'First Encounter'}
    ];


    $scope.myChartObject.type = "AnnotationChart";

    $scope.myChartObject.data = {
        "cols": [
            {id: "month", label: "Month", type: "date"},
            {id: "kepler-data", label: "Kepler-22b mission", type: "number"},
            {id: "kepler-annot", label: "Kepler-22b Annotation Title", type: "string"},
            {id: "kepler-annot-body", label: "Kepler-22b Annotation Text", type: "string"},
            {id: "desktop-data", label: "Gliese mission", type: "number"},
            {id: "desktop-annot", label: "Gliese Annotation Title", type: "string"},
            {id: "desktop-annot-body", label: "Gliese Annotaioon Text", type: "string"}
        ], "rows": [
            {
                c: [
                    {v: new Date(2314, 2, 15)},
                    {v: 19},
                    {v: 'Lalibertines'},
                    {v: 'First encounter'},
                    {v: 7},
                    {v: undefined},
                    {v: undefined}
                ]
            },
            {c: $scope.secondRow},
            {
                c: [
                    {v: new Date(2314, 2, 17)},
                    {v: 0},
                    {v: 'Lalibertines'},
                    {v: 'All crew lost'},
                    {v: 28},
                    {v: 'Gallantors'},
                    {v: 'Omniscience achieved'}

                ]
            }
        ]
    };

    $scope.myChartObject.options = {};


// pie chart
    var chart1 = {};
    chart1.type = "PieChart";
    chart1.data = [
        ['Component', 'cost'],
        ['juin', 50000],
        ['mai', 80000]
    ];
    chart1.data.push(['avril', 20000]);
    chart1.data.push(['mars', 20000]);
    chart1.data.push(['août', 20000]);
    chart1.options = {
        title: 'Mois/Nb.Clients Installés',
        displayExactValues: true,
        width: 190,
        height: 150,
        is3D: true,
        colors: ['#b76832', '#d27435', '#eb8540', '#efad93', '#f3c9bd'],
        chartArea: {left: 0, top: 30, bottom: 0, width: '100%'}
    };
    chart1.formatters = {
        number: [{
            columnNum: 1,
            pattern: "$ #,##0.00"
        }]
    };

    var chart2 = {};
    chart2.type = "PieChart";
    chart2.data = [
        ['Component', 'cost'],
        ['common', 200000],
        ['key', 80000]
    ];
    chart2.data.push(['general', 20000]);
    chart2.data.push(['golden', 500]);
    chart2.data.push(['silver', 20000]);
    chart2.options = {
        title: 'Type de clients',
        displayExactValues: true,
        width: 190,
        height: 150,
        is3D: true,
        colors: ['#c39512', '#e1ac0d', '#fbc212', '#fcd28d', '#fce0b8'],
        chartArea: {left: 0, top: 30, bottom: 0, width: '100%'}
    };
    chart2.formatters = {
        number: [{
            columnNum: 1,
            pattern: "$ #,##0.00"
        }]
    };
    var chart3 = {};
    chart3.type = "PieChart";
    chart3.data = [
        ['Component', 'cost'],
        ['Lyon', 26],
        ['Grenoble', 34]
    ];
    chart3.data.push(['Paris', 20]);
    chart3.data.push(['Toulouse', 62]);
    chart3.data.push(['Nice', 87]);
    chart3.options = {
        title: 'Géographie',
        displayExactValues: true,
        colors: ['#5e8840', '#85b964', '#7ab154', '#a7c697', '#c7d9bf'],
        width: 190,
        height: 150,
        is3D: true,
        chartArea: {left: 0, top: 30, bottom: 0, width: '100%'}
    };
    chart3.formatters = {
        number: [{
            columnNum: 1,
            pattern: "$ #,##0.00"
        }]
    };
    $scope.chart1 = chart1;
    $scope.chart2 = chart2;
    $scope.chart3 = chart3;


    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };


});


app.factory("DataModel", function () {
    var Service = {};
    return Service;
});

app.controller("ChatController", function ($scope) {
    $scope.chatMessages = [];

    $scope.formatChat = function (icon, username, text, origDt) {
        var chat = {};
        chat.icon = icon;
        chat.username = username;
        chat.text = text;
        chat.origDt = origDt;
        return chat;
    };
    $scope.addChat = function () {
        if ($scope.newChatMsg != "") {
            var chat = $scope.formatChat("http://placehold.it/16x16",
                "steve",
                $scope.newChatMsg,
                new Date());

            $scope.chatMessages.push(chat);
            $scope.newChatMsg = "";
        }
        else {

        }
    };

});

app.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});