export function useTimeFormatter() {
  /**
   * Convert a date string to 12-hour time format with AM/PM
   * @param dateString - e.g. '2025-08-05 19:53:30'
   * @returns e.g. '7:53 PM'
   */
  function formatTo12HourTime(dateString: string): string {
    // Replace space with T to make it ISO-compatible
    const date = new Date(dateString.replace(' ', 'T'));

    if (isNaN(date.getTime())) {
      console.warn('Invalid date passed:', dateString);
      return '';
    }

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  return {
    formatTo12HourTime
  };
}
