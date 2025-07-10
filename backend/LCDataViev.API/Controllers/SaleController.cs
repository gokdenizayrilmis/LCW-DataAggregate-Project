using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SaleController : ControllerBase
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<SaleController> _logger;

        public SaleController(ISaleRepository saleRepository, IStoreRepository storeRepository, IUserRepository userRepository, ILogger<SaleController> logger)
        {
            _saleRepository = saleRepository;
            _storeRepository = storeRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSales()
        {
            var sales = await _saleRepository.GetAllAsync();
            var response = sales.Select(s => new SaleResponseDto
            {
                Id = s.Id,
                StoreId = s.StoreId,
                StoreName = s.Store?.Name,
                UserId = s.UserId,
                UserName = s.User?.Name,
                Amount = s.Amount,
                SaleDate = s.SaleDate,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSalesByStore(int storeId)
        {
            var sales = await _saleRepository.GetSalesByStoreIdAsync(storeId);
            var response = sales.Select(s => new SaleResponseDto
            {
                Id = s.Id,
                StoreId = s.StoreId,
                StoreName = s.Store?.Name,
                UserId = s.UserId,
                UserName = s.User?.Name,
                Amount = s.Amount,
                SaleDate = s.SaleDate,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSalesByUser(int userId)
        {
            var sales = await _saleRepository.GetSalesByUserIdAsync(userId);
            var response = sales.Select(s => new SaleResponseDto
            {
                Id = s.Id,
                StoreId = s.StoreId,
                StoreName = s.Store?.Name,
                UserId = s.UserId,
                UserName = s.User?.Name,
                Amount = s.Amount,
                SaleDate = s.SaleDate,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleResponseDto>> GetSale(int id)
        {
            var sale = await _saleRepository.GetSaleWithDetailsAsync(id);
            if (sale == null)
                return NotFound();
            var response = new SaleResponseDto
            {
                Id = sale.Id,
                StoreId = sale.StoreId,
                StoreName = sale.Store?.Name,
                UserId = sale.UserId,
                UserName = sale.User?.Name,
                Amount = sale.Amount,
                SaleDate = sale.SaleDate,
                CreatedAt = sale.CreatedAt,
                UpdatedAt = sale.UpdatedAt
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<SaleResponseDto>> CreateSale(CreateSaleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                return BadRequest("User not found");
            var sale = new Sale
            {
                StoreId = dto.StoreId,
                UserId = dto.UserId,
                Amount = dto.Amount,
                SaleDate = dto.SaleDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var created = await _saleRepository.AddAsync(sale);
            var response = new SaleResponseDto
            {
                Id = created.Id,
                StoreId = created.StoreId,
                StoreName = store.Name,
                UserId = created.UserId,
                UserName = user.Name,
                Amount = created.Amount,
                SaleDate = created.SaleDate,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
            return CreatedAtAction(nameof(GetSale), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, UpdateSaleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var sale = await _saleRepository.GetByIdAsync(id);
            if (sale == null)
                return NotFound();
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                return BadRequest("User not found");
            sale.StoreId = dto.StoreId;
            sale.UserId = dto.UserId;
            sale.Amount = dto.Amount;
            sale.SaleDate = dto.SaleDate;
            sale.UpdatedAt = DateTime.UtcNow;
            await _saleRepository.UpdateAsync(sale);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var sale = await _saleRepository.GetByIdAsync(id);
            if (sale == null)
                return NotFound();
            await _saleRepository.DeleteAsync(id);
            return NoContent();
        }
    }
} 