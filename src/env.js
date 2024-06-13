export function env(name, defaultValue) {
    const value = process.env[name] ?? defaultValue;
    if (typeof value === 'undefined') {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
