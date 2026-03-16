using System;
using System.Collections.Generic;

namespace BAL
{
    public class RetialStoreManager
    {
        public string PFAccount { get; set; }

        public string LicenseId { get; set; }
        public string LicenseName { get; set; }
        public string UniqueId { get; set; }
        public DateTime? InsuranceFromDate { get; set; }
        public DateTime? InsurancePaidReceiptPeriodUpTo { get; set; }
        public string InsurancePaidReceiptRemark { get; set; }

        public string PartyId { get; set; }
        public string locationId { get; set; }
        public string DiligenceFile { get; set; }

        public string Remark { get; set; }
        public string Action { get; set; }
        public string validFrom { get; set; }
        public string validTo { get; set; }
        public string status { get; set; }
        public string UserId { get; set; }
        public string Ids { get; set; }
        public string Directory { get; set; }
        public string RefStoreCode { get; set; }
        public int ActionType { get; set; }
        public long Id { get; set; }
        public Int32 PartyTypeId { get; set; }
        public string StoreCode { get; set; }
        public string StoreName { get; set; }
        public string Category { get; set; }
        public string Operationmodel { get; set; }
        public string ComplianceCategory { get; set; }
        public string CompleteAddress { get; set; }
        public DateTime? ProposedDate { get; set; }
        public string StoreLocation { get; set; }
        public string CityId { get; set; }
        public string CountryId { get; set; }
        public float CircleId { get; set; }
        public float RegionId { get; set; }
        public string ZipCode { get; set; }
        public string StoreManagerName { get; set; }
        public string StoreManagerMobileNo { get; set; }
        public string StoreManagerEmail { get; set; }
        public string AreaManagerName { get; set; }
        public string AreaManagerMobileNo { get; set; }
        public string AreaManagerEmail { get; set; }
        public string ZonalManagerName { get; set; }
        public string ZonalManagerMobileNo { get; set; }
        public string ZonalManagerEmail { get; set; }
        public string CircleHeadName { get; set; }
        public string CircleHeadMobileNo { get; set; }
        public string CircleHeadEmail { get; set; }
        public string RegionalHeadName { get; set; }
        public string RegionalHeadMobileNo { get; set; }
        public string RegionalHeadEmail { get; set; }
        public string CorporateHeadName { get; set; }
        public string CorporateHeadMobileNo { get; set; }
        public string CorporateHeadEmail { get; set; }
        public string SQFTStoreArea { get; set; }
        public string IsActive { get; set; }
        public string ElectricityBill { get; set; }
        public string RentAgreement { get; set; }
        public string PropertyTaxPaidReceipt { get; set; }
        public string BuildingPlan { get; set; }
        public string StabilityStructureCertificate { get; set; }
        public string CompletionCertificate { get; set; }
        public string AdditionalDoc { get; set; }
        public string DocumentName { get; set; }
        public string DocumentPath { get; set; }
        public string Act { get; set; }
        public string ExecuterId { get; set; }
        public string CMonth { get; set; }
        public string FY { get; set; }
        public string PageNumber { get; set; }
        public string PageSize { get; set; }
        public string Searchby { get; set; }
    


        public int LoginId { get; set; }
        public int DaysOfExpire { get; set; }
        public int LED { get; set; }

        public List<StoreMasterList> StoreMaster { get; set; }
        public List<EmployeeMasterList> EmployeeMaster { get; set; }
        public List<ComplianceMasterList> ComplianceList { get; set; }
        public DateTime? ElectricityBillPeriodUpTo { get; set; }
        public DateTime? LeasePaidReceiptPeriodUpTo { get; set; }
        public DateTime? PropertyTaxPeriodUpTo { get; set; }
        public DateTime? FireNocPeriodUpTo { get; set; }
        public DateTime? PollutionPeriodUpTo { get; set; }
        public DateTime? OwnershipDocPeriodUpTo { get; set; }
        public DateTime? AdditionalDocPeriodUpTo { get; set; }
        public DateTime? LeaseFromDate { get; set; }
        public string ElectricityBillRemark { get; set; }
        public string LeasePaidReceiptRemark { get; set; }
        public string PropertyTaxRemark { get; set; }
        public string FireNocRemark { get; set; }
        public string PollutionRemark { get; set; }
        public string OwnershipDocRemark { get; set; }
        public string AdditionalDocRemark { get; set; }


        public string ExecutionLevel1 { get; set; }
        public string ExecutionLevel2 { get; set; }
        public string ExecutionLevel3 { get; set; }
        public string ExecutionLevel4 { get; set; }
        public string ExecutionLevel5 { get; set; }
        public string SelectDuedatefor { get; set; }

        public string LicenseD { get; set; }
        public string LicenseDaysOfExpire { get; set; }
        public string LicenseED { get; set; }
        public string Labour { get; set; }
        public string LabourDaysOfExpire { get; set; }
        public string LabourED { get; set; }
        public string FactoryD { get; set; }
        public string FactoryDaysOfExpire { get; set; }
        public string FactoryED { get; set; }
        public string FinanceD { get; set; }
        public string FinanceDaysOfExpire { get; set; }
        public string FinanceED { get; set; }
        public string SecraterialD { get; set; }
        public string SecraterialDaysOfExpire { get; set; }
        public string SecraterialED { get; set; }

        public string State { get; set; }


    }
    public class StoreMasterList
    {
        public string RefStoreCode { get; set; }

        public string StoreName { get; set; }
        public string CompleteAddress { get; set; }
        public string Category { get; set; }
        public string ProposedDate { get; set; }
        public string StoreLocation { get; set; }
        public string ZipCode { get; set; }
        public string SQFTStoreArea { get; set; }
        public string DaysOfExpire { get; set; }
        public string StoreManagerName { get; set; }
        public string StoreManagerMobileNo { get; set; }
        public string StoreManagerEmail { get; set; }
        public string AreaManagerMobileNo { get; set; }
        public string AreaManagerName { get; set; }
        public string AreaManagerEmail { get; set; }
        public string ZonalManagerName { get; set; }
        public string ZonalManagerMobileNo { get; set; }
        public string ZonalManagerEmail { get; set; }
        public string CircleHeadName { get; set; }
        public string CircleHeadMobileNo { get; set; }
        public string CircleHeadEmail { get; set; }
        public string RegionalHeadName { get; set; }
        public string RegionalHeadMobileNo { get; set; }
        public string RegionalHeadEmail { get; set; }
        public string CorporateHeadName { get; set; }
        public string CorporateHeadMobileNo { get; set; }
        public string CorporateHeadEmail { get; set; }
        public string IsActive { get; set; }

        public float RegionId { get; set; }
        public string RegionName { get; set; }

        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string LicenseExpiryDay { get; set; }

        public string Operationmodel { get; set; }
        public string ComplianceCategory { get; set; }

    }
    public class EmployeeMasterList
    {
        public string StoreCode { get; set; }
        public string RefEmployeeCode { get; set; }
        public string LeavingDate { get; set; }
        public string PFAccount { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeDesignation { get; set; }
        public string EmployeeDepartment { get; set; }
        public string Father_Husband_Name { get; set; }
        public string Gendar { get; set; }
        public string MaritalStatus { get; set; }
        public string DateOfBirth { get; set; }
        public string PresentAddress { get; set; }
        public string PermanemtAddress { get; set; }
        public string AdharCardNumber { get; set; }
        public string PANNumber { get; set; }
        public string MobileNumber { get; set; }
        public string AlternativeMobileNumber { get; set; }
        public string EmployeeEmailID { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankIFSCCode { get; set; }
        public string PreviousUAN { get; set; }
        public string PreviousESI { get; set; }
        public string GrossSalary { get; set; }
        public string DOJ { get; set; }
        public string NomineeName { get; set; }
        public string NomineeAddress { get; set; }
        public string NomineeRelation { get; set; }
        public string NomineeDOB { get; set; }
        public string IsActive { get; set; }

    }
    public class ComplianceMasterList
    {
        public string Id { get; set; }
        public string DocumentNo { get; set; }
        public string DocumentName { get; set; }
        public string Type { get; set; }
        public string Frequency { get; set; }
        public string FilePath { get; set; }
        public string Act { get; set; }

    }
}