// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var rootLink = 'http://192.168.0.11:81/Api/';
var headers = { "Authorization": "Basic " + window.btoa("admin:admin") };
var db = null;
angular.module('mis', ['ionic', 'ngCordova', 'main-controllers', 'sc-controllers', 'act-controllers', 'opp-controllers',
    'quo-controllers','cust-controllers','complain-controllers','ec-controllers','so-controllers','slt-controllers','mis.utility', 'mis.routes', 'mis.services', 'ui.calendar', 'ionic.rating'])

.run(function ($ionicPlatform, $cordovaSQLite, $ionicPopup) {
    $ionicPlatform.ready(function () {
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $ionicPlatform.registerBackButtonAction(function (event) {
            if (true) { // your check here
                $ionicPopup.confirm({
                    title: 'System warning',
                    template: '<label style="text-align:center">are you sure you want to exit?</label>'
                }).then(function (res) {
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
        }, 100);

        if (cordova.platformId === 'ios') {
            db = $cordovaSQLite.openDB({ name: "mis.db", iosDatabaseLocation: 'Documents' });
        } else {
            if (window.cordova) {
              cordova.plugins.diagnostic.isLocationEnabled(
                            function (e) {
                                if (e) {

                                }
                                else {
                                    alert("Please turn on gps to run this application");
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                }
                            },
                            function (e) {
                                alert('Error ' + e);
                            }
                        );
            }

            db = $cordovaSQLite.openDB({ name: "mis.db", location: 'default' });
        }

        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Notification ( Kode TEXT PRIMARY KEY, UserName TEXT, Tanggal TEXT,Title TEXT,Keterangan TEXT, Tempat TEXT)');
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS User (Username TEXT PRIMARY KEY, EmpID TEXT,FirstName TEXT, LastName TEXT PRIMARY KEY, ProfilePath TEXT DEFAULT "img/profile.png",isLogin NUMERIC DEFAULT 0)');
    });
})
