using System.ComponentModel.DataAnnotations;
using LCDataViev.API.Models.Utilities;

namespace LCDataViev.API.Models.Validation
{
    public class ValidWeekRangeAttribute : ValidationAttribute
    {
        private readonly string _startDatePropertyName;
        private readonly string _endDatePropertyName;

        public ValidWeekRangeAttribute(string startDatePropertyName, string endDatePropertyName)
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
                return new ValidationResult("Invalid property names for week range validation");
            }

            var startDate = startDateProperty.GetValue(validationContext.ObjectInstance) as DateTime?;
            var endDate = endDateProperty.GetValue(validationContext.ObjectInstance) as DateTime?;

            if (startDate.HasValue && endDate.HasValue)
            {
                if (!WeeklySaleUtilities.IsValidWeekRange(startDate.Value, endDate.Value))
                {
                    return new ValidationResult("Date range must represent a valid week (7 days from Monday to Sunday)");
                }
            }

            return ValidationResult.Success;
        }
    }
}
