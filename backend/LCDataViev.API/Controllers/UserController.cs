using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserRepository userRepository, IStoreRepository storeRepository, INotificationRepository notificationRepository, ILogger<UserController> logger)
        {
            _userRepository = userRepository;
            _storeRepository = storeRepository;
            _notificationRepository = notificationRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var response = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                StoreId = u.StoreId,
                StoreName = u.Store?.Name,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetActiveUsers()
        {
            var users = await _userRepository.GetActiveUsersAsync();
            var response = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                StoreId = u.StoreId,
                StoreName = u.Store?.Name,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsersByStore(int storeId)
        {
            var users = await _userRepository.GetUsersByStoreIdAsync(storeId);
            var response = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                StoreId = u.StoreId,
                StoreName = u.Store?.Name,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _userRepository.GetUserWithDetailsAsync(id);
            if (user == null)
                return NotFound();
            var response = new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                StoreId = user.StoreId,
                StoreName = user.Store?.Name,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Store? store = null;
            if (dto.StoreId.HasValue)
            {
                store = await _storeRepository.GetByIdAsync(dto.StoreId.Value);
                if (store == null)
                    return BadRequest("Store not found");
            }
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                StoreId = dto.StoreId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var created = await _userRepository.AddAsync(user);
            // Bildirim ekle
            await _notificationRepository.AddAsync(new Notification {
                Message = $"Yeni kullanıcı eklendi: {created.Name} {created.Surname}",
                Type = "Success",
                UserId = created.Id,
                StoreId = created.StoreId,
                CreatedAt = DateTime.UtcNow
            });
            var response = new UserResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Surname = created.Surname,
                Email = created.Email,
                StoreId = created.StoreId,
                StoreName = store?.Name,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
            return CreatedAtAction(nameof(GetUser), new { id = created.Id }, response);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            if (string.IsNullOrEmpty(user.PasswordHash))
                return Unauthorized("Şifre hatalı.");

            _logger.LogInformation($"Login attempt for email: {dto.Email}");
            
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            _logger.LogInformation($"Password verification result: {isPasswordValid}");
            
            if (!isPasswordValid)
                return Unauthorized("Şifre yanlış.");

            // JWT Token üretimi
            var jwtSettings = HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role == LCDataViev.API.Models.Enums.UserRole.Admin ? "admin" : "user"),
                new Claim("name", user.Name),
                new Claim("storeId", user.StoreId?.ToString() ?? "")
            };
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(int.Parse(jwtSettings["ExpirationHours"] ?? "24")),
                signingCredentials: creds
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new {
                token = tokenString,
                user = new {
                    user.Id,
                    user.Username,
                    user.Name,
                    user.Surname,
                    user.Email,
                    Role = user.Role == LCDataViev.API.Models.Enums.UserRole.Admin ? "admin" : "user",
                    user.IsActive,
                    user.StoreId
                }
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            Store? store = null;
            if (dto.StoreId.HasValue)
            {
                store = await _storeRepository.GetByIdAsync(dto.StoreId.Value);
                if (store == null)
                    return BadRequest("Store not found");
            }
            user.Name = dto.Name;
            user.Surname = dto.Surname;
            user.Email = dto.Email;
            user.StoreId = dto.StoreId;
            user.IsActive = dto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            // Bildirim ekle
            await _notificationRepository.AddAsync(new Notification {
                Message = $"Kullanıcı güncellendi: {user.Name} {user.Surname}",
                Type = "Info",
                UserId = user.Id,
                StoreId = user.StoreId,
                CreatedAt = DateTime.UtcNow
            });
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            await _userRepository.DeleteAsync(id);
            // Bildirim ekle
            await _notificationRepository.AddAsync(new Notification {
                Message = $"Kullanıcı silindi: {user.Name} {user.Surname}",
                Type = "Error",
                UserId = user.Id,
                StoreId = user.StoreId,
                CreatedAt = DateTime.UtcNow
            });
            return NoContent();
        }

        // POST: api/User/{id}/reset-password
        [HttpPost("{id}/reset-password")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ResetPassword(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            // Güçlü geçici şifre üret
            string GenerateTempPassword(int length = 12)
            {
                const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // O/I çıkarıldı
                const string lower = "abcdefghijkmnopqrstuvwxyz"; // l çıkarıldı
                const string digits = "23456789"; // 0/1 çıkarıldı
                const string symbols = "!@$%*?";
                var all = upper + lower + digits + symbols;
                var rng = new Random();
                var chars = new char[length];
                // En az birer karakter sınıfı
                chars[0] = upper[rng.Next(upper.Length)];
                chars[1] = lower[rng.Next(lower.Length)];
                chars[2] = digits[rng.Next(digits.Length)];
                chars[3] = symbols[rng.Next(symbols.Length)];
                for (int i = 4; i < length; i++)
                {
                    chars[i] = all[rng.Next(all.Length)];
                }
                // Karıştır
                return new string(chars.OrderBy(_ => rng.Next()).ToArray());
            }

            var tempPassword = GenerateTempPassword();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            await _notificationRepository.AddAsync(new Notification {
                Message = $"Kullanıcı şifresi sıfırlandı: {user.Email}",
                Type = "Info",
                UserId = user.Id,
                StoreId = user.StoreId,
                CreatedAt = DateTime.UtcNow
            });

            // Geçici şifreyi sadece bu yanıtta döndür (log'lamıyoruz)
            return Ok(new { temporaryPassword = tempPassword });
        }
    }
} 