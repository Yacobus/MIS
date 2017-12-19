angular.module('opp-controllers', [])

.controller('OpportunitySearchCtrl', function ($scope, $rootScope, $location, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);

    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startOpp = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endOpp = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startOpp = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endOpp = moment(end).format('YYYY-MM-DD');
    }

    $scope.opp = [];
    $scope.opp.status = 'O';

    $scope.load = function () {
        $rootScope.statusOpp = $scope.opp.status;
        $location.path('/app/oppList');
    };

    $scope.newOpp = function () {
        $rootScope.mode = 'new';
        $location.path('/tabsOpp/opportunity');
    }
})

.controller('OpportunityListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    $scope.opportunities = [];

    var link = rootLink + 'oSalesOpportunities?From=' + $rootScope.startOpp + '&To=' + $rootScope.endOpp + '&user='
        + $rootScope.empID + '&position=' + $rootScope.jabatan
        + '&Status=' + $rootScope.statusOpp;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.opportunities = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (docNum) {
        $rootScope.noOpp = docNum;
        $rootScope.mode = 'view';
        $location.path('/tabsOpp/opportunity');
    };
})

.controller('OpportunityDetailCtrl', function ($scope, $rootScope, $location, $cordovaActionSheet, $ionicPopup, $ionicLoading,
    $http, $cordovaCamera, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $ionicModal, $cordovaToast, $ionicSlideBoxDelegate) {
    $scope.temp = [];
    $scope.temp.stat = 'O';
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Initialize data...'
    });
    var loadMaster = 0;

    //$http.get(rootLink + 'oEmployee', { headers: headers }).then(function (res) {
    //    $scope.oppEmployee = [];
    //    for (var i = 0; i < res.data.length; i++) {
    //        $scope.oppEmployee.push({ EmpID: res.data[i].EmpID.toString(), FirstName: res.data[i].FirstName, LastName: res.data[i].LastName });
    //    }
    //    // $scope.actEmployee = res.data;
    //    loadMaster++;
    //    if (loadMaster == 5)
    //        loadData();
    //}, function (err) {
    //    $ionicLoading.hide();
    //    alert(JSON.stringify(err));
    //})

    $http.get(rootLink + 'oBusinessUnit', { headers: headers }).then(function (res) {
        $scope.businessUnit = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oSalesStage', { headers: headers }).then(function (res) {
        $scope.salesStage = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.salesStage.push({ Stageno: res.data[i].Stageno.toString(), Name: res.data[i].Name, ClosingPercentage: res.data[i].ClosingPercentage });
        }
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oSalesOpportunityInterestSetup', { headers: headers }).then(function (res) {
        $scope.oppInterest = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.oppInterest.push({ SequenceNo: res.data[i].SequenceNo.toString(), Description: res.data[i].Description });
        }
        //$scope.oppInterest = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oSalesOpportunityReasonSetup', { headers: headers }).then(function (res) {
        $scope.oppReasons = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.oppReasons.push({ SequenceNo: res.data[i].SequenceNo.toString(), Description: res.data[i].Description });
        }
        //$scope.oppReasons = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oSalesOpportunityCompetitorSetup', { headers: headers }).then(function (res) {
        $scope.oppComp = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.oppComp.push({
                SequenceNo: res.data[i].SequenceNo.toString(),
                Name: res.data[i].Name
            });
        }
        //$scope.oppReasons = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    function loadData() {
        if ($rootScope.mode == 'new') {
            initNewOpp();
        } else {
            var link = rootLink + 'oSalesOpportunities/' + $rootScope.noOpp;
            $http.get(link, { headers: headers }).then(function (res) {
                getContact(res.data[0].CardCode, 1);
                if (res.data[0].ChannelCode != null)
                    getContact(res.data[0].ChannelCode, 2);

                $scope.startDate = new Date(res.data[0].StartDate);
                $scope.startDateF = moment($scope.startDate).format('DD MMM YYYY');

                $scope.opp = res.data[0];
                $scope.temp.stat = res.data[0].Status;
                if (res.data[0].Status == 'O')
                    $scope.temp.disable = false;
                else
                    $scope.temp.disable = true;

                if ($scope.opp.Potential.PredDate != null) {
                    $scope.predDate = new Date($scope.opp.Potential.PredDate);
                    $scope.predDateF = moment($scope.predDate).format('DD MMM YYYY');
                }

                switch ($scope.opp.Potential.DifType) {
                    case 'D':
                        $scope.opp.totalDate = $scope.opp.Potential.Number + ' Days';
                        break;
                    case 'W':
                        $scope.opp.totalDate = $scope.opp.Potential.Number + ' Weeks';
                        break;
                    case 'M':
                        $scope.opp.totalDate = $scope.opp.Potential.Number + ' Months';
                        break;
                }

                $scope.stages = $scope.opp.Stages;
                $scope.compts = $scope.opp.Competitors;
                $scope.attachments = $scope.opp.Attachments;
                $rootScope.attc = $scope.attachments;
                //$scope.interest = $scope.opp.Interest;
                $scope.reasons = $scope.opp.Reasons;

                $scope.dataStages.totalSlide = $scope.stages.length;
                $scope.dataCompts.totalSlide = $scope.compts.length;

                //$scope.statusOpp = $scope.opp.Status;
                $scope.opp.CprCode = $scope.opp.CprCode.toString();
                $scope.opp.SlpCode = $scope.opp.SlpCode.toString();
                if ($scope.opp.Potential.IntRate != null)
                    $scope.opp.Potential.IntRate = $scope.opp.Potential.IntRate.toString();
                if ($scope.opp.ChannelCode != null) {
                    $scope.opp.ChannelCode = $scope.opp.ChannelCode.toString();
                    $scope.opp.ChannelContact = $scope.opp.ChannelContact.toString();
                }
                refreshComment();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
        }

    }

    function getContact(bp, n) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Data Contact...'
        });
        $http.get(rootLink + 'oContactPerson?cardCode=' + bp, { headers: headers }).then(function (res) {
            if (n == 1)
                $scope.oppContact = res.data;
            else
                $scope.oppContact2 = res.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert('Connection Error');
        })
    }

    function initNewOpp() {
        $scope.opp = {};
        $scope.opp.OpprId = null;
        $scope.opp.Status = 'O';
        $scope.opp.StatusName = 'Open';
        $scope.opp.StartDate = moment(new Date()).format('YYYY-MM-DD');
        $scope.startDateF = moment(new Date()).format('DD MMM YYYY');
        $scope.opp.ClosingDate = null;
        $scope.opp.CloPrcnt = 5;
        $scope.opp.CardCode = null;
        $scope.opp.CprCode = null;
        $scope.opp.TerritoryCode = null;
        $scope.opp.SlpCode = $rootScope.slpID;
        $scope.opp.SlpName = $rootScope.firstName;
        $scope.opp.Remark = null;
        $scope.opp.OpportunityName = null;
        $scope.opp.ChannelCode = null;
        $scope.opp.ChannelContact = null;
        $scope.opp.Potential = {};
        $scope.opp.Potential.Number = null;
        $scope.opp.Potential.DifType = null;
        $scope.opp.Potential.PredDate = null;
        $scope.opp.Potential.MaxSumLoc = 1;
        $scope.opp.Potential.WtSumLoc = 0.05;
        $scope.opp.Potential.IntRate = null;
        $scope.opp.Potential.U_IDU_BU = null;
        $scope.opp.Potential.U_IDU_BU2 = null;
        $scope.opp.Potential.U_IDU_BU3 = null;
        $scope.opp.Interest = [];
        $scope.opp.Reasons = [];
        $scope.opp.Stages = [];
        $scope.opp.Stages.push({
            OpenDate: moment(new Date()).format('YYYY-MM-DD'),
            CloseDate: moment(new Date()).format('YYYY-MM-DD'),
            SlpCode: -1,
            SlpName: "-No Sales Employee-",
            Step_Id: 1,
            Step_IdName: "Leads",
            ClosePrcnt: 5,
            MaxSumLoc: 1,
            WtSumLoc: 0.05,
            ObjType: "-1",
            ObjTypeName: null,
            DocNumber: null,
            LineNum: 0,
            Status: "O"
        });
        $scope.opp.Competitors = [];
        $scope.opp.Attachments = [];
        $ionicLoading.hide();
    }

    $scope.countWtSumLoc = function () {
        $scope.WtSumLoc = $scope.MaxSumLoc / 100 * $CloPrcnt;
        if ($rootScope.mode = 'new') {
            $scope.opp.Stages[0].WtSumLoc = $scope.WtSumLoc;
            $scope.opp.Stages[0].MaxSumLoc = $scope.MaxSumLoc;
        }
    }

    $ionicModal.fromTemplateUrl('templates/Modal/findBP.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalFindBP = modal;
    });

    var bpType;
    $scope.openBPModal = function (n) {
        bpType = n;
        $scope.modalFindBP.show();
    }

    $scope.closeBPModal = function () {
        $scope.modalFindBP.hide();
    }

    $scope.findBP = function (filter) {
        if (filter != null && filter != undefined && filter != '' && filter.length >= 3) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Business Partners Data...'
            });
            $http.get(rootLink + 'oBusinessPartners?name=' + filter, { headers: headers }).then(function (res) {
                $scope.bps = res.data;
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert('Connection Error');
            })
        } else {
            alert('Search minimal 3 karakter');
        }
    }

    $scope.setBP = function (code, name) {
        if (bpType == 1) {
            $scope.opp.CardCode = code;
            $scope.opp.CardName = name;
        } else {
            $scope.opp.ChannelCode = code;
            $scope.opp.ChannelName = name;
        }
        getContact(code, bpType);
        $scope.modalFindBP.hide();
    }

    $scope.dataStages = {
        totalSlide: 0,
        slideIndex: 0
    };

    $scope.dataCompts = {
        totalSlide: 0,
        slideIndex: 0
    };

    var emitSlideBoxChangedStages = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataStages.totalSlide
        });
    }

    var emitSlideBoxChangedCompts = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataCompts.totalSlide
        });
    }

    $scope.slideChangedStages = function (index) {
        if ($scope.dataStages.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataStages.slideIndex = index;
        emitSlideBoxChangedStages();
    };

    $scope.slideChangedCompts = function (index) {
        if ($scope.dataCompts.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataCompts.slideIndex = index;
        emitSlideBoxChangedCompts();
    };


    $scope.goToActivity = function (num) {
       $rootScope.parentAct = 'Opportunity';
       $rootScope.noAct = num;
       $rootScope.actMode = 'view';
       $location.path('/tabsAct/activity');
    };

    $scope.addActivity = function () {
        $rootScope.actMode = 'new';
        $rootScope.parentAct = 'Opportunity';
        $rootScope.bpCode = $scope.opp.CardCode;
        $rootScope.bpName = $scope.opp.CardName;
        $rootScope.itemCode = null;
        $rootScope.itemName = null;
        $rootScope.sn = null;
        var lineNum = $scope.opp.Stages.length - 1;
        $rootScope.opporLine = $scope.stages[lineNum].LineNum;
        $location.path('/tabsAct/activity');
    }

    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };

    $scope.addComment = function () {
        $scope.data = {};

        // An elaborate, custom popup
        var commentPopup = $ionicPopup.show({
            templateUrl: 'templates/Popup/comment.html',
            title: 'Enter Your Comment',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if (!$scope.data.comment) {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {
                          $ionicLoading.show({
                              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving comment...'
                          });
                          var link = rootLink + 'oComment'
                          $http.post(link, {
                              Code: $rootScope.noOpp + moment(new Date()).format('HHmmss'),
                              Name: $rootScope.noOpp + moment(new Date()).format('HHmmss'),
                              U_IDU_Objective: moment(new Date()).format('HH:mm:ss'),
                              U_IDU_DateTime: moment(new Date()).format('YYYY-MM-DD'),
                              U_IDU_NoOpportunity: $rootScope.noOpp,
                              U_IDU_User: $rootScope.username,
                              U_IDU_Comments: $scope.data.comment
                          }, { headers: headers }).then(function (res) {
                              if (typeof res.data.error != 'undefined') {
                                  alert(JSON.stringify(res.data.error));
                              } else {
                                  $cordovaToast.show('Comment Saved', 'long', 'center');
                                  refreshComment();
                              }
                              $ionicLoading.hide();
                          }, function (err) {
                              alert(JSON.stringify(err));
                              $ionicLoading.hide();
                          })
                      }
                  }
              }
            ]
        });

        //commentPopup.then(function (res) {
        //    console.log('Tapped!', res);
        //});

        $timeout(function () {
            commentPopup.close(); //close the popup after 3 seconds for some reason
        }, 5000);

    };

    function refreshComment() {
        var link = rootLink + 'oComment?opprid=' + $rootScope.noOpp;
        $http.get(link, { headers: headers }).then(function (res) {
            $scope.comments = res.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert('Error load Comment');
        })
    }

    $scope.addReason = function () {
        $scope.reasonData = {};

        // An elaborate, custom popup
        var reasonPopup = $ionicPopup.show({
            templateUrl: 'templates/Popup/reasons.html',
            title: 'Choose a reason',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                          var idx = $scope.reasonData.reason;
                          $scope.opp.Reasons.push({
                              OpprId: $rootScope.noOpp,
                              Number: null,
                              ReasonId: $scope.oppReasons[idx].SequenceNo,
                              ReasonName: $scope.oppReasons[idx].Description
                          })       
                  }
              }
            ]
        });

        //reasonPopup.then(function (res) {
        //    var idx = $scope.reasonData.reason;
        //    $scope.opp.Reasons.push({
        //        OpprId: $rootScope.noOpp,
        //        Number: null,
        //        ReasonId: $scope.oppReasons[idx].SequenceNo,
        //        ReasonName: $scope.oppReasons[idx].Description
        //    })
        //});

        $timeout(function () {
            reasonPopup.close(); //close the popup after 3 seconds for some reason
        }, 5000);

    };

    $scope.removeReason = function (idx) {
        $scope.opp.Reasons.splice(idx, idx + 1);
    }

    $ionicModal.fromTemplateUrl('templates/Modal/stage.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalStage = modal;
    });

    $scope.openStage = function (type) {
        if (type == 'new') {
            $scope.title = 'Add Stage';
            $scope.stage = {
                OpenDate: moment(new Date()).format('YYYY-MM-DD'),
                CloseDate: moment(new Date()).format('YYYY-MM-DD'),
                SlpCode: $rootScope.slpID,
                SlpName: $rootScope.firstName,
                Step_Id: null,
                Step_IdName: null,
                ClosePrcnt: null,
                MaxSumLoc: 0,
                WtSumLoc: 0,
                ObjId: null,
                ObjType: null,
                ObjTypeName: null,
                DocNumber: null,
                OpprId: null,
                LineNum: -1,
                Status: "O",
                Activities: []
            }
            $scope.closeStDate = new Date();;
            $scope.closeStDateF = moment(new Date()).format('DD MMM YYYY');

        } else {
            var lineNum = $scope.opp.Stages.length - 1;
            $scope.title = 'Update Stage';
            $scope.stage = {
                OpenDate: $scope.opp.Stages[lineNum].OpenDate,
                CloseDate: $scope.opp.Stages[lineNum].CloseDate,
                SlpCode: $scope.opp.Stages[lineNum].SlpCode,
                SlpName: $scope.opp.Stages[lineNum].SlpName,
                Step_Id: $scope.opp.Stages[lineNum].Step_Id.toString(),
                Step_IdName: $scope.opp.Stages[lineNum].Step_IdName,
                ClosePrcnt: $scope.opp.Stages[lineNum].ClosePrcnt,
                MaxSumLoc: $scope.opp.Stages[lineNum].MaxSumLoc,
                WtSumLoc: $scope.opp.Stages[lineNum].WtSumLoc,
                ObjId: $scope.opp.Stages[lineNum].ObjId,
                ObjType: $scope.opp.Stages[lineNum].ObjType,
                ObjTypeName: $scope.opp.Stages[lineNum].ObjTypeName,
                DocNumber: $scope.opp.Stages[lineNum].DocNumber,
                OpprId: $scope.opp.Stages[lineNum].OpprId,
                LineNum: $scope.opp.Stages[lineNum].LineNum,
                Status: $scope.opp.Stages[lineNum].Status,
                Activities: []
            }
            $scope.closeStDate = new Date($scope.stage.CloseDate);
            $scope.closeStDateF = moment($scope.closeStDate).format('DD MMM YYYY');
        }
        $scope.modalStage.show();
    }

    $scope.closeStageModal = function () {
        $scope.modalStage.hide();
    }

    $scope.changeStage = function (num) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load stage...'
        });
        var link = rootLink + 'oSalesStage/' + num;
        $http.get(link, { headers: headers }).then(function (res) {
            $scope.stage.ClosePrcnt = res.data.ClosingPercentage;
            $scope.stage.MaxSumLoc = $scope.opp.Potential.MaxSumLoc;
            $scope.countWtSumLoc();
            $ionicLoading.hide();
        }, function (err) {
            alert(JSON.stringify(err));
            $ionicLoading.hide();
        })
    }

    $scope.countWtSumLoc = function () {
        if ($scope.stage.ClosePrcnt > 0)
            $scope.stage.WtSumLoc = $scope.stage.ClosePrcnt / 100 * $scope.stage.MaxSumLoc;
    }

    $scope.saveStage = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving stage...'
        });
        var link = rootLink + 'oSalesOpportunities/' + $rootScope.noOpp;
        $http.put(link, {
            Stages: [{
                OpenDate: $scope.stage.OpenDate,
                CloseDate: $scope.stage.CloseDate,
                SlpCode: $scope.stage.SlpCode,
                SlpName: $scope.stage.SlpName,
                Step_Id: $scope.stage.Step_Id,
                Step_IdName: $scope.stage.Step_IdName,
                ClosePrcnt: $scope.stage.ClosePrcnt,
                MaxSumLoc: $scope.stage.MaxSumLoc,
                WtSumLoc: $scope.stage.WtSumLoc,
                ObjId: $scope.stage.ObjId,
                ObjType: $scope.stage.ObjType,
                ObjTypeName: $scope.stage.ObjTypeName,
                DocNumber: $scope.stage.DocNumber,
                OpprId: $scope.stage.OpprId,
                LineNum: $scope.stage.LineNum,
                Status: $scope.stage.Status,
                Activities: []

            }],
            Attachments: $scope.attachments
        },
            { headers: headers }).then(function (res) {
                if (typeof res.data.error != 'undefined') {
                    alert(JSON.stringify(res.data.error));
                } else {
                    var lineNum = 0;
                    if ($scope.title == 'Add Stage') {
                        $scope.stages.push({
                            OpenDate: $scope.stage.OpenDate,
                            CloseDate: $scope.stage.CloseDate,
                            SlpCode: $scope.stage.SlpCode,
                            SlpName: $scope.stage.SlpName,
                            Step_Id: $scope.stage.Step_Id,
                            Step_IdName: $scope.stage.Step_IdName,
                            ClosePrcnt: $scope.stage.ClosePrcnt,
                            MaxSumLoc: $scope.stage.MaxSumLoc,
                            WtSumLoc: $scope.stage.WtSumLoc,
                            ObjId: $scope.stage.ObjId,
                            ObjType: $scope.stage.ObjType,
                            ObjTypeName: $scope.stage.ObjTypeName,
                            DocNumber: $scope.stage.DocNumber,
                            OpprId: $scope.stage.OpprId,
                            LineNum: $scope.stage.LineNum,
                            Status: $scope.stage.Status,
                            Activities: []
                        });
                        //$location.path('/tabsOpp/opportunity');
                        //loadData();
                    } else {
                        lineNum = $scope.stage.LineNum;
                    }
                    
                    var noNotif = 'Opp' + $rootScope.noOpp + '-' + lineNum;
                    link = rootLink + 'oNotification';
                    $http.post(link, {
                        Code: noNotif,
                        Name: noNotif,
                        U_IDU_User: $rootScope.username,
                        U_IDU_Tgl: $scope.opp.StartDate,
                        U_IDU_Title: 'Stages Opportunity',
                        U_IDU_Ket: $scope.opp.OpportunityName+', '+$rootScope.noOpp,
                        U_IDU_JenisTransaksi: "Opportunity",
                        U_IDU_NoTransaksi: $rootScope.noOpp,
                        U_IDU_Flag: 0,
                        U_IDU_Tempat: $scope.opp.CardName,
                        U_IDU_EmpID: $rootScope.empID
                    }, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            if (res.data.error.code == -2035) {
                                link = rootLink + 'oNotification/'+noNotif;
                                $http.put(link, {
                                    Code: noNotif,
                                    Name: noNotif,
                                    U_IDU_User: $rootScope.username,
                                    U_IDU_Tgl: $scope.opp.StartDate,
                                    U_IDU_Title: 'Stages Opportunity',
                                    U_IDU_Ket: $scope.opp.OpportunityName + ', ' + $rootScope.noOpp,
                                    U_IDU_JenisTransaksi: "Opportunity",
                                    U_IDU_NoTransaksi: $rootScope.noOpp,
                                    U_IDU_Flag: 0,
                                    U_IDU_Tempat: $scope.opp.CardName,
                                    U_IDU_EmpID: $rootScope.empID
                                }, { headers: headers });
                            }
                            
                        }
                        $ionicLoading.hide();
                    }, function (err) {
                        alert('Please check your connection');
                    })  
                    $cordovaToast.show($scope.title + ' successful', 'long', 'center');
                }
                $ionicLoading.hide();
                $scope.modalStage.hide();
            }, function (err) {
                alert(JSON.stringify(err));
                $ionicLoading.hide();
            })
    }

    $ionicModal.fromTemplateUrl('templates/Modal/competitor.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalComp = modal;
    });

    $scope.openComp = function (type, line) {
        if (type == 'new') {
            $scope.title = 'Add Competitor';
            $scope.comp = {
                CompetId: null,
                CompetName: null,
                Memo: null,
                Won: 'N',
                ThreatLevl: null,
                U_IDU_Harga: null,
                OpprId: $rootScope.noOpp,
                LineNum: null
            }
        } else {
            var lineNum = line;
            $scope.title = 'Update Competitor';
            $scope.comp = {
                CompetId: $scope.compts[lineNum].CompetId,
                CompetName: $scope.compts[lineNum].CompetName,
                Memo: $scope.compts[lineNum].Memo,
                Won: $scope.compts[lineNum].Won,
                ThreatLevl: $scope.compts[lineNum].ThreatLevl,
                U_IDU_Harga: $scope.compts[lineNum].U_IDU_Harga,
                OpprId: $scope.compts[lineNum].OpprId,
                LineNum: $scope.compts[lineNum].LineNum
            }
        }

        $scope.modalComp.show();
    }

    $scope.closeCompModal = function () {
        $scope.modalComp.hide();
    }

    $scope.changeComp = function (num) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load competitor...'
        });
        var link = rootLink + 'oSalesOpportunityCompetitorSetup/' + num;
        $http.get(link, { headers: headers }).then(function (res) {
            switch (res.data.ThreatLevel) {
                case "tlLow": $scope.comp.ThreatLevl = "1";
                    break;
                case "tlMedium": $scope.comp.ThreatLevl = "2";
                    break;
                case "tlHigh": $scope.comp.ThreatLevl = "3";
                    break;
                default: $scope.comp.ThreatLevl = "1";
            }
            $scope.comp.Memo = res.data.Details;
            $ionicLoading.hide();
        }, function (err) {
            alert(JSON.stringify(err));
            $ionicLoading.hide();
        })
    }

    $scope.saveComp = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving Competitor...'
        });
        var link = rootLink + 'oSalesOpportunities/' + $rootScope.noOpp;
        $http.put(link, {
            Competitors: [{
                CompetId: $scope.comp.CompetId,
                CompetName: $scope.comp.CompetName,
                Memo: $scope.comp.Memo,
                Won: $scope.comp.Won,
                ThreatLevl: $scope.comp.ThreatLevl,
                U_IDU_Harga: $scope.comp.U_IDU_Harga,
                OpprId: $scope.comp.OpprId,
                LineNum: $scope.comp.LineNum
            }],
            Attachments: $scope.attachments
        },
            { headers: headers }).then(function (res) {
                if (typeof res.data.error != 'undefined') {
                    alert(JSON.stringify(res.data.error));
                    $ionicLoading.hide();
                } else {
                    $cordovaToast.show($scope.title + ' successful', 'long', 'center');
                    $ionicLoading.hide();
                    $scope.modalStage.hide();
                    $location.path('/tabsOpp/opportunity');
                }
                $ionicLoading.hide();
                $scope.modalStage.hide();
            }, function (err) {
                alert(JSON.stringify(err));
                $ionicLoading.hide();
            })
    }

    $ionicModal.fromTemplateUrl('templates/Modal/viewImage.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalViewImage = modal;
    });

    $scope.closeViewImageModal = function () {
        $scope.modalViewImage.hide();
    }
    $scope.viewImage = function (imgName) {
        $scope.imageName = imgName;
        $scope.attPath = 'http://192.168.0.11:82/mis/attachment/' + imgName;
        $scope.modalViewImage.show();
    }

    $scope.image = null;

    $scope.showAlert = function (title, msg) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
    };

    $scope.loadImage = function () {
        var options = {
            title: 'Select Image Source',
            buttonLabels: ['Load from Library', 'Use Camera'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
        };
        $cordovaActionSheet.show(options).then(function (btnIndex) {
            var type = null;
            if (btnIndex === 1) {
                type = Camera.PictureSourceType.PHOTOLIBRARY;
            } else if (btnIndex === 2) {
                type = Camera.PictureSourceType.CAMERA;
            }
            if (type !== null) {
                $scope.selectPicture(type);
            }
        });
    };

    $scope.selectPicture = function (sourceType) {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            allowEdit:true,
            targetHeight: 250,
            targetWidth: 250,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imagePath) {
            // Grab the file name of the photo in the temporary directory
            var currentName = imagePath.replace(/^.*[\\\/]/, '');

            //Create a new name for the photo
            var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
            $scope.fileName = n;
            // If you are trying to load image from the gallery on Android we need special treatment!
            if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                window.FilePath.resolveNativePath(imagePath, function (entry) {
                    window.resolveLocalFileSystemURL(entry, success, fail);
                    function fail(e) {
                        console.error('Error: ', e);
                    }

                    function success(fileEntry) {
                        var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                        // Only copy because of access rights
                        $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                            $scope.image = newFileName;
                            $scope.imagePath = cordova.file.dataDirectory + newFileName;
                            uploadImage($scope.imagePath);
                        }, function (error) {
                            $scope.showAlert('Error', error.exception);
                        });
                    };
                }
              );
            } else {
                var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                // Move the file to permanent storage
                $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                    $scope.image = newFileName;
                    $scope.imagePath = cordova.file.dataDirectory + newFileName;
                    uploadImage($scope.imagePath);
                }, function (error) {
                    $scope.showAlert('Error', error.exception);
                });
            }
        },
        function (err) {
            // Not always an error, maybe cancel was pressed...
        })
    };

    $scope.pathForImage = function (image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };

    function uploadImage(path) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving attachment...'
        });
        var url = 'http://192.168.0.11:82/mis/upload.php';
        var transOptions = {
            fileKey: "file",
            fileName: $scope.image,
            chunkedMode: false,
            mimeType: "image/jpg",
            params: { 'directory': 'attachment', 'fileName': $scope.image }
        };
        $cordovaFileTransfer.upload(url, path, transOptions).then(function (result) {
            var dateNow = moment(new Date()).format('YYYY-MM-DD');

            $scope.imageData = {};
            $scope.imageData.Attachments2_Lines = [];
            $scope.imageData.Attachments2_Lines.push({
                SourcePath: "E:\\xampp\\htdocs\\mis\\attachment",
                FileName: $scope.fileName,
                FileExtension: 'jpg',
                AttachmentDate: dateNow,
                UserID: null,
                Override: 'tYES'
            });
            if ($scope.attachments.length > 0) {
                var noAtt = $scope.attachments[0].AttachmentNo;
                var link = rootLink + 'oAttachment/' + noAtt;
                $http.put(link, $scope.imageData, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $scope.attachments.push({
                            AttachmentNo: noAtt,
                            FileName: $scope.image,
                            AttachmentDate: dateNow
                        });
                        $ionicLoading.hide();
                        $cordovaToast.show('Upload successful', 'long', 'center');
                    }
                }, function (err) {
                    $ionicLoading.hide();
                    alert('Please check your connection');
                })
            }
            else {
                var link = rootLink + 'oAttachment';
                $http.post(link, $scope.imageData, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        link = rootLink + 'oSalesOpportunities/' + $rootScope.noOpp;
                        $http.put(link, { Attachments: [{ AttachmentNo: res.data.AbsoluteEntry }] }, { headers: headers }).then(function () {
                            if (typeof res.data.error != 'undefined') {
                                alert(JSON.stringify(res.data.error));
                            } else {
                                $scope.attachments.push({
                                    AttachmentNo: res.data.NewEntry,
                                    FileName: $scope.image,
                                    AttachmentDate: dateNow
                                });
                                $ionicLoading.hide();
                                $cordovaToast.show('Upload successful', 'long', 'center');
                            }
                        })
                    }
                }, function (err) {
                    $ionicLoading.hide();
                    alert('Please check your connection');
                })
            }


        }, function (err) {
            $ionicLoading.hide();
            alert('Upload Error');
        })
    }

    $scope.save = function () {
        var saveOppPopup = $ionicPopup.confirm({
            title: 'Save Opportunity',
            template: 'Do you want to save this Opportunity?'
        });

        saveOppPopup.then(function (res) {
            if (res) {
                saveOpportunity();
            }
        })
    }

    function saveOpportunity() {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving data...'
        });
        $scope.opp.Status = $scope.temp.stat;
        if ($rootScope.mode == 'new') {
            var link = rootLink + 'oSalesOpportunities';
            $http.post(link, $scope.opp, { headers: headers }).then(function (res) {
                if (typeof res.data.error != 'undefined') {
                    $ionicLoading.hide();
                    alert(JSON.stringify(res.data.error));
                } else {
                    $cordovaToast.show('Data tersimpan dengan no opportunity: ' + res.data.NewEntry, 'long', 'center');
                    $location.path('/app/oppSearch');
                    $ionicLoading.hide();  
                }               
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            });

        } else {
            var link = rootLink + 'oSalesOpportunities/' + $rootScope.noOpp;
            $http.put(link, {Status:$scope.opp.Status}, { headers: headers }).then(function (res) {
                $http.put(link, $scope.opp, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $cordovaToast.show('Data telah di update', 'long', 'center');
                    }
                    $ionicLoading.hide();
                }, function (err) {
                    $ionicLoading.hide();
                    alert(JSON.stringify(err));
                });
            })
        }

    }

    $scope.goBack = function () {
        if ($rootScope.mode == 'new')
            $location.path('/app/oppSearch');
        else
            $location.path('/app/oppList');
    }

    $scope.getStartDate = function (tgl) {
        $scope.startDateF = moment(tgl).format('DD MMM YYYY');
        $scope.opp.StartDate = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getPredDate = function (tgl) {
        $scope.predDateF = moment(tgl).format('DD MMM YYYY');
        $scope.opp.PredDate = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.closeStageDate = function (tgl) {
        $scope.closeStDateF = moment(tgl).format('DD MMM YYYY');
        $scope.stage.CloseDate = moment(tgl).format('YYYY-MM-DD');
    }
});