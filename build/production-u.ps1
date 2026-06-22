Push-Location ../src/server
dotnet publish server.csproj -f netcoreapp2.2 -o ../../dist --configuration Release --runtime ubuntu.16.04-x64
Pop-Location