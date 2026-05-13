import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CourseModule", (m) => {
  const course = m.contract("CourseContract");

  return { course };
});
