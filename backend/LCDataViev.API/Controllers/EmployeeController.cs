using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees
                .Include(e => e.Store)
                .Where(e => e.IsActive)
                .ToListAsync();
        }

        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Store)
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // GET: api/Employee/store/5
        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByStore(int storeId)
        {
            return await _context.Employees
                .Include(e => e.Store)
                .Where(e => e.StoreId == storeId && e.IsActive)
                .ToListAsync();
        }

        // POST: api/Employee
        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            // Tüm navigation properties'yi ignore et
            ModelState.Clear();
            
            // Sadece gerekli field'ları validate et
            if (string.IsNullOrEmpty(employee.Name))
            {
                return BadRequest("Ad gerekli");
            }
            if (string.IsNullOrEmpty(employee.Surname))
            {
                return BadRequest("Soyad gerekli");
            }
            if (string.IsNullOrEmpty(employee.Position))
            {
                return BadRequest("Pozisyon gerekli");
            }

            // Store'un var olup olmadığını kontrol et
            var store = await _context.Stores.FindAsync(employee.StoreId);
            if (store == null)
            {
                return BadRequest("Geçersiz mağaza ID'si");
            }

            // Kullanıcının mağazası ile istek mağazası aynı olmalı
            if (employee.StoreId != userStoreId)
            {
                return Forbid();
            }

            employee.CreatedAt = DateTime.UtcNow;
            employee.UpdatedAt = DateTime.UtcNow;
            employee.IsActive = true;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/Employee/5
        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            if (id != employee.Id)
            {
                return BadRequest();
            }

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound();
            }

            // Store'un var olup olmadığını kontrol et
            var store = await _context.Stores.FindAsync(employee.StoreId);
            if (store == null)
            {
                return BadRequest("Geçersiz mağaza ID'si");
            }

            // Kullanıcının mağazası ile istek mağazası aynı olmalı
            if (employee.StoreId != userStoreId)
            {
                return Forbid();
            }

            existingEmployee.Name = employee.Name;
            existingEmployee.Surname = employee.Surname;
            existingEmployee.Position = employee.Position;
            existingEmployee.Salary = employee.Salary;
            existingEmployee.HireDate = employee.HireDate;
            existingEmployee.Email = employee.Email;
            existingEmployee.Phone = employee.Phone;
            existingEmployee.Avatar = employee.Avatar;
            existingEmployee.StoreId = employee.StoreId;
            existingEmployee.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            // Kullanıcının mağazası ile kaydın mağazası aynı olmalı
            if (employee.StoreId != userStoreId)
            {
                return Forbid();
            }

            // Soft delete - sadece IsActive'i false yap
            employee.IsActive = false;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
} 