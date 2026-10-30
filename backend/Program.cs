using GestorTareas.Api.Data;
using MongoDB.Driver;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration["MongoDB:ConnectionString"];
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Configure MongoDB:ConnectionString using the MongoDB__ConnectionString environment variable.");
}

// Un cliente MongoDB compartido atiende las solicitudes de la aplicación.
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(connectionString));
builder.Services.AddSingleton<TareasRepository>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Scalar muestra la documentación OpenAPI solo durante el desarrollo.
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

public partial class Program;
