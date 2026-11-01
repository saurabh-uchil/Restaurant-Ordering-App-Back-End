type Environment = Record<string, unknown>;

const DEFAULT_DEV_ORIGIN = 'http://localhost:5173';
const DEFAULT_SESSION_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

function requiredString(config: Environment, key: string): string {
  const value = config[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

function parseOrigins(value: string): string[] {
  const origins = value.split(',').map((origin) => origin.trim()).filter(Boolean);
  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one frontend origin');
  }

  return [...new Set(origins.map((origin) => {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(`Invalid frontend origin in CORS_ORIGINS: ${origin}`);
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin.replace(/\/$/, '')) {
      throw new Error(`CORS entries must be origins without paths: ${origin}`);
    }
    return parsed.origin;
  }))];
}

export function validateEnvironment(config: Environment): Environment {
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, production, or test');
  }

  const port = Number(config.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  const mongoUri = requiredString(config, 'MONGODB_URI');
  if (!/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
    throw new Error('MONGODB_URI must be a MongoDB connection URI');
  }

  const jwtSecret = requiredString(config, 'JWT_SECRET');
  if (nodeEnv === 'production' && (jwtSecret.length < 32 || /replace|change.?me|example/i.test(jwtSecret))) {
    throw new Error('JWT_SECRET must be a non-placeholder value of at least 32 characters in production');
  }

  const jwtExpiration = String(config.JWT_EXPIRATION ?? '15m').trim();
  if (!/^([1-9]\d*)(ms|s|m|h|d)$/i.test(jwtExpiration)) {
    throw new Error('JWT_EXPIRATION must be a duration such as 15m, 2h, or 7d');
  }

  const frontendUrl = typeof config.FRONTEND_URL === 'string' ? config.FRONTEND_URL.trim() : '';
  const corsInput = typeof config.CORS_ORIGINS === 'string' ? config.CORS_ORIGINS.trim() : '';
  const origins = [
    ...(corsInput ? parseOrigins(corsInput) : []),
    ...(frontendUrl ? parseOrigins(frontendUrl) : []),
  ];
  if (origins.length === 0 && nodeEnv === 'development') origins.push(DEFAULT_DEV_ORIGIN);
  if (origins.length === 0) {
    throw new Error('Set CORS_ORIGINS (or FRONTEND_URL) to the frontend origin');
  }

  const sameSite = String(config.SESSION_COOKIE_SAME_SITE ?? 'lax').toLowerCase();
  if (!['lax', 'strict', 'none'].includes(sameSite)) {
    throw new Error('SESSION_COOKIE_SAME_SITE must be lax, strict, or none');
  }
  const secure = config.SESSION_COOKIE_SECURE === undefined
    ? nodeEnv === 'production'
    : String(config.SESSION_COOKIE_SECURE).toLowerCase() === 'true';
  if (config.SESSION_COOKIE_SECURE !== undefined && !['true', 'false'].includes(String(config.SESSION_COOKIE_SECURE).toLowerCase())) {
    throw new Error('SESSION_COOKIE_SECURE must be true or false');
  }
  if (sameSite === 'none' && !secure) {
    throw new Error('SESSION_COOKIE_SECURE must be true when SESSION_COOKIE_SAME_SITE is none');
  }

  const cookieMaxAge = Number(config.SESSION_COOKIE_MAX_AGE ?? DEFAULT_SESSION_COOKIE_MAX_AGE);
  if (!Number.isSafeInteger(cookieMaxAge) || cookieMaxAge <= 0) {
    throw new Error('SESSION_COOKIE_MAX_AGE must be a positive integer in milliseconds');
  }

  const cookieName = String(config.SESSION_COOKIE_NAME ?? 'dining_session').trim();
  if (!cookieName) throw new Error('SESSION_COOKIE_NAME must not be empty');

  return {
    ...config,
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGODB_URI: mongoUri,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRATION: jwtExpiration,
    CORS_ORIGINS: [...new Set(origins)],
    SESSION_COOKIE_NAME: cookieName,
    SESSION_COOKIE_SECURE: secure,
    SESSION_COOKIE_SAME_SITE: sameSite,
    SESSION_COOKIE_MAX_AGE: cookieMaxAge,
  };
}
