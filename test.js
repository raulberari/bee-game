const { Bee, Queen, Worker } = require("./game.js");

describe("Bee Class", () => {
  it("should reduce health when receiving damage", () => {
    const bee = new Bee(100, "Test Bee", 10);
    bee.receiveDamage();
    expect(bee.hp).toBe(90);
  });

  it("should not have negative health", () => {
    const bee = new Bee(5, "Test Bee", 10);
    bee.receiveDamage();
    expect(bee.hp).toBe(0);
  });
});

describe("Queen Class", () => {
  it("should have Queen type, 100 hp, and 8 damage", () => {
    const queen = new Queen();
    expect(queen.type).toBe("Queen");
    expect(queen.hp).toBe(100);
    expect(queen.damage).toBe(8);
  });
});

describe("Worker Class", () => {
  it("should have Worker type, 75 hp, and 10 damage", () => {
    const worker = new Worker();
    expect(worker.type).toBe("Worker");
    expect(worker.hp).toBe(75);
    expect(worker.damage).toBe(10);
  });
});
