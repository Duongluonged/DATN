using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System.Threading.Tasks;

namespace VietJob_DATN.Candidates
{
    [AbpAuthorize] // Chỉ người đã đăng nhập mới dùng được
    public class CandidateAppService : AsyncCrudAppService<Candidate, CandidateDto, long>
    {
        public CandidateAppService(IRepository<Candidate, long> repository)
            : base(repository)
        {
        }

        // Tùy chỉnh: Khi Ứng viên tạo hồ sơ, tự động lấy ID của họ từ Session
        public override async Task<CandidateDto> CreateAsync(CandidateDto input)
        {
            var candidate = ObjectMapper.Map<Candidate>(input);
            candidate.UserId = (long)AbpSession.UserId; // "Ép" UserId theo người đang login

            await Repository.InsertAsync(candidate);
            return MapToEntityDto(candidate);
        }
    }
}