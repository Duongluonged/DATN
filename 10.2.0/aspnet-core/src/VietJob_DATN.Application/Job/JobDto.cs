using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace VietJob_DATN.Jobs.Dto
{
    [AutoMapFrom(typeof(Job))] // Tự động map từ Job Entity sang Dto
    public class JobDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }
        public DateTime ExpirationDate { get; set; }

        // Thông tin nhà tuyển dụng (để hiển thị tên công ty)
        public Guid EmployerId { get; set; }
        public string EmployerName { get; set; }
    }
}