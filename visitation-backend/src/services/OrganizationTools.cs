using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Identity;
public class OrganizationTools
{
    private const int INVITE_EXPIRATION_DAYS = 1;
    public static async Task<Guid> NewUserInvite(string phoneNumber, int organizationID, string connectionString)
    {
        var token = Guid.NewGuid();
        var expiresAt = DateTime.UtcNow.AddDays(INVITE_EXPIRATION_DAYS);

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            await conn.OpenAsync();

            string query = @"
            INSERT INTO Invites (Token, PhoneNumber, OrganizationID, ExpiresAt)
            VALUES (@Token, @PhoneNumber, @OrganizationID, @ExpiresAt);";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Token", token);
                cmd.Parameters.AddWithValue("@PhoneNumber", phoneNumber);
                cmd.Parameters.AddWithValue("@OrganizationID", organizationID);
                cmd.Parameters.AddWithValue("@ExpiresAt", expiresAt);

                await cmd.ExecuteNonQueryAsync();
            }
        }
        return token;
    }
    public static async Task<int> GetOrgIDFromInviteOrBlank(string? inviteToken, string connectionString)
    {
        if (inviteToken != null)
        {
            var invite = await getInvite(inviteToken, connectionString);
            return invite.OrganizationID;
        }
        else
        {
            return await NewBlankOrganization(connectionString);
        }
    }
    public static async Task<Invite> getInvite(string token, string connectionString)
    {
        Invite invite = null;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {

            await conn.OpenAsync();

            string query = @"
            SELECT 
                OrganizationID,
                PhoneNumber
            FROM Invites
            Where Token = @Token;";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Token", token);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        invite = new Invite
                        {
                            OrganizationID = reader.GetInt32(0),
                            PhoneNumber = reader.GetString(1)
                        };
                    }
                }
            }
        }
        return invite;
    }
    public static async Task<int> NewBlankOrganization(string connectionString)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            await conn.OpenAsync();

            string query = @"
                INSERT INTO Organizations (Name)
                VALUES (null);
                SELECT CAST(SCOPE_IDENTITY() AS int);";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            }
        }
    }
}