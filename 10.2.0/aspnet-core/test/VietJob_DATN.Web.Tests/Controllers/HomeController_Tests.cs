using VietJob_DATN.Models.TokenAuth;
using VietJob_DATN.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace VietJob_DATN.Web.Tests.Controllers;

public class HomeController_Tests : VietJob_DATNWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}