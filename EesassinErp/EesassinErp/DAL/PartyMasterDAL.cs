using BAL;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DAL
{
    public partial class DLL
    {

        public async static Task<DataTable> GetSearchLocation(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@PartyId",obj.PartyId),
                new SqlParameter("@PartyType",obj.PartyType),
                new SqlParameter("@ActionType", obj.ActionType),
            };
            DataTable dt = await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteParamerizedSelectCommand("Usp_Location", CommandType.StoredProcedure, param.ToArray()));
            return dt;
        }
        public async static Task<string> InsertUpdateDelLocation(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@ActionType", obj.ActionType),
                new SqlParameter("@Id", obj.Id),
                new SqlParameter("@CreatedBy", obj.CreatedBy),
                new SqlParameter("@Location", obj.Location),
                new SqlParameter("@SiteId", obj.ClientSiteId),
                new SqlParameter("@PartyId", obj.PartyId),
                new SqlParameter("@Result",""),
            };
            return await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteNonQueryReturnScalar("Usp_Location", CommandType.StoredProcedure, param.ToArray()));
        }
        public async static Task<DataTable> PartyMaster(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@PartyId",obj.PartyId),
                new SqlParameter("@PartyType",obj.PartyType),
                new SqlParameter("@Sptype", obj.ActionType),
                 new SqlParameter("@CreatedBy", obj.CreatedBy),
            };
            DataTable dt = await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteParamerizedSelectCommand("EVM.USP_TBL_PartyMaster", CommandType.StoredProcedure, param.ToArray()));
            return dt;
        }
        public async static Task<string> InsertUpdateDelPartyMaster(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@Sptype", obj.ActionType),
                new SqlParameter("@PartyId",obj.PartyId),
                new SqlParameter("@VendorId",obj.VendorId),
                new SqlParameter("@PartyType",obj.PartyType),
                new SqlParameter("@PartyName",obj.PartyName),
                new SqlParameter("@Address",obj.Address),
                new SqlParameter("@EmailId",obj.EmailId),
                new SqlParameter("@Pincode",obj.Pincode),
                new SqlParameter("@ContactNo",obj.ContactNo),
                new SqlParameter("@BankDetails",obj.BankDetails),
                new SqlParameter("@RegistrationType",obj.RegistrationType),
                new SqlParameter("@PANITNO",obj.Panitno),
                new SqlParameter("@GSTINUIN",obj.Gstinuin),
                new SqlParameter("@Descritpion",obj.Descritpion),
                new SqlParameter("@ContactMobile",obj.ContactMobile),
                new SqlParameter("@ContactPerson",obj.ContactPerson) ,
                new SqlParameter("@CREATED_BY", obj.CreatedBy),
                new SqlParameter("@ATTRIBUTE1", obj.Attribute1),
                new SqlParameter("@ATTRIBUTE2", obj.Attribute2),
                new SqlParameter("@ATTRIBUTE3", obj.Attribute3),
                new SqlParameter("@ATTRIBUTE4", obj.Attribute4),
                new SqlParameter("@ATTRIBUTE5", obj.Attribute5),
                new SqlParameter("@ATTRIBUTE6", obj.Attribute6),
                new SqlParameter("@IsActive", obj.IsActive),
                new SqlParameter("@IsDeleted", obj.IsDeleted),
                new SqlParameter("@StoreLimit", obj.StoreLimit),
                 new SqlParameter("@UserLimit", obj.UserLimit), 
                new SqlParameter("@ValidTo", obj.ValidTo),
                   new SqlParameter("@PartyDate", obj.PartyDate),
                new SqlParameter("@Industry", obj.Industry),
                  new SqlParameter("@MonthExpired", obj.MonthExpired), ///Added by shipra 
                new SqlParameter("@RESULT",""),
            };
            return await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteNonQueryReturnScalar("EVM.USP_TBL_PartyMaster", CommandType.StoredProcedure, param.ToArray()));
        }
        //------------------------------------------Site Manager

        public async static Task<DataTable> SiteManager(TblSiteManager obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@SiteId",obj.SiteId),
                new SqlParameter("@PartyId",obj.PartyId),
                new SqlParameter("@PartyType",obj.PartyType),
                new SqlParameter("@Sptype", obj.ActionType),
            };
            DataTable dt = await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteParamerizedSelectCommand("EVM.USP_TBL_SiteManager", CommandType.StoredProcedure, param.ToArray()));
            return dt;
        }
        public async static Task<string> InsertUpdateDelSiteManager(TblSiteManager obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@Sptype", obj.ActionType),
                new SqlParameter("@SiteId",obj.SiteId),
                new SqlParameter("@PartyId",obj.PartyId),
                      new SqlParameter("@PartyIds",obj.PartyIds),
                new SqlParameter("@PartyType",obj.PartyType),
                new SqlParameter("@SiteName",obj.SiteName),
                new SqlParameter("@CityID",obj.CityId),
                new SqlParameter("@StateID",obj.StateId),
                new SqlParameter("@CountryID",obj.CountryId),
                new SqlParameter("@Address",obj.Address),
                new SqlParameter("@LocationCode",obj.LocationCode),
                new SqlParameter("@Description",obj.Description),
                new SqlParameter("@EmailId",obj.EmailId),
                new SqlParameter("@Pincode",obj.Pincode),
                new SqlParameter("@ContactNo",obj.ContactNo),
                new SqlParameter("@AccountNo",obj.AccountNo),
                new SqlParameter("@BankDetails",obj.BankDetails),
                new SqlParameter("@RegistrationType",obj.RegistrationType),
                new SqlParameter("@PANITNO",obj.Panitno),

                new SqlParameter("@CLRARC",obj.CLRARC),
                new SqlParameter("@CLRLIC",obj.CLRLIC),
                new SqlParameter("@ContactPerson",obj.ContactPerson),
                new SqlParameter("@ContactMobile",obj.ContactMobile),
                new SqlParameter("@Descritpion",obj.Descritpion),
                new SqlParameter("@ValidFrom",obj.ValidFrom),
                new SqlParameter("@ValidTo",obj.ValidTo),
                new SqlParameter("@Manpowertype",obj.Manpowertype),
                new SqlParameter("@ManPowerCount",obj.ManPowerCount),

                new SqlParameter("@AdminFileDoc",obj.AdminFileDoc),
                new SqlParameter("@VendorFileDoc",obj.VendorFileDoc),




                new SqlParameter("@NLabourOffice",obj.NLabourOffice),
                new SqlParameter("@Nature",obj.Nature),
                new SqlParameter("@PrincipalRegistration",obj.PrincipalRegistration),
                new SqlParameter("@IssuingAuthority",obj.IssuingAuthority),
                new SqlParameter("@CLRA_MaxWorkers",obj.CLRA_MaxWorkers),
                new SqlParameter("@CLRA_Validity",obj.CLRA_Validity),
                new SqlParameter("@RenewalRCCopy",obj.RenewalRCCopy),
                new SqlParameter("@BOCW_Reg",obj.BOCW_Reg),
                new SqlParameter("@BOCW_IssuingAuth",obj.BOCW_IssuingAuth),
                new SqlParameter("@BOCW_MaxWorkers",obj.BOCW_MaxWorkers),
                new SqlParameter("@BOCW_Validity",obj.BOCW_Validity),
                new SqlParameter("@BOCWRCCopy",obj.BOCWRCCopy),
                new SqlParameter("@RenewalBOCWRCCopy",obj.RenewalBOCWRCCopy),
                new SqlParameter("@VendorType",obj.VendorType),
                new SqlParameter("@MaxContractors",obj.MaxContractors),
                new SqlParameter("@MaxWorkersSite",obj.MaxWorkersSite),
                new SqlParameter("@PPEMandatory",obj.PPEMandatory),
                new SqlParameter("@PPEType",obj.PPEType),
                new SqlParameter("@SafetyTraining",obj.SafetyTraining),
                new SqlParameter("@SiteInduction",obj.SiteInduction),
                new SqlParameter("@PoliceVerification",obj.PoliceVerification),
                new SqlParameter("@IDCardRequired",obj.IDCardRequired), 

                 new SqlParameter("@GSTINUIN",obj.Gstinuin),
                new SqlParameter("@CREATED_BY", obj.CreatedBy),
                new SqlParameter("@ATTRIBUTE1", obj.Attribute1),
                new SqlParameter("@ATTRIBUTE2", obj.Attribute2),
                new SqlParameter("@ATTRIBUTE3", obj.Attribute3),
                new SqlParameter("@ATTRIBUTE4", obj.Attribute4),
                new SqlParameter("@ATTRIBUTE5", obj.Attribute5),
                new SqlParameter("@ATTRIBUTE6", obj.Attribute6),
                new SqlParameter("@IsActive", obj.IsActive),
                new SqlParameter("@IsDeleted", obj.IsDeleted),
                new SqlParameter("@RESULT",""),
            };
            return await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteNonQueryReturnScalar("EVM.USP_TBL_SiteManager", CommandType.StoredProcedure, param.ToArray()));
        }
        //------------------------------------------------TimePeriod


        public async static Task<DataTable> GetSearchTimePeriod(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
              new SqlParameter("@Id", obj.Id),
                new SqlParameter("@Action", obj.ActionType),
            };
            DataTable dt = await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteParamerizedSelectCommand("Usp_TimePeriod", CommandType.StoredProcedure, param.ToArray()));
            return dt;
        }
        public async static Task<string> IUDTimePeriod(TblPartyMaster obj)
        {
            var param = new List<SqlParameter>
            {
                new SqlParameter("@Action", obj.ActionType),
                new SqlParameter("@Id", obj.Id),
                new SqlParameter("@ClientId", obj.ClientId),
                new SqlParameter("@VendorId", obj.VendorId),
                new SqlParameter("@Location", obj.Location),
                new SqlParameter("@ClientSiteId", obj.ClientSiteId),
                new SqlParameter("@Year", obj.Year),
                new SqlParameter("@Month", obj.Month),
                new SqlParameter("@EndDate", obj.EndDate),
                new SqlParameter("@Result",""),
            };
            return await Task.Factory.StartNew(() => SqlDBHelper.SqlHelper.ExecuteNonQueryReturnScalar("Usp_TimePeriod", CommandType.StoredProcedure, param.ToArray()));
        }
        //--------------------------------------End
    }
}