using System.ComponentModel.DataAnnotations;

namespace VietJob_DATN.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
