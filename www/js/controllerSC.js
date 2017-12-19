angular.module('sc-controllers', [])
.controller('ServiceCallSearchCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startSC = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endSC = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startSC = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endSC = moment(end).format('YYYY-MM-DD');
    }

    $scope.sc = [];
    $scope.sc.status = 'O';
    $scope.sc.assign = 'U';

    $scope.load = function () {
        $rootScope.statusSC = $scope.sc.status;
        $rootScope.assignSC = $scope.sc.assign;
        $location.path('/app/serviceCallList');
    };

})

.controller('ServiceCallListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading, $stateParams) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    $scope.serviceCall = [];
    var link = rootLink + 'oServiceCall?From=' + $rootScope.startSC + '&To=' + $rootScope.endSC + '&user='
        + $rootScope.empID + '&position=' + $rootScope.jabatan
        + '&Status=' + $rootScope.statusSC + '&Assigned=' + $rootScope.assignSC;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.serviceCall = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.getPriorityColor = function (priority, status, date) {
        if (status == -3) {
            switch (priority) {
                case 'H':
                    return "red";
                    break;
                case 'M':
                    var today = new Date();
                    var scDate = new Date(date);
                    if (scDate - today > 30) {
                        return "red";
                    } else {
                        return "yellow";
                    }
                    break;
                case 'L':
                    return "yellow";
                    break;
            }
        } else if (status == -2) {
            return "blue";
        } else {
            return "green";
        }
    };

    $scope.goDetail = function (docNum) {
        $rootScope.noSC = docNum;
        $location.path('/tabsSC/serviceCall-master');
    };
})

.controller('ServiceCallDetailCtrl', function ($scope, $rootScope, $location, $cordovaActionSheet, $ionicPopup, $ionicModal, $cordovaCamera, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $ionicSlideBoxDelegate, $ionicLoading, $http, $cordovaToast) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });
    $scope.max_stars = 5;
    var temp={};
    var link = rootLink + 'oEmployee';
    $http.get(link, { headers: headers }).then(function (res) {
        //$scope.technician=[];
        //for (var i = 0; i < res.data.length; i++) {
        //    $scope.technician.push({ EmployeeID :res.data[i].EmployeeID.toString(),FirstName:res.data[i].FirstName,LastName:res.data[i].LastName});
        //}
        $scope.technician = res.data;
        link = rootLink + 'oServiceCall/' + $rootScope.noSC;
        $http.get(link, { headers: headers }).then(function (res) {
            $scope.callStatus = [{ value: -1, display: 'Close' }, { value: -2, display: 'Pending' }, { value: -3, display: 'Open' }];
            $scope.sc = res.data[0];
            if ($scope.sc.U_IDU_CustumerScoring > 0) {
                $scope.readonly = true;
            } else {
                $scope.readonly = false;
            }
            $scope.attachments = $scope.sc.Attachments;
            $rootScope.attc = $scope.attachments;
            if ($scope.sc.TechnicianCode != null)
                $scope.sc.TechnicianCode = $scope.sc.TechnicianCode.toString();
            $scope.statusSC = $scope.sc.Status;
            $scope.sc.Status = $scope.sc.Status.toString();
            $scope.activity = res.data[0].Activity;
            $scope.solution = res.data[0].Solution;
            $scope.expenses = res.data[0].Expenses;
            $scope.schedule = res.data[0].Scheduling;
            temp.StartDate=$scope.schedule.StartDate;
            temp.StartTime=$scope.schedule.StartTime;
            temp.EndDate=$scope.schedule.EndDate;
            temp.EndTime=$scope.schedule.EndTime;
            temp.teknisi1=res.data[0].TechnicianCode;
            temp.teknisi2=res.data[0].U_IDU_Technician2;
            temp.teknisi3 = res.data[0].U_IDU_Technician3;
            temp.rating = res.data[0].U_IDU_CustumerScoring;
            $scope.startDateSchedule = new Date($scope.schedule.StartDate);
            $scope.startDateScheduleF = moment($scope.startDateSchedule).format('DD MMM YYYY');
            $scope.endDateSchedule = new Date($scope.schedule.EndDate);
            $scope.endDateScheduleF = moment($scope.endDateSchedule).format('DD MMM YYYY');
            $scope.startTimeSchedule = new Date($scope.schedule.StartDate + ' ' + $scope.schedule.StartTime);
            $scope.endTimeSchedule = new Date($scope.schedule.EndDate + ' ' + $scope.schedule.EndTime);
            $scope.Duration = parseInt($scope.schedule.Duration) + ' ' + $scope.schedule.DurationType;
            $scope.dataActivity.totalSlide = $scope.activity.length;
            $scope.dataSolution.totalSlide = $scope.solution.length;
            $scope.dataExpenses.totalSlide = $scope.expenses.length;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert(JSON.stringify(err));
        })
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })


    $scope.dataActivity = {
        totalSlide: 0,
        slideIndex: 0
    };

    $scope.dataSolution = {
        totalSlide: 0,
        slideIndex: 0
    };

    $scope.dataExpenses = {
        totalSlide: 0,
        slideIndex: 0
    };

    //$scope.data.totalSlide = $scope.activity.length;

    var emitSlideActivity = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataActivity.totalSlide
        });
    }

    var emitSlideSolution = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataSolution.totalSlide
        });
    }

    var emitSlideExpenses = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataExpenses.totalSlide
        });
    }

    $scope.slideChangedActivity = function (index) {
        if ($scope.dataActivity.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataActivity.slideIndex = index;
        emitSlideActivity();
    };

    $scope.slideChangedSolution = function (index) {
        if ($scope.dataSolution.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataSolution.slideIndex = index;
        emitSlideSolution();
    };

    $scope.slideChangedExpenses = function (index) {
        if ($scope.dataExpenses.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataExpenses.slideIndex = index;
        emitSlideExpenses();
    };

    $scope.image = null;

    $scope.showAlert = function (title, msg) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
    };

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

    $scope.loadImage = function () {
        var options = {
            title: 'Select Image Source',
            buttonLabels: ['Load from Library', 'Use Camera', 'Get Signature'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
        };
        $cordovaActionSheet.show(options).then(function (btnIndex) {
            var type = null;
            if (btnIndex === 1) {
                type = Camera.PictureSourceType.PHOTOLIBRARY;
            } else if (btnIndex === 2) {
                type = Camera.PictureSourceType.CAMERA;
            } else if (btnIndex === 3) {
                $scope.openModal();
            }
            if (type !== null) {
                $scope.selectPicture(type);
            }
        });
    };

    $scope.selectPicture = function (sourceType) {
         var options = {
            quality:100,
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

    $ionicModal.fromTemplateUrl('templates/Modal/signatureModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
        var canvas = document.getElementById('signatureCanvas');
        signaturePad = new SignaturePad(canvas);
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });


    $scope.clearCanvas = function () {
        signaturePad.clear();
    }

    $scope.saveCanvas = function () {
        var sigImg = signaturePad.toDataURL();
        $scope.imagePath = sigImg;
        $scope.image = $rootScope.noSC + 'SignSC.jpg';
        $scope.fileName = $rootScope.noSC + 'SignSC';
        $scope.modal.hide();
        uploadImage($scope.imagePath);     
    }

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
                Override: 'tNO'
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
                        link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                        var noAtt = res.data.AbsoluteEntry;
                        $http.put(link, { Attachments: [{ AttachmentNo: res.data.AbsoluteEntry }] }, { headers: headers }).then(function (res) {
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
    //$scope.add={};
    //$scope.add.iconPath = 'img/no-icon.png';

    //$scope.savePath = function (num) {
    //    $scope.add.iconPath = 'img/icon-' + num + '.png';
    //    $scope.modal.hide();
    //};

    $scope.goToActivity = function (actNum) {
        $rootScope.noAct = actNum;
        $rootScope.actMode = 'view';
        $rootScope.parentAct = 'ServiceCall';
        $location.path('/tabsAct/activity');
    };

    $scope.addActivity = function () {
        $rootScope.actMode = 'new';
        $rootScope.bpCode = $scope.sc.CustmrCode;
        $rootScope.bpName = $scope.sc.CustmrName;
        $rootScope.itemCode = $scope.sc.ItemCode;
        $rootScope.itemName = $scope.sc.ItemName;
        $rootScope.sn = $scope.sc.InternalSN;
        $rootScope.parentAct = 'ServiceCall';
        $location.path('/tabsAct/activity');
    }

    $scope.goToSolution = function (solNum) {
        $rootScope.noSol = solNum;
        $rootScope.solMode = 'view';
        $location.path('/solution');
    };

    $scope.addSolution = function () {
        $rootScope.solMode = 'new';
        $rootScope.itemCode = $scope.sc.CardCode;
        $rootScope.itemName = $scope.sc.CardName;
        $location.path('/solutionList');
    }

    $scope.updateMasterSC = function () {
        var updateMasterPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call Master Data?'
        });

        updateMasterPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving attachment...'
                });
                if ($scope.sc.Status == -1) {
                    if ($scope.solution.length > 0) {
                        updateMaster();
                        $ionicLoading.hide();
                    } else {
                        $cordovaToast.show('No solution for Service Call, can not be closed', 'long', 'center');
                        $ionicLoading.hide();
                    }
                } else {
                    updateMaster();
                    $ionicLoading.hide();
                }
            }
        })
    }

    function updateMaster() {
        var updateMasterPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call Master Data?'
        });

        updateMasterPopup.then(function (res) {
            if (res) {
                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                $http.put(link, { Status: $scope.sc.Status, U_IDU_CustumerScoring: $scope.sc.U_IDU_CustumerScoring,Attachments:$scope.attachments }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $cordovaToast.show('Service Call Master Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })

            }
        })
    }

    $scope.updateGeneralSC = function () {
        var updateGeneralPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call General Data?'
        });

        updateGeneralPopup.then(function (res) {
            if (res) {
                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                $http.put(link, {
                    TechnicianCode: $scope.sc.TechnicianCode,
                    U_IDU_Technician2: $scope.sc.U_IDU_Technician2,
                    U_IDU_Technician3: $scope.sc.U_IDU_Technician3,
                    U_IDU_TechnicianScore: $scope.sc.U_IDU_TechnicianScore,
                    U_IDU_TechnicianScore2: $scope.sc.U_IDU_TechnicianScore2,
                    U_IDU_TechnicianScore3: $scope.sc.U_IDU_TechnicianScore3,
                    Attachments:$scope.attachments
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        if (temp.teknisi1 != $scope.sc.TechnicianCode) {
                            saveSchedule($scope.sc.TechnicianCode);
                        }

                        if (temp.teknisi2 != $scope.sc.U_IDU_Technician2) {
                            saveSchedule($scope.sc.U_IDU_Technician2);
                        }

                        if (temp.teknisi3 != $scope.sc.U_IDU_Technician3) {
                            saveSchedule($scope.sc.U_IDU_Technician3);
                        }

                        if (temp.rating != $scope.sc.U_IDU_CustumerScoring) {

                            postNotification(2, 'Rate Service Call', 'No:' + $rootScope.noSC, $scope.sc.AssigneeCode, $scope.sc.AssigneeName);
                        }

                        if ($scope.sc.Status == -1) {
                            postNotification(3, 'Close Service Call', 'No:'+$rootScope.noSC, $scope.sc.AssigneeCode, $scope.sc.AssigneeName);
                        }
                        
                        
                        
                        $cordovaToast.show('Service Call General Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            }
        })
    }

    function postNotification(num,title,ket,empID,username) {
            var noNotif = 'SC'+$rootScope.noSC+'-'+empID + '-' + num;
            link = rootLink + 'oNotification';
            $http.post(link, {
                Code: noNotif,
                Name: noNotif,
                U_IDU_User: username,
                U_IDU_Tgl: $scope.schedule.StartDate + ' ' + $scope.schedule.StartTime,
                U_IDU_Title: title,
                U_IDU_Ket: ket,
                U_IDU_JenisTransaksi: "Service Call",
                U_IDU_NoTransaksi: $rootScope.noSC,
                U_IDU_Flag: 0,
                U_IDU_Tempat: $scope.sc.CustmrName,
                U_IDU_EmpID: empID
            }, { headers: headers }).then(function (res) {
                if (typeof res.data.error != 'undefined') {
                    alert(JSON.stringify(res.data.error));
                } 
            }, function (err) {
                alert('Please check your connection');
            })
    }

    $scope.updateRemarksSC = function () {
        var updateRemarksPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call Remarks Data?'
        });

        updateRemarksPopup.then(function (res) {
            if (res) {
                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                $http.put(link, {
                    Description: $scope.sc.Description,
                    Attachments:$scope.attachments
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $cordovaToast.show('Service Call Remarks Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            }
        })
    }

    $scope.updateResolutionSC = function () {
        var updateResolutionPopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call Resolution Data?'
        });

        updateResolutionPopup.then(function (res) {
            if (res) {
                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                $http.put(link, {
                    Resolution: $scope.sc.Resolution,
                    Attachments:$scope.attachments
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        $cordovaToast.show('Service Call Remarks Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            }
        })
    }

    $scope.updateScheduleSC = function () {
        var updateSchedulePopup = $ionicPopup.confirm({
            title: 'Update Service Call',
            template: 'Update Service Call Scheduling Data?'
        });

        updateSchedulePopup.then(function (res) {
            if (res) {
                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                $http.put(link, {
                    Scheduling: {
                        StartDate: $scope.schedule.StartDate,
                        StartTime: $scope.schedule.StartTime,
                        EndDate: $scope.schedule.EndDate,
                        EndTime: $scope.schedule.EndTime,                       
                    },
                    Attachments:$scope.attachments
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        if (temp.StartDate!=$scope.schedule.StartDate
                            || temp.StartTime!=$scope.schedule.StartTime
                            || temp.EndDate!=$scope.schedule.EndDate
                            || temp.EndTime!=$scope.schedule.EndTime){
                                saveSchedule($scope.sc.TechnicianCode);
                                saveSchedule($scope.sc.U_IDU_Technician2);
                                saveSchedule($scope.sc.U_IDU_Technician3);
                            } 
                        $cordovaToast.show('Service Call Scheduling Updated', 'long', 'center');
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            }
        })
    }

    function saveSchedule(empID){
        if (empID != null) {
            link = rootLink + 'oEmployee/' + empID;
            $http.get(link, { headers: headers }).then(function (res) {
                var username = res.data[0].U_IDU_UserMobile;
                var noSch = 'SC'+$rootScope.noSC + '-' + empID;
                link = rootLink + 'oSchedule';
                $http.post(link, {
                    Code: noSch,
                    Name: noSch,
                    U_IDU_User: username,
                    U_IDU_StartDate: $scope.schedule.StartDate + ' ' + $scope.schedule.StartTime,
                    U_IDU_EndDate: $scope.schedule.EndDate + ' ' + $scope.schedule.EndTime,
                    U_IDU_Title: 'New Service Call',
                    U_IDU_Keterangan: $scope.sc.ProblemName + ' ' + $scope.sc.ItemName,
                    U_IDU_JenisTransaksi: "Service Call",
                    U_IDU_NoTransaksi: $rootScope.noSC,
                    U_IDU_EmpID: empID,
                    U_IDU_Tempat: $scope.sc.CustmrName
                }, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        if (res.data.error.code == -2035) {    
                            link = rootLink + 'oSchedule/' + noSch;
                            $http.put(link, {
                                Code: noSch,
                                Name: noSch,
                                U_IDU_User: username,
                                U_IDU_StartDate: $scope.schedule.StartDate + ' ' + $scope.schedule.StartTime,
                                U_IDU_EndDate: $scope.schedule.EndDate + ' ' + $scope.schedule.EndTime,
                                U_IDU_Title: 'New Service Call',
                                U_IDU_Keterangan: $scope.sc.ProblemName + ' ' + $scope.sc.ItemName,
                                U_IDU_JenisTransaksi: "Service Call",
                                U_IDU_NoTransaksi: $rootScope.noSC,
                                U_IDU_EmpID: empID,
                                U_IDU_Tempat: $scope.sc.CustmrName
                            },
                                 { headers: headers }).then(function (res) {
                                     if (typeof res.data.error != 'undefined') {
                                         alert(JSON.stringify(res.data.error));
                                     } else {
                                         alert('Update success');
                                     }
                                 }, function (err) {
                                     alert('Please check your connection');
                                 })
                        }
                    } else {
                        link = rootLink + 'oNotification';
                        $http.post(link, {
                            Code: noSch+'-1',
                            Name: noSch + '-1',
                            U_IDU_User: username,
                            U_IDU_Tgl: $scope.schedule.StartDate + ' ' + $scope.schedule.StartTime,
                            U_IDU_Title: "New Service Call",
                            U_IDU_Ket: $scope.sc.ProblemName + ' ' + $rootScope.noSC,
                            U_IDU_JenisTransaksi: "Service Call",
                            U_IDU_NoTransaksi: $rootScope.noSC,
                            U_IDU_Flag: 0,
                            U_IDU_Tempat: $scope.sc.CustmrName,
                            U_IDU_EmpID: empID
                        }, { headers: headers }).then(function (res) {
                            if (typeof res.data.error != 'undefined') {
                                alert(JSON.stringify(res.data.error));
                            } else {
                                alert('Add Success');
                            }
                        }, function (err) {
                            alert('Please check your connection');
                        })           
                    }
                }, function (err) {
                    alert('Please check your connection');
                })
            })    
               
        }
    }

    $scope.getStartDateSchedule = function (tgl) {
        $scope.startDateScheduleF = moment(tgl).format('DD MMM YYYY');
        $scope.schedule.StartDate = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getEndDateSchedule = function (tgl) {
        $scope.endDateScheduleF = moment(tgl).format('DD MMM YYYY');
        $scope.schedule.EndDate = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getStartTimeSchedule = function (tgl) {
        $scope.schedule.StartTime = moment(tgl).format('HH:mm');
    }

    $scope.getEndTimeSchedule = function (tgl) {
        $scope.schedule.EndTime = moment(tgl).format('HH:mm');
    }
});