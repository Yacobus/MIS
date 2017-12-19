angular.module('so-controllers', [])


.controller('SOSearchCtrl', function ($scope, $rootScope, $location) {
    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startSO = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endSO = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startSO = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endSO = moment(end).format('YYYY-MM-DD');
    }

    $scope.so = [];
    $scope.so.status = 'O';

    $scope.load = function () {
        $rootScope.statusSO = $scope.so.status;
        $location.path('/app/salesOrderList');
    };
})

.controller('SOListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });
    var link = null;
    if ($rootScope.soTitle == 'Sales Order') {
        link = rootLink + 'oSalesOrder?From=' + $rootScope.startSO + '&To=' + $rootScope.endSO
                + '&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan
                + '&Status=' + $rootScope.statusSO;
    } else if ($rootScope.soTitle == 'RAB') {
        link = rootLink + 'oPurchaseRequest?From=' + $rootScope.startSO + '&To=' + $rootScope.endSO
                + '&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan
                + '&Status=' + $rootScope.statusSO;
    } else {
        link = rootLink + 'oDraftSalesOrder?&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan;
    }

    $http.get(link, { headers: headers }).then(function (res) {
        $scope.salesOrder = res.data;
        $ionicLoading.hide();

    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (docNum) {
        $rootScope.noDoc = docNum;
        $location.path('/tabsSO/salesOrder');
    };
})

.controller('SODetailCtrl', function ($scope, $rootScope, $location, $http, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $cordovaToast) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });


    var link = null;
    link = rootLink + 'oBusinessUnit';
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.bUnit = res.data;
        $ionicLoading.hide();
    }, function (err) {
        alert(JSON.stringify(err));
    });

    if ($rootScope.soTitle == 'Sales Order') {
        link = rootLink + 'oSalesOrder';
    } else if ($rootScope.soTitle == 'RAB') {
        link = rootLink + 'oPurchaseRequest';
    } else {
        link = rootLink + 'oDraftSalesOrder';
    }

    link = link + '/' + $rootScope.noDoc;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.so = res.data[0];

        $scope.items = $scope.so.Lines;
        $scope.data.totalSlide = $scope.items.length;

        $ionicLoading.hide();
    }, function (err) {
        alert(JSON.stringify(err));
    });

    $scope.data = {
        totalSlide: 0,
        slideIndex: 0
    };

    var emitSlideBoxChanged = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.data.totalSlide
        });
    }

    $scope.slideChanged = function (index) {
        if ($scope.data.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.data.slideIndex = index;
        emitSlideBoxChanged();
    };

    $scope.save = function () {
        var updateDraftPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Draft Sales Order Data?'
        });

        updateDraftPopup.then(function (res) {
            if (res) {
                var link = rootLink + 'oDraftSalesOrder/' + $rootScope.noDoc;
                $http.put(link, {
                    U_IDU_Approval: $scope.so.U_IDU_Approval,
                    U_IDU_ApprovalManager: $scope.so.U_IDU_ApprovalManager
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $cordovaToast.show('Draft SO Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            }
        })
    }

});