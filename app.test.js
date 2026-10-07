const request = require("supertest");
const app = require("./app");

describe("Product API", () => {
  test("GET /health trả 503 khi chưa kết nối MongoDB", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(503);
    expect(res.body.database).toBe("disconnected");
  });

  test("GET đường dẫn không tồn tại trả 404", async () => {
    const res = await request(app).get("/khong-ton-tai");
    expect(res.statusCode).toBe(404);
  });
});
