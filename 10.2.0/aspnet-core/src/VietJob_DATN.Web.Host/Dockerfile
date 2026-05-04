FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/VietJob_DATN.Web.Host/VietJob_DATN.Web.Host.csproj", "src/VietJob_DATN.Web.Host/"]
COPY ["src/VietJob_DATN.Web.Core/VietJob_DATN.Web.Core.csproj", "src/VietJob_DATN.Web.Core/"]
COPY ["src/VietJob_DATN.Application/VietJob_DATN.Application.csproj", "src/VietJob_DATN.Application/"]
COPY ["src/VietJob_DATN.Core/VietJob_DATN.Core.csproj", "src/VietJob_DATN.Core/"]
COPY ["src/VietJob_DATN.EntityFrameworkCore/VietJob_DATN.EntityFrameworkCore.csproj", "src/VietJob_DATN.EntityFrameworkCore/"]
WORKDIR "/src/src/VietJob_DATN.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/VietJob_DATN.Web.Host", "src/VietJob_DATN.Web.Host"]
COPY ["src/VietJob_DATN.Web.Core", "src/VietJob_DATN.Web.Core"]
COPY ["src/VietJob_DATN.Application", "src/VietJob_DATN.Application"]
COPY ["src/VietJob_DATN.Core", "src/VietJob_DATN.Core"]
COPY ["src/VietJob_DATN.EntityFrameworkCore", "src/VietJob_DATN.EntityFrameworkCore"]
WORKDIR "/src/src/VietJob_DATN.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "VietJob_DATN.Web.Host.dll"]
