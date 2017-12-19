angular.module('main-controllers', ['mis.services'])

.controller('AppCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $location, $cordovaLocalNotification, ClockSrv, $ionicHistory, $http, $cordovaSQLite) {
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.setDefaults({
        title: 'MIS Mobile',
        text: 'Background Mode',
        icon: 'icon', // this will look for icon.png in platforms/android/res/drawable|mipmap
        color: '6699CC', // hex format like 'F14F4D'
        resume: true,
        hidden: false,
        bigText: true
    });

    ClockSrv.startClock(function () {
        var link = rootLink + 'oNotification?user=' + $rootScope.username;
        $http.get(link, { headers: headers }).then(function (res) {
            if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                    $rootScope.notification.push({
                        Kode: res.data[i].Code,
                        UserName: res.data[i].U_IDU_User,
                        Tanggal: res.data[i].U_IDU_Tgl,
                        Title: res.data[i].U_IDU_Title,
                        Keterangan: res.data[i].U_IDU_Ket,
                        Tempat:res.data[i].U_IDU_Tempat
                    });
                    $cordovaSQLite.execute(db, 'INSERT INTO Notification(Kode, UserName, Tanggal,Title,Keterangan,Tempat) VALUES(?,?,?,?,?,?)',
                        [res.data[i].Code, res.data[i].U_IDU_User, res.data[i].U_IDU_Tgl, res.data[i].U_IDU_Title, res.data[i].U_IDU_Ket, res.data[i].U_IDU_Tempat]);
                    $cordovaLocalNotification.schedule({
                        id: res.data[i].Code,
                        title: res.data[i].U_IDU_Title,
                        text: res.data[i].U_IDU_Ket,
                        data: {
                            jenisTransaksi: '',
                            noTransaksi: ''
                        }
                    }).then(function (result) {
                        // ...
                    });

                }
            }
        })
    });

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.goToSO = function (type) {
        switch (type) {
            case 'so':
                $rootScope.isRab = false;
                $rootScope.isDraft = false;
                $rootScope.soTitle = 'Sales Order';
                break;
            case 'draft':
                $rootScope.isRab = false;
                $rootScope.isDraft = true;
                $rootScope.soTitle = 'SO Draft';
                break;
            case 'rab':
                $rootScope.isRab = true;
                $rootScope.isDraft = false;
                $rootScope.soTitle = 'RAB';
                break;
        }

        if ($rootScope.isDraft)
            $location.path('/app/salesOrderList');
        else
            $location.path('/app/salesOrderSearch');
    }

    $scope.logout = function () {
        $rootScope.isLogin = false;
        $rootScope.username = null;
        $rootScope.departemen = null;
        $rootScope.jabatan = null;
        $rootScope.empID = null;
        $rootScope.isSales = false;
        $rootScope.isTC = false;
        $rootScope.isPS = false;
        $rootScope.imgProfile = 'img/profile.png';
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $location.path('/login');
    }
})

.controller('LoginCtrl', function ($scope, $location, $rootScope, $http, $ionicLoading, $cordovaSQLite) {
    $scope.user = {};
    $scope.login = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading...'
        });
        var link = rootLink + 'oLogin';
        $http.post(link, { U_IDU_UserMobile: $scope.user.username, U_IDU_Password: $scope.user.password }, { headers: headers }).then(function (res) {
            if (res.data != null) {

                switch (res.data.Department) {
                    case 1:
                        $rootScope.isSales = false;
                        $rootScope.isTC = true;
                        $rootScope.isPS = false;
                        break;
                    case 2:
                        $rootScope.isSales = true;
                        $rootScope.isTC = false;
                        $rootScope.isPS = false;
                        break;
                    case 3:
                        $rootScope.isSales = false;
                        $rootScope.isTC = false;
                        $rootScope.isPS = true;
                        break;
                    case -2:
                        $rootScope.isSales = true;
                        $rootScope.isTC = true;
                        $rootScope.isPS = true;
                        break;
                }

                $rootScope.firstName = res.data.FirstName;
                $rootScope.lastName = res.data.LastName;


                $rootScope.username = res.data.U_IDU_UserMobile;
                $rootScope.departemen = res.data.Department;
                $rootScope.jabatan = res.data.Position;
                $rootScope.empID = res.data.EmpID;
                $rootScope.slpID = res.data.SalesPerson;
                $rootScope.isLogin = true;
                var random = (new Date()).toString();
                $rootScope.imgProfile = 'http://192.168.0.11:82/mis/attachment/' + $rootScope.username + '.jpg' + "?cb=" + random;
                $ionicLoading.hide();
                $location.path('/app/notification');
            } else {
                $ionicLoading.hide();
                alert('Wrong username or password');
            }
        }, function (err) {
            $ionicLoading.hide();
            alert('Connection failed. Please check your internet connection!');
            //alert(JSON.stringify(err));
        })

    }
})

.controller('NotificationCtrl', function ($scope, $rootScope, $cordovaSQLite, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Loading Data...'
    });
    $rootScope.notification = [];
    getNotif();
    function getNotif() {
        $cordovaSQLite.execute(db, 'SELECT * FROM Notification WHERE UserName=?', [$rootScope.username])
            .then(function (res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        $rootScope.notification.push(res.rows.item(i));
                    }
                }
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                alert(JSON.stringify(err));
            })
    }

    function refresh() {
        var lngth = $rootScope.notification.length;
        $rootScope.notification.splice(0, lngth);
        getNotif();
    }

    $scope.deleteNotif = function (Kode) {
        $cordovaSQLite.execute(db, 'DELETE FROM Notification WHERE Kode=?', [Kode])
       .then(function (res) {
           refresh();
       })
    }

    $scope.deleteAll = function () {
        $cordovaSQLite.execute(db, 'DELETE FROM Notification WHERE UserName=?', [$rootScope.username])
      .then(function (res) {
          refresh();
      })
    }
})

.controller('ScheduleCtrl', function ($scope, $rootScope, $timeout, $compile, uiCalendarConfig, $ionicLoading, $ionicPopup, $http) {


    var events = [];

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var fullMonthName = moment(date).format('MMMM');
    $scope.current = fullMonthName + ' ' + y;

    getDate = function () {
        // uiCalendarConfig.calendars['myCalendar'].fullCalendar('option', 'timezone', 'local');
        myDate = uiCalendarConfig.calendars['myCalendar'].fullCalendar('getView');
        $scope.current = myDate.title;
        $scope.eventList = getEventList();
    }

    getSchedule();

    /* event source that contains custom events on the scope */
    function getSchedule() {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Load Schedule...'
        });
        var link = rootLink + 'oSchedule?user=' + $rootScope.empID+'&position='+$rootScope.jabatan;
        $http.get(link, { headers: headers }).then(function (res) {
            events.splice(0, events.length);
            for (var i = 0; i < res.data.length; i++) {
                events.push({
                    id: res.data[i].Code,
                    title: res.data[i].U_IDU_Title,
                    start: res.data[i].U_IDU_StartDate,
                    end: res.data[i].U_IDU_EndDate,
                    allDay: false,
                    stick: true,
                    notes: res.data[i].U_IDU_Keterangan,
                    technician: res.data[i].U_IDU_User,
                    tempat:res.data[i].U_IDU_Tempat
                });
            }
            getDate();
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert(JSON.stringify(err));
        })
    }
    $scope.eventList = [];

    var getEventList = function () {
        var calendar = uiCalendarConfig.calendars['myCalendar'].fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        var listEvent = [];
        for (var i = 0; i < events.length; i++) {
            var w = new Date(events[i].start);
            var x = new Date(events[i].end);
            var y = new Date(dates.start);
            var z = new Date(dates.end);
            if ((x >= y && x <= z) || (w >= y && w <= z)) {
                listEvent.push({
                    id: events[i].id,
                    title: events[i].title,
                    start: w,
                    end: x,
                    notes: events[i].notes,
                    technician: events[i].technician,
                    tempat:events[i].tempat
                });
            }
        };
        return listEvent;
    }

    $scope.sortEvent = function (event) {
        var date = new Date(event.start);
        return date;
    };

    $scope.notOneDay = function (start, end) {
        var s = new Date(start);
        var e = new Date(end);
        if (s.getDate() == e.getDate()) {
            return false
        } else { return true }
    }
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        var alertPopup = $ionicPopup.alert({
            title: date.title,
            template: '<label style="color:black">' + date.notes + '</label><br /> \
                       <label style="color:black">User : '+ date.technician + '</label><br /> \
                       <label style="color:black">Place : '+ date.tempat + '</label>'
        });
    };

    ionic.DomUtil.ready(function () {
        getDate();
    })


    //$scope.afterRender = function (view) {
    //    if (view != null) {
    //        var calendar = uiCalendarConfig.calendars['myCalendar'].fullCalendar('getCalendar');
    //    }
    //}

    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        getDate();

    };

    $scope.today = function () {
        uiCalendarConfig.calendars['myCalendar'].fullCalendar('today');
        getDate();
    };

    $scope.prev = function () {
        uiCalendarConfig.calendars['myCalendar'].fullCalendar('prev');
        getDate();
    };

    $scope.next = function () {
        uiCalendarConfig.calendars['myCalendar'].fullCalendar('next');
        getDate();
    };



    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: false,
            ignoreTimezone: false,
            eventLimit: true,
            header: {
                left: '',
                center: '',
                right: ''

            },
            eventClick: $scope.alertOnEventClick
        }

    };

    /* event sources array*/
    $scope.eventSources = [events];

    $scope.refresh = function () {
        getSchedule();
    }

})

.controller('ProfileCtrl', function ($scope, $rootScope, $ionicPopup, $cordovaDevice, $cordovaCamera, $cordovaFileTransfer, $cordovaFile, $cordovaToast, $cordovaActionSheet, $ionicLoading,$http) {

    $scope.image = null;
    
    $scope.changePass = function () {
        $scope.data = {};
        var passPopup = $ionicPopup.show({
            templateUrl: 'templates/Popup/changePass.html',
            title: 'Change Password',
            subTitle: 'Please enter your new password',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if (!$scope.data.pass) {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } if ($scope.data.pass!=$scope.data.pass2){
                            alert ('Password not same');
                      } else {
                          $ionicLoading.show({
                              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Saving new password...'
                          });
                          var link = rootLink + 'oEmployee/' + $rootScope.empID;
                          $http.put(link, {U_IDU_Password:$scope.data.pass}, 
                            { headers: headers }).then(function (res) {
                              if (typeof res.data.error != 'undefined') {
                                  alert(JSON.stringify(res.data.error));
                              } else {
                                  $cordovaToast.show('Password has been change', 'long', 'center');
                                  
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

        $timeout(function () {
            passPopup.close(); //close the popup after 3 seconds for some reason
        }, 5000);
    }

    $scope.changePhoto = function () {
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
                selectPicture(type);
            }
        });
    };

    function selectPicture(sourceType) {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            allowEdit: true,
            targetHeight: 250,
            targetWidth: 250,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imagePath) {
            // Grab the file name of the photo in the temporary directory
            var currentName = imagePath.replace(/^.*[\\\/]/, '');

            //Create a new name for the photo
            var newFileName = $rootScope.username + ".jpg";

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
                            uploadProfile($scope.imagePath);
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
                    uploadProfile($scope.imagePath);
                }, function (error) {
                    $scope.showAlert('Error', error.exception);
                });
            }
        },
        function (err) {
            alert('Error :' + JSON.stringify(err));
        })
    };

    $scope.pathForImage = function (image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };

    function uploadProfile(path) {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Save image...'
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
                FileName: $rootScope.username,
                FileExtension: 'jpg',
                AttachmentDate: dateNow,
                UserID: null,
                Override: 'tYES'
            });
                var link = rootLink + 'oAttachment';
                $http.post(link, $scope.imageData, { headers: headers }).then(function (res) {
                    if (typeof res.data.error != 'undefined') {
                        alert(JSON.stringify(res.data.error));
                    } else {
                        link = rootLink + 'oEmployee/' + $rootScope.empID;
                        $http.put(link, {AttachmentEntry: res.data.AbsoluteEntry}, { headers: headers }).then(function (res) {
                            if (typeof res.data.error != 'undefined') {
                                alert(JSON.stringify(res.data.error));
                            } else {
                                var random = (new Date()).toString();
                                $rootScope.imgProfile = 'http://192.168.0.11:82/mis/attachment/' + $rootScope.username + '.jpg' + "?cb=" + random;
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


        }, function (err) {
            $ionicLoading.hide();
            alert('Upload Error');
        })
    }

});