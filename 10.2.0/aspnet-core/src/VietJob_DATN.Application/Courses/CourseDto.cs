using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace VietJob_DATN.Courses.Dto
{
    [AutoMapFrom(typeof(Course))]
    [AutoMapTo(typeof(Course))]
    public class CourseDto : EntityDto<int>
    {
        public int NhaTuyenDungId { get; set; }

        public string TieuDe { get; set; }

        public string MoTa { get; set; }

        public string TrangThai { get; set; }

        // CreationTime từ Entity sẽ map vào đây nếu bạn muốn hiển thị ngày tạo
        public System.DateTime CreationTime { get; set; }
    }
}