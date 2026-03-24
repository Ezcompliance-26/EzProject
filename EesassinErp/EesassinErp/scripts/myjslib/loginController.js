var myLoginApp = angular.module('myLoginApp', []);

myLoginApp.service("myLoginService", function ($http) {
    this.methode = function (methodType, virtualUrl, dataList) {
        return $http({
            method: methodType,
            url: virtualUrl,
            data: dataList,
            contentType: 'application/json; charset=utf-8',
            datatype: 'json'
        });
    };
});

myLoginApp.controller('myLoginController', function ($scope, $timeout, myLoginService) {

    // ---- init ----
    $scope.Username = $scope.Password = $scope.Captcha = $scope.MobileNo = $scope.NewPassword = '';
    $scope.Step1 = true; $scope.Step2 = $scope.Step3 = false;
    $scope.IshideOtp = false; $scope.hidemobile = true; $scope.IshideSubmit = false;
    $scope.ModuleId = '3';
    $scope.refresh = 'fa fa-refresh';

    // small helpers to reduce DOM ops
    function setBtn($sel, html, disabled) { $($sel).html(html).prop('disabled', !!disabled); }
    function showMsg(text, color, duration) {
        $("#lblmsg").text(text).css('color', color);
        $("#msgbox").attr("class", color === "green" ? "box-v-g" : "box-v-r").fadeIn().delay(duration || 3000).fadeOut();
    }
    function storeSession(obj) {
        if (!obj) return;
        Object.keys(obj).forEach(k => sessionStorage.setItem(k, obj[k]));
        sessionStorage.setItem('Loadonce', 0); 
    }

    // focus small init (deferred so DOM exists)
    $timeout(function () { $('#username-input').val('').focus(); }, 50);

    // --------------- API helpers ---------------
    function postObj(url, obj) {
        return myLoginService.methode('POST', url, '{obj:' + JSON.stringify(obj) + '}');
    }
    function getPlain(url) {
        return myLoginService.methode('GET', url, '{}');
    }

    // --------------- Login flow ---------------
    $scope.Login = function () {
        if (!isValidate()) return;
        setBtn('#btnLogin', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);

        var obj = { Username: $scope.Username, Password: $scope.Password, Captcha: $scope.Captcha, Action: "1" };

        postObj('../Login/GetUserId', obj).then(function (res) {
            var data = res.data;
            if (data == '89') { showMsg("Invalid Captcha!", "red"); resetBtn(); $scope.Captcha = ''; $scope.GetCaptchaImage(); return; }
            if (data == '-1') { showMsg("Invalid credentials!", "red"); resetBtn(); $scope.Captcha = ''; $scope.GetCaptchaImage(); return; }
             
            if (!data || !data.length) { resetBtn(); return; }
            
            var d = data[0];
            if (["-1", null, ""].includes(d.LoginId)) { showMsg("Authentication failed. Contact admin.", "red"); resetBtn(); $scope.GetCaptchaImage(); return; }
            if (d.LoginId == "-11") { showMsg("Session Active, close other sessions!", "red"); resetBtn(); $scope.GetCaptchaImage(); return; }

            storeSession(d);

            if (['3', '4'].includes($scope.ModuleId)) {
                $scope.RedirectToModule();
                return;
            }

            showMsg("You have logged in successfully.", "green");
            $scope.ManageLog(d.LoginId, 'Login');
            $scope.Captcha = ''; $scope.GetCaptchaImage();
            window.location.href = '../Dashboard/Dashboard';
        }).finally(resetBtn);
    };

    // --------------- RedirectToModule ---------------
    $scope.RedirectToModule = function () {
        var obj = { Action: "15", LoginId: $scope.ModuleId, Username: $scope.Username };
        postObj('../Login/GetModulePermission', obj).then(function (res) {
            var data = res.data && res.data.Result;
            if (!data || !data.length) {
               
                $scope.ManageLog($scope.ModuleId, 'Login Supplier Section');
                return window.location.href = '../Dashboard/Dashboard';
            }

            var d = data[0];
         
            $scope.Captcha = ''; $scope.GetCaptchaImage();

            if (d.LoginType == '1' || d.Module_Name === 'Supplier') {
                showMsg("You have logged in successfully.", "green");
                $scope.ManageLog(d.LoginId, 'Login Supplier Section');
                return window.location.href = '../Dashboard/Dashboard';
            }

            if (d.Module_Name === 'Retail') {
                showMsg("You have logged in successfully.", "green");
                $scope.ManageLog(d.LoginId, 'Login Retail Section');
                return window.location.href = '../Dashboard/CommonDashboard';
            }

            if (d.Module_Name === 'Both') {
                var sel = $("#ddlModule option:selected").text();
                if (sel === 'Supplier') { $scope.ManageLog(d.LoginId, 'Login Supplier Section'); return window.location.href = '../Dashboard/Dashboard'; }
                if (sel === 'Retail') { $scope.ManageLog(d.LoginId, 'Login Retail Section'); return window.location.href = '../Dashboard/CommonDashboard'; }
                showMsg("Please select module!", "red"); resetBtn();
                return;
            }

            // fallback
            $scope.ManageLog(d.LoginId, 'Login Supplier Section');
            window.location.href = '../Dashboard/Dashboard';
        });
    };

    // --------------- SessionClose (light) ---------------
    $scope.SessionClose = function () {
        if (!isValidate()) return;
        setBtn('#btnLogin', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);

        var obj = { Username: $scope.Username, Password: $scope.Password, Captcha: $scope.Captcha, Action: "18" };

        postObj('../Login/GetUserId', obj).then(function (res)
        {
            var data = res.data;
            if (data == '89') { showMsg("Invalid Captcha!", "red"); resetBtn(); $scope.Captcha = ''; $scope.GetCaptchaImage(); return; }
            if (!data || !data.length)
            { 
                resetBtn(); return;
            }

            var d = data[0];
            storeSession(d);

            if (["-1", "", null].includes(d.LoginId)) { showMsg("Authentication error.", "red"); resetBtn(); $scope.GetCaptchaImage(); return; }
            if (d.LoginId == "-11") { showMsg("Session Active, Please Close All Sessions!", "red"); resetBtn(); $scope.GetCaptchaImage(); return; }

            if ([1, 2, 3, 4].includes(d.LoginType)) {
                if ($scope.ModuleId === '3' || $scope.ModuleId === '4') return $scope.RedirectToModule();
                showMsg("You have logged in successfully.", "green");
                $scope.ManageLog(d.LoginId, 'Login');
                $scope.Captcha = ''; $scope.GetCaptchaImage();
                window.location.href = '../Dashboard/Dashboard';
            }
        }).finally(resetBtn);
    };

    // --------------- Password recovery / OTP ---------------
    $scope.RedirectLogin = function () {
        var contact = $('#txtContactNo').val() || '';
        if (!contact) { $('#txtContactNo').css('border-bottom', '1px solid red'); showMsgBox('999', 'Alert', 'Invalid Contact No or Email Id', 'warning', 'btn-warning'); return; }
        $scope.WHEREOTPGO = /^\d+$/.test(contact) ? "Phone" : "Email";
        $scope.MobileNo = contact;
        $scope.Recover();
    };

    $scope.Recover = function () {
        if (!$scope.MobileNo) { $('#txtContactNo').css('border-bottom', '1px solid red'); showMsgBox('999', 'Alert', 'Invalid MobileNo or EmailId', 'warning', 'btn-warning'); return; }
        setBtn('#btnRLogin', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);
        postObj('../Login/chkUserId', { Username: $scope.MobileNo, Action: "8" }).then(function (res) {
            var d = res.data && res.data[0];
            if (!d) { showMsgBox('999', 'Alert', 'Invalid Contact No or Email Id', 'warning', 'btn-warning'); resetBtn('#btnRLogin'); return; }
            $scope.Otp = d.Otp; 
            if ($scope.WHEREOTPGO == "Phone") sendOtpSMS();
            else sendOtpEmail(); 
        }).finally(function () { setBtn('#btnRLogin', 'Send Otp', false); });
    };

    function sendOtpEmail() {
        setBtn('#btnLogin2', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);
        postObj('../SendEmail/SendEmail', { Id: $scope.Otp, ClientId: $scope.MobileNo, Action: "19" }).then(function () {
            $('#txtOtp').val('');
            showMsg("Otp sent to your Email Id", "green", 300);
            $scope.IshideOtp = true; $scope.hidemobile = false; $scope.IshideSubmit = false;
        }).finally(function () { setBtn('#btnLogin2', 'Submit', false); });
    }

    function sendOtpSMS() {
        setBtn('#btnLogin2', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);
        postObj('../Login/SendGeneralSMS', { Msg: $scope.Otp, ContactNo: $scope.MobileNo, Action: "1" }).then(function () {
            $('#txtOtp').val('');
            showMsg("Otp sent to your number", "grey", 300);
            $scope.IshideOtp = true; $scope.hidemobile = false; $scope.IshideSubmit = false;
        }).finally(function () { setBtn('#btnLogin2', 'Submit', false); });
    }

    $scope.verifypass = function () {
        if ($scope.Otp == $scope.notp) {
            $scope.IshideOtp = false; $scope.hidemobile = false; $scope.IshideSubmit = true;
            $('#txtPassWord').attr("placeholder", "Enter New Password").val('');
        } else showMsg("Invalid Otp", "red");
    };

    $scope.ResetPass = function () {
        if ($scope.Otp != $scope.notp) return;
        setBtn('#btnLogin2', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);
        postObj('../Login/chkUserId', { Username: $scope.MobileNo, Password: $scope.NewPassword, notp: $scope.Otp, Action: "10" })
            .then(function (res) {
                if (res.data && res.data[0] && res.data[0].Msg == 2) {
                    showMsg("Congrats, Password Changed", "green", 3000);
                    $timeout(function () { window.top.location.href = '../Login/Login'; }, 1500);
                } else {
                    showMsg("Something went wrong, please try again.", "red");
                    setBtn('#btnLogin2', 'Submit', false);
                }
            });
    };

    // --------------- Misc small functions ---------------
    $scope.Redirect = function () { setBtn('#btnWelcome', '<i class="fa fa-spinner fa-spin"></i> Please wait', true); $scope.ManageLog(null, 'Welcome Click'); setBtn('#btnWelcome', 'LOG IN', false); window.location.href = '../Login/Login'; };

    $scope.resetusername = function () { $scope.Step1 = true; $scope.Step2 = $scope.Step3 = false; };
    $scope.forgetpass = function () { $scope.Step1 = $scope.Step2 = false; $scope.Step3 = true; };
    $scope.Next = function () { $scope.Step1 = false; $scope.Step2 = true; $scope.Step3 = false; };

    $scope.CheckUserName = function () {
        if (!$scope.Username) { $('#username-input').css('border-bottom', '1px solid red'); showMsgBox('999', 'Alert', 'Please Enter Username', 'warning', 'btn-warning'); return; }
        setBtn('#btnStep1Login', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);
        postObj('../Login/chkUserId', { Username: $scope.Username, Action: "23" }).then(function (res) {
            setBtn('#btnStep1Login', 'Next', false);
            var r = res.data && res.data[0];
            if (r && r.userid == 1) { $scope.Step1 = false; $scope.Step2 = true; }
            else showMsgBox('999', 'Alert', r ? r.userid : 'Error', 'info', 'btn-warning');
        });
    };

    $scope.PassWordEnterKey = function (event) { if (event && event.keyCode == 13) $scope.Login(); };

    $scope.GetCaptchaImage = function () {
        $scope.refresh = 'fa fa-spinner fa-spin';
        getPlain("../Login/CaptchaImage").then(function (res) { $timeout(function () { $scope.CaptchaSrc = res.data; $scope.refresh = 'fa fa-refresh'; }, 200); });
    };

    $scope.CheckCaptchaSum = function () {
        myLoginService.methode('POST', "../Login/GetUserId", '{sum:' + JSON.stringify($scope.Captcha) + '}').then(function (res) { console.log(res.data); });
    };

    $scope.LoadFocus = function () { $scope.Username = $scope.Password = ''; $("#txtUserName").focus(); };

    $scope.CUVAILD = function () {
        postObj('../Login/GetModulePermission', { Username: $scope.Username, Action: "15" }).then(function (res) {
            var r = res.data && res.data.Result && res.data.Result[0];
            $scope.IsModuleOpen = (r && r.Module_Name === 'Both');
        });
    };

    $scope.BindModule = function () {
        postObj('../Login/GetModulePermission', { Action: "16" }).then(function (res) { $scope.ModuleList = res.data.Result; });
    };

    // lightweight UI helpers
    $scope.FindWindow = function () {
        $(".input-effect input").each(function () {
            $(this).toggleClass('has-content', $(this).val().length > 0);
        });
    };
    $scope.hascontent = function (id) { $(id).toggleClass('has-content', $(id).val().length > 0); };

    // RecoverPassword (legacy)
    $scope.RecoverPassword = function () {
        if (!isValidate()) return;
        setBtn('#btnSubmit', '<i class="fa fa-spinner fa-spin"></i> Please wait', true);

        myLoginService.methode('POST', '../Login/RecoverPassword',
            '{username:' + JSON.stringify($scope.Username) + ',mobileno:' + JSON.stringify($scope.MobileNo) + ',schoolcode:' + JSON.stringify($scope.SchoolCode) + '}')
            .then(function (res) {
                var data = (res.data || '').replace(/"/g, '');
                var splitdata = data.split('$');
                if (splitdata[0] == '1') {
                    var msg = splitdata[1] == 'Email' ? "Password has been sent to your registered email." : "Password has been sent to your registered mobile no.";
                    showMsg(msg, "green", 6000);
                    $scope.Username = $scope.MobileNo = '';
                } else {
                    $("#lblmsg").html(splitdata[0]); $("#msgbox").attr("class", "box-v-r");
                }
            }).finally(function () { setBtn('#btnSubmit', 'Submit', false); });

        $("#msgbox").fadeIn().delay(6000).fadeOut(function () { $("#lblmsg").html(''); });
    };

    // ManageLog
    $scope.ManageLog = function (ClientId, Activity) {
        postObj("../RetailSection/MaintainLog", { Action: 3, ClientId: ClientId, Activity: Activity }).then(function () { });
    };

    // back button inside reset password step ----- Vansh Chaudhary

    $scope.backToLogin = function () {
        $scope.Step3 = false;
        $scope.Step2 = true;
    };

    // single resetBtn definition
    function resetBtn() { $('#btnLogin').html('Login').prop('disabled', false); }

});

