using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReturnController : ControllerBase
    {
        private readonly IReturnRepository _returnRepository;

        public ReturnController(IReturnRepository returnRepository)
        {
            _returnRepository = returnRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Return>>> GetAll()
        {
            try
            {
                var returns = await _returnRepository.GetAllAsync();
                return Ok(returns);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Return>> GetById(int id)
        {
            try
            {
                var returnItem = await _returnRepository.GetByIdAsync(id);
                if (returnItem == null)
                {
                    return NotFound();
                }
                return Ok(returnItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Return>> Create(Return returnItem)
        {
            try
            {
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (returnItem.StoreId != userStoreId)
                {
                    return Forbid();
                }
                await _returnRepository.AddAsync(returnItem);
                return CreatedAtAction(nameof(GetById), new { id = returnItem.Id }, returnItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Update(int id, Return returnItem)
        {
            if (id != returnItem.Id)
            {
                return BadRequest();
            }

            try
            {
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (returnItem.StoreId != userStoreId)
                {
                    return Forbid();
                }
                await _returnRepository.UpdateAsync(returnItem);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var returnItem = await _returnRepository.GetByIdAsync(id);
                if (returnItem == null)
                {
                    return NotFound();
                }

                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (returnItem.StoreId != userStoreId)
                {
                    return Forbid();
                }

                await _returnRepository.DeleteAsync(returnItem);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}