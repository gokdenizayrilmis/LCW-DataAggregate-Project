using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Models.Validation
{
    public class DateRangeValidationAttribute : ValidationAttribute
    {
        private readonly string _startDatePropertyName;
        private readonly string _endDatePropertyName;

        public DateRangeValidationAttribute(string startDatePropertyName, string endDatePropertyName)
        {
            _startDatePropertyName = startDatePropertyName;
            _endDatePropertyName = endDatePropertyName;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var startDateProperty = validationContext.ObjectType.GetProperty(_startDatePropertyName);
            var endDateProperty = validationContext.ObjectType.GetProperty(_endDatePropertyName);

            if (startDateProperty == null || endDateProperty == null)
            {
                return new ValidationResult("Invalid property names for date range validation");
            }

            var startDate = startDateProperty.GetValue(validationContext.ObjectInstance) as DateTime?;
            var endDate = endDateProperty.GetValue(validationContext.ObjectInstance) as DateTime?;

            if (startDate.HasValue && endDate.HasValue && endDate <= startDate)
            {
                return new ValidationResult($"{_endDatePropertyName} must be after {_startDatePropertyName}");
            }

            return ValidationResult.Success;
        }
    }
}
