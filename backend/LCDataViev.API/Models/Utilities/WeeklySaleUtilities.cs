using System.Globalization;

namespace LCDataViev.API.Models.Utilities
{
    public static class WeeklySaleUtilities
    {
        /// <summary>
        /// Gets the week number for a given date according to ISO 8601 standard
        /// </summary>
        /// <param name="date">The date to get the week number for</param>
        /// <returns>The ISO week number (1-53)</returns>
        public static int GetIsoWeekNumber(DateTime date)
        {
            var calendar = CultureInfo.InvariantCulture.Calendar;
            return calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }

        /// <summary>
        /// Gets the start date of a week for a given year and week number
        /// </summary>
        /// <param name="year">The year</param>
        /// <param name="weekNumber">The week number (1-53)</param>
        /// <returns>The start date of the week (Monday)</returns>
        public static DateTime GetWeekStartDate(int year, int weekNumber)
        {
            var jan1 = new DateTime(year, 1, 1);
            var daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;
            var firstThursday = jan1.AddDays(daysOffset);
            var firstWeek = CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            var weekNum = weekNumber;
            if (firstWeek <= 1)
            {
                weekNum -= 1;
            }
            var result = firstThursday.AddDays(weekNum * 7);
            return result.AddDays(-3);
        }

        /// <summary>
        /// Gets the end date of a week for a given year and week number
        /// </summary>
        /// <param name="year">The year</param>
        /// <param name="weekNumber">The week number (1-53)</param>
        /// <returns>The end date of the week (Sunday)</returns>
        public static DateTime GetWeekEndDate(int year, int weekNumber)
        {
            return GetWeekStartDate(year, weekNumber).AddDays(6);
        }

        /// <summary>
        /// Validates if a date range represents a valid week (7 days)
        /// </summary>
        /// <param name="startDate">The start date</param>
        /// <param name="endDate">The end date</param>
        /// <returns>True if the date range represents a valid week</returns>
        public static bool IsValidWeekRange(DateTime startDate, DateTime endDate)
        {
            var daysDifference = (endDate - startDate).Days;
            return daysDifference == 6 && startDate.DayOfWeek == DayOfWeek.Monday && endDate.DayOfWeek == DayOfWeek.Sunday;
        }

        /// <summary>
        /// Gets the current week number
        /// </summary>
        /// <returns>The current ISO week number</returns>
        public static int GetCurrentWeekNumber()
        {
            return GetIsoWeekNumber(DateTime.Now);
        }

        /// <summary>
        /// Gets the current year
        /// </summary>
        /// <returns>The current year</returns>
        public static int GetCurrentYear()
        {
            return DateTime.Now.Year;
        }
    }
}
