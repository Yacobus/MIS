angular.module('mis.routes', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.icon('ion-chevron-left');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position("top");
    //$ionicConfigProvider.views.transition('none');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/Master/login.html',
            controller: "LoginCtrl"
        })


     .state('app', {
         url: "/app",
         abstract: true,
         templateUrl: "templates/Master/menu.html",
         controller: 'AppCtrl'
     })

     .state('app.notification', {
         url: "/notification",
         cache: false,
         views: {
             'menuContent': {
                 templateUrl: "templates/Master/notification.html",
                 controller: 'NotificationCtrl'
             }
         }
     })

     .state('app.schedule', {
         url: "/schedule",
         views: {
             'menuContent': {
                 templateUrl: "templates/Master/schedule.html",
                 controller: 'ScheduleCtrl'
             }
         }
     })

     .state('app.profile', {
         url: "/profile",
         views: {
             'menuContent': {
                 templateUrl: "templates/Master/profile.html",
                 controller: 'ProfileCtrl'

             }
         }
     })

     .state('solutionList', {
         url: '/solutionList',
         cache: false,
         templateUrl: 'templates/ServiceCall/Solution/solutionList.html',
         controller: "SolutionListCtrl"
     })

    .state('solution', {
        url: '/solution',
        cache: false,
        templateUrl: 'templates/ServiceCall/Solution/solution.html',
        controller: "SolutionCtrl"
    })

    .state('app.customerSearch', {
        url: "/customerSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/Customer/customerSearch.html",
                controller: 'CustomerSearchCtrl'

            }
        }
    })

     .state('app.customerList', {
         url: "/customerList",
         views: {
             'menuContent': {
                 templateUrl: "templates/Customer/customerList.html",
                 controller: 'CustomerListCtrl'

             }
         }
     })

    .state('tabsCust', {
        url: "/tabsCust",
        abstract: true,
        cache: false,
        templateUrl: "templates/Customer/tabsCustomer.html",
        controller: 'CustomerDetailCtrl'
    })

    .state('tabsCust.customer', {
        url: "/customer",
        views: {
            'masterCust': {
                templateUrl: "templates/Customer/customer.html"

            }
        }
    })

    .state('tabsCust.customerSC', {
        url: "/cust-sc",
        views: {
            'SCCust': {
                templateUrl: "templates/Customer/cust-SC.html"
            }
        }
    })
        
    .state('app.oppSearch', {
        url: "/oppSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/Opportunity/oppSearch.html",
                controller: 'OpportunitySearchCtrl'

            }
        }
    })

    .state('app.oppList', {
        url: "/oppList",
        views: {
            'menuContent': {
                templateUrl: "templates/Opportunity/oppList.html",
                controller: 'OpportunityListCtrl'

            }
        }
    })
        
    .state('tabsOpp', {
        url: "/tabsOpp",
        abstract: true,
        cache: false,
        templateUrl: "templates/Opportunity/tabsOpp.html",
        controller: 'OpportunityDetailCtrl'
    })

    .state('tabsOpp.opportunity', {
        url: "/opportunity",
        views: {
            'masterOpp': {
                templateUrl: "templates/Opportunity/opportunity.html",

            }
        }
    })

     .state('tabsOpp.opp-potential', {
         url: "/opp-potential",
         views: {
             'potentialOpp': {
                 templateUrl: "templates/Opportunity/opp-potential.html"

             }
         }
     })

     .state('tabsOpp.opp-general', {
         url: "/opp-general",
         views: {
             'generalOpp': {
                 templateUrl: "templates/Opportunity/opp-general.html"

             }
         }
     })

     .state('tabsOpp.opp-stages', {
         url: "/opp-stages",
         views: {
             'stagesOpp': {
                 templateUrl: "templates/Opportunity/opp-stages.html"

             }
         }
     })

    .state('tabsOpp.opp-competitors', {
        url: "/opp-competitors",
        views: {
            'competitorOpp': {
                templateUrl: "templates/Opportunity/opp-competitors.html"

            }
        }
    })

    .state('tabsOpp.opp-summary', {
        url: "/opp-summary",
        views: {
            'summaryOpp': {
                templateUrl: "templates/Opportunity/opp-summary.html"

            }
        }
    })

     .state('tabsOpp.opp-attachment', {
         url: "/opp-attachment",
         views: {
             'attachmentOpp': {
                 templateUrl: "templates/Opportunity/opp-attachment.html"
             }
         }
     })

         .state('tabsOpp.opp-comment', {
             url: "/opp-comment",
             views: {
                 'commentOpp': {
                     templateUrl: "templates/Opportunity/opp-comment.html"

                 }
             }
         })

    .state('app.quotationSearch', {
        url: "/quotationSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/Quotation/quotationSearch.html",
                controller: 'QuotationSearchCtrl'

            }
        }
    })

    .state('app.quotationList', {
        url: "/quotationList",
        views: {
            'menuContent': {
                templateUrl: "templates/Quotation/quotationList.html",
                controller: 'QuotationListCtrl'

            }
        }
    })

    .state('tabsQuo', {
        url: "/:quoNum",
        abstract: true,
        cache: false,
        templateUrl: "templates/Quotation/tabsQuotation.html",
        controller: 'QuotationDetailCtrl'
    })

     .state('tabsQuo.quotation-master', {
         url: "/quotation-master",
         views: {
             'masterQuo': {
                 templateUrl: "templates/Quotation/quotation-master.html"

             }
         }
     })

     .state('tabsQuo.quotation-content', {
         url: "/quotation-content",
         views: {
             'contentQuo': {
                 templateUrl: "templates/Quotation/quotation-content.html"

             }
         }
     })

     .state('tabsQuo.quotation-detail', {
         url: "/quotation-detail",
         views: {
             'detailQuo': {
                 templateUrl: "templates/Quotation/quotation-detail.html"

             }
         }
     })

    .state('app.salesOrderSearch', {
        url: "/salesOrderSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/SalesOrder/salesOrderSearch.html",
                controller: 'SOSearchCtrl'

            }
        }
    })

    .state('app.salesOrderList', {
        url: "/salesOrderList",
        views: {
            'menuContent': {
                templateUrl: "templates/SalesOrder/salesOrderList.html",
                controller: 'SOListCtrl'

            }
        }
    })

    .state('tabsSO', {
        url: "/tabsSO",
        abstract: true,
        cache: false,
        templateUrl: "templates/SalesOrder/tabsSO.html",
        controller: 'SODetailCtrl'
    })

    .state('tabsSO.salesOrder', {
        url: "/salesOrder",
        views: {
            'masterSO': {
                templateUrl: "templates/SalesOrder/salesOrder.html"

            }
        }
    })

    .state('tabsSO.salesOrder-content', {
        url: "/salesOrder-content",
        views: {
            'contentSO': {
                templateUrl: "templates/SalesOrder/salesOrder-content.html"

            }
        }
    })

    .state('tabsSO.salesOrder-detail', {
        url: "/salesOrder-detail",
        views: {
            'detailSO': {
                templateUrl: "templates/SalesOrder/salesOrder-detail.html"

            }
        }
    })

    .state('app.serviceCallSearch', {
        url: "/serviceCallSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/ServiceCall/serviceCallSearch.html",
                controller: 'ServiceCallSearchCtrl'

            }
        }
    })

    .state('app.serviceCallList', {
        url: "/serviceCallList",
        views: {
            'menuContent': {
                templateUrl: "templates/ServiceCall/serviceCallList.html",
                controller: 'ServiceCallListCtrl'

            }
        }
    })

    .state('tabsSC', {
        url: "/tabsSC",
        abstract: true,
        cache: false,
        templateUrl: "templates/ServiceCall/tabsServiceCall.html",
        controller: 'ServiceCallDetailCtrl'
    })

    .state('tabsSC.serviceCall-master', {
        url: "/serviceCall-master",
        views: {
            'masterSC': {
                templateUrl: "templates/ServiceCall/serviceCall-master.html"

            }
        }
    })

    .state('tabsSC.serviceCall-general', {
        url: "/serviceCall-general",
        views: {
            'generalSC': {
                templateUrl: "templates/ServiceCall/serviceCall-general.html"

            }
        }
    })

    .state('tabsSC.serviceCall-businessPartner', {
        url: "/serviceCall-businessPartner",
        views: {
            'bpSC': {
                templateUrl: "templates/ServiceCall/serviceCall-businessPartner.html"

            }
        }
    })

    .state('tabsSC.serviceCall-activity', {
        url: "/serviceCall-activity",
        views: {
            'activitySC': {
                templateUrl: "templates/ServiceCall/serviceCall-activity.html"

            }
        }
    })

    .state('tabsSC.serviceCall-remarks', {
        url: "/serviceCall-remarks",
        views: {
            'remarksSC': {
                templateUrl: "templates/ServiceCall/serviceCall-remarks.html"

            }
        }
    })

    .state('tabsSC.serviceCall-solution', {
        url: "/serviceCall-solution",
        views: {
            'solutionSC': {
                templateUrl: "templates/ServiceCall/serviceCall-solution.html"

            }
        }
    })

    .state('tabsSC.serviceCall-expenses', {
        url: "/serviceCall-expenses",
        views: {
            'expensesSC': {
                templateUrl: "templates/ServiceCall/serviceCall-expenses.html"

            }
        }
    })

    .state('tabsSC.serviceCall-resolution', {
        url: "/serviceCall-resolution",
        views: {
            'resolutionSC': {
                templateUrl: "templates/ServiceCall/serviceCall-resolution.html"

            }
        }
    })

     .state('tabsSC.serviceCall-history', {
         url: "/serviceCall-history",
         views: {
             'historySC': {
                 templateUrl: "templates/ServiceCall/serviceCall-history.html"

             }
         }
     })

     .state('tabsSC.serviceCall-attachment', {
         url: "/serviceCall-attachment",
         views: {
             'attachmentSC': {
                 templateUrl: "templates/ServiceCall/serviceCall-attachment.html"

             }
         }
     })

     .state('tabsSC.serviceCall-scheduling', {
         url: "/serviceCall-scheduling",
         views: {
             'schedulingSC': {
                 templateUrl: "templates/ServiceCall/serviceCall-scheduling.html"

             }
         }
     })

     .state('app.ECSearch', {
         url: "/ECSearch",
         views: {
             'menuContent': {
                 templateUrl: "templates/EquipmentCard/ECSearch.html",
                 controller: 'EquipmentCardSearchCtrl'

             }
         }
     })

    .state('app.ECList', {
        url: "/ECList",
        views: {
            'menuContent': {
                templateUrl: "templates/EquipmentCard/ECList.html",
                controller: 'EquipmentCardListCtrl'

            }
        }
    })

    .state('tabsEC', {
        url: "/tabsEC",
        abstract: true,
        cache: false,
        templateUrl: "templates/EquipmentCard/tabsEC.html",
        controller: 'EquipmentCardCtrl'
    })

    .state('tabsEC.EC-master', {
        url: "/EC-master",
        views: {
            'masterEC': {
                templateUrl: "templates/EquipmentCard/EC-master.html"

            }
        }
    })

    .state('tabsEC.EC-address', {
        url: "/EC-address",
        views: {
            'addressEC': {
                templateUrl: "templates/EquipmentCard/EC-address.html"

            }
        }
    })

    .state('tabsEC.EC-serviceCall', {
        url: "/EC-serviceCall",
        views: {
            'serviceCallEC': {
                templateUrl: "templates/EquipmentCard/EC-serviceCall.html"

            }
        }
    })

    .state('tabsEC.EC-serviceContract', {
        url: "/EC-serviceContract",
        views: {
            'serviceContractEC': {
                templateUrl: "templates/EquipmentCard/EC-serviceContract.html"

            }
        }
    })

    .state('tabsEC.EC-transaction', {
        url: "/EC-transaction",
        views: {
            'transactionEC': {
                templateUrl: "templates/EquipmentCard/EC-transaction.html"

            }
        }
    })

    .state('tabsEC.EC-attachment', {
        url: "/EC-attachment",
        views: {
            'attachmentEC': {
                templateUrl: "templates/EquipmentCard/EC-attachment.html"

            }
        }
    })

    .state('app.activitySearch', {
        url: "/activitySearch",
        views: {
            'menuContent': {
                templateUrl: "templates/Activity/activitySearch.html",
                controller: 'ActivitySearchCtrl'

            }
        }
    })

    .state('app.activityList', {
        url: "/activityList",
        views: {
            'menuContent': {
                templateUrl: "templates/Activity/activityList.html",
                controller: 'ActivityListCtrl'

            }
        }
    })

    .state('tabsAct', {
        url: "/tabsAct",
        abstract: true,
        cache: false,
        templateUrl: "templates/Activity/tabsActivity.html",
        controller: 'ActivityDetailCtrl'
    })

    .state('tabsAct.activity', {
        url: "/activity",
        views: {
            'masterAct': {
                templateUrl: "templates/Activity/activity.html"
            }
        }
    })

     .state('tabsAct.act-general', {
         url: "/act-general",
         views: {
             'generalAct': {
                 templateUrl: "templates/Activity/act-general.html"
             }
         }
     })

     .state('tabsAct.act-content', {
         url: "/act-content",
         views: {
             'contentAct': {
                 templateUrl: "templates/Activity/act-content.html"
             }
         }
     })

    .state('tabsAct.act-additional', {
        url: "/act-additional",
        views: {
            'additionalAct': {
                templateUrl: "templates/Activity/act-additional.html"
            }
        }
    })

        .state('tabsAct.act-instalasi', {
            url: "/act-instalasi",
            views: {
                'instalasiAct': {
                    templateUrl: "templates/Activity/act-instalasi.html"
                }
            }
        })

        .state('tabsAct.act-prainstalasi', {
            url: "/act-prainstalasi",
            views: {
                'prainstalasiAct': {
                    templateUrl: "templates/Activity/act-prainstalasi.html"
                }
            }
        })

        .state('tabsAct.act-training', {
            url: "/act-training",
            views: {
                'trainingAct': {
                    templateUrl: "templates/Activity/act-training.html"
                }
            }
        })

        .state('tabsAct.act-demo', {
            url: "/act-demo",
            views: {
                'demoAct': {
                    templateUrl: "templates/Activity/act-demo.html"
                }
            }
        })

     .state('tabsAct.act-attachment', {
         url: "/act-attachment",
         views: {
             'attachmentAct': {
                 templateUrl: "templates/Activity/act-attachment.html"
             }
         }
     })

    .state('app.complainSearch', {
        url: "/complainSearch",
        views: {
            'menuContent': {
                templateUrl: "templates/Complain/complainSearch.html",
                controller: 'ComplainSearchCtrl'

            }
        }
    })

    .state('app.complainList', {
        url: "/complainList",
        views: {
            'menuContent': {
                templateUrl: "templates/Complain/complainList.html",
                controller: 'ComplainListCtrl'

            }
        }
    })

     .state('tabsComplain', {
         url: "/tabsComplain",
         abstract: true,
         cache: false,
         templateUrl: "templates/Complain/tabsComplain.html",
         controller: 'ComplainCtrl'
     })

    .state('tabsComplain.complain', {
        url: "/complain",
        views: {
            'masterComp': {
                templateUrl: "templates/Complain/complain.html"

            }
        }
    })

    .state('tabsComplain.complainSC', {
        url: "/comp-sc",
        views: {
            'SCComp': {
                templateUrl: "templates/Complain/comp-SC.html"
            }
        }
    });



    $urlRouterProvider.otherwise('/login')



});