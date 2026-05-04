using System;
using System.Text;
using System.Security.Claims;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity; // Thêm để dùng PasswordHasher
using Abp.Configuration;
using Abp.Zero.Configuration;
using Abp.Domain.Repositories;
using Abp.UI; // Thêm để dùng UserFriendlyException
using VietJob.Authorization.Accounts.Dto;
using VietJob.Authorization.Users;


namespace VietJob.Authorization.Accounts;

public class AccountAppService : VietJobAppServiceBase
{
    public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

    private readonly UserRegistrationManager _userRegistrationManager;
    private readonly IRepository<User, long> _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher; // Thêm để check pass mã hóa

    public AccountAppService(
        UserRegistrationManager userRegistrationManager,
        IRepository<User, long> userRepository,
        IPasswordHasher<User> passwordHasher)
    {
        _userRegistrationManager = userRegistrationManager;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    // --- HÀM LOGIN: ĐÃ SỬA ĐỂ CHECK PASS MÃ HÓA ---
    public async Task<string> LoginCustom(LoginDto input)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.EmailAddress == input.Email);

        if (user == null)
            throw new UserFriendlyException("Email không tồn tại trong hệ thống!");

        // Check mật khẩu đã mã hóa
        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, input.MatKhau);
        if (verificationResult == PasswordVerificationResult.Failed)
            throw new UserFriendlyException("Mật khẩu không chính xác!");

        // Tạo JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("VietJob_D207F65F53744E549063AD7285C7BA8B");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim("email", user.EmailAddress),
                new Claim("userName", user.UserName)
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
    {
        var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
        if (tenant == null) return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
        if (!tenant.IsActive) return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
        return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id);
    }

    // --- HÀM REGISTER: ĐÃ THÊM SAVECHANGES ĐỂ ĐẨY VÀO SQL ---
    public async Task<RegisterOutput> Register(Register input)
    {
        var user = await _userRegistrationManager.RegisterAsync(
            input.Ho,
            input.Ten,
            input.Email,
            input.Tendangnhap,
            input.Matkhau,
            true
        );

        // QUAN TRỌNG: Ép ghi dữ liệu vào Database ngay lập tức
        await CurrentUnitOfWork.SaveChangesAsync();

        var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

        return new RegisterOutput
        {
            CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
        };
    }
}