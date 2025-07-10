using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserRepository userRepository, IStoreRepository storeRepository, ILogger<UserController> logger)
        {
            _userRepository = userRepository;
            _storeRepository = storeRepository;
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
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
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
            var response = new UserResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Surname = created.Surname,
                Email = created.Email,
                StoreId = created.StoreId,
                StoreName = store.Name,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
            return CreatedAtAction(nameof(GetUser), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            user.Name = dto.Name;
            user.Surname = dto.Surname;
            user.Email = dto.Email;
            user.StoreId = dto.StoreId;
            user.IsActive = dto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            await _userRepository.DeleteAsync(id);
            return NoContent();
        }
    }
} 