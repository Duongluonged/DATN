using System;
using System.ComponentModel.DataAnnotations;

namespace VietJob_DATN.Applies.Dto
{
    public class CreateApplyDto
    {
        [Required]
        public Guid JobId { get; set; }

        [Required]
        public string CvUrl { get; set; } // Link CV sau khi bạn upload lên Cloud/Server

        public string CoverLetter { get; set; }
    }
}