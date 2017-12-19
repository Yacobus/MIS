angular.module('mis.utility', [])
.directive("scrollableTab", function ($compile) {
    function link($scope, element, attrs) {
        //debugger;
        $(element).find(".tab-nav.tabs a").wrapAll("<div class='allLinks'></div>");

        var myScroll = $compile("<ion-scroll class='myScroll' dir='ltr' zooming='true' direction='x' style='width: 100%; height: 50px'></ion-scroll>")($scope);

        $(element).find('.allLinks').append(myScroll);
        $(element).find(myScroll).find('.scroll').append($('.allLinks a'));
        $(element).find(myScroll).find("a")
            .wrapAll("<div class='links' style='min-width: 100%'></div>");

        $(element).on("ready", function () {
            debugger;
        });
        $(element).on('$destroy', function () {
        });

    }

    return {
        restrict: 'A',
        link: link
    }
})

.directive("scrollableTab2", function ($compile) {
    function link($scope, element, attrs) {
        //debugger;
        $(element).find(".tab-nav.tabs a").wrapAll("<div class='allLinks2'></div>");

        var myScroll = $compile("<ion-scroll class='myScroll2' dir='ltr' zooming='true' direction='x' style='width: 100%; height: 50px'></ion-scroll>")($scope);

        $(element).find('.allLinks2').append(myScroll);
        $(element).find(myScroll).find('.scroll').append($('.allLinks2 a'));
        $(element).find(myScroll).find("a")
            .wrapAll("<div class='links' style='min-width: 100%'></div>");

        $(element).on("ready", function () {
            debugger;
        });
        $(element).on('$destroy', function () {
        });

    }

    return {
        restrict: 'A',
        link: link
    }
})

.directive('appDatetime', function ($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var moment = $window.moment;

            ngModel.$formatters.push(formatter);
            ngModel.$parsers.push(parser);

            element.on('change', function (e) {
                var element = e.target;
                element.value = formatter(ngModel.$modelValue);
            });

            function parser(value) {
                var m = moment(value);
                var valid = m.isValid();
                ngModel.$setValidity('datetime', valid);
                if (valid) return m.valueOf();
                else return value;
            }

            function formatter(value) {
                var m = moment(value);
                var valid = m.isValid();
                if (valid) return m.format("DD MMM YYYY");
                else return value;

            }

        } //link
    };

})

.directive('appTime', function ($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var moment = $window.moment;

            ngModel.$formatters.push(formatter);
            ngModel.$parsers.push(parser);

            element.on('change', function (e) {
                var element = e.target;
                element.value = formatter(ngModel.$modelValue);
            });

            function parser(value) {
                var m = moment(value);
                var valid = m.isValid();
                ngModel.$setValidity('datetime', valid);
                if (valid) return m.valueOf();
                else return value;
            }

            function formatter(value) {
                var m = moment(value);
                var valid = m.isValid();
                if (valid) return m.format("hh:mm");
                else return value;

            }

        } //link
    };

})

.directive('checkImage', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                $http.get(ngSrc).success(function () {
                }).error(function () {
                    element.attr('src', 'img/profile.png'); // set default image
                });
            });
        }
    }
});