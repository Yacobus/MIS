angular.module('act-controllers', [])

.controller('ActivitySearchCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    var date = new Date();
    date.setDate(date.getDate() + 14);
    $scope.start = new Date();
    $scope.end = new Date(date);
    $scope.startDate = moment($scope.start).format('DD-MMM-YYYY');
    $scope.endDate = moment($scope.end).format('DD-MMM-YYYY');
    $rootScope.startAct = moment($scope.start).format('YYYY-MM-DD');
    $rootScope.endAct = moment($scope.end).format('YYYY-MM-DD');

    $scope.getStart = function (start) {
        $scope.startDate = moment(start).format('DD-MMM-YYYY');
        $rootScope.startAct = moment(start).format('YYYY-MM-DD');
    }

    $scope.getEnd = function (end) {
        $scope.endDate = moment(end).format('DD-MMM-YYYY');
        $rootScope.endAct = moment(end).format('YYYY-MM-DD');
    }

    $scope.act = [];
    $scope.act.status = 'O';

    $scope.load = function () {
        $rootScope.statusACT = $scope.act.status;
        $location.path('/app/activityList');
    };

    $scope.newAct = function () {
        $rootScope.actMode = 'new';
        $rootScope.parentAct = 'NewActivity';
        $location.path('/tabsAct/activity');
    }
})

.controller('ActivityListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading, $stateParams) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    var link = rootLink + 'oActivity?From=' + $rootScope.startAct + '&To=' + $rootScope.endAct
                + '&user=' + $rootScope.empID + '&position=' + $rootScope.jabatan
                + '&Status=' + $rootScope.statusACT;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.activities = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (docNum) {
        $rootScope.noAct = docNum;
        $rootScope.actMode = 'view';
        $rootScope.parentAct = 'ViewActivity';
        $location.path('/tabsAct/activity');
    };
})

.controller('ActivityDetailCtrl', function ($scope, $rootScope, $location, $cordovaActionSheet, $ionicPopup, $ionicLoading,
    $http, $cordovaCamera, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $ionicModal, $cordovaToast, $cordovaGeolocation) {

    $scope.temp = [];
    //$scope.init = function () {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Initialize data...'
    });
    var loadMaster = 0;
    $scope.actAction = [{ value: 'C', text: 'Phone Call' },
        { value: 'M', text: 'Meeting' },
        { value: 'T', text: 'Task' },
        { value: 'E', text: 'Note' },
        { value: 'P', text: 'Campaign' },
        { value: 'N', text: 'Other' }];

    $scope.actPriority = [{ value: 1, display: 'Low' }, { value: 2, display: 'Normal' }, { value: 1, display: 'High' }];
    $scope.actTaskStatus = [{ value: '-3', display: 'Completed' }, { value: '-2', display: 'Not Started' }];

    $http.get(rootLink + 'oActivityType', { headers: headers }).then(function (res) {
        $scope.actType = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oEmployee', { headers: headers }).then(function (res) {
        $scope.actEmployee = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.actEmployee.push({ EmpID: res.data[i].EmpID.toString(), FirstName: res.data[i].FirstName, LastName: res.data[i].LastName });
        }
        // $scope.actEmployee = res.data;

        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oActivityLocation', { headers: headers }).then(function (res) {
        $scope.actLocation = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oState', { headers: headers }).then(function (res) {
        $scope.actState = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oCountry', { headers: headers }).then(function (res) {
        $scope.actCountry = res.data;
        loadMaster++;
        if (loadMaster == 5)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    //}

    function loadData() {


        if ($rootScope.actMode == 'new') {
            initNewActivity();
        } else {
            var link = rootLink + 'oActivity/' + $rootScope.noAct;
            $http.get(link, { headers: headers }).then(function (res) {
                $scope.getSubject(res.data[0].ContactTypeCode);
                getContact(res.data[0].CardCode);
                if (res.data[0].Inactive == 'Y')
                    $scope.temp.inactive = true;
                else
                    $scope.temp.inactive = false;

                if (res.data[0].Closed == 'Y')
                    $scope.temp.status = true;
                else
                    $scope.temp.status = false;

                $scope.tglUjiSesuai = new Date(res.data[0].U_IDU_TglUjiKesesuaian);
                $scope.tglUjiSesuaiF = moment($scope.tglUjiSesuai).format('DD MMM YYYY');
                $scope.tglUjiFungsi = new Date(res.data[0].U_IDU_TglUjiFungsi);
                $scope.tglUjiFungsiF = moment($scope.tglUjiFungsi).format('DD MMM YYYY');
                $scope.tglUjiRadiasi = new Date(res.data[0].U_IDU_TglUjiPaparan);
                $scope.tglUjiRadiasiF = moment($scope.tglUjiRadiasi).format('DD MMM YYYY');
                $scope.tglTraining = new Date(res.data[0].U_IDU_TglTraining);
                $scope.tglTrainingF = moment($scope.tglTraining).format('DD MMM YYYY');
                $scope.activity = res.data[0];
                $scope.attachments = $scope.activity.Attachments;
                $scope.statusAct = $scope.activity.Closed;
                $scope.activity.ContactTypeCode = $scope.activity.ContactTypeCode.toString();
                $scope.activity.AttendUserCode = $scope.activity.AttendUserCode.toString();
                $scope.activity.ContactSubjectCode = $scope.activity.ContactSubjectCode.toString();
                $scope.activity.TaskStatusCode = $scope.activity.TaskStatusCode.toString();
                $scope.activity.Address.LocationCode = $scope.activity.Address.LocationCode.toString();

                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
        }

    }



    $scope.getSubject = function (type) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Data Subject...'
        });
        $http.get(rootLink + 'oActivitySubject?type=' + type, { headers: headers }).then(function (res) {
            $scope.actSubject = res.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert('Connection Error');
        })
    }

    function getContact(bp) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Data Contact...'
        });
        $http.get(rootLink + 'oContactPerson?cardCode=' + bp, { headers: headers }).then(function (res) {
            $scope.actContact = res.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert('Connection Error');
        })
    }

    function initNewActivity() {
        $scope.activity = {};
        $scope.activity.OpporId = null;
        $scope.activity.OpporLine = null;
        $scope.activity.ClgCode = null;
        $scope.activity.CntctDate = null;
        $scope.activity.CntctTime = null;
        $scope.activity.Action = null;
        $scope.activity.Notes = null;
        $scope.activity.DocType = null;
        $scope.activity.DocTypeName = null;
        $scope.activity.ContactTypeCode = null;
        $scope.activity.ContactTypeName = null;
        $scope.activity.ContactSubjectCode = null;
        $scope.activity.ContactSubjectName = null;
        $scope.activity.AttendUserCode = $rootScope.empID.toString();
        $scope.activity.AttendUser = null;
        if ($rootScope.parentAct != 'NewActivity') {
            $scope.activity.CardCode = $rootScope.bpCode;
            $scope.activity.CardName = $rootScope.bpName;
            $scope.activity.U_IDU_Unit = $rootScope.itemCode;
            $scope.activity.U_IDU_UnitName = $rootScope.itemName;
            $scope.activity.U_IDU_SerialUnit = $rootScope.sn;
        } else {
            $scope.activity.CardCode = null;
            $scope.activity.CardName = null;
            $scope.activity.U_IDU_Unit = null;
            $scope.activity.U_IDU_UnitName = null;
            $scope.activity.U_IDU_SerialUnit = null;
        }

        if ($rootScope.parentAct == 'Opportunity') {
            $scope.activity.OpporId = $rootScope.noOpp;
            $scope.activity.OpporLine = $rootScope.opporLine;
        }

        $scope.activity.ContactCode = null;
        $scope.activity.ContactName = null;
        $scope.activity.Tel = null;
        $scope.activity.Details = null;
        $scope.activity.Recontact = moment(new Date()).format('YYYY-MM-DD');
        $scope.activity.EndDate = moment(new Date()).format('YYYY-MM-DD');
        $scope.activity.BeginTime = moment(new Date()).format('hh:mm');
        $scope.activity.EndTime = moment(new Date()).format('hh:mm');
        $scope.activity.Duration = null;
        $scope.activity.Priority = null;
        $scope.activity.Location = null;
        $scope.activity.TaskStatusCode = null;
        $scope.activity.TaskStatusName = null;

        $scope.activity.U_IDU_TambahanUser = null;
        $scope.activity.U_IDU_UjiFungsi = null;
        $scope.activity.U_IDU_UjiKesesuaian = null;
        $scope.activity.U_IDU_UjiPaparan = null;
        $scope.activity.U_IDU_Training = null;
        $scope.activity.U_IDU_Ruangan = null;
        $scope.activity.U_IDU_DayaListrik = null;
        $scope.activity.U_IDU_ProteksiRadiasi = null;
        $scope.activity.U_IDU_BebanCost = null;
        $scope.activity.U_IDU_Progress1 = null;
        $scope.activity.U_IDU_Progress2 = null;
        $scope.activity.U_IDU_Progress3 = null;
        $scope.activity.U_IDU_StatusProgress = null;
        $scope.activity.U_IDU_ItemRadiasi = null;
        $scope.activity.U_IDU_OtherInformation = null;
        $scope.activity.U_IDU_SertificateInstalasi = null;
        $scope.activity.U_IDU_TypeTraining = null;
        $scope.activity.U_IDU_ObjPelatihan = null;
        $scope.activity.U_IDU_SbjYgDibahas = null;
        $scope.activity.U_IDU_MasalahPelatihan = null;
        $scope.activity.U_IDU_TglUjiKesesuaian = null;
        $scope.activity.U_IDU_TglUjiFungsi = null;
        $scope.activity.U_IDU_TglUjiPaparan = null;
        $scope.activity.U_IDU_TglTraining = null;
        $scope.activity.U_IDU_Latitude = null;
        $scope.activity.U_IDU_Longitude = null;
        $scope.activity.U_IDU_Deskripsi = null;
        $scope.activity.U_IDU_LaborTime = null;
        $scope.activity.U_IDU_TravelTime = null;
        $scope.activity.U_IDU_TravelCost = null;
        $scope.activity.U_IDU_Misc = null;
        $scope.activity.U_IDU_TotalCost = null;
        $scope.activity.U_IDU_No_Request = null;

        $scope.activity.Closed = 'N';
        $scope.activity.Inactive = 'N';
        $scope.activity.Address = {};
        $scope.activity.Address.LocationCode = null;
        $scope.activity.Address.LocationName = null;
        $scope.activity.Address.Street = null;
        $scope.activity.Address.City = null;
        $scope.activity.Address.Room = null;
        $scope.activity.Address.StateCode = null;
        $scope.activity.Address.StateName = null;
        $scope.activity.Address.CountryCode = null;
        $scope.activity.Address.CountryName = null;
        $scope.activity.Attachments = [];
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
        $scope.activity.CardCode = code;
        $scope.activity.CardName = name;
        getContact(code);
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
        $scope.activity.U_IDU_Unit = code;
        $scope.activity.U_IDU_UnitName = name;
        $scope.modalFindItem.hide();
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
                        link = rootLink + 'oActivity/' + $rootScope.noAct;
                        var noAtt = res.data.AbsoluteEntry
                        $http.put(link, { Attachments: [{ AttachmentNo: res.data.AbsoluteEntry }] }, { headers: headers }).then(function () {
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

    $scope.changeStatus = function () {
        if ($scope.temp.status == true) {
            $scope.activity.Closed = 'Y';
            $scope.activity.EndDate = moment(new Date()).format('YYYY-MM-DD');
            $scope.activity.EndTime = moment(new Date()).format('hh:mm');
        } else {
            $scope.activity.Closed = 'N';
        }
    }

    $scope.changeInactive = function () {
        if ($scope.temp.inactive == true) {
            $scope.activity.Inactive = 'Y';
        } else {
            $scope.activity.Inactive = 'N';
        }
    }

    $scope.back = function () {
        if ($rootScope.parentAct == 'Opportunity') {
            $location.path('/tabsOpp/opportunity');
        } else if ($rootScope.parentAct == 'ServiceCall') {
            $location.path('/tabsSC/serviceCall-master');
        } else if ($rootScope.parentAct == 'NewActivity') {
            $location.path('/app/activitySearch');
        } else if ($rootScope.parentAct == 'ViewActivity') {
            $location.path('/app/activityList');
        }

    };

    var posOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    };

    $scope.save = function () {
        if ($scope.activity.AttendUserCode == $rootScope.empID) {
            var saveActPopup = $ionicPopup.confirm({
                title: 'Save Activity',
                template: 'Do you want to save this Activity?'
            });

            saveActPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Get your location...'
                    });
                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                        $scope.activity.U_IDU_Latitude = position.coords.latitude;
                        $scope.activity.U_IDU_Longitude = position.coords.longitude;
                        saveActivity();

                    }, function (err) {
                        $scope.activity.U_IDU_Latitude = 0;
                        $scope.activity.U_IDU_Longitude = 0;
                        saveActivity();
                    })
                }
            })
        } else {
            alert('You do not have authorize to change this activity');
        }
    }

    function saveActivity() {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving data...'
        });
        if ($rootScope.actMode == 'new') {
            var link = rootLink + 'oActivity';

            $http.post(link, $scope.activity, { headers: headers }).then(function (res) {
                if (typeof res.data.error != 'undefined') {
                    alert(JSON.stringify(res.data.error));
                } else {
                    var noAct = res.data.NewEntry;
                    var noSch = 'Act' + noAct + '-' + $rootScope.empID;           
                    var actName = null;
                    switch ($scope.activity.Action) {
                        case 'M':
                            actName = 'Meeting';
                            break;
                        case 'T':
                            actName = 'Task';
                            break;
                        case 'E':
                            actName = 'Note';
                            break;
                        case 'P':
                            actName = 'Campaign';
                            break;
                        case 'N':
                            actName = 'Other';
                            break;
                    }
                    link = rootLink + 'oSchedule';
                    $http.post(link, {
                        Code: noSch,
                        Name: noSch,
                        U_IDU_User: $rootScope.username,
                        U_IDU_StartDate: $scope.activity.Recontact + ' ' + $scope.activity.BeginTime,
                        U_IDU_EndDate: $scope.activity.EndDate + ' ' + $scope.activity.EndTime,
                        U_IDU_Title: 'Activity:'+noAct,
                        U_IDU_Keterangan: actName,
                        U_IDU_JenisTransaksi: "Activity",
                        U_IDU_NoTransaksi: noAct,
                        U_IDU_EmpID: $rootScope.empID,
                        U_IDU_Tempat: $scope.activity.CardName
                    }, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            $ionicLoading.hide();
                            alert(JSON.stringify(res.data.error));
                        } else {
                            if ($rootScope.parentAct == 'Opportunity') {
                                $location.path('/tabsOpp/opportunity');
                                $cordovaToast.show('Data tersimpan dengan no activity: ' + noAct, 'long', 'center');
                             
                            } else if ($rootScope.parentAct == 'ServiceCall') {
                                link = rootLink + 'oServiceCall/' + $rootScope.noSC;
                                $http.put(link, { Activity: [{ ClgCode: noAct }], Attachments: $rootScope.attc }, { headers: headers }).then(function (res) {
                                    if (typeof res.data.error != 'undefined') {
                                        alert(JSON.stringify(res.data.error));
                                    } else {
                                        $location.path('/tabsSC/serviceCall-master');
                                        $cordovaToast.show('Data tersimpan dengan no activity: ' + noAct, 'long', 'center');
                                    }
                                }, function (err) {
                                    $ionicLoading.hide();
                                    alert(JSON.stringify(err));
                                })
                            } else {
                                $cordovaToast.show('Data tersimpan dengan no activity: ' + noAct, 'long', 'center');
                                $location.path('/app/activitySearch');
                            }
                            $ionicLoading.hide();
                        }
                    }, function (err) {
                        alert('Please check your connection');
                    })
                    
                }
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            });

        } else {
            var link = rootLink + 'oActivity/' + $rootScope.noAct;

            $http.put(link, $scope.activity, { headers: headers }).then(function (res) {
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
        if ($scope.temp.status == true)
            $scope.statusAct = 'Y';
    }

    $scope.getTglUjiSesuai = function (tgl) {
        $scope.tglUjiSesuaiF = moment(tgl).format('DD MMM YYYY');
        $scope.activity.U_IDU_TglUjiKesesuaian = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getTglUjiFungsi = function (tgl) {
        $scope.tglUjiFungsiF = moment(tgl).format('DD MMM YYYY');
        $scope.activity.U_IDU_TglUjiFungsi = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getTglUjiRadiasi = function (tgl) {
        $scope.tglUjiRadiasiF = moment(tgl).format('DD MMM YYYY');
        $scope.activity.U_IDU_TglUjiPaparan = moment(tgl).format('YYYY-MM-DD');
    }

    $scope.getTglTraining = function (tgl) {
        $scope.tglTrainingF = moment(tgl).format('DD MMM YYYY');
        $scope.activity.U_IDU_TglTraining = moment(tgl).format('YYYY-MM-DD');
    }

});
