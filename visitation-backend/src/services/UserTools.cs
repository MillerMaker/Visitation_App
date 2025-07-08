using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration.UserSecrets;
using Twilio.Types;

public class UserTools
{
    public static bool CheckPhoneOrEmailExists(string phoneOrEmail, string connectionString)
    {
        bool userExists = false;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            string query = @"
                SELECT
                    u.ID
                FROM Users u
                WHERE u.Phone = @phoneOrEmail OR u.Email = @phoneOrEmail;";
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@phoneOrEmail", phoneOrEmail);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    userExists = reader.Read();
                }
            }
        }
        return userExists;
    }

    public static async Task<int> CreateUserAsync(
        string firstName,
        string lastName,
        string organizationID,
        string phone,
        string email,
        string passwordHash,
        string connectionString)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            await conn.OpenAsync();

            string query = @"
                INSERT INTO Users (FirstName, LastName, OrganizationID, Phone, Email, PasswordHash)
                VALUES (@FirstName, @LastName, @OrganizationID, @Phone, @Email, @PasswordHash);
                SELECT CAST(SCOPE_IDENTITY() AS int);";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@FirstName", (object?)firstName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@LastName", (object?)lastName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@OrganizationID", (object?)organizationID ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Phone", (object?)phone ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Email", (object?)email ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PasswordHash", (object?)passwordHash ?? DBNull.Value);

                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            }
        }
    }

    public static async Task<User?> GetUser(string? phoneNumber, int? userID, string connectionString)
    {
        if (string.IsNullOrEmpty(phoneNumber) && userID == null)
            throw new ArgumentException("Either phoneNumber or userID must be provided.");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            await conn.OpenAsync();

            string query;
            SqlCommand cmd;

            if (!string.IsNullOrEmpty(phoneNumber))
            {
                query = @"
                    SELECT ID, FirstName, LastName, OrganizationID, Phone, PasswordHash
                    FROM Users
                    WHERE Phone = @phoneNumber";
                cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@phoneNumber", phoneNumber);
            }
            else
            {
                query = @"
                    SELECT ID, FirstName, LastName, OrganizationID, Phone, PasswordHash
                    FROM Users
                    WHERE ID = @userID";
                cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@userID", userID);
            }

            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    return new User
                    {
                        UserID = reader.GetInt32(0),
                        FirstName = reader.GetString(1),
                        LastName = reader.GetString(2),
                        OrganizationID = reader.GetInt32(3),
                        PhoneNumber = reader.GetString(4),
                        PasswordHash = reader.GetString(5)
                    };
                }
            }
        }

        return null;
    }  

    public static string HashPassword(User user, string rawPassword)
    {
        var hasher = new PasswordHasher<User>();
        return hasher.HashPassword(user, rawPassword);
    }

    public static bool VerifyPassword(User user, string rawPassword, string storedHash)
    {
        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, storedHash, rawPassword);
        return result == PasswordVerificationResult.Success;
    }
}