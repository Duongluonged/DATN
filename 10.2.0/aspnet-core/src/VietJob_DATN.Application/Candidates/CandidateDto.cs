using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace VietJob_DATN.Candidates
{
    [AutoMapFrom(typeof(Candidate))]
    [AutoMapTo(typeof(Candidate))]
    public class CandidateDto : EntityDto<long>
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
        public string Title { get; set; }
        public string Skills { get; set; }
        public string Education { get; set; }
        public string Experience { get; set; }
        public string CvPath { get; set; }
        public string PhoneNumber { get; set; }
    }
}