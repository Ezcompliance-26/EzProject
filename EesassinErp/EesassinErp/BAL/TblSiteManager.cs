using System;

namespace BAL
{
    public partial class TblSiteManager
    {

        public string ClientId { get; set; }
        public string ActionType { get; set; }
        public string FileName { get; set; }
        public string File { get; set; }
        public string ProfessionalTaxReg { get; set; }
        public string Labour { get; set; }
        public string TAN { get; set; }
        public string PF { get; set; }
        public string CIN { get; set; }
        public string Name { get; set; }
        public string Id { get; set; }
        public string CLRARC { get; set; }
        public string CLRLIC { get; set; }
        public string ContactPerson { get; set; }
        public string ContactMobile { get; set; }
        public string AdminFileDoc { get; set; }
        public string Descritpion { get; set; }
        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }
        public string Manpowertype { get; set; }
        public string ManPowerCount { get; set; }
        public string VendorFileDoc { get; set; }
        public int SiteId { get; set; }
        public int? PartyId { get; set; }
        public string PartyType { get; set; }
        public string SiteName { get; set; }
        public string Address { get; set; }
        public int? CityId { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public string Pincode { get; set; }
        public string LocationCode { get; set; }
        public string EmailId { get; set; }
        public string ContactNo { get; set; }
        public string Description { get; set; }
        public string IsActive { get; set; }
        public string BankDetails { get; set; }
        public string AccountNo { get; set; }
        public string RegistrationType { get; set; }
        public string Panitno { get; set; }
        public string Gstinuin { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdateOn { get; set; }
        public int? LastLoginId { get; set; }
        public int? CreatedBy { get; set; }
        public string LastUpdateBy { get; set; }
        public string Attribute1 { get; set; }
        public string Attribute2 { get; set; }
        public string Attribute3 { get; set; }
        public string Attribute4 { get; set; }
        public string Attribute5 { get; set; }
        public string Attribute6 { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
