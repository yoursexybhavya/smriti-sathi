/**
 * SMRITI SATHI — Input Validator
 * 
 * Validates user input to prevent common issues.
 * This is a basic layer — production would need server-side validation too.
 */

export class InputValidator {
  // Sanitize string input
  static sanitizeString(input: string, maxLength: number = 500): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      // Remove control characters except newlines
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Validate name
  static validateName(name: string): { valid: boolean; error?: string } {
    const sanitized = this.sanitizeString(name, 100);
    
    if (!sanitized) {
      return { valid: false, error: 'Name is required' };
    }
    
    if (sanitized.length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (sanitized.length > 100) {
      return { valid: false, error: 'Name must be less than 100 characters' };
    }
    
    // Allow letters, spaces, hyphens, periods (for names like "Dr." or "O'Brien")
    if (!/^[a-zA-Z\u00C0-\u024F\u0900-\u097F\s\-'.]+$/.test(sanitized)) {
      return { valid: false, error: 'Name contains invalid characters' };
    }
    
    return { valid: true };
  }

  // Validate age
  static validateAge(age: number | string): { valid: boolean; value?: number; error?: string } {
    const numAge = typeof age === 'string' ? parseInt(age, 10) : age;
    
    if (isNaN(numAge)) {
      return { valid: false, error: 'Age must be a number' };
    }
    
    if (numAge < 1) {
      return { valid: false, error: 'Age must be at least 1' };
    }
    
    if (numAge > 150) {
      return { valid: false, error: 'Age must be less than 150' };
    }
    
    return { valid: true, value: numAge };
  }

  // Validate PIN (for demo auth)
  static validatePin(pin: string): { valid: boolean; error?: string } {
    if (!pin || typeof pin !== 'string') {
      return { valid: false, error: 'PIN is required' };
    }
    
    const trimmed = pin.trim();
    
    if (trimmed.length < 4) {
      return { valid: false, error: 'PIN must be at least 4 digits' };
    }
    
    if (trimmed.length > 8) {
      return { valid: false, error: 'PIN must be at most 8 digits' };
    }
    
    if (!/^\d+$/.test(trimmed)) {
      return { valid: false, error: 'PIN must contain only numbers' };
    }
    
    return { valid: true };
  }

  // Validate email (basic)
  static validateEmail(email: string): { valid: boolean; error?: string } {
    const sanitized = this.sanitizeString(email, 254);
    
    if (!sanitized) {
      return { valid: false, error: 'Email is required' };
    }
    
    // Basic email regex — not comprehensive but catches obvious errors
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true };
  }

  // Validate phone number (basic)
  static validatePhone(phone: string): { valid: boolean; error?: string } {
    const sanitized = this.sanitizeString(phone, 20);
    
    if (!sanitized) {
      return { valid: false, error: 'Phone number is required' };
    }
    
    // Remove common formatting
    const cleaned = sanitized.replace(/[\s\-\(\)\.]/g, '');
    
    if (cleaned.length < 10) {
      return { valid: false, error: 'Phone number too short' };
    }
    
    if (cleaned.length > 15) {
      return { valid: false, error: 'Phone number too long' };
    }
    
    if (!/^\+?\d+$/.test(cleaned)) {
      return { valid: false, error: 'Phone number contains invalid characters' };
    }
    
    return { valid: true };
  }

  // Validate description/text
  static validateText(text: string, minLength: number = 0, maxLength: number = 1000): { valid: boolean; error?: string } {
    const sanitized = this.sanitizeString(text, maxLength);
    
    if (minLength > 0 && sanitized.length < minLength) {
      return { valid: false, error: `Text must be at least ${minLength} characters` };
    }
    
    return { valid: true };
  }

  // Sanitize object (remove dangerous properties)
  static sanitizeObject<T extends Record<string, unknown>>(obj: T, allowedKeys: string[]): Partial<T> {
    const sanitized: Partial<T> = {};
    
    for (const key of allowedKeys) {
      if (key in obj) {
        (sanitized as Record<string, unknown>)[key] = obj[key];
      }
    }
    
    return sanitized;
  }
}
