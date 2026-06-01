using System;
using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;

namespace VietJob_DATN.Jobs.Dto
{
    [AutoMapTo(typeof(Job))] // Tự động map từ Dto sang Job Entity để lưu SQL
    public class CreateJobDto
    {
        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string Location { get; set; }

        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }

        public DateTime ExpirationDate { get; set; }

        [Required]
        public Guid EmployerId { get; set; }
    }
}