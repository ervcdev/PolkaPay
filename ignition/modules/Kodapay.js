const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KodapayModule", (m) => {
  const mockUSDT = m.contract("MockUSDT");
  const kodapay = m.contract("Kodapay", [mockUSDT]);

  return { mockUSDT, kodapay };
});
