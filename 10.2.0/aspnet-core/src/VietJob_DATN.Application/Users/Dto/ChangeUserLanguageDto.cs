using System.ComponentModel.DataAnnotations;

namespace VietJob_DATN.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}