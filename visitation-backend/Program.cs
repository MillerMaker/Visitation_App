using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;

// To publish, run:
// rm -rf ./publish
// dotnet publish -c Release -o ./publish

// To start both frontend and backend servers in development:
// from the root directory:
    // CD visitation-app
    // npm run dev

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var connectionString = configuration.GetSection("DBSettings")["ConnectionString"];
if (string.IsNullOrEmpty(connectionString))
    throw new InvalidOperationException("Database connection string is missing in configuration.");


var baseFrontendUrl = configuration.GetSection("AppSettings")["BaseFrontendURL"];
if (string.IsNullOrEmpty(baseFrontendUrl))
    throw new InvalidOperationException("Base Frontend URL is missing in configuration.");

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<UserLocations>();
builder.Services.AddSingleton<LocationBroadcastHandler>();
builder.Services.AddSingleton<LocationUpdateHandler>();
builder.Services.AddSingleton<ConnectionManager>();
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddSingleton<SMSservices>();
builder.Services.AddSingleton<WebSocketManager>(sp =>
    new WebSocketManager( 
        sp.GetRequiredService<LocationUpdateHandler>(),
        sp.GetRequiredService<LocationBroadcastHandler>()));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000", // For DEV
            "https://visitation-frontend-bkdzgffegjanheab.centralus-01.azurewebsites.net" // For PROD
        )
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtKey = Environment.GetEnvironmentVariable("Jwt__Key") ?? builder.Configuration["Jwt:Key"];
    if (string.IsNullOrEmpty(jwtKey))
        throw new InvalidOperationException("JWT key is missing in configuration.");
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var webSocketManager = app.Services.GetRequiredService<WebSocketManager>();

//Map Rest and websocket Routes
//webSocketManager.MapWebSocketRoutes(app);
LocationController.MapLocationRoutes(app, connectionString);
AuthenticationController.MapAuthenticationRoutes(app, connectionString, baseFrontendUrl);

app.Run();