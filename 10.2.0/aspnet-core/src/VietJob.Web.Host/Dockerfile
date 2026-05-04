FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/VietJob.Web.Host/VietJob.Web.Host.csproj", "src/VietJob.Web.Host/"]
COPY ["src/VietJob.Web.Core/VietJob.Web.Core.csproj", "src/VietJob.Web.Core/"]
COPY ["src/VietJob.Application/VietJob.Application.csproj", "src/VietJob.Application/"]
COPY ["src/VietJob.Core/VietJob.Core.csproj", "src/VietJob.Core/"]
COPY ["src/VietJob.EntityFrameworkCore/VietJob.EntityFrameworkCore.csproj", "src/VietJob.EntityFrameworkCore/"]
WORKDIR "/src/src/VietJob.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/VietJob.Web.Host", "src/VietJob.Web.Host"]
COPY ["src/VietJob.Web.Core", "src/VietJob.Web.Core"]
COPY ["src/VietJob.Application", "src/VietJob.Application"]
COPY ["src/VietJob.Core", "src/VietJob.Core"]
COPY ["src/VietJob.EntityFrameworkCore", "src/VietJob.EntityFrameworkCore"]
WORKDIR "/src/src/VietJob.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "VietJob.Web.Host.dll"]
