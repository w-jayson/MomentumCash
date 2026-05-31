FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/MomentumCash.Domain/MomentumCash.Domain.csproj", "src/MomentumCash.Domain/"]
COPY ["src/MomentumCash.Application/MomentumCash.Application.csproj", "src/MomentumCash.Application/"]
COPY ["src/MomentumCash.Infrastructure/MomentumCash.Infrastructure.csproj", "src/MomentumCash.Infrastructure/"]
COPY ["src/MomentumCash.Api/MomentumCash.Api.csproj", "src/MomentumCash.Api/"]

RUN dotnet restore "src/MomentumCash.Api/MomentumCash.Api.csproj"

COPY . .
RUN dotnet publish "src/MomentumCash.Api/MomentumCash.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "MomentumCash.Api.dll"]
