using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace LCDataViev.API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = new
            {
                error = new
                {
                    message = GetErrorMessage(exception),
                    details = GetErrorDetails(exception),
                    timestamp = DateTime.UtcNow,
                    path = context.Request.Path,
                    method = context.Request.Method
                }
            };

            var statusCode = GetStatusCode(exception);
            context.Response.StatusCode = statusCode;

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }

        private static string GetErrorMessage(Exception exception)
        {
            return exception switch
            {
                ArgumentException => "Geçersiz parametre",
                UnauthorizedAccessException => "Yetkisiz erişim",
                FileNotFoundException => "Dosya bulunamadı",
                InvalidOperationException => "Geçersiz işlem",
                TimeoutException => "İşlem zaman aşımına uğradı",
                _ => "Beklenmeyen bir hata oluştu"
            };
        }

        private static string GetErrorDetails(Exception exception)
        {
            // Production'da detaylı hata bilgisi verme
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                return exception.ToString();
            }
            
            return "Hata detayları güvenlik nedeniyle gizlenmiştir";
        }

        private static int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                ArgumentException => (int)HttpStatusCode.BadRequest,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                FileNotFoundException => (int)HttpStatusCode.NotFound,
                InvalidOperationException => (int)HttpStatusCode.BadRequest,
                TimeoutException => (int)HttpStatusCode.RequestTimeout,
                _ => (int)HttpStatusCode.InternalServerError
            };
        }
    }
}
