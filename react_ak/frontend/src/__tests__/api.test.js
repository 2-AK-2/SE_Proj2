import axios from "axios";
import { fareAPI } from "../api/api";

jest.mock("axios");

test("fareAPI.estimate calls backend", async () => {
  axios.post.mockResolvedValue({
    data: { fare: 120, eta: 10 }
  });

  const result = await fareAPI.estimate("A", "B");

  expect(result.fare).toBe(120);
  expect(result.eta).toBe(10);
});
