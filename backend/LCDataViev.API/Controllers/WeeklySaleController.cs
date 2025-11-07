using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Utilities;
using LCDataViev.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeeklySaleController : ControllerBase
    {
        private readonly IWeeklySaleRepository _weeklySaleRepository;
        private readonly ApplicationDbContext _context;

        public WeeklySaleController(IWeeklySaleRepository weeklySaleRepository, ApplicationDbContext context)
        {
            _weeklySaleRepository = weeklySaleRepository;
            _context = context;
        }

        // GET: api/WeeklySale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeeklySale>>> GetWeeklySales()
        {
            var weeklySales = await _weeklySaleRepository.GetAllAsync();
            return Ok(weeklySales);
        }

        // GET: api/WeeklySale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WeeklySale>> GetWeeklySale(int id)
        {
            var weeklySale = await _weeklySaleRepository.GetByIdAsync(id);

            if (weeklySale == null)
            {
                return NotFound();
            }

            return Ok(weeklySale);
        }

        // GET: api/WeeklySale/store/5
        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<WeeklySale>>> GetWeeklySalesByStore(int storeId)
        {
            var weeklySales = await _weeklySaleRepository.GetWeeklySalesByStoreAsync(storeId);
            return Ok(weeklySales);
        }

        // GET: api/WeeklySale/date-range
        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<WeeklySale>>> GetWeeklySalesByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var weeklySales = await _weeklySaleRepository.GetWeeklySalesByDateRangeAsync(startDate, endDate);
            return Ok(weeklySales);
        }

        // GET: api/WeeklySale/store/{storeId}/week/{weekNumber}/year/{year}
        [HttpGet("store/{storeId}/week/{weekNumber}/year/{year}")]
        public async Task<ActionResult<WeeklySale>> GetWeeklySaleByStoreAndWeek(int storeId, int weekNumber, int year)
        {
            var weeklySale = await _weeklySaleRepository.GetWeeklySaleByStoreAndWeekAsync(storeId, weekNumber, year);

            if (weeklySale == null)
            {
                return NotFound();
            }

            return Ok(weeklySale);
        }

        // GET: api/WeeklySale/store/{storeId}/revenue
        [HttpGet("store/{storeId}/revenue")]
        public async Task<ActionResult<decimal>> GetTotalRevenueByStoreAndPeriod(
            int storeId, 
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var totalRevenue = await _weeklySaleRepository.GetTotalRevenueByStoreAndPeriodAsync(storeId, startDate, endDate);
            return Ok(totalRevenue);
        }

        // GET: api/WeeklySale/year/{year}
        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<WeeklySale>>> GetWeeklySalesByYear(int year)
        {
            var weeklySales = await _weeklySaleRepository.GetWeeklySalesByYearAsync(year);
            return Ok(weeklySales);
        }

        // GET: api/WeeklySale/store/{storeId}/average-revenue
        [HttpGet("store/{storeId}/average-revenue")]
        public async Task<ActionResult<decimal>> GetAverageWeeklyRevenueByStore(
            int storeId, 
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var averageRevenue = await _weeklySaleRepository.GetAverageWeeklyRevenueByStoreAsync(storeId, startDate, endDate);
            return Ok(averageRevenue);
        }

        // GET: api/WeeklySale/week-info/{year}/{weekNumber}
        [HttpGet("week-info/{year}/{weekNumber}")]
        public ActionResult<object> GetWeekInfo(int year, int weekNumber)
        {
            if (weekNumber < 1 || weekNumber > 53)
            {
                return BadRequest("Week number must be between 1 and 53");
            }

            var weekStartDate = WeeklySaleUtilities.GetWeekStartDate(year, weekNumber);
            var weekEndDate = WeeklySaleUtilities.GetWeekEndDate(year, weekNumber);

            return Ok(new
            {
                Year = year,
                WeekNumber = weekNumber,
                WeekStartDate = weekStartDate,
                WeekEndDate = weekEndDate,
                IsValidWeek = WeeklySaleUtilities.IsValidWeekRange(weekStartDate, weekEndDate)
            });
        }

        // GET: api/WeeklySale/current-week
        [HttpGet("current-week")]
        public ActionResult<object> GetCurrentWeekInfo()
        {
            var currentYear = WeeklySaleUtilities.GetCurrentYear();
            var currentWeek = WeeklySaleUtilities.GetCurrentWeekNumber();
            var weekStartDate = WeeklySaleUtilities.GetWeekStartDate(currentYear, currentWeek);
            var weekEndDate = WeeklySaleUtilities.GetWeekEndDate(currentYear, currentWeek);

            return Ok(new
            {
                Year = currentYear,
                WeekNumber = currentWeek,
                WeekStartDate = weekStartDate,
                WeekEndDate = weekEndDate,
                IsValidWeek = WeeklySaleUtilities.IsValidWeekRange(weekStartDate, weekEndDate)
            });
        }

        // POST: api/WeeklySale
        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<WeeklySale>> CreateWeeklySale(CreateWeeklySaleDto createDto)
        {
            // Token'daki store ile eşleşme
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }
            if (createDto.StoreId != userStoreId)
            {
                return Forbid();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate that week number is unique for the store within the year
            var isWeekNumberUnique = await _weeklySaleRepository.IsWeekNumberUniqueForStoreAsync(
                createDto.StoreId, 
                createDto.WeekNumber, 
                createDto.WeekStartDate.Year);

            if (!isWeekNumberUnique)
            {
                return BadRequest($"Week {createDto.WeekNumber} already exists for this store in year {createDto.WeekStartDate.Year}");
            }

            // Validate that the store exists
            var store = await _context.Stores.FindAsync(createDto.StoreId);
            if (store == null)
            {
                return BadRequest($"Store with ID {createDto.StoreId} does not exist");
            }

            // Validate that the week dates are not in the future
            if (createDto.WeekStartDate > DateTime.UtcNow || createDto.WeekEndDate > DateTime.UtcNow)
            {
                return BadRequest("Week dates cannot be in the future");
            }

            // Validate that the week dates are not too far in the past (e.g., more than 5 years ago)
            var fiveYearsAgo = DateTime.UtcNow.AddYears(-5);
            if (createDto.WeekStartDate < fiveYearsAgo || createDto.WeekEndDate < fiveYearsAgo)
            {
                return BadRequest("Week dates cannot be more than 5 years in the past");
            }

            // Validate that the revenue and sold products are reasonable
            if (createDto.WeeklyRevenue > 1000000000) // 1 billion TL
            {
                return BadRequest("Weekly revenue cannot exceed 1 billion TL");
            }

            if (createDto.SoldProducts > 100000) // 100,000 products
            {
                return BadRequest("Sold products count cannot exceed 100,000");
            }

            // Validate that there are no overlapping weeks for the same store
            var overlappingWeeks = await _weeklySaleRepository.FindAsync(w => 
                w.StoreId == createDto.StoreId && 
                w.IsActive &&
                ((w.WeekStartDate <= createDto.WeekStartDate && w.WeekEndDate >= createDto.WeekStartDate) ||
                 (w.WeekStartDate <= createDto.WeekEndDate && w.WeekEndDate >= createDto.WeekEndDate) ||
                 (w.WeekStartDate >= createDto.WeekStartDate && w.WeekEndDate <= createDto.WeekEndDate)));

            if (overlappingWeeks.Any())
            {
                return BadRequest("Week dates overlap with existing weeks for this store");
            }

            // Validate that the week dates represent exactly 7 days
            var daysDifference = (createDto.WeekEndDate - createDto.WeekStartDate).Days;
            if (daysDifference != 6)
            {
                return BadRequest("Week must represent exactly 7 days (6 days difference between start and end dates)");
            }

            // Validate that the week starts on Monday and ends on Sunday
            if (createDto.WeekStartDate.DayOfWeek != DayOfWeek.Monday)
            {
                return BadRequest("Week must start on Monday");
            }

            if (createDto.WeekEndDate.DayOfWeek != DayOfWeek.Sunday)
            {
                return BadRequest("Week must end on Sunday");
            }

            // Validate that the week number matches the actual dates
            var expectedWeekNumber = WeeklySaleUtilities.GetIsoWeekNumber(createDto.WeekStartDate);
            if (createDto.WeekNumber != expectedWeekNumber)
            {
                return BadRequest($"Week number {createDto.WeekNumber} does not match the start date. Expected week number for {createDto.WeekStartDate:yyyy-MM-dd} is {expectedWeekNumber}");
            }

            var weeklySale = new WeeklySale
            {
                StoreId = createDto.StoreId,
                WeekNumber = createDto.WeekNumber,
                WeeklyRevenue = createDto.WeeklyRevenue,
                SoldProducts = createDto.SoldProducts,
                WeekStartDate = createDto.WeekStartDate,
                WeekEndDate = createDto.WeekEndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var createdWeeklySale = await _weeklySaleRepository.AddAsync(weeklySale);

            return CreatedAtAction(nameof(GetWeeklySale), new { id = createdWeeklySale.Id }, createdWeeklySale);
        }

        // PUT: api/WeeklySale/5
        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> UpdateWeeklySale(int id, UpdateWeeklySaleDto updateDto)
        {
            // Token'daki store ile eşleşme
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }
            if (existingWeeklySale.StoreId != userStoreId)
            {
                return Forbid();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingWeeklySale = await _weeklySaleRepository.GetByIdAsync(id);
            if (existingWeeklySale == null)
            {
                return NotFound();
            }

            // Validate that week number is unique for the store within the year (excluding current record)
            var isWeekNumberUnique = await _weeklySaleRepository.IsWeekNumberUniqueForStoreAsync(
                existingWeeklySale.StoreId, 
                updateDto.WeekNumber, 
                updateDto.WeekStartDate.Year, 
                id);

            if (!isWeekNumberUnique)
            {
                return BadRequest($"Week {updateDto.WeekNumber} already exists for this store in year {updateDto.WeekStartDate.Year}");
            }

            existingWeeklySale.WeekNumber = updateDto.WeekNumber;
            existingWeeklySale.WeeklyRevenue = updateDto.WeeklyRevenue;
            existingWeeklySale.SoldProducts = updateDto.SoldProducts;
            existingWeeklySale.WeekStartDate = updateDto.WeekStartDate;
            existingWeeklySale.WeekEndDate = updateDto.WeekEndDate;
            existingWeeklySale.UpdatedAt = DateTime.UtcNow;

            await _weeklySaleRepository.UpdateAsync(existingWeeklySale);

            return NoContent();
        }

        // DELETE: api/WeeklySale/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> DeleteWeeklySale(int id)
        {
            var weeklySale = await _weeklySaleRepository.GetByIdAsync(id);
            if (weeklySale == null)
            {
                return NotFound();
            }

            // Token'daki store ile eşleşme
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }
            if (weeklySale.StoreId != userStoreId)
            {
                return Forbid();
            }

            weeklySale.IsActive = false;
            weeklySale.UpdatedAt = DateTime.UtcNow;
            await _weeklySaleRepository.UpdateAsync(weeklySale);

            return NoContent();
        }
    }
} 