import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifyCronAuthorization,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth";

const ORIGINAL_ENV = { ...process.env };

describe("auth module", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret-padding-00000000";
    process.env.APP_PASSWORD = "test-only-password";
    process.env.CRON_SECRET = "test-cron-secret";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("creates and verifies HMAC-SHA256 session tokens", async () => {
    const token = await createSessionToken(60);
    expect(await verifySessionToken(token)).toBe(true);

    const tampered = `${token.slice(0, -2)}ff`;
    expect(await verifySessionToken(tampered)).toBe(false);
  });

  it("rejects expired session tokens", async () => {
    const expiredToken = await createSessionToken(-10);
    expect(await verifySessionToken(expiredToken)).toBe(false);
  });

  it("fails closed when SESSION_SECRET is missing or too short", async () => {
    process.env.SESSION_SECRET = "short";
    await expect(createSessionToken()).rejects.toThrow();
    expect(await verifySessionToken("12345.abc.def")).toBe(false);
  });

  it("verifies password using constant-time check", () => {
    expect(verifyPassword("test-only-password")).toBe(true);
    expect(verifyPassword("wrong-password")).toBe(false);
    expect(verifyPassword("")).toBe(false);
  });

  it("fails closed on CRON_SECRET when unset or mismatched", () => {
    expect(verifyCronAuthorization("Bearer test-cron-secret")).toBe(true);
    expect(verifyCronAuthorization("Bearer wrong")).toBe(false);
    delete process.env.CRON_SECRET;
    expect(verifyCronAuthorization("Bearer undefined")).toBe(false);
  });
});
