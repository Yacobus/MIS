angular.module('complain-controllers', [])

.controller('ComplainSearchCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startComp = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endComp = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startComp = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endComp = moment(end).format('YYYY-MM-DD');
    }

    $scope.comp = [];
    $scope.comp.status = 'O';

    $scope.load = function () {
        if ($scope.comp.status == 'L')
            $rootScope.statusComp = '';
        else
            $rootScope.statusComp = $scope.comp.status;
        $location.path('/app/complainList');
    };

    $scope.newComp = function () {
        $rootScope.compMode = 'new';
        $location.path('/tabsComplain/complain');
    }
})

.controller('ComplainListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    $scope.complains = [];

    var link = rootLink + 'oComplain?From=' + $rootScope.startComp + '&To=' + $rootScope.endComp
        + '&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan
                + '&Status=' + $rootScope.statusComp;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.complains = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (compNum) {
        $rootScope.noComp = compNum;
        $rootScope.compMode = 'view';
        $location.path('/tabsComplain/complain');
    };

})

.controller('ComplainCtrl', function ($scope, $rootScope, $location, $ionicLoading, $http, $ionicModal, $ionicPopup, $cordovaToast) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Initialize data...'
    });
    var loadMaster = 0;

    $http.get(rootLink + 'oEmployee', { headers: headers }).then(function (res) {
        $scope.compEmployee = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.compEmployee.push({ EmpID: res.data[i].EmpID.toString(), FirstName: res.data[i].FirstName, LastName: res.data[i].LastName });
        }
        // $scope.actEmployee = res.data;
        loadMaster++;
        if (loadMaster == 2)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert('Please check your connection');
    })

    $http.get(rootLink + 'oBranch', { headers: headers }).then(function (res) {
        $scope.compBranch = res.data;
        loadMaster++;
        if (loadMaster == 2)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert('Please check your connection');
    })

    function loadData() {
        if ($rootScope.compMode == 'new') {
            initNewComplain();
        } else {
            var link = rootLink + 'oComplain/' + $rootScope.noComp;
            $http.get(link, { headers: headers }).then(function (res) {
                $scope.complain = res.data[0];
                $scope.serviceCall = $scope.complain.ServiceCall;
                $scope.statusComp = $scope.complain.U_IDU_Status;

                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
        }

    }

    function initNewComplain() {
        $scope.complain = {};
        $scope.complain.U_IDU_Date = moment(new Date()).format('YYYY-MM-DD');
        $scope.complain.U_IDU_Branch = null;
        $scope.complain.U_IDU_User = $rootScope.empID;
        $scope.complain.U_IDU_UserComplain = null;
        $scope.complain.U_IDU_MngrSales = null;
        $scope.complain.U_IDU_Customer = null;
        $scope.complain.U_IDU_Unit = null;
        $scope.complain.U_IDU_Issue = null;
        $scope.complain.U_IDU_Status = 'O';
        $ionicLoading.hide();
    }


    $ionicModal.fromTemplateUrl('templates/Modal/findBP.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalFindBP = modal;
    });

    $scope.openBPModal = function () {
        $scope.modalFindBP.show();
    }

    $scope.closeBPModal = function () {
        $scope.modalFindBP.hide();
    }

    $scope.findBP = function (filter) {
        if (filter != null && filter != undefined && filter != '' && filter.length >= 3) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Customers Data...'
            });
            $http.get(rootLink + 'oBusinessPartners?name=' + filter, { headers: headers }).then(function (res) {
                $scope.bps = res.data;
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert('Connection Error');
            })
        } else {
            alert('Search minimum 3 karakter');
        }
    }

    $scope.setBP = function (code, name) {
        $scope.complain.U_IDU_Customer = code;
        $scope.complain.U_IDU_CustomerName = name;
        $scope.modalFindBP.hide();
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
        $scope.complain.U_IDU_Unit = code;
        $scope.complain.U_IDU_UnitName = name;
        $scope.modalFindItem.hide();
    }

    $scope.save = function () {
        var saveCompPopup = $ionicPopup.confirm({
            title: 'Save Complain',
            template: 'Do you want to save this Complain?'
        });

        saveCompPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving data...'
                });
                if ($rootScope.compMode == 'new') {
                    var link = rootLink + 'oComplain';
                    $http.post(link, $scope.complain, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            alert(JSON.stringify(res.data.error));
                        } else {
                            var noComp = res.data.NewEntry;
                            link = rootLink + 'oEmployee/' + $scope.complain.compEmployee;
                            $http.get(link, { headers: headers }).then(function (res) {
                                var username = res.data[0].U_IDU_UserMobile;
                                var noNotif = 'Comp' + noComp;
                                link = rootLink + 'oNotification';
                                $http.post(link, {
                                    Code: noNotif,
                                    Name: noNotif,
                                    U_IDU_User: username,
                                    U_IDU_Tgl: $scope.complain.U_IDU_Date,
                                    U_IDU_Title: 'New Complain',
                                    U_IDU_Ket: $scope.complain.U_IDU_UnitName + ', ' + $scope.complain.U_IDU_Issue,
                                    U_IDU_JenisTransaksi: "Complain",
                                    U_IDU_NoTransaksi: $rootScope.noComp,
                                    U_IDU_Flag: 0,
                                    U_IDU_Tempat: $scope.complain.U_IDU_CustomerName,
                                    U_IDU_EmpID: $scope.complain.U_IDU_UserComplain
                                }, { headers: headers }).then(function (res) {
                                    if (typeof res.data.error != 'undefined') {
                                        alert(JSON.stringify(res.data.error));
                                    } else {
                                        $cordovaToast.show('Data tersimpan dengan no complain: ' + res.data.NewEntry, 'long', 'center');
                                        $location.path('/app/complainSearch');
                                        $ionicLoading.hide();
                                    }
                                }, function (err) {
                                    alert('Please check your connection');
                                })
                            })
                            
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        alert(JSON.stringify(err));
                    });

                } else {
                    var link = rootLink + 'oComplain/' + $rootScope.noComp;
                    $http.put(link, $scope.complain, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            alert(JSON.stringify(res.data.error));
                        } else {
                            $cordovaToast.show('Data telah di update', 'long', 'center');
                            $ionicLoading.hide();
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        alert(JSON.stringify(err));
                    });
                }

            }
        })
    }
});