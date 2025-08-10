using System.ComponentModel.DataAnnotations;
using LCDataViev.API.Models.Utilities;

namespace LCDataViev.API.Models.Validation
{
    public class WeekNumberValidationAttribute : ValidationAttribute
    {
        private readonly string _startDatePropertyName;
        private readonly string _weekNumberPropertyName;

        public WeekNumberValidationAttribute(string startDatePropertyName, string weekNumberPropertyName)
        {
            _startDatePropertyName = startDatePropertyName;
            _weekNumberPropertyName = weekNumberPropertyName;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var startDateProperty = validationContext.ObjectType.GetProperty(_startDatePropertyName);
            var weekNumberProperty = validationContext.ObjectType.GetProperty(_weekNumberPropertyName);

            if (startDateProperty == null || weekNumberProperty == null)
            {
                return new ValidationResult("Invalid property names for week number validation");
            }

            var startDate = startDateProperty.GetValue(validationContext.ObjectInstance) as DateTime?;
            var weekNumber = weekNumberProperty.GetValue(validationContext.ObjectInstance) as int?;

            if (startDate.HasValue && weekNumber.HasValue)
            {
                var expectedWeekNumber = WeeklySaleUtilities.GetIsoWeekNumber(startDate.Value);
                if (weekNumber.Value != expectedWeekNumber)
                {
                    return new ValidationResult($"Week number {weekNumber.Value} does not match the start date. Expected week number for {startDate.Value:yyyy-MM-dd} is {expectedWeekNumber}");
                }
            }

            return ValidationResult.Success;
        }
    }
}
