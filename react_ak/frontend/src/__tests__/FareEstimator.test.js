import { render, fireEvent, screen } from "@testing-library/react";
import FareEstimator from "../pages/FareEstimator";
import { MemoryRouter } from "react-router-dom";

test("shows error if fields are empty", () => {
  render(
    <MemoryRouter>
      <FareEstimator />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText("Get Estimate"));
  expect(screen.getByText("Please enter both locations")).toBeInTheDocument();
});
