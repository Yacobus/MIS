angular.module('cust-controllers', [])

.controller('CustomerSearchCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading Data...'
    });
    $scope.cust = [];
    $scope.teritory = [];
    $scope.groupCust = [];
    var link = rootLink + 'oTerritory';
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.teritory = res.data;

        link = rootLink + 'oBusinessPartnerGroup';
        $http.get(link, { headers: headers }).then(function (res2) {
            $scope.groupCust = res2.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert(JSON.stringify(err));
        })
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.load = function () {
        $rootScope.teritoryCode = $scope.cust.teritory;
        $rootScope.groupCode = $scope.cust.group;
        $location.path('/app/customerList');
    };
})

.controller('CustomerListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading Data...'
    });
    $scope.customers = [];
    var link = rootLink + 'oBusinessPartners?territory=' + $rootScope.teritoryCode + '&groupCode=' + $rootScope.groupCode;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.customers = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (custNum) {
        $rootScope.docNum = custNum;
        $location.path('/tabsCust/customer');
    };
})

.controller('CustomerDetailCtrl', function ($scope,$rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading Data...'
    });

    var link = rootLink + 'oBusinessPartners?id=' + $rootScope.docNum;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.customer = res.data[0];
        $scope.serviceCall = $scope.customer.ServiceCall;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

});