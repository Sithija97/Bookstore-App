import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";

const testEnv = {
  NODE_ENV: "test",
  PORT: "3001",
  JWT_ALGORITHM: "HS256",
  JWT_ACCESS_SECRET: "test-access-secret-value-1234567890",
  JWT_REFRESH_SECRET: "test-refresh-secret-value-1234567890",
  TOKEN_HASH_SECRET: "test-token-hash-secret-value-1234567890",
  ACCESS_TOKEN_TTL: "15m",
  REFRESH_TOKEN_TTL: "7d",
  COOKIE_SECURE: "false",
  COOKIE_SAME_SITE: "lax",
  REFRESH_REUSE_REVOKE_SCOPE: "user",
  CORS_ORIGINS: "http://localhost:5173",
  REFRESH_COOKIE_NAME: "refresh_token",
  CSRF_COOKIE_NAME: "csrf_token",
  CSRF_HEADER_NAME: "x-csrf-token",
  BCRYPT_ROUNDS: "8",
  LOGIN_RATE_LIMIT_WINDOW_MINUTES: "15",
  LOGIN_RATE_LIMIT_MAX: "20",
  REFRESH_RATE_LIMIT_WINDOW_MINUTES: "10",
  REFRESH_RATE_LIMIT_MAX: "30",
  LOGIN_MAX_ATTEMPTS: "5",
  LOGIN_LOCK_BASE_MINUTES: "5",
  LOGIN_LOCK_MAX_MINUTES: "60",
};

let mongoServer: MongoMemoryServer;
let createApp: typeof import("../../../app").createApp;
let RefreshTokenModel: typeof import("../model/refreshToken.model").RefreshTokenModel;
let UserModel: typeof import("../../users/model/user.model").UserModel;

function applyTestEnv(mongoUri: string): void {
  Object.assign(process.env, testEnv, { MONGODB_URI: mongoUri });
}

function getCookieValue(
  setCookieHeaders: string[] | undefined,
  cookieName: string,
): string {
  const match = setCookieHeaders?.find((header) =>
    header.startsWith(`${cookieName}=`),
  );

  if (!match) {
    throw new Error(`Missing cookie: ${cookieName}`);
  }

  return match.split(";")[0].split("=")[1];
}

async function seedAndLogin(
  app: ReturnType<typeof createApp>,
  email = "reader@example.com",
) {
  await request(app).post("/auth/register").send({
    email,
    password: "Password123!",
    name: "Reader",
  });

  const loginResponse = await request(app).post("/auth/login").send({
    email,
    password: "Password123!",
  });

  const accessToken = (loginResponse.body.tokens?.accessToken as string) ?? "";
  const setCookieHeaders = Array.isArray(loginResponse.headers["set-cookie"])
    ? loginResponse.headers["set-cookie"]
    : [loginResponse.headers["set-cookie"]];
  const refreshToken = getCookieValue(setCookieHeaders, "refresh_token");
  const csrfToken = getCookieValue(setCookieHeaders, "csrf_token");

  return { accessToken, refreshToken, csrfToken };
}

describe("auth integration", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    applyTestEnv(mongoServer.getUri());

    ({ createApp } = await import("../../../app"));
    ({ RefreshTokenModel } = await import("../model/refreshToken.model"));
    ({ UserModel } = await import("../../users/model/user.model"));

    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("rotates refresh tokens on refresh", async () => {
    const app = createApp();
    const { accessToken, refreshToken, csrfToken } = await seedAndLogin(app);

    const refreshResponse = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [
        `refresh_token=${refreshToken}`,
        `csrf_token=${csrfToken}`,
      ])
      .set("x-csrf-token", csrfToken)
      .send({ refreshToken, csrfToken });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.tokens.accessToken).toBeTypeOf("string");
    expect(refreshResponse.body.tokens.refreshToken).toBeTypeOf("string");
    expect(refreshResponse.body.tokens.refreshToken).not.toBe(refreshToken);

    const totalTokens = await RefreshTokenModel.countDocuments({});
    expect(totalTokens).toBeGreaterThanOrEqual(1);

    const meResponse = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(meResponse.status).toBe(200);
  });

  it("detects refresh token reuse and revokes the family", async () => {
    const app = createApp();
    const { refreshToken, csrfToken } = await seedAndLogin(
      app,
      "reuse@example.com",
    );

    await request(app)
      .post("/auth/refresh")
      .set("Cookie", [
        `refresh_token=${refreshToken}`,
        `csrf_token=${csrfToken}`,
      ])
      .set("x-csrf-token", csrfToken)
      .send({ refreshToken, csrfToken })
      .expect(200);

    const reuseResponse = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [
        `refresh_token=${refreshToken}`,
        `csrf_token=${csrfToken}`,
      ])
      .set("x-csrf-token", csrfToken)
      .send({ refreshToken, csrfToken });

    expect(reuseResponse.status).toBe(401);

    const familyRecords = await RefreshTokenModel.find({}).lean();
    expect(familyRecords.some((record) => record.status === "reused")).toBe(
      true,
    );
    expect(
      familyRecords.every((record) =>
        ["revoked", "reused", "rotated"].includes(record.status),
      ),
    ).toBe(true);
  });

  it("logs out a single session and logs out all sessions", async () => {
    const app = createApp();
    const { refreshToken, csrfToken } = await seedAndLogin(
      app,
      "logout@example.com",
    );

    await request(app)
      .post("/auth/logout")
      .set("Cookie", [
        `refresh_token=${refreshToken}`,
        `csrf_token=${csrfToken}`,
      ])
      .set("x-csrf-token", csrfToken)
      .send({ refreshToken, csrfToken })
      .expect(204);

    const loginAgain = await request(app).post("/auth/login").send({
      email: "logout@example.com",
      password: "Password123!",
    });

    const secondAccessToken = loginAgain.body.tokens.accessToken as string;
    const setCookieHeaders2 = Array.isArray(loginAgain.headers["set-cookie"])
      ? loginAgain.headers["set-cookie"]
      : [loginAgain.headers["set-cookie"]];
    const secondRefreshToken = getCookieValue(
      setCookieHeaders2,
      "refresh_token",
    );
    const secondCsrfToken = getCookieValue(setCookieHeaders2, "csrf_token");

    await request(app)
      .post("/auth/logout-all")
      .set("Authorization", `Bearer ${secondAccessToken}`)
      .set("Cookie", [
        `refresh_token=${secondRefreshToken}`,
        `csrf_token=${secondCsrfToken}`,
      ])
      .set("x-csrf-token", secondCsrfToken)
      .send({ csrfToken: secondCsrfToken })
      .expect(204);

    const user = await UserModel.findOne({
      email: "logout@example.com",
    }).lean();
    const activeTokens = await RefreshTokenModel.countDocuments({
      userId: String(user?._id),
      status: "active",
    });

    expect(activeTokens).toBe(0);
    await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${secondAccessToken}`)
      .expect(401);
  });
});
