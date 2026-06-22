FROM mcr.microsoft.com/dotnet/core/sdk:2.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.1 AS build
WORKDIR /src

# Setup NodeJs
RUN apt-get update && apt-get install -y unzip zip && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -y nodejs

#Copy distinct layers
COPY ./ui.zip .
RUN unzip ui.zip
RUN rm ui.zip
#RUN ls -la /ui/*

COPY ./contract/contract.csproj contract/
COPY ./common/common.csproj common/
COPY ./data/data.csproj data/
COPY ./service/service.csproj service/
COPY ./server/server.csproj server/

RUN dotnet restore contract/*.csproj
RUN dotnet restore common/*.csproj
RUN dotnet restore data/*.csproj
RUN dotnet restore service/*.csproj
RUN dotnet restore server/*.csproj

WORKDIR /src/ui
RUN npm i

WORKDIR /src

# Copy everything else and build
COPY . ./
#RUN dotnet publish -c Release -o out
RUN dotnet publish server/server.csproj -f netcoreapp2.1 -o out --configuration Release --runtime ubuntu.18.04-x64

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/sdk:2.1
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Cms360.UI.dll"]
