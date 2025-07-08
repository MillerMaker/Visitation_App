using System.Security.Claims;
using Microsoft.AspNetCore.Mvc; 
using Microsoft.Data.SqlClient;

public static class AuthenticationController {
    public static void MapAuthenticationRoutes(WebApplication app, string connectionString, string baseFrontendUrl)
    {
        app.MapGet("/checkPhoneOrEmailExists", async (string phoneOrEmail) =>
        {
            if (string.IsNullOrEmpty(phoneOrEmail))
            {
                return Results.BadRequest("Phone or email is required.");
            }
            return Results.Ok(UserTools.CheckPhoneOrEmailExists(phoneOrEmail, connectionString));
        });

        app.MapPost("/createUser", async (
            CreateUserRequest request
        ) =>
        {
            try
            {
                // If the phone or email is null or empty, return a bad request
                if (string.IsNullOrEmpty(request.Phone) && string.IsNullOrEmpty(request.Email))
                {
                    return Results.BadRequest("Either phone or email is required.");
                }

                if ((!string.IsNullOrEmpty(request.Phone) && UserTools.CheckPhoneOrEmailExists(request.Phone, connectionString)) ||
                    (!string.IsNullOrEmpty(request.Email) && UserTools.CheckPhoneOrEmailExists(request.Email, connectionString)))
                {
                    return Results.BadRequest("An account with that Phone or Email already exists, try using /login ");
                }

                // Create a new blank organization for the user
                int orgId = await OrganizationTools.GetOrgIDFromInviteOrBlank(request.InviteToken, connectionString);

                var passwordHash = UserTools.HashPassword(new User(), request.Password);
                int newUserId = await UserTools.CreateUserAsync(request.FirstName, request.LastName, orgId.ToString(), request.Phone, request.Email, passwordHash, connectionString);

                var user = new User
                {
                    UserID = newUserId,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    OrganizationID = orgId,
                    Phone = request.Phone,
                    Email = request.Email,
                    PasswordHash = passwordHash
                };

                return Results.Ok(new { user });
            }
            catch (Exception e)
            {
                Console.Write(e);
                return Results.BadRequest(e);
            }

        });

        app.MapPost("/login", async (LoginRequest request, [FromServices] JwtTokenService jwtService) =>
        {
            try
            {
                var user = await UserTools.GetUser(request.PhoneNumber, null, connectionString);
                if (UserTools.VerifyPassword(user, request.Password, user.PasswordHash))
                {
                    var token = jwtService.GenerateJwtToken(user);
                    return Results.Ok(new { token }); // Also recommend wrapping in object for consistency
                }
                else return Results.BadRequest("Phone number or password is incorrect");
            }
            catch (Exception e)
            {
                return Results.BadRequest($"Server error {e}");
            }
        });

        app.MapPost("/inviteUser", async (string phoneNumber, HttpContext httpContext, [FromServices] SMSservices SMSservices) =>
        {
            var orgClaim = httpContext.User.FindFirst("OrganizationID");
            if (orgClaim == null)
                return Results.Unauthorized();

            int organizationID = int.Parse(orgClaim.Value);
            var token = await OrganizationTools.NewUserInvite(phoneNumber, organizationID, connectionString);
            await SMSservices.sendInviteSMS(phoneNumber, token, baseFrontendUrl);
            return Results.Ok(token);
        });

        app.MapGet("/getUserFromToken", async (HttpContext httpContext, [FromServices] JwtTokenService jwtService) =>
        {
            try
            {
                var userIDClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIDClaim != null)
                {
                    int userID = int.Parse(userIDClaim.Value);
                    var user = await UserTools.GetUser(null, userID, connectionString);
                    return Results.Ok(user);
                }
                return Results.Unauthorized();
            }
            catch (Exception e)
            {
                return Results.BadRequest(e);
            }
        });

        app.MapGet("/getInvite", async (string inviteToken) =>
        {
            try
            {
                var invite = await OrganizationTools.getInvite(inviteToken, connectionString);
                return Results.Ok(invite);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e);
            }
        });
    }
}