app.AuditorComplianceController = function ($scope, $element, $filter, myService) {
 
    $scope.LoadData = function ()
    {
      var  trans = [];
      trans = window.location.href.slice(window.location.href.indexOf('?') + 1).split('%');
        var splitvalue = trans[0].split('|');
                       
      $scope.InvoiceNo = splitvalue[0];
        $scope.ClientId = splitvalue[1];
        $scope.Vendord = splitvalue[2];
      debugger;
     $scope.GetAuditorCompliance();
    }

    $scope.AuditorList = [];
    $scope.AuditorList.push({
        SrNo: "",
        DocId: "",
        ComplianceId: "",
        InvoiceNo: "",
        Form: "",
        ComplianceScore: "",
        ComplianceScoreAchieved: "",
        CompalianceStatus: "",
        Remark: "",
        VendorRemark: ""

    });

    $scope.SetAchievedScore=function(index)
    {
        $scope.AuditorList[index].ComplianceScoreAchieved = $scope.AuditorList[index].ComplianceScore * ($scope.AuditorList[index].CompalianceStatus) / 100;
    }

    $scope.GetAuditorCompliance = function () {
        var collectionobj = {};
        collectionobj.Action = 4;
        collectionobj.InvoiceNo = $scope.InvoiceNo;
        collectionobj.Id = $scope.ClientId;
        collectionobj.VendorId = $scope.Vendord;
        
        var getData = myService.methode('POST', "../DocumentMaster/GetAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response)
        {
            if (response.data.length > 0)
            {
                $('#btnSave').attr('style', 'display:block')
                $scope.PartyName = response.data[0].PartyName;
                $scope.VendorInvNum = response.data[0].VendorInvNum;
                $scope.TypeInvoice = response.data[0].TypeInvoice;
                $scope.InvDate = response.data[0].InvDate;
                $scope.InvoiceDate = response.data[0].InvoiceDate;
                $scope.IssueDate = response.data[0].IssueDate;
                $scope.AuditDate = response.data[0].AuditDate;
                $scope.Auditer = response.data[0].Auditer;
                $scope.SiteName = response.data[0].SiteName;
                $scope.FYID = response.data[0].FYID;
                $scope.MONTH = response.data[0].MONTH;
                $scope.ContactNo = response.data[0].ContactNo;
                $scope.Representative = response.data[0].Representative;
                $scope.Address = response.data[0].Address;
                $scope.naturework = response.data[0].naturework;
                $scope.companyName = response.data[0].companyName;
                $scope.ClientName = response.data[0].ClientName;
                $scope.StateName = response.data[0].StateName;
                $scope.Location = response.data[0].Location;
                $scope.VenderSite = response.data[0].VenderSite;
                $scope.grossAmount = response.data[0].grossAmount;
                $scope.Email = response.data[0].Email;
                $scope.DocDate = response.data[0].DocDate;
                $scope.CompanyName = response.data[0].CompanyName
                $scope.TUDC = response.data[0].TUDC;
                $scope.TDC = response.data[0].TDC;
                $scope.$applyAsync();
                var collectionobj = {};
                collectionobj.Action = 5;
                collectionobj.InvoiceNo = $scope.InvoiceNo;
                collectionobj.VendorId = $scope.Vendord;
                var getData = myService.methode('POST', "../DocumentMaster/GetAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');
                getData.then(function (response) {
                    $scope.DocList = response.data;
                    $scope.ComplianceId = response.data[0].ComplianceId;
                    $scope.TotalComplianceScore = response.data[0].TotalScoreCompliance;
                    $scope.TotalComplianceScoreAchieved = response.data[0].TotalAchievedCompliance;
                    $scope.ScorePer = response.data[0].ScorePer;
                    $scope.FinalSave = response.data[0].FinalSave;
                    $scope.AuditorQuery = response.data[0].AuditorQuery;
                    $scope.IsUploadAQ = response.data[0].IsUploadAQ;
                    $scope.IsUploadVQ = response.data[0].IsUploadVQ;
                    $scope.VendorQuery = response.data[0].VendorQuery;
                    $scope.IsUploadVENQ = response.data[0].IsUploadVENQ;
                    $scope.RejectOn = response.data[0].RejectOn;
                    $scope.ApproveOn = response.data[0].ApproveOn;
                    $scope.NotOpenforClient = loginType;
                    $scope.AuditOn = response.data[0].AuditOn;
                    $scope.Remark = response.data[0].ARemark;
                    $scope.CRM = response.data[0].CRM;
                    $scope.OpenFlag = response.data[0].IsUploadVQ ;

                    if ($scope.FinalSave == '-1')
                    {
                       $scope.DocumentStatus = 'Save Mode'
                    }
                    else if ($scope.FinalSave == '0') {
                        $scope.DocumentStatus = 'Draft Mode'
                    }
                    else if ($scope.FinalSave == '1') {
                        $scope.DocumentStatus = 'Final Submittion Mode'
                    }
                    else if ($scope.FinalSave == '2') {
                        $scope.DocumentStatus = 'Compliance Complete'
                    }
                  
                    $scope.$applyAsync();
                });
            }
            else {
                $('#btnSave').attr('style','display:none')
            }
        });
    };

    $scope.SaveRecord = function ()
    {
        debugger; 
            $scope.showLoader();
            var collectionobj = {};
            collectionobj.ComplianceDetail = $scope.AuditorList; 
            collectionobj.CreatedBy = LoginId;
            collectionobj.ClientId = $scope.ClientId;
            collectionobj.InvoiceNo = $scope.InvoiceNo;
            collectionobj.ComplianceId = $scope.ComplianceId;
            collectionobj.CreatedOn = $scope.InvDate;
            collectionobj.Action = 1;
            var getData = myService.methode('POST', "../DocumentMaster/InsertUpdateDelAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');

            getData.then(function (response) {
                if (showMsgBox(response.data.Result)) {
                    $scope.GetAuditorCompliance();

                }
            }); 
    }
    $scope.UploadVendorFile = function () {
        debugger;
        $scope.showLoader();
        var collectionobj = {};
        collectionobj.AuditorQuery = $scope.FileDoc;
        collectionobj.InvoiceNo = $scope.InvoiceNo;
        collectionobj.ComplianceId = $scope.ComplianceId;
        collectionobj.extention = $scope.extention;
        collectionobj.Action = 14;
        var getData = myService.methode('POST', "../DocumentMaster/IUDAuditorComplianceQUERY", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            if (showMsgBox(response.data.Result)) {
                $scope.GetAuditorCompliance();
            }
        });
    }
    $scope.showVendor = function (input, imgfileid) {
        if ($scope.FinalSave != '2')
        {
            if ($scope.ComplianceId != null) {
                $scope.extention = "";
                fileName = document.querySelector('#fuCandidatePhoto').value;
                extension = fileName.substring(fileName.lastIndexOf('.') + 1); 

                if (extension == 'xlsx' || extension == 'xlsm' || extension == 'xlsb' || extension == 'xltx' || extension == 'xltm' || extension == 'xls' || extension == 'xlt' ||
                    extension == 'xml' || extension == 'xml' || extension == 'xlam' || extension == 'xla' || extension == 'xlw' || extension == 'xlr')
                {
                    if (input.files && input.files[0]) {
                        {
                            var filerdr = new FileReader();
                            filerdr.onload = function (e) {
                                debugger;
                                $scope.FileDoc = e.target.result;
                                $scope.extention = 'xls'
                                $scope.UploadVendorFile();
                                $scope.$applyAsync();
                            }
                            filerdr.readAsDataURL(input.files[0]);
                        }

                    }
                    else {
                        $scope.Image = '';
                        $scope.$applyAsync();
                    }

                }
                else if (extension == 'pdf')
                {
                    if (input.files && input.files[0]) {
                        var filerdr = new FileReader();
                        filerdr.onload = function (e) {
                            $scope.FileDoc = e.target.result;
                            $scope.extention = 'pdf'
                            $scope.UploadVendorFile();
                            $scope.$applyAsync();
                        }
                        filerdr.readAsDataURL(input.files[0]);
                    }
                    else {
                        $scope.Image = '';
                        $scope.$applyAsync();
                    }

                }
                else {
                    showMsgBox('999', 'Rejected', 'File Not Correct Format,please Upload in pdf/xls format', 'warning', 'btn-warning');
                    return;
                }
            }
            else {
                showMsgBox('999', 'Require At Least One Record', 'Please Save Record before Auditor Query', 'warning', 'btn-warning')
                return;
            }
        }
        else {
            showMsgBox('999', 'Not Allowed', 'After Final Submittion not allowed Any Changes', 'warning', 'btn-warning')
            return;
        }

    };
    $scope.show = function (input, imgfileid) {
        if ($scope.FinalSave != '2') {
            if ($scope.ComplianceId != null) {
                $scope.extention = "";
                fileName = document.querySelector('#fuCandidatePhoto').value;
                extension = fileName.substring(fileName.lastIndexOf('.') + 1); 

                if (extension == 'xlsx' || extension == 'xlsm' || extension == 'xlsb' || extension == 'xltx' || extension == 'xltm' || extension == 'xls' || extension == 'xlt' ||
                    extension == 'xml' || extension == 'xml' || extension == 'xlam' || extension == 'xla' || extension == 'xlw' || extension == 'xlr') {
                    if (input.files && input.files[0]) {
                        {
                            var filerdr = new FileReader();
                            filerdr.onload = function (e) {
                                debugger;
                                $scope.FileDoc = e.target.result;
                                $scope.extention = 'xls'
                                $scope.UploadAudtorFile();
                                $scope.$applyAsync();
                            }
                            filerdr.readAsDataURL(input.files[0]);
                        }

                    }
                    else {
                        $scope.Image = '';
                        $scope.$applyAsync();
                    }

                }
                else if (extension == 'pdf') {
                    if (input.files && input.files[0]) {
                        var filerdr = new FileReader();
                        filerdr.onload = function (e) {
                            $scope.FileDoc = e.target.result;
                            $scope.extention = 'pdf'
                            $scope.UploadAudtorFile();
                            $scope.$applyAsync();
                        }
                        filerdr.readAsDataURL(input.files[0]);
                    }
                    else {
                        $scope.Image = '';
                        $scope.$applyAsync();
                    }

                }
                else {
                    showMsgBox('999', 'Rejected', 'File Not Correct Format,please Upload in  pdf/xls  format', 'warning', 'btn-warning');
                    return;
                }
            }
            else {
                showMsgBox('999', 'Require At Least One Record', 'Please Save Record before Auditor Query', 'warning', 'btn-warning')
                return;
            }

        }
        else {
            showMsgBox('999', 'Not Allowed', 'After Final Submittion not allowed Any Changes', 'warning', 'btn-warning')
            return;
        }
    }
        ;
     
    $scope.UploadAudtorFile = function () {
        debugger; 
            $scope.showLoader();
            var collectionobj = {};
            collectionobj.AuditorQuery = $scope.FileDoc; 
            collectionobj.InvoiceNo = $scope.InvoiceNo;
            collectionobj.ComplianceId = $scope.ComplianceId;
            collectionobj.extention = $scope.extention;
            collectionobj.Action = 13;
            var getData = myService.methode('POST', "../DocumentMaster/IUDAuditorComplianceQUERY", '{obj:' + JSON.stringify(collectionobj) + '}');
             getData.then(function (response) {
                 if (showMsgBox(response.data.Result)) {
                     $scope.GetAuditorCompliance();
                 }
            }); 
    }
    $scope.ApproveAuditor = function () {
        debugger;
        if (isValidate()) {
            $scope.showLoader();
            var collectionobj = {};
            collectionobj.Remark = $scope.Remark;
            collectionobj.InvoiceNo = $scope.InvoiceNo;
            collectionobj.ComplianceId = $scope.ComplianceId;
            collectionobj.Action = 15;
            var getData = myService.methode('POST', "../DocumentMaster/IUDAuditorComplianceQUERY", '{obj:' + JSON.stringify(collectionobj) + '}');
            getData.then(function (response) {
                $scope.Remark = "";
                $scope.GetAuditorCompliance();
                showMsgBox(response.data.Result)
                 
            });
        }
    }
    $scope.RejectAuditor = function () {
        debugger;
        if (isValidate()) {
            $scope.showLoader();
            var collectionobj = {};
            collectionobj.Remark = $scope.Remark;
            collectionobj.InvoiceNo = $scope.InvoiceNo;
            collectionobj.ComplianceId = $scope.ComplianceId;
            collectionobj.Action = 16;
            var getData = myService.methode('POST', "../DocumentMaster/IUDAuditorComplianceQUERY", '{obj:' + JSON.stringify(collectionobj) + '}');
            getData.then(function (response) {
                $scope.Remark = "";
                $scope.GetAuditorCompliance();
                showMsgBox(response.data.Result)
            });
        }
    }
    $scope.VendorSaveRemark=function()
    {
        if ($scope.ComplianceId != null) {
            $scope.showLoader();
            var collectionobj = {};
            collectionobj.ComplianceDetail = $scope.AuditorList;
            collectionobj.CreatedBy = LoginId;
            collectionobj.ClientId = $scope.ClientId;
            collectionobj.InvoiceNo = $scope.InvoiceNo;
            collectionobj.ComplianceId = $scope.ComplianceId;
            collectionobj.CreatedOn = $scope.InvDate;
            collectionobj.Action = 17;
            var getData = myService.methode('POST', "../DocumentMaster/InsertUpdateDelAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');

            getData.then(function (response) {
                if (showMsgBox(response.data.Result)) {
                    $scope.GetAuditorCompliance(); 
                }
            });
        } 
    }
    
    $scope.VendorDraftRecord = function () { 
            if ($scope.ComplianceId != null) {
                $scope.showLoader();
                var collectionobj = {};
                collectionobj.ComplianceDetail = $scope.AuditorList;
                collectionobj.CreatedBy = LoginId;
                collectionobj.ClientId = $scope.ClientId;
                collectionobj.InvoiceNo = $scope.InvoiceNo;
                collectionobj.ComplianceId = $scope.ComplianceId;
                collectionobj.CreatedOn = $scope.InvDate;
                collectionobj.Action = 18;
                var getData = myService.methode('POST', "../DocumentMaster/InsertUpdateDelAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');

                getData.then(function (response) {
                    if (showMsgBox(response.data.Result)) {
                        $scope.GetAuditorCompliance();
                        $scope.FireEmail(3, $scope.InvoiceNo, $scope.ClientId)

                    }
                });
            } 
        } 
    $scope.DraftRecord = function () {
        debugger;
        if (isValidate()) {
            if ($scope.ComplianceId != null) {
                $scope.showLoader();
                var collectionobj = {};
                collectionobj.ComplianceDetail = $scope.AuditorList;
                collectionobj.CreatedBy = LoginId;
                collectionobj.ClientId = $scope.ClientId;
                collectionobj.InvoiceNo = $scope.InvoiceNo;
                collectionobj.ComplianceId = $scope.ComplianceId;
                collectionobj.CreatedOn = $scope.InvDate; 
                collectionobj.Action = 12;
                var getData = myService.methode('POST', "../DocumentMaster/InsertUpdateDelAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');

                getData.then(function (response) {
                    if (showMsgBox(response.data.Result)) {
                        $scope.GetAuditorCompliance();
                        $scope.FireEmail(3, $scope.InvoiceNo, $scope.ClientId)
                      
                    }
                });
            }
            else {
                showMsgBox('999', 'Require At Least One Record', 'Please Save Record before final submittion', 'warning', 'btn-warning')
                return;
            }

        }
    }
    
    $scope.SaveAllRecord = function () {
        debugger;
        if (isValidate())
        {
            if ($scope.ComplianceId != null)
            {
                $scope.showLoader();
                var collectionobj = {};
                collectionobj.ComplianceDetail = $scope.AuditorList;
                collectionobj.CreatedBy = LoginId;
                collectionobj.ClientId = $scope.ClientId;
                collectionobj.InvoiceNo = $scope.InvoiceNo;
                collectionobj.ComplianceId = $scope.ComplianceId;
                collectionobj.CreatedOn = $scope.InvDate; 
                collectionobj.Action = 19;
               // var getData = myService.methode('POST', "../DocumentMaster/updateAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');
                var getData = myService.methode('POST', "../DocumentMaster/InsertUpdateDelAuditorCompliance", '{obj:' + JSON.stringify(collectionobj) + '}');

                getData.then(function (response) {
                    if (showMsgBox(response.data.Result))
                    {
                        $scope.FireEmail(4, $scope.InvoiceNo, $scope.ClientId)
                        $scope.GetAuditorCompliance();
                    }
                });
            }
            else {
                showMsgBox('999', 'Require At Least One Record', 'Please Save Record before final submittion', 'warning', 'btn-warning')
                return;
            }
           
        }
    }
    
   
    $scope.CountPercentage=function()
    {
        $Scope.Percentage= $scope.TotalComplianceScore / $scope.TotalComplianceScoreAchieved * 100;
        $scope.$applyAsync();
    }

    $scope.SumTableList =function()
    {
        $scope.TotalComplianceScore = 0;
        $scope.TotalComplianceScoreAchieved = 0;
        for (i = 0; $scope.AuditorList.length>0 ; i++)
        {
            $scope.TotalComplianceScore += parseInt($scope.AuditorList[i].ComplianceScore)
            $scope.TotalComplianceScoreAchieved += parseInt($scope.AuditorList[i].ComplianceScoreAchieved);
          //--  $scope.Percentage = $scope.TotalComplianceScore / $scope.TotalComplianceScoreAchieved * 100;
            $scope.$applyAsync();
        }
       
       
    }
     


    /*Refresh Search Table Record*/
    $(document).on("click", ".RefreshSearchTable", function (e) {
        debugger;
        var panelToRefresh = $(this).closest('.panel').find('.refresh-container');
        var dataToRefresh = $(this).closest('.panel').find('.panel-wrapper');
        var loadingAnim = panelToRefresh.find('.loading-progress');
        panelToRefresh.show();
        setTimeout(function () {
            loadingAnim.addClass('la-animate');
        }, 100);
        $scope.started();
        return false;
    });
    $scope.PrintRecord = function () {

        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        print = $('#printDiv').html();
        var head = '<html><head><title>Auditor Compliance</title><head><style>.hidecss { display: none };.showcss{display: block}</style></head><body onload="window.print()" class="dt-print-view">' + print + '</body></html>';
        popupWin.document.write(head);
        popupWin.document.close();
    };
     
}