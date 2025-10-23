/**
 * Security Service for MET24 Phase 1
 * 
 * Handles security measures and validation
 * 
 * @version 3.0.0-core
 */

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in milliseconds
  sessionTimeout: number; // in milliseconds
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'password_change' | 'suspicious_activity';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  details: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class SecurityService {
  private config: SecurityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  };

  private securityEvents: SecurityEvent[] = [];
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private lockedAccounts: Map<string, Date> = new Map();

  /**
   * Validate password strength
   */
  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check minimum length
    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }

    // Check for uppercase letters
    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for numbers
    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for special characters
    if (this.config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a more secure password');
    }

    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
      warnings.push('Password contains repeated characters, consider using a more varied password');
    }

    // Check for sequential characters
    if (this.hasSequentialChars(password)) {
      warnings.push('Password contains sequential characters, consider using a more random password');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    // Check for disposable email domains
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      warnings.push('Disposable email addresses are not recommended');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(userId: string): boolean {
    const lockoutTime = this.lockedAccounts.get(userId);
    if (!lockoutTime) {
      return false;
    }

    if (Date.now() - lockoutTime.getTime() > this.config.lockoutDuration) {
      this.lockedAccounts.delete(userId);
      this.loginAttempts.delete(userId);
      return false;
    }

    return true;
  }

  /**
   * Record login attempt
   */
  recordLoginAttempt(userId: string, success: boolean, ipAddress?: string, userAgent?: string): void {
    const event: SecurityEvent = {
      id: this.generateId(),
      type: success ? 'login_success' : 'login_failure',
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      details: { success }
    };

    this.securityEvents.push(event);

    if (!success) {
      const attempts = this.loginAttempts.get(userId) || { count: 0, lastAttempt: new Date() };
      attempts.count++;
      attempts.lastAttempt = new Date();
      this.loginAttempts.set(userId, attempts);

      if (attempts.count >= this.config.maxLoginAttempts) {
        this.lockedAccounts.set(userId, new Date());
        this.logSecurityEvent('suspicious_activity', userId, {
          reason: 'max_login_attempts_exceeded',
          attempts: attempts.count
        });
      }
    } else {
      // Reset login attempts on successful login
      this.loginAttempts.delete(userId);
      this.lockedAccounts.delete(userId);
    }
  }

  /**
   * Log security event
   */
  logSecurityEvent(
    type: SecurityEvent['type'],
    userId?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): void {
    const event: SecurityEvent = {
      id: this.generateId(),
      type,
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      details: details || {}
    };

    this.securityEvents.push(event);
  }

  /**
   * Get security events
   */
  getSecurityEvents(userId?: string, limit: number = 100): SecurityEvent[] {
    let events = this.securityEvents;

    if (userId) {
      events = events.filter(event => event.userId === userId);
    }

    return events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate user input
   */
  validateInput(input: string, type: 'text' | 'email' | 'password' | 'url'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for empty input
    if (!input || input.trim().length === 0) {
      errors.push('Input cannot be empty');
      return { isValid: false, errors, warnings };
    }

    // Sanitize input
    const sanitized = this.sanitizeInput(input);

    // Check for potential XSS
    if (input !== sanitized) {
      errors.push('Input contains potentially dangerous characters');
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        return this.validateEmail(input);
      
      case 'password':
        return this.validatePassword(input);
      
      case 'url':
        try {
          new URL(input);
        } catch {
          errors.push('Invalid URL format');
        }
        break;
      
      case 'text':
        if (input.length > 1000) {
          warnings.push('Text is very long, consider shortening it');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate secure token
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Hash password (basic implementation)
   */
  async hashPassword(password: string): Promise<string> {
    // In a real implementation, you would use a proper hashing library like bcrypt
    // For now, this is a placeholder
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Check for suspicious activity
   */
  checkSuspiciousActivity(userId: string): boolean {
    const recentEvents = this.getSecurityEvents(userId, 10);
    const recentFailures = recentEvents.filter(
      event => event.type === 'login_failure' && 
      Date.now() - event.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    return recentFailures.length >= 3;
  }

  /**
   * Get security statistics
   */
  getSecurityStatistics(): {
    totalEvents: number;
    failedLogins: number;
    successfulLogins: number;
    lockedAccounts: number;
    suspiciousActivities: number;
  } {
    const totalEvents = this.securityEvents.length;
    const failedLogins = this.securityEvents.filter(e => e.type === 'login_failure').length;
    const successfulLogins = this.securityEvents.filter(e => e.type === 'login_success').length;
    const lockedAccounts = this.lockedAccounts.size;
    const suspiciousActivities = this.securityEvents.filter(e => e.type === 'suspicious_activity').length;

    return {
      totalEvents,
      failedLogins,
      successfulLogins,
      lockedAccounts,
      suspiciousActivities
    };
  }

  /**
   * Check for sequential characters
   */
  private hasSequentialChars(password: string): boolean {
    const sequences = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
    const lowerPassword = password.toLowerCase();
    
    return sequences.some(seq => lowerPassword.includes(seq));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update security configuration
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Clear old security events
   */
  clearOldEvents(olderThanDays: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    this.securityEvents = this.securityEvents.filter(
      event => event.timestamp > cutoffDate
    );
  }
}

// Export singleton instance
export const securityService = new SecurityService();
