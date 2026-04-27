 
app.WithoutInvoiceController = function ($scope, $element, $filter, myService, $http) {
   



    $scope.fileChange = function (input) {
        var index = input.id.replace('fuCandidatePhoto', '');

        if (input.files && input.files[0]) {
            $scope.$apply(function () {
                $scope.InvoiceDetail[index].file = input.files[0];   // ✅ actual file
                $scope.InvoiceDetail[index].IsFile = 'Attached Invoice';
                $scope.InvoiceDetail[index].loading = false;
            });
        }
    };


    //--------------------------------------------------------
    $scope.BeforeSaveRecord = function () {

        for (var i = 0; i < $scope.InvoiceDetail.length; i++) {

            $scope.InvoiceDetail[i].StateId = $scope.StateId;

            // ✅ FILE CHECK (new OR existing)
            if (!$scope.InvoiceDetail[i].file && !$scope.InvoiceDetail[i].fileupload) {
                showMsgBox('999', 'Invoice Required',
                    'Please attach Invoice in row ' + $scope.InvoiceDetail[i].Srno +
                    ' / Invoice No: ' + $scope.InvoiceDetail[i].VendorInvNum,
                    'warning', 'btn-warning');
                return;
            }

            // ✅ DATE CHECK
            if (!$scope.InvoiceDetail[i].InvDate ||
                $scope.InvoiceDetail[i].InvDate == 'Invalid date') {

                showMsgBox('999', 'Invoice Required',
                    'Please add date in row ' + $scope.InvoiceDetail[i].Srno +
                    ' / Invoice No: ' + $scope.InvoiceDetail[i].VendorInvNum,
                    'warning', 'btn-warning');
                return;
            }

            // ✅ SPACE NOT ALLOWED
            if ($scope.InvoiceDetail[i].VendorInvNum &&
                $scope.InvoiceDetail[i].VendorInvNum.match(/\s/g)) {

                showMsgBox('999', 'Invoice Error',
                    'Invoice number cannot contain spaces (Row ' + $scope.InvoiceDetail[i].Srno + ')',
                    'warning', 'btn-warning');
                return;
            }

            // ✅ DATE FORMAT
            $scope.InvoiceDetail[i].InvDate = moment(
                $scope.InvoiceDetail[i].InvDate,
                "DD-MMM-YYYY"
            ).format('YYYY-MM-DD');
        }

        $scope.SaveInvoiceAfterValidate();
    };

    $scope.SaveInvoiceAfterValidate = function () {

        if (!$scope.ValidateInvoiceGrid()) return;

        $scope.showLoader();

        var formData = new FormData();

        // 🔥 MAIN FIELDS
        formData.append("ClientId", $scope.ClientId);
        formData.append("ClientSiteId", 'NA');
        formData.append("VendorSiteId", LoginId);
        formData.append("FYID", $scope.FyId);
        formData.append("Month", $scope.Month);
        formData.append("InvDate", $scope.InvDate);
        formData.append("CreatedBy", LoginId);
        formData.append("InvoiceId", $scope.hfId);
        formData.append("VendorId", LoginId);
        formData.append("ActionType", 1);

        // 🔥 LOOP DATA
        angular.forEach($scope.InvoiceDetail, function (item, index) {

            // ✅ FILE SEND
            if (item.file) {
                formData.append("files[" + index + "]", item.file);
            }

            // ✅ JSON SEND
            formData.append("InvoiceDetail[" + index + "]", JSON.stringify(item));
        });

        // 🔥 API CALL
        $http.post("../VenInvoice/NewInsertUpdateDelVenInvoice", formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .then(function (response) {

                if (!response.data || !response.data.Result) {
                    showMsgBox('999', 'Alert', 'Something Went Wrong', 'warning', 'btn-warning');
                } else  
                    {

                    showMsgBox('999', 'Success',
                        'Saved Successfully. Batch No: ' + response.data.Result,
                        'success', 'btn-success');
                    $scope.BindCommunication();
                    $scope.ResetInvoiceForm();
                    $scope.ClearHEADER(); 
                    $scope.FireEmail(16, response.data.Result, $scope.ClientId);
                
                }
            })
            .catch(function (err) {
                console.error("Error:", err);
                showMsgBox('999', 'Error', 'Server Error Occurred', 'danger', 'btn-danger');
            })
            .finally(function () {
                $scope.hideLoader();
            });
    };

    $scope.ClearHEADER = function () {
        $scope.freeze = false;
        $scope.IsHide = false;
        $scope.InvoiceDetail = [];
        $scope.AddInvoiceDetail();
    }
    $scope.ValidateInvoiceGrid = function () {

        for (var i = 0; i < $scope.InvoiceDetail.length; i++) {

            var row = $scope.InvoiceDetail[i];

            // reset error flags
            row.errVendorInvNum = false;
            row.errInvDate = false;
            row.errTaxable = false;
            row.errFile = false;

            // 🔴 Invoice No
            if (!row.VendorInvNum || row.VendorInvNum.trim() == '') {
                row.errVendorInvNum = true;
                showMsgBox('999', 'Validation', 'Enter Invoice No at row ' + (i + 1), 'warning', 'btn-warning');
                return false;
            }

            // 🔴 Date
            if (!row.InvDate) {
                row.errInvDate = true;
                showMsgBox('999', 'Validation', 'Select Invoice Date at row ' + (i + 1), 'warning', 'btn-warning');
                return false;
            }

            // 🔴 Taxable
            if (!row.TaxableValue || row.TaxableValue == 0) {
                row.errTaxable = true;
                showMsgBox('999', 'Validation', 'Enter Taxable Value at row ' + (i + 1), 'warning', 'btn-warning');
                return false;
            }

            // 🔴 File
            if (!row.file && !row.fileupload) {
                row.errFile = true;
                showMsgBox('999', 'Validation', 'Upload file at row ' + (i + 1), 'warning', 'btn-warning');
                return false;
            }
        }

        return true; // ✅ ALL GOOD
    };

    $scope.ResetInvoiceForm = function () {

        $scope.ClientId = '';
        $scope.FyId = '';
        $scope.Month = '';
        $scope.InvDate = '';
        $scope.hfId = '';
        $scope.Save = "Save";

        if ($scope.InvoiceDetail && $scope.InvoiceDetail.length > 0) {

            angular.forEach($scope.InvoiceDetail, function (item) {

                item.Srno = '';
                item.InvDate = '';
                item.VendorInvNum = '';
                item.StateId = '';
                item.Location = '';
                item.ManpowerType = '';
                item.ManpowerCount = '';
                item.InvoiceType = '';
                item.TaxableValue = '';
                item.CGST = '';
                item.SGST = '';
                item.IGST = '';
                item.GrossAmount = '';
                item.Status = '';

                item.file = null;
                item.fileupload = '';
                item.IsFile = '';
                item.loading = false;
            });
        }

        $scope.InvoiceDetail = [{
            Srno: 1,
            InvDate: '',
            VendorInvNum: '',
            file: null,
            fileupload: '',
            IsFile: '',
            loading: false
        }];
    };
    //----------------------------------------------

    $scope.AllPartySiteLoadWI = function () {
        var collectionobj = {};
        collectionobj.ActionType = 17;
        collectionobj.PartyID = $scope.ClientId;
        collectionobj.StateId = $scope.StateId;
        collectionobj.CreatedBy = MapId;
        var getData = myService.methode('POST', "../VenInvoice/GetVenInvoiceListDT", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            debugger;
            $scope.AllPartySiteVList = response.data;
        });
    }

  
    $scope.BindStatusInvoice = function () {
        var collectionobj = {};
        collectionobj.Action = 6;
        collectionobj.ClientId = $scope.ClientId;
        collectionobj.VendorId = MapId;
        var getData = myService.methode('POST', "../ClientActMapping/SearchClientActMapping", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (response.data.Result.length > 0) {
                if (response.data.Result[0].IStatus == 1) {
                    $scope.IWITHStatus = true;
                    $scope.TypeInvoice = "WithoutInvoice";
                }
                else {
                    $scope.IWITHStatus = false;
                    $scope.TypeInvoice = "Invoice";
                }
            }

        });
    };

    $scope.SetSingleLocation = function (WClientSiteId) {

        $scope.IsLocation = true;
        $scope.hideIsLocation = false;
        $scope.$applyAsync();
        var collectionobj = {};
        collectionobj.ActionType = 30;
        collectionobj.PartyId = WClientSiteId;
        collectionobj.CreatedBy = MapId;
        debugger;
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.LocationL = response.data.Result;
        });
    }

    $scope.ValidateWithoutInvoice = function () {
        if ($scope.ClientId == "" || $scope.ClientId == undefined) {
            showMsgBox('999', 'Warning', 'Please Select Client', 'warning', 'btn-warning')
            return;
        }
        else if ($scope.StateId == "" || $scope.StateId == undefined) {
            showMsgBox('999', 'Warning', 'Please Select State', 'warning', 'btn-warning')
            return;
        }
        else if ($scope.FyId == "" || $scope.FyId == undefined) {
            showMsgBox('999', 'Warning', 'Please Select Financial Year', 'warning', 'btn-warning')
            return;
        }
        else if ($scope.Month == "" || $scope.Month == undefined) {
            showMsgBox('999', 'Warning', 'Please Select Month', 'warning', 'btn-warning')
            return;
        }
        else if ($scope.WClientSiteId == "" || $scope.WClientSiteId == undefined) {
            showMsgBox('999', 'Warning', 'Please Select Client Site', 'warning', 'btn-warning')
            return;
        }
        else if ($scope.WLocation == "" || $scope.WLocation == undefined) {
            showMsgBox('999', 'Warning', 'Please Select Location', 'warning', 'btn-warning')
            return;
        }
        else {
           
                $scope.SAVEWithoutInvoice();
          
        }


    }

    $scope.WIBindMonth = function () {
        var collectionobj = {};
        collectionobj.Action = 2;
        collectionobj.ClientId = $scope.ClientId;
        collectionobj.VendorId = MapId;
        var getData = myService.methode('POST', ("../ClientActMapping/SearchClientActMapping"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.WIMonthList = response.data.Result;
        });
    }

    $scope.WIBindFinacialYear = function () {
        var collectionobj = {};
        collectionobj.Action = 3;
        collectionobj.ClientId = $scope.ClientId;
        collectionobj.VendorId = MapId;
        var getData = myService.methode('POST', ("../ClientActMapping/SearchClientActMapping"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.WIfinacialyearList = response.data.Result;
        });

    }

    $scope.SAVEWithoutInvoice = function () {

        $scope.showLoader();
        var collectionobj = {};
        collectionobj.ClientId = $scope.ClientId;
        collectionobj.StateID = $scope.StateId;
        collectionobj.FYID = $scope.FyId;
        collectionobj.Month = $scope.Month;
        collectionobj.CreatedBy = LoginId;
        collectionobj.TypeInvoice = $scope.TypeInvoice;
        collectionobj.ClientSiteId = $scope.WClientSiteId;
        collectionobj.Location = $scope.WLocation;
        collectionobj.ActionType = 11;
        var getData = myService.methode('POST', "../VenInvoice/InsertUpdateDelWithoutVenInvoice", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {
            let text = response.data.Result;
            const invno = text.split("|");
            if (invno == "Already Exists this Mapping") {
                showMsgBox('999', 'Alert', response.data.Result, 'warning', 'btn-warning');
            }
            else {
                showMsgBox('999', 'Alert', "Save Successfully New Unique No." + response.data.Result, 'warning', 'btn-warning');
                $scope.FireEmail(14, invno[0], $scope.ClientId);
                $scope.BindCommunication();

            }

        });
    }
  

    $scope.AllState = function () {
        $scope.CountryId = 1;
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), { "ActionType": 28, "PartyId": $scope.CountryId }); 
        getData.then(function (response) {
            debugger;
            $scope.AllStateList = response.data.Result;
        });
    }


    $scope.StateBind = function () {
        var collectionobj = {};
        collectionobj.Action = 9;
        collectionobj.UserId = $scope.ClientId;
        var getData = myService.methode('POST', ("../rating/searchrating"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.AllStateList = response.data;
        });
    }

  

    $scope.ChangeMonth = function () {
        var collectionobj = {};
        collectionobj.ActionType = 8;
        collectionobj.StartDate = ConverttoDate($scope.StartDate);
        collectionobj.EndDate = ConverttoDate($scope.EndDate);
        collectionobj.Month = $scope.Month;
        collectionobj.FYID = $scope.FyId;
        debugger;
        var getData = myService.methode('POST', ("../VenInvoice/SetINVOICEDATE"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.StartDate = response.data[0].StartDate;
            $scope.EndDate = response.data[0].EndDate;
            $scope.$applyAsync();
        });
    }
    $scope.BindFinacialYear = function () {
        var getData = myService.methode('POST', ("../VenInvoice/GetVenInvoiceListDT"), { "ActionType": 6 });
        getData.then(function (response) {
            debugger;
            $scope.finacialyearList = response.data;
        });
    }
     
 
    $scope.AllParty = function () {
        var collectionobj = {};
        collectionobj.ActionType = 6;
        collectionobj.PartyId = LoginId;
        debugger;
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), JSON.stringify(collectionobj));
        getData.then(function (response) {
            debugger;
            $scope.AllPartyList = response.data.Result;;
        });
    }
    
    $scope.ClearReset = function () {
        $scope.ClientId = "";
        $scope.StateId = "";
        $scope.FyId = "";
        $scope.Month = "";
        $scope.WClientSiteId = "";
        $scope.WLocation = "";
    }

    //-----------------------------------------------------------------vendor communication
    $scope.InvoiceList = [];
    $scope.FilteredList = [];

    // Selected values
    $scope.selectedStatus = '';
    $scope.selectedState = '';
    $scope.selectedMonth = '';
    $scope.selectedYear = '';

    // Dropdown Lists
    $scope.StatusList = [];
    $scope.StateList = [];
    $scope.MonthList = [];
    $scope.YearList = [];

    $scope.BindCommunication = function () {

        var collectionobj = {};
        collectionobj.Action = 50;
        collectionobj.Id = LoginId;

        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');

        getData.then(function (response) {

            $scope.InvoiceList = response.data;
            $scope.FilteredList = angular.copy($scope.InvoiceList);

            // Auto bind dropdowns
            $scope.StatusList = [...new Set($scope.InvoiceList.map(x => x.Status))];
            $scope.StateList = [...new Set($scope.InvoiceList.map(x => x.StateName))];
            $scope.MonthList = [...new Set($scope.InvoiceList.map(x => x.InMonthName))];
            $scope.YearList = [...new Set($scope.InvoiceList.map(x => x.FYID))];
        });
    };
    $scope.setFilter = function (type, value) {

        if (type === 'status') $scope.selectedStatus = value;
        if (type === 'state') $scope.selectedState = value;
        if (type === 'month') $scope.selectedMonth = value;
        if (type === 'year') $scope.selectedYear = value;
    };
    $scope.applyFilter = function () {

        $scope.FilteredList = $scope.InvoiceList.filter(function (x) {

            return (!$scope.selectedStatus || x.Status === $scope.selectedStatus)
                && (!$scope.selectedState || x.StateName === $scope.selectedState)
                && (!$scope.selectedMonth || x.InMonthName === $scope.selectedMonth)
                && (!$scope.selectedYear || x.FYID === $scope.selectedYear);

        });

        // Dependent dropdown update
        updateDropdowns();
    };
    function updateDropdowns() {

        let data = $scope.FilteredList;

        $scope.StatusList = [...new Set(data.map(x => x.Status))];
        $scope.StateList = [...new Set(data.map(x => x.StateName))];
        $scope.MonthList = [...new Set(data.map(x => x.InMonthName))];
        $scope.YearList = [...new Set(data.map(x => x.FYID))];
    }
    $scope.resetFilter = function () {

        $scope.selectedStatus = '';
        $scope.selectedState = '';
        $scope.selectedMonth = '';
        $scope.selectedYear = '';

        $scope.FilteredList = angular.copy($scope.InvoiceList);

        // Reset dropdowns
        $scope.StatusList = [...new Set($scope.InvoiceList.map(x => x.Status))];
        $scope.StateList = [...new Set($scope.InvoiceList.map(x => x.StateName))];
        $scope.MonthList = [...new Set($scope.InvoiceList.map(x => x.InMonthName))];
        $scope.YearList = [...new Set($scope.InvoiceList.map(x => x.FYID))];
    };
    $scope.Searchbox = '';

   
    $scope.SetValues = function (Id) {
        $scope.ComFreeze = true;
        $scope.ConversationId = Id; 
        var collectionobj = {};
        collectionobj.Action = 4;
        collectionobj.Id = Id;
        collectionobj.Updatedby = LoginId;
        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (response.data.length > 0) {
                $scope.InList = response.data; 
            }

        });
    };

    $scope.downloadAll = function () {
        $scope.selectedone = [];

        for (let i = 0; i < $scope.InDocList.length; i += 1) {
            setTimeout(function () {
                //if ($scope.InDocList[i].IsDefault == true) {
                $scope.selectedone.push($scope.InDocList[i].DocumentFile);
                $scope.id = $scope.InDocList[i].name;
                var link = document.createElement('a');
                var ext = /^.+\.([^.]+)$/.exec($scope.InDocList[i].DocumentFile);
                var extension = '';

                if (ext[1] == 'pdf') {
                    extension = '.pdf'
                    link.href = $scope.InDocList[i].DocumentFile;
                    link.download = $scope.InDocList[i].InvoiceNo + '_' + $scope.InDocList[i].DocumentName + extension;
                    link.click();
                    link.remove();

                }
                else if (ext[1] == 'jpeg') {
                    extension = '.jpeg'
                    link.href = $scope.InDocList[i].DocumentFile;
                    link.download = $scope.InDocList[i].InvoiceNo + '_' + $scope.InDocList[i].DocumentName + extension;
                    link.click();
                    link.remove();
                }

                //}
            }, i * 200);
        }

    }
    $scope.GetDocument = function (Id) {

        var collectionobj = {}; 
        collectionobj.Action = 51;
        collectionobj.Updatedby = LoginId;
        collectionobj.Id = Id;
        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (response.data.length > 0) {
                $scope.InDocList = '';
                $scope.Pendding = response.data[0].Pendding;
                $scope.Submit = response.data[0].Submit;
                $scope.Reject = response.data[0].Reject;
                $scope.NewReq = response.data[0].NewReq;
                $scope.TotalDoc = response.data[0].TotalDoc;
                $scope.IDATE = response.data[0].InvDate;
                $scope.ClientName = response.data[0].Name;
                $scope.ClientId = response.data[0].ClientId;
                $scope.Location = response.data[0].Location;
                $scope.RegInvoiceNo = response.data[0].RegInvoiceNo;
                $scope.InvoiceNo = response.data[0].InvoiceNo;
                $scope.HeaderInvoice = response.data[0].HeaderInvoice;

                $scope.DayLeft = response.data[0].DayLeft;

                if ($scope.DayLeft == "0") {
                    $('.lbldayleft').css('color', 'red');
                    $scope.DayLeft = 'Day Left : Uploading Time Expire, Please Contact to Admin';
                    $scope.TimeLeftMsg = true;

                }
                else {
                    $('.lbldayleft').css('color', 'green');
                    $scope.DayLeft = 'Last day of document submision: ' + response.data[0].WIEndDate + ' ;  Day Left :' + $scope.DayLeft;
                    $scope.TimeLeftMsg = false;
                }
                if ($scope.HeaderInvoice == "Unique No : ") {
                    $scope.WhichDate = "Created Date : ";
                }
                else {
                    $scope.WhichDate = "Invoice Date :";
                }
                $scope.ConversationId = response.data[0].ConversationId;
                $scope.InDocList = response.data;
                $scope.$applyAsync();

            }

        });
    };
    $scope.ValidateFileDoc = function (InvoiceNo, SNO, DocumentName, DocumentId, FormatFile, index, ConversationId) {
        fileName = document.querySelector('#fuCandidatePhoto1' + index).value;
        if (fileName != "") {
            extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (FormatFile == extension) {
                $scope.UploadDocument(InvoiceNo, SNO, DocumentName, DocumentId, FormatFile, index, ConversationId);
            }
            else if (FormatFile == 'image') {
                if (extension == 'jpg') {
                    $scope.UploadDocument(InvoiceNo, SNO, DocumentName, DocumentId, FormatFile, index, ConversationId);
                }
                else if (extension == 'png') {
                    $scope.UploadDocument(InvoiceNo, SNO, DocumentName, DocumentId, FormatFile, index, ConversationId);
                }
                else {
                    showMsgBox('999', 'Rejected', 'File Not Correct Format,please Upload in jpg or png format', 'warning', 'btn-warning');
                    return;
                }
            }
            else {
                showMsgBox('999', 'Rejected', 'File Not Correct Format,please Upload in ' + FormatFile + ' format', 'warning', 'btn-warning');
                return;
            }
        } else {
            showMsgBox('999', 'OOps !', 'File Not Found,Please Upload in proper way.', 'warning', 'btn-warning');
            return;
        }

    }


    $scope.UploadDocument = function (InvoiceNo, SNO, DocumentName, DocumentId, FormatFile, index, ConversationId) {
        debugger; 
        {
            $scope.showLoader();
            var collectionobj = {};


            collectionobj.InvoiceId = InvoiceNo;
            collectionobj.ConversationId = ConversationId;
            collectionobj.SNO = SNO;
            collectionobj.DocumentName = DocumentName;
            collectionobj.DocumentId = DocumentId;
            collectionobj.FileDoc = $scope.FileDoc;
            collectionobj.CreatedBy = LoginId;
            collectionobj.ActionType = 8;

            var getData = myService.methode('POST', "../VenInvoice/UploadDoc", '{obj:' + JSON.stringify(collectionobj) + '}');

            getData.then(function (response) {

                $scope.GetDocument($scope.RegInvoiceNo);
                //$scope.FireEmail(15, InvoiceNo, MapId);
                showMsgBox(response.data.Result);

            });
        }
    }

    $scope.show = function (input, imgfileid) {
        // fileName = document.querySelector(input.id).value;
        if (input.files && input.files[0]) {
            var filerdr = new FileReader();
            filerdr.onload = function (e) {
                $scope.FileDoc = e.target.result;

                $scope.$applyAsync();
            }
            filerdr.readAsDataURL(input.files[0]);
        }
        else {
            $scope.Image = '';
            $scope.$applyAsync();
        }
    };


    $scope.ChkDefaultFile = function () {
        for (var i = 0; i < $scope.InDocList.length; i++) {
            if ($scope.InDocList[i].IsUpload == '' && $scope.InDocList[i].IsDefault == true) {
                showMsgBox('999', 'Auditor Requirement', 'Please Attact Document of ' + $scope.InDocList[i].DocumentName, 'warning', 'btn-warning')
                return;
            }
        }
        $scope.SaveAuditorRecord();
    }

    $scope.SaveAuditorRecord = function () { 
        var collectionobj = {};
        collectionobj.InvoiceId = $scope.RegInvoiceNo;
        collectionobj.ClientId = $scope.ClientId;
        collectionobj.ConversationId = $scope.ConversationId;
        collectionobj.CreatedBy = LoginId;
        collectionobj.ActionType = 16
        var getData = myService.methode('POST', "../VenInvoice/ApproveUploadDoc", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            showMsgBox('999', 'Approve', response.data.Result, 'success', 'btn-success')
            $('#btnCancel').click();
            $scope.FireEmail(2, $scope.RegInvoiceNo, '');
        });
    }

    $scope.printData = function () {

        let data = $scope.FilteredList;

        if (!data || !data.length) {
            alert("No data to print");
            return;
        }

        let createdBy = "Admin"; // yaha dynamic bhi laga sakte ho (Login user)
        let generatedOn = new Date().toLocaleString();

        let html = `
    <html>
    <head>
        <title>Print</title>
        <style>
            body { font-family: Arial; }
            .header { text-align: center; margin-bottom: 10px; }
            .company { font-size: 20px; font-weight: bold; }
            .meta { font-size: 12px; margin-top: 5px; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 5px; font-size: 12px; }
            th { background: #f2f2f2; }
        </style>
    </head>
    <body>

    <div class="header">
        <div class="company">${MapUser}</div>
        <div class="meta">Created By: ${UserName}</div>
        <div class="meta">Generated On: ${generatedOn}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Party</th>
                <th>State</th>
                <th>Year</th>
                <th>Month</th>
                <th>Site</th>
                <th>Location</th>
                <th>Status</th>
                <th>Invoice</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Days</th>
            </tr>
        </thead>
        <tbody>
    `;

        data.forEach(function (item, index) {
            html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.PartyName || ''}</td>
            <td>${item.StateName || ''}</td>
            <td>${item.FYID || ''}</td>
            <td>${item.InMonthName || ''}</td>
            <td>${item.SiteName || ''}</td>
            <td>${item.Location || ''}</td>
            <td>${item.Status || ''}</td>
            <td>${item.InvoiceNo || ''}</td>
            <td>${item.CreatedOn || ''}</td>
            <td>${item.UpdatedON || ''}</td>
            <td>${item.DayLeft || ''}</td>
        </tr>`;
        });

        html += `
        </tbody>
    </table>

    </body>
    </html>
    `;

        let printWindow = window.open('', '', 'width=900,height=600');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    $scope.exportCSV = function () {

        let data = $scope.FilteredList;

        if (!data || !data.length) {
            alert("No data to export");
            return;
        }

        let csv = '';

        // Header
        csv += "Party Name,State,Year,Month,Site,Location,Status,Invoice No,Created On,Updated On,Day Left\n";

        // Rows (IMPORTANT FIX)
        data.forEach(function (item) {

            let row = [
                item.PartyName || '',
                item.StateName || '',
                item.FYID || '',
                item.InMonthName || '',
                item.SiteName || '',
                item.Location || '',
                item.Status || '',
                item.InvoiceNo || '',
                item.CreatedOn || '',
                item.UpdatedON || '',
                item.DayLeft || ''
            ];

            csv += row.join(",") + "\n";   // ✅ yaha fix hai
        });

        // Download
        let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "FilteredData.csv";
        link.click();
    };



    //-----------------------------------Client
    $scope.BindVendor = function () {
        var collectionobj = {};
        collectionobj.Action = 31;
        collectionobj.Updatedby = MapId;
        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (response.data.length > 0) {
                $scope.VendorList = response.data
            }

        });
    };

    $scope.GetClientDocument = function (Id, ConversationId) {

        $scope.ConversationId = Id;

        var collectionobj = {};
        collectionobj.Action = 37;
        collectionobj.Id = Id;
        collectionobj.Updatedby = MapId;
        collectionobj.ConversationId = ConversationId;
        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (response.data.length > 0) {
                $scope.InDocList = '';
                

                $scope.InDocList = response.data;
                $scope.$applyAsync();

            }

        });
    };

    $scope.Controlbyuser = "0";
    $scope.BindControl = function () {
        var collectionobj = {}; 
        $scope.InDocList = "";
        if ($scope.VendorId == undefined || $scope.VendorId == "" || $scope.VendorId == null) {
            collectionobj.Id = '';
        }
        else { collectionobj.Id = $scope.VendorId;}
      
        collectionobj.VendorId = $scope.Controlbyuser;
        collectionobj.Updatedby = MapId;
        collectionobj.Action = 36; 
        if ($scope.SearchCom == '' || $scope.SearchCom == 'undefined' || $scope.SearchCom == undefined) {
            $scope.SearchCom = '';
        }
        collectionobj.ConversationId = $scope.SearchCom;

        var getData = myService.methode('POST', "../Communication/GetCommunication", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            debugger;
            $scope.InvoiceList = response.data;
        });
    }
}
