const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productdb_test";

jest.setTimeout(30000);

const sample = { pid: 1, pname: "Laptop", price: 15000000, quantity: 10 };

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  await Product.init();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await Product.deleteMany({});
  }
  await mongoose.disconnect();
});

describe("Product CRUD với MongoDB thật", () => {
  test("GET /health trả 200 khi đã kết nối MongoDB", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.database).toBe("connected");
  });

  test("POST tạo sản phẩm", async () => {
    const res = await request(app).post("/api/products").send(sample);
    expect(res.statusCode).toBe(201);
    expect(res.body.pname).toBe("Laptop");
    expect(res.body._id).toBeDefined();
  });

  test("POST thiếu trường trả 400", async () => {
    const res = await request(app).post("/api/products").send({ pid: 2 });
    expect(res.statusCode).toBe(400);
  });

  test("POST trùng pid trả 409", async () => {
    await request(app).post("/api/products").send(sample);
    const res = await request(app).post("/api/products").send(sample);
    expect(res.statusCode).toBe(409);
  });

  test("GET danh sách và GET theo pid", async () => {
    await request(app).post("/api/products").send(sample);
    const list = await request(app).get("/api/products");
    expect(list.statusCode).toBe(200);
    expect(list.body).toHaveLength(1);
    const one = await request(app).get("/api/products/1");
    expect(one.statusCode).toBe(200);
    expect(one.body.pid).toBe(1);
  });

  test("GET pid không tồn tại trả 404", async () => {
    const res = await request(app).get("/api/products/999");
    expect(res.statusCode).toBe(404);
  });

  test("PUT cập nhật sản phẩm", async () => {
    await request(app).post("/api/products").send(sample);
    const res = await request(app)
      .put("/api/products/1")
      .send({ price: 14000000, quantity: 8 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(14000000);
    expect(res.body.quantity).toBe(8);
  });

  test("DELETE xóa sản phẩm rồi GET trả 404", async () => {
    await request(app).post("/api/products").send(sample);
    const del = await request(app).delete("/api/products/1");
    expect(del.statusCode).toBe(200);
    const after = await request(app).get("/api/products/1");
    expect(after.statusCode).toBe(404);
  });
});
