angular.module('quo-controllers', [])


.controller('QuotationSearchCtrl', function ($scope,$rootScope, $location) {
    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startQuo = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endQuo = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startQuo = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endQuo = moment(end).format('YYYY-MM-DD');
    }

    $scope.quo = [];
    $scope.quo.status = 'O';

    $scope.load = function () {
        $rootScope.statusQuo = $scope.quo.status;
        $location.path('/app/quotationList');
    };
})

.controller('QuotationListCtrl', function ($scope,$rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });
    
    var link = rootLink + 'oSalesQuotation?From=' + $rootScope.startQuo + '&To=' + $rootScope.endQuo
                + '&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan
                + '&Status=' + $rootScope.statusQuo;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.quotations = res.data;
        $ionicLoading.hide();

    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (docNum) {
        $rootScope.noDoc = docNum;
        $location.path('/tabsQuo/quotation-master');
    };
})

.controller('QuotationDetailCtrl', function ($scope, $rootScope, $ionicLoading, $http, $ionicSlideBoxDelegate) {

    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    var link = rootLink + 'oSalesQuotation/' + $rootScope.noDoc;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.quotation = res.data[0];
        $scope.items = $scope.quotation.Lines;
        $scope.data.totalSlide = $scope.items.length;

        $ionicLoading.hide();
    }, function (err) {
        alert(JSON.stringify(err));
    })


    $scope.data = {
        totalSlide: 0,
        slideIndex: 0
    };

    // $scope.data.totalSlide = $scope.items.length;

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

});