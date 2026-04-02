app.VendorDashboardcontroller = function ($scope, $element, $filter, myService, $http) {

    $scope.AllIndustry = function () {
        var getData = myService.methode('POST', ("../Retail/SearchRetailCreateIndustry"), { "Action": 8 });
        getData.then(function (response) {
            debugger;
            $scope.IndustryList = response.data.Result;;
        });
    }
    $scope.AddParty = function () {
        if (isValidate()) {
            if ($scope.MobileNo.length == 10) {
                $scope.AfterverifyAddParty()
            }
            else {
                showMsgBox('999', 'Alert', 'Contact Number Should be 10 digit', 'warning', 'btn-warning')
            }
        }
    }

    $scope.PartySearch = function () {

        var collectionobj = {};
        collectionobj.ActionType = 31;
        collectionobj.CreatedBy = LoginId;

        var getData = myService.methode('POST', "../PartyMaster/GetPartyMasterDT", JSON.stringify(collectionobj));

        getData.then(function (response) {

            $scope.VendorList = response.data.Result || []; 
            $scope.FilteredVendorList = angular.copy($scope.VendorList); 
            UpdateCounts($scope.FilteredVendorList); 
            $scope.NIndustryList = [...new Set($scope.VendorList
                .map(x => x.IndustryName)
                .filter(x => x && x.trim() !== ""))];

        });
    };
    $scope.PPIds = [];

    $scope.SelectAll = function () {
        angular.forEach($scope.VendorList, function (item) {
            item.Selected = $scope.IsAllSelected;
        });
        $scope.UpdateSelection();
    };

    $scope.UpdateSelection = function () {
        $scope.PPIds = [];

        angular.forEach($scope.VendorList, function (item) {
            if (item.Selected) {
                $scope.PPIds.push(item.PartyId);
            }
        });

        // Check if all selected
        $scope.IsAllSelected = $scope.VendorList.every(x => x.Selected);
    };
    $scope.SelectIndustry = function (industry) {

        $scope.SelectedIndustry = industry;

        if (!industry) {
            $scope.FilteredVendorList = angular.copy($scope.VendorList);
        }
        else {
            $scope.FilteredVendorList =
                $scope.VendorList.filter(x => x.IndustryName == industry);
        }

        UpdateCounts($scope.FilteredVendorList);
    };
    function UpdateCounts(list) {

        $scope.TotalVendor = list.length;
        $scope.ActiveUser = list.filter(x => x.IsActive == "1").length;
        $scope.InactiveUser = list.filter(x => x.IsActive == "0").length;
    }


    $scope.AfterverifyAddParty = function () {
        debugger;
        if (isValidate()) {
            $scope.showLoader();
            var collectionobj = {}; 
            collectionobj.EmployeeId = $scope.EmployeeId;
            collectionobj.VendorId = $scope.VendorId;
            collectionobj.PartyId = $scope.hfId;
            collectionobj.PartyName = $scope.PartyName;
            collectionobj.Address = $scope.Address;
            collectionobj.EmailId = $scope.EmailId;
            collectionobj.ContactNo = $scope.MobileNo;
            collectionobj.BankDetails = $scope.BankDetails;
            collectionobj.RegistrationType = $scope.RegistrationType;
            collectionobj.Panitno = $scope.Panitno;
            collectionobj.Gstinuin = $scope.Gstinuin;
            collectionobj.CreatedBy = LoginId;
            collectionobj.Pincode = $scope.Pincode;
            collectionobj.Descritpion = $scope.Descritpion;
            collectionobj.ContactMobile = $scope.ContactMobile;
            collectionobj.ContactPerson = $scope.ContactPerson
            collectionobj.StoreLimit = 0;
            collectionobj.UserLimit = $scope.UserLimit;
            collectionobj.ValidTo = $('#txtValidTo').val();
            collectionobj.Industry = $scope.NIndustryId;
            collectionobj.MonthExpired = $scope.MonthExpired;  
            collectionobj.IsActive = $scope.IsActive;
            collectionobj.PartyType = 'Vendor';
            collectionobj.ActionType = 1;
            var getData = myService.methode('POST', ("../PartyMaster/InsertUpdateDelPartyMaster"), JSON.stringify(collectionobj));
            getData.then(function (response) {
                if (showMsgBox(response.data.Result)) {
                    $scope.PartySearch();
                    $scope.ClearControl(1);
                }
            });
        }
    }
    $scope.ClearControl = function (flag) {
        if (flag == 1) {
            $scope.ResetControl(flag);
        }
        else {
            clearConfirmbox("Do you want to clear fields?", function () { $scope.ResetControl(0); });
        }
    };

    $scope.ResetControl = function (flag) {
        debugger;
        document.getElementById("btnCancel").click();
        $scope.PartyName = "";
        $scope.EmployeeId = "";
        $scope.Address = "";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.IsActive = ""; 
        $scope.BankDetails = "";
        $scope.Panitno = "";
        $scope.Gstinuin = "";
        $scope.Pincode = "";
        $scope.VendorId = "";
        $scope.Descritpion = "";
        $scope.ContactMobile = "";
        $scope.ContactPerson = "";
        $scope.NIndustryId = "";
        if (flag == 0) {
            showMsgBox('4');
        };

    }
    $scope.ExportVendorCSV = function () {

        var list = $scope.FilteredVendorList || [];

        if (!list.length) {
            alert("No data available");
            return;
        }

        var csv = "";
        csv += "S.No,Party Name,Email,Mobile,Contact Person,Industry,UserLimit,Status\n";

        list.forEach(function (x) {

            csv += '"' + (x.SNO || '') + '",';
            csv += '"' + (x.PartyName || '') + '",';
            csv += '"' + (x.EmailId || '') + '",';
            csv += '"' + (x.ContactNo || '') + '",';
            csv += '"' + (x.ContactPerson || '') + '",';
            csv += '"' + (x.IndustryName || '') + '",';
            csv += '"' + (x.UserLimit || '') + '",';
            csv += '"' + (x.IsActived || '') + '"\n';

        });

        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "PartyManagement.csv";
        link.click();
    };
    $scope.PrintVendorList = function () {

        var list = $scope.FilteredVendorList || [];
        if (!list.length) {
            alert("No data available");
            return;
        }

        var printWindow = window.open('', '', 'height=700,width=1000');

        var today = new Date().toLocaleString();

        var html = `
        <html>
        <head>
            <title>Vendor List</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                h2 { text-align: center; margin-bottom: 5px; }
                .generated { text-align: right; font-size: 12px; margin-bottom: 20px; }
   .party { text-align: center; font-size: 13px;  }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
              <h2> ${MapUser}</h2> 
 <div class="party">Party Management</div>
            <div class="generated">Generated On: ${today}</div>

            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Party Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Contact Person</th>
                        <th>Industry</th>
<th>UserLimit</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

        list.forEach(function (x) {
            html += `
            <tr>
                <td>${x.SNO || ''}</td>
                <td>${x.PartyName || ''}</td>
                <td>${x.EmailId || ''}</td>
                <td>${x.ContactNo || ''}</td>
                <td>${x.ContactPerson || ''}</td>
                <td>${x.IndustryName || ''}</td>
   <td>${x.UserLimit || ''}</td>
                <td>${x.IsActived || ''}</td>
            </tr>
        `;
        });

        html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };
//-------------------------------------------------------------------------UserManagement Start

    $scope.UserList = function () {
        var collectionobj = {};
        collectionobj.Action = 28; 
        collectionobj.LoginId = LoginId;
        debugger;
        var getData = myService.methode('POST', "../DashBoard/GetUserRegistration", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            $scope.EmployeeList = response.data.Result;
            $scope.UsedUsers = $scope.EmployeeList.length;

            // 🔹 Total User Limit (first record se le rahe hain)
            $scope.TotalUserLimit = $scope.EmployeeList.length > 0
                ? parseInt($scope.EmployeeList[0].UserLimit) || 0
                : 0;

            // 🔹 Remaining Users
            $scope.RemainingUsers = $scope.TotalUserLimit - $scope.UsedUsers;

            // Safety (negative avoid)
            if ($scope.RemainingUsers < 0) {
                $scope.RemainingUsers = 0;
            }
        });
    }

  

    $scope.VerifyPassword = function () {
         
            $scope.showLoader();
            var collectionobj = {};
        collectionobj.MapId = $scope.PPId;
            collectionobj.UserName = $scope.UserNames;
            collectionobj.Password = $scope.Password;
            collectionobj.Name = $scope.UName;
            collectionobj.ContactNo = $scope.ContactNumber;
        collectionobj.EmailId = $scope.UserEmail;
        collectionobj.LoginType = $scope.VendorType;
        collectionobj.LoginId = LoginId
            collectionobj.BranchCode = '001';
            collectionobj.Action = 7;
            collectionobj.IsActive = 1
            collectionobj.CreatedBy = LoginId;
            var getData = myService.methode('POST', "../DashBoard/IUDUserRegistration", '{obj:' + JSON.stringify(collectionobj) + '}');
            getData.then(function (response) {
                debugger;
                if (showMsgBox(response.data.Result)) {
                    $scope.UserList();
                    $scope.FireEmail(1, $scope.UserEmail, 0);
                     
                 
                    $scope.UserNames = '';
                    $scope.Password = '';
                    $scope.UName = '';
                    $scope.ContactNumber = '';
                    $scope.UserEmail = '';
                }
            }); 
    }


    $scope.validateEmail = function () {

        var semail = $('#txtUserEmail').val();
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(semail)) {
            $scope.VerifyPassword();
        }
        else {
            showMsgBox('999', 'Alert', 'Please fill correct e-mail address!', 'warning', 'btn-warning')
            return;
        }
    }

    $scope.SaveUser = function () {

        if ($scope.PPId == '' || $scope.PPId == undefined) {
            showMsgBox('999', 'Alert', 'Party Name  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("ddlPPId").focus();
            }, 200);
            return;
        }
        if ($scope.UName == '' || $scope.UName == undefined) {
            showMsgBox('999', 'Alert', 'Name  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("txtUName").focus();
            }, 200);
            return;
        }
        if ($scope.UserNames == '' || $scope.UserNames == undefined) {
            showMsgBox('999', 'Alert', 'UserName  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("txtUserNames").focus();
            }, 200);
            return;
        }
        if ($scope.Password == '' || $scope.Password == undefined) {
            showMsgBox('999', 'Alert', 'Password  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("txtPassword").focus();
            }, 200);
            return;
        }
        if ($scope.ContactNumber == '' || $scope.ContactNumber == undefined) {
            showMsgBox('999', 'Alert', 'Contact Number  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("txtContactNumber").focus();
            }, 200);
            return;
        }

        if ($scope.UserEmail == '' || $scope.UserEmail == undefined) {
            showMsgBox('999', 'Alert', 'Email  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("txtUserEmail").focus();
            }, 200);
            return;
        }
        if ($scope.VendorType == '' || $scope.VendorType == undefined) {
            showMsgBox('999', 'Alert', 'Vendor Type  Should be Required', 'warning', 'btn-warning')
            setTimeout(function () {
                document.getElementById("VendorType").focus();
            }, 200);
            return;
        }
        var upper = 0,
            lower = 0,
            number = 0,
            special = 0;
        var mb = $scope.ContactNumber;
        var str = $scope.Password;
        for (var i = 0; i < str.length; i++) {
            if (str[i] >= "A" && str[i] <= "Z") upper++;
            else if (str[i] >= "a" && str[i] <= "z") lower++;
            else if (str[i] >= "0" && str[i] <= "9") number++;
            else special++;
        }
        if (upper >= 1 && lower >= 1 && special >= 1 && number >= 1 && str.length > 8) {
            
                if (mb.length == 10) {
                    $scope.validateEmail()
                }
                else {
                    showMsgBox('999', 'Alert', 'Contact Number Should be 10 digit', 'warning', 'btn-warning')
                } 
        }
        else {
            var Msg = "Your Password should be greated than 8 , 1 Upper case , 1 Lower case , 1 Special characters ,1 Number  currently Upper case letter : " + upper + ", Lower case : " + lower + ", Number : " + number + ", Special characters : " + special
            showMsgBox('999', 'Alert', Msg, 'warning', 'btn-warning')
        }

    }

    //-----------------------------------------employee Compliance doc
    $scope.Saveempdoc = function () {

        // Validation
        if (!$scope.DocumentName || $scope.DocumentName.trim() === "") { 
            showMsgBox('999', 'Alert', 'Please enter Document Name', 'warning', 'btn-warning') 
            return;
        }

        // Optional: length validation
        if ($scope.DocumentName.length < 3) {
            showMsgBox('999', 'Document Name must be at least 3 characters', 'warning', 'btn-warning') 
            return;
        }

        $scope.showLoader();

        var collectionobj = {};
        collectionobj.UserName = $scope.DocumentName;
        collectionobj.Action = 30;
        collectionobj.MapId = MapId;

        var getData = myService.methode(
            'POST',
            "../DashBoard/IUDUserRegistration",
            '{obj:' + JSON.stringify(collectionobj) + '}'
        );

        getData.then(function (response) {
            if (showMsgBox(response.data.Result)) {
                $scope.BindEmpDocumentList();
            }
        });
    }



    $scope.BindEmpDocumentList = function () {
        var collectionobj = {};
        collectionobj.Action = 31;
        collectionobj.LoginId = MapId;
        collectionobj.Id= $scope.SelectedVendorId
        
        var getData = myService.methode('POST', "../DashBoard/GetempRegistration", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            $scope.EmpDocumentList = response.data.Result;

            // 🔥 Auto check fix
            $scope.EmpDocumentList.forEach(function (item) {
                item.IsCheck = item.IsCheck === true || item.IsCheck === "true";
            }); 
        });
    }

    $scope.checkAll = false;

    $scope.toggleAll = function () {
        angular.forEach($scope.EmpDocumentList, function (item) {
            item.IsCheck = $scope.checkAll;
        });
    };

    $scope.BindVendorListList = function ()
    {
        var collectionobj = {};
        collectionobj.Action = 32;
        collectionobj.LoginId = MapId;
        debugger;
        var getData = myService.methode('POST', "../DashBoard/GetUserRegistration", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            $scope.EVendorList = response.data.Result;
        });
    }
    $scope.OnVendorChange = function () {

        if (!$scope.SelectedVendorId) {
            // sab uncheck
            angular.forEach($scope.EmpDocumentList, function (x) {
                x.IsCheck = false;
            });
            return;
        }

        var obj = {
            VendorId: $scope.SelectedVendorId,
            Action: 31 // mapping get action
        };

        var getData = myService.methode(
            'POST',
            "../DashBoard/IUDUserRegistration",
            '{obj:' + JSON.stringify(obj) + '}'
        );

        getData.then(function (res) {

            var mappedDocs = res.data.List || []; 
            angular.forEach($scope.EmpDocumentList, function (x) {
                x.IsCheck = false; 
                var match = mappedDocs.find(m => m.DocumentId == x.DocumentId);
                if (match) {
                    x.IsCheck = true;
                }
            });

        });
    };

    $scope.SaveVendorDocumentMapping = function () {

        if (!$scope.SelectedVendorId) {
          
            showMsgBox('999', 'Please select vendor', 'warning', 'btn-warning')
            return;
            return;A
        }

        var selectedDocs = $scope.EmpDocumentList
            .filter(x => x.IsCheck)
            .map(x => x.Id);   

        var obj = {
            VendorId: $scope.SelectedVendorId,
            Documents: selectedDocs.join(','),   
            Action: 33
        };

        var getData = myService.methode(
            'POST',
            "../DashBoard/IUDEmployeeDoc",
            '{obj:' + JSON.stringify(obj) + '}'
        );

        getData.then(function (res) {
            if (showMsgBox(res.data.Result)) {
                $scope.BindEmpDocumentList();
            }
        });
    };
    //---------------------------------------------------------------





    $scope.SelectedPartyId = null;
    $scope.SelectedPartyName = null;

    $scope.SelectParty = function (x) {
        $scope.SelectedPartyId = x.PartyId;
        $scope.SelectedPartyName = x.PartyName;
    };

    $scope.SelectPartyAll = function () {
        $scope.SelectedPartyId = null;
        $scope.SelectedPartyName = null;
    };

    $scope.PrintUserList = function () {

        // 🔹 Apply same filter logic (Party + Search)
        var list = ($scope.EmployeeList || []).filter(function (x) {

            var partyMatch = !$scope.SelectedPartyId || x.PartyId == $scope.SelectedPartyId;

            var searchMatch = !$scope.searchText ||
                (x.UserName && x.UserName.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.PartyName && x.PartyName.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.EmailId && x.EmailId.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.ContactNo && x.ContactNo.includes($scope.searchText));

            return partyMatch && searchMatch;
        });

        if (!list.length) {
            alert("No data available");
            return;
        }

        var printWindow = window.open('', '', 'height=700,width=1000');
        var today = new Date().toLocaleString();

        var html = `
    <html>
    <head>
        <title>User List</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; margin-bottom: 5px; }
            .sub-title { text-align: center; font-size: 13px; margin-bottom: 5px; }
            .generated { text-align: right; font-size: 12px; margin-bottom: 15px; }
            .count { text-align: left; font-size: 12px; margin-bottom: 15px; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 12px; text-align:center; }
            th { background-color: #f2f2f2; font-weight: bold; }
        </style>
    </head>
    <body>

        <h2>User Management</h2>
        <div class="sub-title">User List Report</div>
        <div class="generated">Generated On: ${today}</div>
        <div class="count">Total Records: ${list.length}</div>

        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>User Name</th>
                    <th>Party Name</th>
                    <th>Email</th>
                    <th>Contact No</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
    `;

        list.forEach(function (x, index) {

            var role = x.LoginType == 5 ? 'Admin' : 'User';

            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${x.UserName || ''}</td>
                <td>${x.PartyName || ''}</td>
                <td>${x.EmailId || ''}</td>
                <td>${x.ContactNo || ''}</td>
                <td>${role}</td>
            </tr>
        `;
        });

        html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    $scope.ExportUserCSV = function () {

        if (!$scope.EmployeeList || $scope.EmployeeList.length == 0) {
            alert("No data to export");
            return;
        }

        var filteredData = $scope.EmployeeList.filter(function (x) {

            var partyMatch = !$scope.SelectedPartyId || x.PartyId == $scope.SelectedPartyId;

            var searchMatch = !$scope.searchText ||
                (x.UserName && x.UserName.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.PartyName && x.PartyName.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.EmailId && x.EmailId.toLowerCase().includes($scope.searchText.toLowerCase())) ||
                (x.ContactNo && x.ContactNo.includes($scope.searchText));

            return partyMatch && searchMatch;
        });

        var csv = "S.No,UserName,Party Name,EmailId,Contact No,Role\n";

        filteredData.forEach(function (x, index) {
            var role = x.LoginType == 5 ? "Admin" : "User";

            csv += (index + 1) + "," +
                x.UserName + "," +
                x.PartyName + "," +
                x.EmailId + "," +
                x.ContactNo + "," +
                role + "\n";
        });

        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "UserList.csv";
        link.click();
    };


    //--------------------------------------------------------------------Sitemanager
   
    $scope.AllCountry = function () {
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), { "ActionType": 27 });
        getData.then(function (response) {
            debugger;
            $scope.AllCountryList = response.data.Result;
        });
    }
    $scope.AllState = function () {
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), { "ActionType": 28, "PartyId": $scope.CountryId });
        getData.then(function (response) {
            debugger;
            $scope.AllStateList = response.data.Result;
        });
    }
    $scope.AllCity = function () {
        var getData = myService.methode('POST', ("../PartyMaster/GetPartyMasterDT"), { "ActionType": 29, "PartyId": $scope.StateId });
        getData.then(function (response) {
            debugger;
            $scope.AllCityList = response.data.Result;
        });
    }


   
    $scope.Vendorshow = function (input, imgfileid) {

        var maxSizeKB = 500; 
        var maxSizeBytes = maxSizeKB * 1024;

        if (input.files && input.files[0]) {

            var file = input.files[0];

            // 🔴 File Size Validation
            if (file.size > maxSizeBytes) {

                var fileSizeKB = (file.size / 1024).toFixed(2);

                showMsgBox('999', 'Alert',
                    'Selected file is ' + fileSizeKB + ' KB. Max allowed is 500 KB',
                    'warning', 'btn-warning');

                // Reset file input
                input.value = "";
                $scope.VendorFileDoc = null;

                return;
            }

            // ✅ If size valid
            var filerdr = new FileReader();

            filerdr.onload = function (e) {
                $scope.VendorFileDoc = e.target.result;
                $scope.$applyAsync();
            };

            filerdr.readAsDataURL(file);
        }
        else {
            $scope.VendorFileDoc = null;
            $scope.$applyAsync();
        }
    };


    $scope.RCCopyShow = function (input, imgfileid) {

        var maxSizeKB = 500;
        var maxSizeBytes = maxSizeKB * 1024;

        if (input.files && input.files[0]) {

            var file = input.files[0];

            // 🔴 File Size Validation
            if (file.size > maxSizeBytes) {

                var fileSizeKB = (file.size / 1024).toFixed(2);

                showMsgBox('999', 'Alert',
                    'Selected file is ' + fileSizeKB + ' KB. Max allowed is 500 KB',
                    'warning', 'btn-warning');

                // Reset file input
                input.value = "";
                $scope.RCCopy = null;

                return;
            }

            // ✅ If size valid
            var filerdr = new FileReader();

            filerdr.onload = function (e) {
                $scope.RCCopy = e.target.result;
                $scope.$applyAsync();
            };

            filerdr.readAsDataURL(file);
        }
        else {
            $scope.RCCopy = null;
            $scope.$applyAsync();
        }
    };
    $scope.RenewalRCCopyShow = function (input, imgfileid) {

        var maxSizeKB = 500;
        var maxSizeBytes = maxSizeKB * 1024;

        if (input.files && input.files[0]) {

            var file = input.files[0];

            // 🔴 File Size Validation
            if (file.size > maxSizeBytes) {

                var fileSizeKB = (file.size / 1024).toFixed(2);

                showMsgBox('999', 'Alert',
                    'Selected file is ' + fileSizeKB + ' KB. Max allowed is 500 KB',
                    'warning', 'btn-warning');

                // Reset file input
                input.value = "";
                $scope.RenewalRCCopy = null;

                return;
            }

            // ✅ If size valid
            var filerdr = new FileReader();

            filerdr.onload = function (e) {
                $scope.RenewalRCCopy = e.target.result;
                $scope.$applyAsync();
            };

            filerdr.readAsDataURL(file);
        }
        else {
            $scope.RenewalRCCopy = null;
            $scope.$applyAsync();
        }
    };
    $scope.BOCWRCCopyShow = function (input, imgfileid) {

        var maxSizeKB = 500;
        var maxSizeBytes = maxSizeKB * 1024;

        if (input.files && input.files[0]) {

            var file = input.files[0];

            // 🔴 File Size Validation
            if (file.size > maxSizeBytes) {

                var fileSizeKB = (file.size / 1024).toFixed(2);

                showMsgBox('999', 'Alert',
                    'Selected file is ' + fileSizeKB + ' KB. Max allowed is 500 KB',
                    'warning', 'btn-warning');

                // Reset file input
                input.value = "";
                $scope.BOCWRCCopy = null;

                return;
            }

            // ✅ If size valid
            var filerdr = new FileReader();

            filerdr.onload = function (e) {
                $scope.BOCWRCCopy = e.target.result;
                $scope.$applyAsync();
            };

            filerdr.readAsDataURL(file);
        }
        else {
            $scope.BOCWRCCopy = null;
            $scope.$applyAsync();
        }
    };
    $scope.RenewalBOCWRCCopyShow = function (input, imgfileid) {

        var maxSizeKB = 500;
        var maxSizeBytes = maxSizeKB * 1024;

        if (input.files && input.files[0]) {

            var file = input.files[0];

            // 🔴 File Size Validation
            if (file.size > maxSizeBytes) {

                var fileSizeKB = (file.size / 1024).toFixed(2);

                showMsgBox('999', 'Alert',
                    'Selected file is ' + fileSizeKB + ' KB. Max allowed is 500 KB',
                    'warning', 'btn-warning');

                // Reset file input
                input.value = "";
                $scope.RenewalBOCWRCCopy = null;

                return;
            }

            // ✅ If size valid
            var filerdr = new FileReader();

            filerdr.onload = function (e) {
                $scope.RenewalBOCWRCCopy = e.target.result;
                $scope.$applyAsync();
            };

            filerdr.readAsDataURL(file);
        }
        else {
            $scope.RenewalBOCWRCCopy = null;
            $scope.$applyAsync();
        }
    };


    $scope.DeleteVendorSite = function (deleteid) {
        deleteConfirmbox(
            "Do you want to delete this record?",
            function () {
                $scope.Deletemapping(deleteid);
            }
        );
    };

    $scope.Deletemapping = function (deleteid) {

        var collectionobj = {
            SiteId: deleteid,
            ActionType: 10
        };

        var getData = myService.methode(
            'POST',
            "../SiteManager/InsertUpdateDelSiteManager",
            JSON.stringify(collectionobj)
        );

        getData.then(function (response) {
            if (showMsgBox(response.data.Result)) {
                $scope.BindVendorSiteList();
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.edit = 0;

    $scope.EditVendorSite = function (item) {
        $scope.edit = 1;
        // 🔹 Hidden Id
        $scope.SiteId = item.SiteId;

        // 🔹 Basic Details
        $scope.SiteName = item.SiteName;
        $scope.SiteAddress = item.Address;
        $scope.LocationCode = item.LocationCode;
        $scope.EmailId = item.EmailId;
        $scope.MobileNo = item.ContactNo;
        $scope.Description = item.Description;

        // 🔹 Bank & Tax
        $scope.BankDetails = item.BankDetails;
        $scope.AccountNo = item.AccountNo;
        $scope.Panitno = item.Panitno;
        $scope.Gstinuin = item.Gstinuin;

        // 🔹 Location
        $scope.Pincode = item.Pincode;
        $("#ddlcountry").val(item.CountryId);
        $("#ddlstate").val(item.StateId);
        $("#ddlcity").val(item.CityId);

        // 🔹 Party Multi Select
        if (item.PartyIds) {
            $scope.PPIds = item.PartyIds.split(',').map(Number);

            angular.forEach($scope.VendorList, function (x) {
                x.Selected = $scope.PPIds.includes(x.Id);
            });
        }

        // 🔹 Contact
        $scope.ContactPerson = item.ContactPerson;
        $scope.ContactMobile = item.ContactMobile;

        // 🔹 CLRA
        $scope.CLRARC = item.CLRARC;
        $scope.CLRLIC = item.CLRLIC;
        $scope.ValidFrom = item.ValidFrom;
        $scope.ValidTo = item.ValidTo;

        // 🔹 Manpower
        $scope.Manpowertype = item.Manpowertype;
        $scope.ManPowerCount = item.ManPowerCount;

        // 🔹 Labour
        $scope.NLabourOffice = item.NLabourOffice;
        $scope.Nature = item.Nature;
        $scope.PrincipalRegistration = item.PrincipalRegistration;
        $scope.IssuingAuthority = item.IssuingAuthority;
        $scope.CLRA_MaxWorkers = item.CLRA_MaxWorkers;
        $scope.CLRA_Validity = item.CLRA_Validity;

        // 🔹 Files
        $scope.RCCopy = item.RCCopy;
        $scope.RenewalRCCopy = item.RenewalRCCopy;

        // 🔹 BOCW
        $scope.BOCW_Reg = item.BOCW_Reg;
        $scope.BOCW_IssuingAuth = item.BOCW_IssuingAuth;
        $scope.BOCW_MaxWorkers = item.BOCW_MaxWorkers;
        $scope.BOCW_Validity = item.BOCW_Validity;

        $scope.BOCWRCCopy = item.BOCWRCCopy;
        $scope.RenewalBOCWRCCopy = item.RenewalBOCWRCCopy;

        // 🔹 Safety
        $scope.VendorType = item.VendorType;
        $scope.MaxContractors = item.MaxContractors;
        $scope.MaxWorkersSite = item.MaxWorkersSite;
        $scope.PPEMandatory = item.PPEMandatory;
        $scope.PPEType = item.PPEType;
        $scope.SafetyTraining = item.SafetyTraining;
        $scope.SiteInduction = item.SiteInduction;
        $scope.PoliceVerification = item.PoliceVerification;
        $scope.IDCardRequired = item.IDCardRequired;

        // 🔹 Files
        $scope.VendorFileDoc = item.VendorFileDoc;
        $scope.AdminFileDoc = item.AdminFileDoc;
    };

    $scope.AfterSave = function () {
        $scope.ActionId = 0;
        if ($scope.edit == 1) { $scope.ActionId = 2 }
        else { $scope.ActionId = 9 }
        function setError(id, message) {

            $(".form-control, select").removeClass("border-danger");

            var element = $(id);
            element.addClass("border-danger");

            setTimeout(function () {
                element.focus();
            }, 100);

            showMsgBox('999', 'Alert', message, 'warning', 'btn-warning');
            return false;
        }


        if ($scope.ActionId == 9) {
            if (!$scope.PPIds || $scope.PPIds.length === 0)
                return setError("#ddlparty", "Party Required");
        }
        // 🔴 Validation
      

        if (!$scope.SiteName || !$scope.SiteName.trim())
            return setError("#txtSiteName", "Site Name Required");

        if (!$scope.SiteAddress || !$scope.SiteAddress.trim())
            return setError("#txtSiteAddress", "Address Required");

        if (!$scope.MobileNo)
            return setError("#txtMobileNo", "Contact No Required");

        if (!$scope.EmailId)
            return setError("#txtEmailId", "Email Required");

        if (!$scope.Pincode)
            return setError("#txtPincode", "Pincode Required");

        if ($scope.ActionId == 9) {
            if (!$("#ddlcountry").val())
                return setError("#ddlcountry", "Country Required");

            if (!$("#ddlstate").val())
                return setError("#ddlstate", "State Required");

            if (!$("#ddlcity").val())
                return setError("#ddlcity", "City Required");
        }
        $(".form-control, select").removeClass("border-danger");

        $scope.showLoader();
       
      
        var collectionobj = {
            PartyIds: $scope.PPIds.join(',') ,
            PartyType: 'Vendor',
            SiteId: $scope.hfId,
            SiteName: $scope.SiteName,
            Address: $scope.SiteAddress,
            LocationCode: $scope.LocationCode,
            EmailId: $scope.EmailId,
            ContactNo: $scope.MobileNo,
            BankDetails: $scope.BankDetails,
            AccountNo: $scope.AccountNo,
            Description: $scope.Description,
            Panitno: $scope.Panitno,
            Gstinuin: $scope.Gstinuin,
            CreatedBy: LoginId,
            Pincode: $scope.Pincode,
            CountryId: $("#ddlcountry").val(),
            StateId: $("#ddlstate").val(),
            CityId: $("#ddlcity").val(),
            CLRARC: $scope.CLRARC,
            CLRLIC: $scope.CLRLIC,
            ContactPerson: $scope.ContactPerson,
            ContactMobile: $scope.ContactMobile,
            Descritpion: $scope.Descritpion,
            ValidFrom: $scope.ValidFrom,
            ValidTo: $scope.ValidTo,
            VendorFileDoc: $scope.VendorFileDoc,
            AdminFileDoc: $scope.AdminFileDoc,
            Manpowertype: $scope.Manpowertype,
            ManPowerCount: $scope.ManPowerCount,

            NLabourOffice: $scope.NLabourOffice,
            Nature: $scope.Nature,
            PrincipalRegistration: $scope.PrincipalRegistration,
            IssuingAuthority: $scope.IssuingAuthority,
            CLRA_MaxWorkers: $scope.CLRA_MaxWorkers,
            CLRA_Validity: $scope.CLRA_Validity,

            RCCopy: $scope.RCCopy,
            RenewalRCCopy: $scope.RenewalRCCopy,

            BOCW_Reg: $scope.BOCW_Reg,
            BOCW_IssuingAuth: $scope.BOCW_IssuingAuth,
            BOCW_MaxWorkers: $scope.BOCW_MaxWorkers,
            BOCW_Validity: $scope.BOCW_Validity,

            BOCWRCCopy: $scope.BOCWRCCopy,
            RenewalBOCWRCCopy: $scope.RenewalBOCWRCCopy,

            VendorType: $scope.VendorType,
            MaxContractors: $scope.MaxContractors,
            MaxWorkersSite: $scope.MaxWorkersSite,
            PPEMandatory: $scope.PPEMandatory,
            PPEType: $scope.PPEType,
            SafetyTraining: $scope.SafetyTraining,
            SiteInduction: $scope.SiteInduction,
            PoliceVerification: $scope.PoliceVerification,
            IDCardRequired: $scope.IDCardRequired,
            SiteId: $scope.SiteId,
            ActionType: $scope.ActionId
        };

        var getData = myService.methode(
            'POST',
            "../SiteManager/InsertUpdateDelSiteManager",
            JSON.stringify(collectionobj)
        );

        getData.then(function (response) {
            if (showMsgBox(response.data.Result)) {

                $scope.BindVendorSiteList();
                 
                $scope.SiteName = "";
                $scope.SiteAddress = "";
                $scope.EmailId = "";
                $scope.MobileNo = "";
                $scope.Description = "";
                $scope.LocationCode = "";
                $scope.BankDetails = "";
                $scope.AccountNo = "";
                $scope.Panitno = "";
                $scope.Gstinuin = "";
                $scope.Pincode = "";
                $scope.CLRARC = "";
                $scope.CLRLIC = "";
                $scope.ContactPerson = "";
                $scope.ContactMobile = "";
                $scope.Descritpion = "";
                $scope.ValidFrom = "";
                $scope.ValidTo = "";
                $scope.Manpowertype = "";
                $scope.ManPowerCount = "";

                $scope.AdminFileDoc = "";
                $scope.VendorFileDoc = "";

                $("#txtpincode").val('');
                $scope.edit = 0;
                $scope.CountryId = "";
                $scope.StateId = "";
                $scope.CityId = ""; 
                $scope.PPIds = [];
                $scope.IsAllSelected = false;

                angular.forEach($scope.VendorList, function (item) {
                    item.Selected = false;
                });
            }
        });
    };
    $scope.BindVendorSiteList = function () {
        var collectionobj = {};
        collectionobj.Action = 29;
        collectionobj.LoginId = LoginId;
        debugger;
        var getData = myService.methode('POST', "../DashBoard/GetUserRegistration", '{obj:' + JSON.stringify(collectionobj) + '}');
        getData.then(function (response) {
            $scope.VendorSiteList = response.data.Result; 
            $scope.TotalSite = response.data.Result.length;
        });
    }
    $scope.ExportSiteCSV = function () {

        var list = $scope.VendorSiteList || [];

        if (!list.length) {
            alert("No data available");
            return;
        }

        var csv = "S.No,Site Name,Email Id,Contact No,Address\n";

        list.forEach(function (x, index) {

            csv += (index + 1) + "," +
                (x.SiteName || '') + "," +
                (x.EmailId || '') + "," +
                (x.ContactNo || '') + "," +
                (x.Address || '') + "\n";
        });

        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "VendorSiteList.csv";
        link.click();
    };
    $scope.PrintSiteList = function () {

        var list = $scope.VendorSiteList || [];

        if (!list.length) {
            alert("No data available");
            return;
        }

        var printWindow = window.open('', '', 'height=700,width=1000');
        var today = new Date().toLocaleString();

        var html = `
    <html>
    <head>
        <title>Vendor Site List</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; margin-bottom: 5px; }
            .generated { text-align: right; font-size: 12px; margin-bottom: 15px; }
            .count { text-align: left; font-size: 12px; margin-bottom: 15px; }

            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 12px; text-align:center; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>

        <h2>Vendor Site Management</h2>
        <div class="generated">Generated On: ${today}</div>
        <div class="count">Total Records: ${list.length}</div>

        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Site Name</th>
                    <th>Email Id</th>
                    <th>Contact No</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
    `;

        list.forEach(function (x, index) {
            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${x.SiteName || ''}</td>
                <td>${x.EmailId || ''}</td>
                <td>${x.ContactNo || ''}</td>
                <td>${x.Address || ''}</td>
            </tr>
        `;
        });

        html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };





    $scope.PrintemployeedocList = function () {

        var list = $scope.EmpDocumentList || [];

        if (!list.length) {
            alert("No data available");
            return;
        }

        var printWindow = window.open('', '', 'height=700,width=1000');
        var today = new Date().toLocaleString();

        var html = `
    <html>
    <head>
        <title>Employee Compliance Documents</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; margin-bottom: 5px; }
            .generated { text-align: right; font-size: 12px; margin-bottom: 15px; }
            .count { text-align: left; font-size: 12px; margin-bottom: 15px; }

            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 12px; text-align:center; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>

        <h2>Employee Compliance Documents</h2>
        <div class="generated">Generated On: ${today}</div>
        <div class="count">Total Records: ${list.length}</div>

        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Document Name</th> 
                </tr>
            </thead>
            <tbody>
     `;

        list.forEach(function (x, index) {
            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${x.DocumentName || ''}</td> 
            </tr>
        `;
        });

        html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

}