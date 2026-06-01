using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Authorization; // QUAN TRỌNG: Thêm cái này để dùng AllowAnonymous
using Microsoft.EntityFrameworkCore;
using VietJob_DATN.Jobs.Dto;

namespace VietJob_DATN.Jobs
{
    // Mặc định class có thể yêu cầu Login, nhưng ta sẽ mở hàm Search ra
    public class JobAppService : AsyncCrudAppService<Job, JobDto, Guid, PagedJobResultRequestDto, CreateJobDto, JobDto>, IJobAppService
    {
        public JobAppService(IRepository<Job, Guid> repository)
            : base(repository)
        {
        }

        // --- CHO PHÉP TÌM KIẾM KHÔNG CẦN ĐĂNG NHẬP ---
        [AbpAllowAnonymous]
        public override async Task<PagedResultDto<JobDto>> GetAllAsync(PagedJobResultRequestDto input)
        {
            return await base.GetAllAsync(input);
        }

        [AbpAllowAnonymous]
        public override async Task<JobDto> GetAsync(EntityDto<Guid> input)
        {
            var job = await Repository.GetAllIncluding(x => x.Employer)
                .FirstOrDefaultAsync(x => x.Id == input.Id);
            return MapToEntityDto(job);
        }

        // --- LOGIC LỌC DỮ LIỆU ---
        protected override IQueryable<Job> CreateFilteredQuery(PagedJobResultRequestDto input)
        {
            // Sử dụng Left Join với Employer để tránh việc mất dữ liệu khi EmployerId bị sai
            return Repository.GetAllIncluding(x => x.Employer)
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x =>
                    x.Title.ToLower().Contains(input.Keyword.ToLower()) ||
                    (x.Employer != null && x.Employer.Name.ToLower().Contains(input.Keyword.ToLower())) ||
                    x.Description.ToLower().Contains(input.Keyword.ToLower()))

                .WhereIf(!input.Location.IsNullOrWhiteSpace(), x =>
                    x.Location.ToLower().Contains(input.Location.ToLower()))

                .WhereIf(!input.Skill.IsNullOrWhiteSpace(), x =>
                    x.Description.ToLower().Contains(input.Skill.ToLower()))

                .WhereIf(input.MinSalary.HasValue, x => x.MaxSalary >= input.MinSalary)

                .WhereIf(!input.JobLevel.IsNullOrWhiteSpace(), x =>
                    x.Description.ToLower().Contains(input.JobLevel.ToLower()));
        }

        protected override IQueryable<Job> ApplySorting(IQueryable<Job> query, PagedJobResultRequestDto input)
        {
            return base.ApplySorting(query, input).OrderByDescending(x => x.CreationTime);
        }
    }
}