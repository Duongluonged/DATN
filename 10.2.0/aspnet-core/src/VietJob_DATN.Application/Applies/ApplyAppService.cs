using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System.Threading.Tasks;
using VietJob_DATN.Applies.Dto;

namespace VietJob_DATN.Applies
{
    [AbpAuthorize] // Bắt buộc phải đăng nhập mới được gọi API này
    public class ApplyAppService : ApplicationService, IApplyAppService
    {
        private readonly IRepository<ApplyJob, long> _applyRepository;

        public ApplyAppService(IRepository<ApplyJob, long> applyRepository)
        {
            _applyRepository = applyRepository;
        }

        public async Task ApplyAsync(CreateApplyDto input)
        {
            // 1. Kiểm tra xem đã đăng nhập chưa
            if (!AbpSession.UserId.HasValue)
            {
                throw new UserFriendlyException("Vui lòng đăng nhập trước khi ứng tuyển!");
            }

            long currentUserId = AbpSession.UserId.Value;

            // 2. Kiểm tra xem ứng viên đã ứng tuyển chưa
            var isExist = await _applyRepository.FirstOrDefaultAsync(x =>
                x.JobId == input.JobId && x.CandidateId == currentUserId);

            if (isExist != null)
            {
                throw new UserFriendlyException("Bạn đã ứng tuyển công việc này rồi!");
            }

            // 3. Tạo bản ghi ứng tuyển
            var apply = new ApplyJob
            {
                JobId = input.JobId,
                CandidateId = currentUserId, // Dùng biến đã kiểm tra an toàn
                CvUrl = input.CvUrl,
                CoverLetter = input.CoverLetter,
                Status = ApplyStatus.Pending
            };

            await _applyRepository.InsertAsync(apply);
        }
    }
}