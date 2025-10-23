import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret-key"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key"

export const generateTokens = (userId: string) => {
  const access_token = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  })

  const refresh_token = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })

  return { access_token, refresh_token }
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string }
  } catch {
    return null
  }
}
