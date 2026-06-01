using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System;
using System.Threading.Tasks;

namespace VietJob_DATN.Employers.Services
{
    [AbpAuthorize]
    public class EmployerAppService : AsyncCrudAppService<Employer, EmployerDto, Guid>
    {
        public EmployerAppService(IRepository<Employer, Guid> repository)
            : base(repository)
        {
        }

        public override async Task<EmployerDto> CreateAsync(EmployerDto input)
        {
            // Kiểm tra quyền (Nếu cần)
            CheckCreatePermission();

            // 1. Map từ DTO sang Entity
            var employer = ObjectMapper.Map<Employer>(input);

            // 2. Gán UserId từ Session (Ép kiểu long vì AbpSession.UserId là long?)
            // Lưu ý: Kiểm tra xem AbpSession.UserId có null không trước khi ép kiểu
            if (AbpSession.UserId.HasValue)
            {
                employer.UserId = AbpSession.UserId.Value;
            }

            // 3. Chèn vào Database thông qua Repository
            await Repository.InsertAsync(employer);


            // 5. Map ngược lại từ Entity sang DTO để trả về
            return MapToEntityDto(employer);
        }
    }
}