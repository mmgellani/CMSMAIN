Push-Location ../src/server
dotnet publish server.csproj -f netcoreapp2.2 -o ../../dist --configuration Release --runtime win-x64
Pop-Location