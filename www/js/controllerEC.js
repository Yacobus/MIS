angular.module('ec-controllers', [])

.controller('EquipmentCardSearchCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading, $ionicModal) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    $scope.ec = [];
    $scope.ec.empID = 'L';
    $http.get(rootLink + 'oEmployee', { headers: headers }).then(function (res) {
        $scope.ecEmployee=[];
        $scope.ecEmployee.push({ EmpID:'L' , FirstName: 'All', LastName:'' });
        for (var i = 0; i < res.data.length; i++) {
            $scope.ecEmployee.push({ EmpID: res.data[i].EmpID.toString(), FirstName: res.data[i].FirstName, LastName: res.data[i].LastName });
        }
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

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
        $scope.ec.cardCode = code;
        $scope.ec.cardName = name;
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
        $scope.ec.itemCode = code;
        $scope.ec.itemName = name;
        $scope.modalFindItem.hide();
    }

    $scope.load = function () {
        $rootScope.itemEC = $scope.ec.itemCode;
        $rootScope.cardEC = $scope.ec.cardCode;
        $rootScope.empEC = $scope.ec.empID;
        $location.path('/app/ECList');
    };

    $scope.newEC = function () {
        $rootScope.ecMode = 'new';
        $location.path('/tabsEC/EC-master');
    }
})

.controller('EquipmentCardListCtrl', function ($scope, $rootScope, $location, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading data...'
    });

    $scope.equipment = [];
    if ($rootScope.empEC == '' || $rootScope.empEC == 'L')
        var link = rootLink + 'oEquipmentCard?customer=' + $rootScope.cardEC + '&itemCode=' + $rootScope.itemEC;
    else
    var link = rootLink + 'oEquipmentCard?customer=' + $rootScope.cardEC + '&itemCode=' + $rootScope.itemEC +
                '&technician=' + $rootScope.empEC;
    $http.get(link, { headers: headers }).then(function (res) {
        $scope.equipment = res.data;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $scope.goDetail = function (ecNo) {
        $rootScope.noEC = ecNo;
        $rootScope.ecMode = 'view';
        $location.path('/tabsEC/EC-master');
    };
})

.controller('EquipmentCardCtrl', function ($scope, $rootScope, $location, $ionicSlideBoxDelegate, $http, $ionicLoading,
    $ionicModal, $ionicPopup, $cordovaToast, $cordovaCamera, $cordovaFileTransfer, $cordovaActionSheet, $cordovaDevice,
    $cordovaFile) {

    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Initialize data...'
    });
    var loadMaster = 0;

    $http.get(rootLink + 'oEmployee', { headers: headers }).then(function (res) {
        $scope.ecEmployee = [];
        for (var i = 0; i < res.data.length; i++) {
            $scope.ecEmployee.push({ EmpID: res.data[i].EmpID.toString(), FirstName: res.data[i].FirstName, LastName: res.data[i].LastName });
        }
        // $scope.actEmployee = res.data;
        loadMaster++;
        if (loadMaster == 3)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert('Please check your connection');
    })

    $http.get(rootLink + 'oState', { headers: headers }).then(function (res) {
        $scope.ecState = res.data;
        loadMaster++;
        if (loadMaster == 3)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    $http.get(rootLink + 'oCountry', { headers: headers }).then(function (res) {
        $scope.ecCountry = res.data;
        loadMaster++;
        if (loadMaster == 3)
            loadData();
    }, function (err) {
        $ionicLoading.hide();
        alert(JSON.stringify(err));
    })

    function loadData() {
        if ($rootScope.ecMode == 'new') {
            initNewEC();
        } else {
            var link = rootLink + 'oEquipmentCard/' + $rootScope.noEC;
            $http.get(link, { headers: headers }).then(function (res) {
                $scope.ec = res.data[0];
                $scope.attachments = $scope.ec.Attachments;
                getContact(res.data.CustomerCode);
                $scope.ec.TechnicianCode = $scope.ec.TechnicianCode.toString();
                $scope.serviceCall = res.data[0].ServiceCall;
                $scope.serviceContr = res.data[0].ServiceContract;
                //$scope.transaction = res.data.ServiceTransaction;

                $scope.dataCall.totalSlide = $scope.serviceCall.length;
                $scope.dataContr.totalSlide = $scope.serviceContr.length;
                //$scope.dataTrans.totalSlide = $scope.transaction.length;

                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
        }

    }

    function initNewEC() {
        $scope.ec = {};
        //$scope.ec.BPType = 'R';
        $scope.ec.ManufSN = null;
        $scope.ec.InternalSN = null;
        $scope.ec.ItemCode = null;
        $scope.ec.Customer = null;
        $scope.ec.ContactCode= null;
        $scope.ec.TeleponNo = null;
        $scope.ec.PreviousSN = null;
        $scope.ec.NewSN = null;
        $scope.ec.TechnicianCode = $rootScope.empID.toString();;
        $scope.ec.TerritoryCode = null;
        $scope.ec.Address = {};
        $scope.ec.Address.Street = null;
        $scope.ec.Address.StreetNo = null;
        $scope.ec.Address.Building = null;
        $scope.ec.Address.Zip = null;
        $scope.ec.Address.Block = null;
        $scope.ec.Address.City = null;
        $scope.ec.Address.StateCode = null;
        $scope.ec.Address.CountryCode = null;
        $scope.ec.Address.InstallLocation = null;
        $scope.ec.Status = 'A';
        $scope.ec.Attachments = [];
        $ionicLoading.hide();
    }

    $scope.dataCall = {
        totalSlide: 0,
        slideIndex: 0
    };

    $scope.dataContr = {
        totalSlide: 0,
        slideIndex: 0
    };

    //$scope.dataTrans = {
    //    totalSlide: 0,
    //    slideIndex: 0
    //};



    var emitSlideBoxChangedCall = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataCall.totalSlide
        });
    }

    var emitSlideBoxChangedContr = function () {
        $scope.$emit('slidebox.slidechanged', {
            currentIndex: $ionicSlideBoxDelegate.currentIndex(),
            numberOfSlides: $scope.dataContr.totalSlide
        });
    }

    //var emitSlideBoxChangedTrans = function () {
    //    $scope.$emit('slidebox.slidechanged', {
    //        currentIndex: $ionicSlideBoxDelegate.currentIndex(),
    //        numberOfSlides: $scope.dataTrans.totalSlide
    //    });
    //}

    $scope.slideChangedCall = function (index) {
        if ($scope.dataCall.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataCall.slideIndex = index;
        emitSlideBoxChangedCall();
    };

    $scope.slideChangedContr = function (index) {
        if ($scope.dataContr.totalSlide == 2 && index > 1)
            index = index - 2;
        $scope.dataContr.slideIndex = index;
        emitSlideBoxChangedContr();
    };

    //$scope.slideChangedTrans = function (index) {
    //    if ($scope.dataTrans.totalSlide == 2 && index > 1) {
    //        index = index - 2;
    //    }
    //    $scope.dataTrans.slideIndex = index;
    //    emitSlideBoxChangedTrans();
    //};

    $ionicModal.fromTemplateUrl('templates/Modal/findBP2.html', {
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

    $scope.setBP = function (code, name,tCode,tName) {
        $scope.ec.Customer = code;
        $scope.ec.CustomerName = name;
        $scope.ec.TerritoryCode = tCode;
        $scope.ec.TerritoryName = tName;
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
        $scope.ec.ItemCode = code;
        $scope.ec.ItemName = name;
        $scope.modalFindItem.hide();
    }

    function getContact(bp) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Data Contact...'
        });
        $http.get(rootLink + 'oContactPerson?cardCode=' + bp, { headers: headers }).then(function (res) {
            $scope.ecContact = res.data;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert('Connection Error');
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
                        link = rootLink + 'oEquipmentCard/' + $rootScope.noEC;
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
                        }, function (err) {
                            $ionicLoading.hide();
                            alert('Please check your connection');
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
        var saveECPopup = $ionicPopup.confirm({
            title: 'Save Equipment Card',
            template: 'Do you want to save this Equipment Card?'
        });

        saveECPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving data...'
                });
                if ($rootScope.ecMode == 'new') {
                    var link = rootLink + 'oEquipmentCard';
                    $http.post(link, $scope.ec, { headers: headers }).then(function (res) {
                        if (typeof res.data.error != 'undefined') {
                            alert(JSON.stringify(res.data.error));
                        } else {
                            $cordovaToast.show('Data tersimpan dengan no equipment card: ' + res.data.NewEntry, 'long', 'center');
                            $location.path('/app/ECSearch');
                            $ionicLoading.hide();
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        alert(JSON.stringify(err));
                    });

                } else {
                    var link = rootLink + 'oEquipmentCard/' + $rootScope.noEC;
                    $http.put(link, $scope.ec, { headers: headers }).then(function (res) {
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