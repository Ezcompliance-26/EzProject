app.StoreDashboardController = function ($scope, $element, $filter, myService) {


 

    $scope.chekandredirect = function () {
        var collectionobj = {};
        collectionobj.ActionType = 10;
        collectionobj.Id = LoginId;
        var getData = myService.methode('POST', ("../RetailSection/SearchCompliance"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            $scope.LoginAs = response.data.Result[0].LoginAs; 
            if ($scope.LoginAs == 'Executer') {
                window.location.href = '/RetailSection/LicenceStatusDashboard';
            }
            $scope.$applyAsync();
        });
    }



    $scope.BindStoreStatus = function () {
        $scope.chekandredirect();
        var collectionobj = {};
        collectionobj.Action = 1;
        collectionobj.UserId = LoginId;
        collectionobj.StartDate = $('#StorestartDate').val();
        collectionobj.EndDate = $('#StoreendDate').val();
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            $scope.SDeactive = response.data.Result[0].Deactive;
            $scope.SActive = response.data.Result[0].Active;
            $scope.SUpcoming = response.data.Result[0].Upcoming;
            $scope.STotal = response.data.Result[0].Total;
            $scope.SDeactivePercentage = response.data.Result[0].DeactivePercentage;
            $scope.SActivePercentage = response.data.Result[0].ActivePercentage;
            $scope.SDeactivePercentage = response.data.Result[0].DeactivePercentage;
            $scope.SUpcomingPercentage = response.data.Result[0].UpcomingPercentage;
            $scope.STotalPercentage = response.data.Result[0].TotalPercentage; 
        });
    }




    $scope.BindUpcommingStatus = function () {
        var collectionobj = {};
        collectionobj.Action = 1;
        collectionobj.UserId = LoginId;
        collectionobj.StartDate = $('#UpcomingstartDate').val();
        collectionobj.EndDate = $('#UpcomingendDate').val();
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) { 
            $scope.ExectedDocument = response.data.Result[0].ExectedDocument;
            $scope.UTA = response.data.Result[0].UTA;
            $scope.TL = response.data.Result[0].TL;
            $scope.Draft = response.data.Result[0].Draft;
            $scope.Submit = response.data.Result[0].Submit;
            $scope.Applied = response.data.Result[0].Applied;
            $scope.Issued = response.data.Result[0].Issued;
            $scope.Upcoming = response.data.Result[0].Upcoming;
            $scope.TotalDaysInYear = response.data.Result[0].TotalDaysInYear;
            $scope.PerStoredays = response.data.Result[0].PerStoredays;
            $scope.PerActualStoredays = response.data.Result[0].PerActualStoredays;

           
        });
    }



    $scope.BindCircleGraphStatus = function () {
        var collectionobj = {};
        collectionobj.Action = 1;
        collectionobj.UserId = LoginId;
        collectionobj.StartDate = $('#StorestartDate').val();
        collectionobj.EndDate = $('#StoreendDate').val();
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
       
            $(".pie-unit-1").text(""); 
            $(".pie-unit-2").text(""); 
            $(".pie-unit-3").text("");
            $scope.TotalDaysInYear = response.data.Result[0].TotalDaysInYear;
            $scope.PerStoredays = response.data.Result[0].PerStoredays;
            $scope.PerActualStoredays = response.data.Result[0].PerActualStoredays;
            $scope.NUpcoming = response.data.Result[0].UpcomingPercentage ;
            var NUpcoming = $scope.NUpcoming
            var UPS = response.data.Result[0].Upcoming;
            if (UPS > 100) {
                UPSper = 0
            }
            else { UPSper = UPS}
            var NAS = response.data.Result[0].Storedays ;
            var ASD = response.data.Result[0].ActualStoredays;
            var PerStoredays = $scope.PerStoredays
            if (PerStoredays > 100) {
                PerStoredaysper = 0
            }
            else { PerStoredaysper = PerStoredays }
            var PerActualStoredays = $scope.PerActualStoredays
            if (PerActualStoredays > 100) {
                PerActualStoredaysper = 0
            }
            else { PerActualStoredaysper = PerActualStoredays }
            angular.element(document).ready(function () {
                $('#pieChart').attr('data-pie', JSON.stringify({
                    "percent": UPSper,  // dynamically set the percentage
                    "colorSlice": "#00af78",
                    "colorCircle": "#cfeae2",
                    "fontWeight": 100

                }));
             
               
                
               
                $('#pieChart1').attr('data-pie', JSON.stringify({
                    "percent": PerStoredaysper,  // dynamically set the percentage
                    "colorSlice": "#0096d1",
                    "colorCircle": "#ddf0f9",
                    "fontWeight": 100
                }));
                $('#pieChart2').attr('data-pie', JSON.stringify({
                    "percent": PerActualStoredaysper,  // dynamically set the percentage
                    "colorSlice": "#ff5a59",
                    "colorCircle": "#ffe8e8",
                    "fontWeight": 100
                }));
               
               
                setTimeout(function () {
                     $(".pie-percent-1").text(UPS);
                     $(".pie-unit-1").text("");
                    $(".pie-percent-2").text(NAS);
                    $(".pie-unit-2").text("");
                    $(".pie-percent-3").text(ASD);
                     $(".pie-unit-3").text("");

                }, 400);
                FIRESMS();
                firecode();
            });
        });
    }

    $scope.BindCircleGraphStatusHots = function () {

        var collectionobj = {
            Action: 1,
            UserId: LoginId,
            StartDate: $('#StorestartDate').val(),
            EndDate: $('#StoreendDate').val()
        };

        myService.methode(
            'POST',
            "../RetailSection/GetStoreDashboard",
            '{obj:' + JSON.stringify(collectionobj) + '}'
        ).then(function (response) {

            var data = response.data.Result[0] || {};

            var UPSper = Math.min(data.UpcomingPercentage || 0, 100);
            var PerStoredaysper = Math.min(data.PerStoredays || 0, 100);
            var PerActualStoredaysper = Math.min(data.PerActualStoredays || 0, 100);

       

                budgetedChartObj = $scope.bindDonutChart(
                    budgetedChartObj,
                    "budgetedChart",
                    UPSper,
                    100,
                    "#E45D27"
                );

                locationDaysChartObj = $scope.bindDonutChart(
                    locationDaysChartObj,
                    "locationDaysChart",
                    PerStoredaysper,
                    100,
                    "#E45D27"
                );

                actualDaysChartObj = $scope.bindDonutChart(
                    actualDaysChartObj,
                    "actualDaysChart",
                    PerActualStoredaysper,
                    100,
                    "#E45D27"
                );

           

        });
    };


    
    // ===== Chart references =====
    var budgetedChartObj = null;
    var locationDaysChartObj = null;
    var actualDaysChartObj = null;

    // ===== AngularJS Donut Binder =====
    $scope.bindDonutChart = function (chartObj, canvasId, value, total, color) {

        value = value || 0;
        total = total || 100;
        if (value > total) value = total;

        if (chartObj) {
            chartObj.destroy();
        }

        return new Chart(
            document.getElementById(canvasId),
            {
                type: "doughnut",
                data: {
                    datasets: [{
                        data: [value, total - value],
                        backgroundColor: [color, "#eee"],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: "70%",
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                }
            }
        );
    };



    $scope.DocumentHighlights = function ()
    {

        var collectionobj = {};
        collectionobj.Action = 2;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', ("../RetailSection/GetStoreDashboard"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            $scope.DocumentHighlightsList = response.data.Result; 
            
        });

        //-------------------------
    }


    $scope.DocumentNewHighlights = function () {

        var collectionobj = {};
        collectionobj.Action = 2;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', ("../RetailSection/GetStoreDashboard"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            $scope.DocumentHighlightsList = response.data.Result;
            $('#dochilight').DataTable().destroy();
            if ($.fn.DataTable.isDataTable('#dochilight')) {
                $('#dochilight').DataTable().destroy();
            } else {
                angular.element(document).ready(function () {
                    dTable = $('#dochilight')
                    deferRender = true,
                        orderClasses = false,
                        serverSide = true,
                        pagging = true,

                        dTable.DataTable({
                            searching: true,
                            dom: 'Bfrtip',
                            "ordering": false,
                            "scrollCollapse": true,
                            "info": false,
                            buttons: [
                                //'colvis',
                                {
                                    extend: 'csv',
                                    filename: 'Document Highlights',
                                    orientation: 'landscape', //portrait
                                    title: function () {
                                        var printTitle = 'Document Highlights';
                                        return printTitle
                                    },
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5]
                                    },
                                    action: function (e, dt, button, config) {
                                        $scope.ManageLog('Document Highlights csv Download');
                                        $.fn.dataTable.ext.buttons.csvHtml5.action.call(this, e, dt, button, config);
                                    }

                                },

                                'excel',
                                {
                                    extend: 'pdfHtml5',
                                    text: 'Export PDF',
                                    filename: 'Document Highlights',
                                    orientation: 'landscape', //portrait
                                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter 
                                    customize: function (doc) {
                                        doc.styles['table'] = { width: '100%' }
                                        doc.pageMargins = [20, 60, 20, 30];
                                        doc.styles.tableHeader.fontSize = 15;
                                        doc['header'] = (function () {
                                            return {
                                                columns: [
                                                    {
                                                        alignment: 'center',
                                                        fontSize: 14,
                                                        text: 'Document Highlights'
                                                    }
                                                ],
                                                margin: 40
                                            }
                                        });
                                    },
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5]
                                    },
                                    action: function (e, dt, button, config) {
                                        $scope.ManageLog('Document Highlights pdf Download');
                                        $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                                    }
                                },
                                , {
                                    extend: 'print',
                                    filename: 'Document Highlights',
                                    autoprint: false,
                                    orientation: 'landscape', //portrait
                                    title: function () {
                                        var printTitle = 'Document Highlights';
                                        return printTitle
                                    },
                                    customize: function (win) {
                                        $(win.document.body).addClass('white-bg');
                                        $(win.document.body).css('font-size', '8px');

                                        $(win.document.body).find('table')
                                            .addClass('compact')
                                            .css('font-size', '8px')
                                            .css('color', 'black');

                                    },
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5]
                                    },
                                    action: function (e, dt, button, config) {

                                        $scope.ManageLog('Document Highlights print Download');
                                        $.fn.dataTable.ext.buttons.print.action.call(this, e, dt, button, config);
                                    }
                                }
                            ],

                        });


                });
            }
        });

        //-------------------------
    }


    $scope.BindStoreDoc= function () {
        var collectionobj = {};
        collectionobj.Action = 3;
        collectionobj.UserId = LoginId;
        collectionobj.RegionId = $scope.RegionId;
        collectionobj.StateId = $scope.StateId;
        collectionobj.StoreCode = $scope.StoreCode;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) { 
            let pieChartData = response.data.Result[0];
            angular.element(document).ready(function () {
                storedoc(pieChartData.EBPER, pieChartData.RAPER, pieChartData.PTPRPER, pieChartData.BPPER, pieChartData.SSCPER, pieChartData.CCPPER, pieChartData.ADPPER);

                });
            });
    };
    // default state
    $scope.viewAll = false;
    $scope.pageSize = 10;

    // toggle function
    $scope.toggleViewRows = function () {

        $scope.viewAll = !$scope.viewAll;

        if ($scope.viewAll) {
            $scope.pageSize = $scope.totalRecords;   // View All
        } else {
            $scope.pageSize = 10;                     // View 10
        }

    };

    $scope.BindRegion = function () {
        var collectionobj = {};
        collectionobj.Action = 4;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            $scope.RegionList = response.data.Result;

        });
    };
    $scope.BindState = function () {
        var collectionobj = {};
        collectionobj.Action = 5;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            $scope.StateList = response.data.Result;
            
        });
    };
    $scope.BindStoreCode = function () {
        var collectionobj = {};
        collectionobj.Action = 6;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            $scope.StoreCodeList = response.data.Result;
             
        });
    };
    $scope.BindYear = function () {
        var collectionobj = {};
        collectionobj.Action = 8;
        collectionobj.UserId = LoginId;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            $scope.AllData = response.data.Result;
            $scope.YearList = [...new Set($scope.AllData.map(x => x.Year))];
            $scope.BindPieChartRegion();
        });
    };

    $scope.StatusText = {
        1: "Active",
        0: "Inactive",
        2: "Upcoming"
    };
    $scope.MonthText = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    };
    $scope.ResetFilter = function () {

        $scope.Year = null;
        $scope.Month = null;
        $scope.Category = null;
        $scope.Status1 = null;

        $scope.FilterData();
        $scope.BindPieChartRegion();

    };
    $scope.FilterData = function () {

        var data = $scope.AllData;

        if ($scope.Year) {
            data = data.filter(x => x.Year == $scope.Year);
        }

        if ($scope.Month) {
            data = data.filter(x => x.Month == $scope.Month);
        }

        if ($scope.Category) {
            data = data.filter(x => x.CategoryName  == $scope.Category);
        }

        if ($scope.Status1) {
            data = data.filter(x => x.Status == $scope.Status1);
        }

        // Distinct Month
        $scope.MonthList = [...new Set(data.map(x => x.Month))];

        // Distinct Category
        $scope.CategoryList = [...new Set(data.map(x => x.CategoryName))];

        // Distinct Status
        $scope.StatusList = [...new Set(data.map(x => x.Status))];
        $scope.BindPieChartRegion();

    };
    $scope.BindPieChartRegion = function () {
        var collectionobj = {};
        collectionobj.Action = 7;
        collectionobj.UserId = LoginId;
        collectionobj.Year = $scope.Year;
        collectionobj.Month = $scope.Month;
        collectionobj.Category = $scope.Category;
        collectionobj.Status = $scope.Status1;
        var getData = myService.methode('POST', "../RetailSection/GetStoreDashboard", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            $scope.PieChartRegionList = response.data.Result;
          
            let PieChartRegionList = "";
            angular.element(document).ready(function () {
                 
                $scope.CentralList = $filter('filter')($scope.PieChartRegionList, {
                    'Name': 'Central'
                });
               
                if ($scope.CentralList.length > 0) { $scope.Central = $scope.CentralList[0].RegionCount; } else { $scope.Central = ' ' ;}

                $scope.EastList = $filter('filter')($scope.PieChartRegionList, {
                    'Name': 'East'
                });
               
                if ($scope.EastList.length > 0) { $scope.East = $scope.EastList[0].RegionCount; } else { $scope.East = ' '; }

                $scope.WestList = $filter('filter')($scope.PieChartRegionList, {
                    'Name': 'West'
                });

                if ($scope.WestList.length > 0) { $scope.West = $scope.WestList[0].RegionCount; } else { $scope.West = ' '; }

                $scope.NorthList = $filter('filter')($scope.PieChartRegionList, {
                    'Name': 'North'
                });
              
                if ($scope.NorthList.length > 0) { $scope.North = $scope.NorthList[0].RegionCount; } else { $scope.North = ' '; }
                $scope.SouthList = $filter('filter')($scope.PieChartRegionList, {
                    'Name': 'South'
                }); 
                if ($scope.SouthList.length > 0) { $scope.South = $scope.SouthList[0].RegionCount; } else { $scope.South = ' '; }

                setTimeout(function () {
                    PieChartRegion($scope.East, $scope.West, $scope.North, $scope.South, $scope.Central);

                }, 1000);
            });
        });
    };
    $scope.downloadCSV = function () {
        if (!$scope.DocumentHighlightsList || !$scope.DocumentHighlightsList.length) {
            alert("No data available");
            return;
        }

        let csv = [];
        let headers = [
            "S.No",
            "Location Code",
            "Document Name",
            "Period",
            "Days to Expire",
            "Status"
        ];
        csv.push(headers.join(","));

        $scope.DocumentHighlightsList.forEach(function (item) {
            let row = [
                item.SrNo,
                item.StoreCode,
                '"' + item.DocumentType + '"',
                item.ValidDate,
                item.DayExpire,
                item.ExpiryStatus
            ];
            csv.push(row.join(","));
        });

        let csvContent = csv.join("\n");
        let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        let url = URL.createObjectURL(blob);

        let link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Location_Dashboard.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    $scope.printTable = function () {
        let table = document.getElementById("locationDashTable");
        let printWindow = window.open("", "", "height=600,width=900");

        printWindow.document.write(`
        <html>
        <head>
            <title>Print</title>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
                th { background: #f2f2f2; }
            </style>
        </head>
        <body>
            ${table.outerHTML}
        </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    $scope.LocationdownloadCSV = function () {

        if (!$scope.StoreAllList || !$scope.StoreAllList.length) {
            alert("No data available");
            return;
        }

        // Apply same filter as table
        var filteredData = $filter('filter')($scope.StoreAllList, $scope.NewsearchText);

        if (!filteredData.length) {
            alert("No filtered data available");
            return;
        }

        let csv = [];

        // Visible columns
        let visibleColumns = $scope.tblheader.filter(x => x.ShowColumn == 'Yes');

        // Header Row
        let headers = visibleColumns.map(x => '"' + x.HeaderText + '"');
        csv.push(headers.join(","));

        // Data Rows
        filteredData.forEach(function (item, index) {

            let row = [];

            visibleColumns.forEach(function (col) {

                if (col.HeaderValue == "SrNo") {
                    row.push(index + 1);
                }
                else {
                    let value = item[col.HeaderValue] || "";
                    row.push('"' + value + '"');
                }

            });

            csv.push(row.join(","));

        });

        let csvContent = csv.join("\n");

        let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        let url = URL.createObjectURL(blob);

        let link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", "Location_List.csv");

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };

    $scope.LocationprintTable = function () {

        if (!$scope.StoreAllList || !$scope.StoreAllList.length) {
            alert("No data available");
            return;
        }

        // Apply same filter as table
        var filteredData = $filter('filter')($scope.StoreAllList, $scope.NewsearchText);

        if (!filteredData.length) {
            alert("No filtered data available");
            return;
        }

        let visibleColumns = $scope.tblheader.filter(x => x.ShowColumn == 'Yes');

        let tableHTML = "<table border='1' style='width:100%;border-collapse:collapse;font-size:12px'>";

        // Header
        tableHTML += "<thead><tr>";

        visibleColumns.forEach(function (col) {
            tableHTML += "<th style='padding:6px;background:#f2f2f2'>" + col.HeaderText + "</th>";
        });

        tableHTML += "</tr></thead>";

        // Body
        tableHTML += "<tbody>";

        filteredData.forEach(function (item, index) {

            tableHTML += "<tr>";

            visibleColumns.forEach(function (col) {

                if (col.HeaderValue == "SrNo") {
                    tableHTML += "<td style='padding:6px'>" + (index + 1) + "</td>";
                }
                else {
                    let value = item[col.HeaderValue] || "";
                    tableHTML += "<td style='padding:6px'>" + value + "</td>";
                }

            });

            tableHTML += "</tr>";

        });

        tableHTML += "</tbody></table>";

        let printWindow = window.open('', '', 'height=700,width=1000');

        printWindow.document.write(`
        <html>
        <head>
            <title>  Location List</title>
            <style>
                body{font-family:Arial;margin:20px;}
                table{width:100%;border-collapse:collapse;}
                th,td{border:1px solid #000;padding:6px;text-align:left;}
                th{background:#f2f2f2;}
            </style>
        </head>
        <body>
            <h3>Store Location List</h3>
            ${tableHTML}
        </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();

    };





    $scope.GetAllBindStoreList = function () {

        var collectionobj = {
            ActionType: 4,
            Id: LoginId,
            PageNumber: 1,
            PageSize: 999999
        };

        var getData = myService.methode('POST', "../RetailSection/GetStoreMaster", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {

            $scope.StoreAllList = response.data.Result; // DATA BIND

            $scope.tblheader = [

         

                { "HeaderText": "Location Code", "HeaderValue": "StoreCode", "Width": "120px", "ShowColumn": "Yes" },

                { "HeaderText": "Ref Location Code", "HeaderValue": "RefStoreCode", "Width": "120px", "ShowColumn": "Yes" },

                { "HeaderText": "Unit Name", "HeaderValue": "StoreName", "Width": "200px", "ShowColumn": "Yes" },

                { "HeaderText": "State", "HeaderValue": "STATE_NM", "Width": "120px", "ShowColumn": "Yes" },

                { "HeaderText": "City", "HeaderValue": "CITY_NAME", "Width": "120px", "ShowColumn": "Yes" },

                { "HeaderText": "Region", "HeaderValue": "RegionName", "Width": "120px", "ShowColumn": "Yes" }, 

                { "HeaderText": "Status", "HeaderValue": "Status", "Width": "100px", "ShowColumn": "Yes" },

                { "HeaderText": "Proposed Date", "HeaderValue": "ProposedDate", "Width": "120px", "ShowColumn": "Yes" },

                { "HeaderText": "ZipCode", "HeaderValue": "ZipCode", "Width": "200px", "ShowColumn": "Yes" },

               

                { "HeaderText": "Location Manager Name", "HeaderValue": "StoreManagerName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Location Manager MobileNo", "HeaderValue": "StoreManagerMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Location ManagerEmail", "HeaderValue": "StoreManagerEmail", "Width": "200px", "ShowColumn": "Yes" },

                { "HeaderText": "Escalation level 1 Name ", "HeaderValue": "AreaManagerName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 1 MobileNo", "HeaderValue": "AreaManagerMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 1 Email", "HeaderValue": "AreaManagerEmail", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 2 Name", "HeaderValue": "ZonalManagerName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 2 MobileNo", "HeaderValue": "ZonalManagerMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 2 Email", "HeaderValue": "ZonalManagerEmail", "Width": "200px", "ShowColumn": "Yes" },
                
                { "HeaderText": "Escalation level 3 Name", "HeaderValue": "CircleHeadName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 3 MobileNo", "HeaderValue": "CircleHeadMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 3 Email", "HeaderValue": "CircleHeadEmail", "Width": "200px", "ShowColumn": "Yes" },

                { "HeaderText": "Escalation level 4 Name", "HeaderValue": "RegionalHeadName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 4 MobileNo", "HeaderValue": "RegionalHeadMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 4 Email", "HeaderValue": "RegionalHeadEmail", "Width": "200px", "ShowColumn": "Yes" },

                { "HeaderText": "Escalation level 5 Name", "HeaderValue": "CorporateHeadName", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 5 MobileNo", "HeaderValue": "CorporateHeadMobileNo", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Escalation level 5 Email", "HeaderValue": "CorporateHeadEmail", "Width": "200px", "ShowColumn": "Yes" },


                { "HeaderText": "Location Area in sq.ft.", "HeaderValue": "SQFTStoreArea", "Width": "200px", "ShowColumn": "Yes" },
                { "HeaderText": "Status", "HeaderValue": "IsActive", "Width": "200px", "ShowColumn": "Yes" },
             
                { "HeaderText": "Notify (Before Days)", "HeaderValue": "DaysOfExpire", "Width": "200px", "ShowColumn": "Yes" },


                { "HeaderText": "Reminder (Alert Days)", "HeaderValue": "LED", "Width": "200px", "ShowColumn": "Yes" },
               

                { "HeaderText": "Compliance Category", "HeaderValue": "ComplianceCategory", "Width": "150px", "ShowColumn": "Yes" },

                { "HeaderText": "Category Name", "HeaderValue": "CategoryName", "Width": "120px", "ShowColumn": "Yes" }, 
              
                { "HeaderText": "Address", "HeaderValue": "CompleteAddress", "Width": "250px", "ShowColumn": "Yes" }



            ];

        });

    };
}
   
