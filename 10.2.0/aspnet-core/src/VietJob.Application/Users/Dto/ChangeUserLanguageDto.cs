using System.ComponentModel.DataAnnotations;

namespace VietJob.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}