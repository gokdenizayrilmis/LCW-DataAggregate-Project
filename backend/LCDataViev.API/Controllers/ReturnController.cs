using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReturnController : ControllerBase
    {
        private readonly IReturnRepository _returnRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ReturnController> _logger;

        public ReturnController(IReturnRepository returnRepository, IStoreRepository storeRepository, IUserRepository userRepository, ILogger<ReturnController> logger)
        {
            _returnRepository = returnRepository;
            _storeRepository = storeRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReturnResponseDto>>> GetReturns()
        {
            var returns = await _returnRepository.GetAllAsync();
            var response = returns.Select(r => new ReturnResponseDto
            {
                Id = r.Id,
                StoreId = r.StoreId,
                StoreName = r.Store?.Name,
                UserId = r.UserId,
                UserName = r.User?.Name,
                Amount = r.Amount,
                ReturnDate = r.ReturnDate,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<ReturnResponseDto>>> GetReturnsByStore(int storeId)
        {
            var returns = await _returnRepository.GetReturnsByStoreIdAsync(storeId);
            var response = returns.Select(r => new ReturnResponseDto
            {
                Id = r.Id,
                StoreId = r.StoreId,
                StoreName = r.Store?.Name,
                UserId = r.UserId,
                UserName = r.User?.Name,
                Amount = r.Amount,
                ReturnDate = r.ReturnDate,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReturnResponseDto>>> GetReturnsByUser(int userId)
        {
            var returns = await _returnRepository.GetReturnsByUserIdAsync(userId);
            var response = returns.Select(r => new ReturnResponseDto
            {
                Id = r.Id,
                StoreId = r.StoreId,
                StoreName = r.Store?.Name,
                UserId = r.UserId,
                UserName = r.User?.Name,
                Amount = r.Amount,
                ReturnDate = r.ReturnDate,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReturnResponseDto>> GetReturn(int id)
        {
            var ret = await _returnRepository.GetReturnWithDetailsAsync(id);
            if (ret == null)
                return NotFound();
            var response = new ReturnResponseDto
            {
                Id = ret.Id,
                StoreId = ret.StoreId,
                StoreName = ret.Store?.Name,
                UserId = ret.UserId,
                UserName = ret.User?.Name,
                Amount = ret.Amount,
                ReturnDate = ret.ReturnDate,
                CreatedAt = ret.CreatedAt,
                UpdatedAt = ret.UpdatedAt
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ReturnResponseDto>> CreateReturn(CreateReturnDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                return BadRequest("User not found");
            var ret = new Return
            {
                StoreId = dto.StoreId,
                UserId = dto.UserId,
                Amount = dto.Amount,
                ReturnDate = dto.ReturnDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var created = await _returnRepository.AddAsync(ret);
            var response = new ReturnResponseDto
            {
                Id = created.Id,
                StoreId = created.StoreId,
                StoreName = store.Name,
                UserId = created.UserId,
                UserName = user.Name,
                Amount = created.Amount,
                ReturnDate = created.ReturnDate,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
            return CreatedAtAction(nameof(GetReturn), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReturn(int id, UpdateReturnDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var ret = await _returnRepository.GetByIdAsync(id);
            if (ret == null)
                return NotFound();
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                return BadRequest("User not found");
            ret.StoreId = dto.StoreId;
            ret.UserId = dto.UserId;
            ret.Amount = dto.Amount;
            ret.ReturnDate = dto.ReturnDate;
            ret.UpdatedAt = DateTime.UtcNow;
            await _returnRepository.UpdateAsync(ret);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReturn(int id)
        {
            var ret = await _returnRepository.GetByIdAsync(id);
            if (ret == null)
                return NotFound();
            await _returnRepository.DeleteAsync(id);
            return NoContent();
        }
    }
} 