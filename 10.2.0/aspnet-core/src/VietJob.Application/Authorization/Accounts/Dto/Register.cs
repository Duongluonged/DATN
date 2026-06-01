using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.Extensions;
using VietJob.Validation;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VietJob.Authorization.Accounts.Dto;

public class Register : IValidatableObject
{
    public string Ho { get; set; }

    public string Ten { get; set; }

    public string Tendangnhap { get; set; }

    public string Email { get; set; }

    public string Matkhau { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!Tendangnhap.IsNullOrEmpty())
        {
            if (!Tendangnhap.Equals(Email) && ValidationHelper.IsEmail(Tendangnhap))
            {
                yield return new ValidationResult("Username cannot be an email address unless it's the same as your email address!");
            }
        }
    }
}
