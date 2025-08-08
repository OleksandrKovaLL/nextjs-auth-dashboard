import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}


export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}


export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export function isValidPassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    if (password.length > 128) {
        return { isValid: false, message: 'Password must be less than 128 characters' };
    }

    return { isValid: true };
}


//Validate user registration data
export function validateRegistrationData(data: {
    name: string;
    email: string;
    password: string;
}): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    } else if (data.name.trim().length > 60) {
        errors.push('Name must be less than 60 characters');
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }

    // Password validation
    const passwordValidation = isValidPassword(data.password);
    if (!passwordValidation.isValid && passwordValidation.message) {
        errors.push(passwordValidation.message);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}