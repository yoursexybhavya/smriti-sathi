/// Temporal orientation helper formatting dates and times in full words
/// to alleviate temporal disorientation in dementia patients.
class DateFormatter {
  DateFormatter._();

  static const List<String> _weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  static const List<String> _hindiWeekdays = [
    'सोमवार',
    'मंगलवार',
    'बुधवार',
    'गुरुवार',
    'शुक्रवार',
    'शनिवार',
    'रविवार',
  ];

  static const List<String> _months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  static const List<String> _hindiMonths = [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ];

  /// Fully spelled-out English date: "Thursday, 18 September"
  static String formatElderlyDate(DateTime date) {
    final weekday = _weekdays[date.weekday - 1];
    final month = _months[date.month - 1];
    return '$weekday, ${date.day} $month';
  }

  /// Fully spelled-out Hindi date: "गुरुवार, 18 सितंबर"
  static String formatHindiElderlyDate(DateTime date) {
    final weekday = _hindiWeekdays[date.weekday - 1];
    final month = _hindiMonths[date.month - 1];
    return '$weekday, ${date.day} $month';
  }

  /// 12-hour formatted time: "08:30 AM"
  static String formatTime(int hour, int minute) {
    final period = hour >= 12 ? 'PM' : 'AM';
    final formattedHour = hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    final formattedMinute = minute.toString().padLeft(2, '0');
    return '${formattedHour.toString().padLeft(2, '0')}:$formattedMinute $period';
  }

  /// Day-phase greeting in Hindi and English
  static String getGreeting(DateTime date) {
    final hour = date.hour;
    if (hour < 12) {
      return 'नमस्ते, शुभ प्रभात!\nGood Morning';
    } else if (hour < 17) {
      return 'नमस्ते, शुभ दोपहर!\nGood Afternoon';
    } else {
      return 'नमस्ते, शुभ संध्या!\nGood Evening';
    }
  }
}
