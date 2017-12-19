angular.module('slt-controllers', [])
.controller('SolutionListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    var link = rootLink + 'oRecommend?id='+$rootScope.noSC;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.solutions = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (docNum) {
        $rootScope.solMode = 'get';
        $rootScope.noSol = docNum;
        $location.path('/solution');
    };

    $scope.newSolution = function () {
        $rootScope.solMode = 'new';
        $location.path('/solution');
    };

    $scope.back = function () {
        $location.path('/tabsSC/serviceCall-master');
    };
})

.controller('SolutionCtrl', function ($scope, $rootScope, $location, $ionicLoading, $http, $cordovaToast, $ionicModal, $ionicPopup) {
    $scope.init = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Solution Data...'
        });

        $scope.solStatus = [{ Code: -1, Name: 'Publish' }, { Code: -2, Name: 'Internal' }, { Code: -3, Name: 'Review' }];
        loadData();
    }

    function loadData() {
        if ($rootScope.solMode == 'new') {
            initNewSolution();
        } else {
            var link = rootLink + 'oKnowledgeBaseSolution/' + $rootScope.noSol;
            $http.get(link, { headers: headers }).then(function (res) {
                $scope.solution = res.data;
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
        }
    }

    function initNewSolution() {
        $scope.solution = {};
        $scope.solution.SolutionCode = null;
        $scope.solution.DateCreate = moment(new Date()).format('YYYY-MM-DD');
        $scope.solution.ServiceCallSolutionStatus = null;
        $scope.solution.ItemCode = $rootScope.itemCode;
        $scope.solution.ItemName = $rootScope.itemName;
        $scope.solution.Solution = null;
        $scope.solution.Symptom = null;
        $scope.solution.Description = null;

        $ionicLoading.hide();
    }

    $scope.back = function () {
        if ($rootScope.solMode != 'view')
            $location.path('/solutionList');
        else
            $location.path('/tabsSC/serviceCall-master');
    };

    $scope.save = function () {
        var saveSolPopup = $ionicPopup.confirm({
            title: 'Save Solution',
            template: 'Do you want to add this Solution?'
        });

        saveSolPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving data...'
                });
                if ($rootScope.solMode == 'new') {
                    var link = rootLink + 'oKnowledgeBaseSolution';
                    $http.post(link, $scope.solution, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            alert(JSON.stringify(res.data.error));
                        } else {
                            link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                            $http.put(link, { Solution: [{ SltCode: res.data.SolutionCode }], Attachments: $rootScope.attc }, { headers: headers }).then(function (res) {
                                if (typeof res.data.error != 'undefined') {
                                    alert(JSON.stringify(res.data.error));
                                } else {
                                    $cordovaToast.show('Solution have been saved', 'long', 'center');
                                    $location.path('/tabsSC/serviceCall-master');
                                    $ionicLoading.hide();
                                }
                            }, function (err) {
                                $ionicLoading.hide();
                                alert(JSON.stringify(err));
                            })
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        alert(JSON.stringify(err));
                    });

                } else {
                    var link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                    $http.put(link, { Solution: [{ SltCode: $rootScope.noSol }], Attachments: $rootScope.attc }, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            alert(JSON.stringify(res.data.error));
                        } else {
                            $cordovaToast.show('Solution have been saved', 'long', 'center');
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        alert(JSON.stringify(err));
                    })
                    $location.path('/tabsSC/serviceCall-master');
                    $ionicLoading.hide();
                    //var link = rootLink + 'oKnowledgeBaseSolution/' + $rootScope.noSol;

                    //$http.put(link, $scope.solution, { headers: headers }).then(function (res) {
                    //    $cordovaToast.show('Data telah di update', 'long', 'center');
                    //    $ionicLoading.hide();
                    //}, function (err) {
                    //    $ionicLoading.hide();
                    //    alert(JSON.stringify(err));
                    //});
                }
            }
        })
    }

    $ionicModal.fromTemplateUrl('templates/Modal/findItem.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalFindItem = modal;
    });

    $scope.openItemModal = function () {
        $scope.modalFindItem.show();
    }

    $scope.closeItemModal = function () {
        $scope.modalFindItem.hide();
    }

    $scope.findItem = function (filter) {
        if (filter != null && filter != undefined && filter != '' && filter.length >= 4) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Items Data...'
            });
            $http.get(rootLink + 'oItems?id=' + filter, { headers: headers }).then(function (res) {
                if (res.data.length <= 100) {
                    $scope.items = res.data;
                } else {
                    alert('Data Item lebih 100, silahkan masukan No Part atau nama item yang lebih spesifik');
                }
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert('Connection Error');
            })
        } else {
            alert('Search minimal 4 karakter');
        }
    }

    $scope.setItem = function (code, name) {
        $scope.solution.ItemCode = code;
        //$scope.activity.CardName = name;
        $scope.modalFindItem.hide();
    }
});