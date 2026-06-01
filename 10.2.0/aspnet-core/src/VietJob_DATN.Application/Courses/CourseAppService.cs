using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using VietJob_DATN.Courses.Dto;

namespace VietJob_DATN.Courses
{
    [AbpAuthorize]
    public class CourseAppService : AsyncCrudAppService<Course, CourseDto, int>
    {
        public CourseAppService(IRepository<Course, int> repository)
            : base(repository)
        {
        }

        // --- DÀNH CHO NHÀ TUYỂN DỤNG ---

        public override async Task<CourseDto> CreateAsync(CourseDto input)
        {
            var course = ObjectMapper.Map<Course>(input);

            // Gán ID người dùng hiện tại và mặc định trạng thái chờ duyệt
            course.NhaTuyenDungId = (int)AbpSession.GetUserId();
            course.TrangThai = "ChoPheDuyet";

            await Repository.InsertAsync(course);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(course);
        }

        public override async Task<CourseDto> UpdateAsync(CourseDto input)
        {
            var course = await Repository.GetAsync(input.Id);

            // Chỉ chủ sở hữu hoặc Admin mới được sửa
            if (!IsGranted("Pages.Administration") && course.NhaTuyenDungId != (int)AbpSession.GetUserId())
            {
                throw new UserFriendlyException("Bạn không có quyền chỉnh sửa khóa học này!");
            }

            ObjectMapper.Map(input, course);

            // Nếu nhà tuyển dụng sửa, trạng thái nên quay về chờ duyệt
            if (!IsGranted("Pages.Administration"))
            {
                course.TrangThai = "ChoPheDuyet";
            }

            await Repository.UpdateAsync(course);
            return MapToEntityDto(course);
        }

        // --- DÀNH CHO ADMIN (PHÊ DUYỆT) ---

        [AbpAuthorize("Pages.Administration")] // Chỉ Admin mới thấy hàm này trong Swagger
        public async Task ApproveCourse(EntityDto<int> input)
        {
            var course = await Repository.GetAsync(input.Id);
            course.TrangThai = "DaPheDuyet";
            await Repository.UpdateAsync(course);
        }

        [AbpAuthorize("Pages.Administration")]
        public async Task RejectCourse(EntityDto<int> input)
        {
            var course = await Repository.GetAsync(input.Id);
            course.TrangThai = "TuChoi";
            await Repository.UpdateAsync(course);
        }

        // --- LOGIC LẤY DANH SÁCH ---

        public override async Task<PagedResultDto<CourseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = Repository.GetAll();

            // Phân loại hiển thị:
            // Admin: Thấy tất cả để quản lý/duyệt
            // Nhà tuyển dụng: Chỉ thấy khóa học của họ
            if (!IsGranted("Pages.Administration"))
            {
                var currentUserId = (int)AbpSession.GetUserId();
                query = query.Where(x => x.NhaTuyenDungId == currentUserId);
            }

            var totalCount = await query.CountAsync();
            var courses = await query.PageBy(input).ToListAsync();

            return new PagedResultDto<CourseDto>(
                totalCount,
                courses.Select(MapToEntityDto).ToList()
            );
        }
    }
}