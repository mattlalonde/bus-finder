import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BusRouteInfoForm } from "./busRouteInfoForm";

describe("BusRouteInfoForm", () => {
  test("Form displays default values", () => {
    const searchTypeValue = "latlng";
    const searchTypeOptionText = "Lat/Lng";
    const searchForValue = "0.123,-0.123";
    const radiusValue = 1000;

    render(
      <BusRouteInfoForm
        defaultValues={{
          searchType: searchTypeValue,
          searchFor: searchForValue,
          range: radiusValue,
        }}
        onSubmit={vi.fn()}
      />
    );

    const latLngOption = screen.getByRole("option", {
      name: searchTypeOptionText,
    });
    const searchFor = screen.getByLabelText("Search For");
    const radius = screen.getByLabelText("Radius");

    expect((latLngOption as HTMLOptionElement).selected).toBe(true);
    expect((searchFor as HTMLInputElement).value).toBe(searchForValue);
    expect((radius as HTMLInputElement).value).toBe(radiusValue.toString());
  });

  test("Can update Search Type", async () => {
    render(<BusRouteInfoForm onSubmit={vi.fn()} />);

    const searchTypeValue = "latlng";
    const searchTypeOptionText = "Lat/Lng";

    const searchType = screen.getByLabelText("Search Type");
    const latLngOption = screen.getByRole("option", {
      name: searchTypeOptionText,
    });

    await userEvent.selectOptions(searchType, searchTypeValue);

    expect((latLngOption as HTMLOptionElement).selected).toBe(true);
  });

  test("Can update Search For", async () => {
    render(<BusRouteInfoForm onSubmit={vi.fn()} />);

    const searchForValue = "0.123,-0.123";
    const searchFor = screen.getByLabelText("Search For");

    await userEvent.type(searchFor, searchForValue);

    expect((searchFor as HTMLInputElement).value).toBe(searchForValue);
  });

  test("Can update radius", async () => {
    render(<BusRouteInfoForm onSubmit={vi.fn()} />);

    const radiusValue = 1000;
    const radius = screen.getByLabelText("Radius");

    fireEvent.change(radius, { target: { value: radiusValue } });

    expect((radius as HTMLInputElement).value).toBe(radiusValue.toString());
  });

  test("Shows error message if search for field is empty", async () => {
    const submitMock = vi.fn();
    render(<BusRouteInfoForm onSubmit={submitMock} />);

    const searchFor = screen.getByLabelText("Search For");
    const submitButton = screen.getByRole("button", { name: "Search" });

    userEvent.clear(searchFor);

    await userEvent.click(submitButton);

    expect(submitMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText("Search For is a required field")
    ).toBeDefined();
  });

  test("Submitting form raises event with correct values", async () => {
    const submitMock = vi.fn();
    render(<BusRouteInfoForm onSubmit={submitMock} />);

    const searchTypeValue = "latlng";
    const searchForValue = "0.123,-0.123";
    const radiusValue = 1000;

    const searchType = screen.getByLabelText("Search Type");
    const searchFor = screen.getByLabelText("Search For");
    const radius = screen.getByLabelText("Radius");
    const submitButton = screen.getByRole("button", { name: "Search" });

    await userEvent.selectOptions(searchType, searchTypeValue);
    await userEvent.type(searchFor, searchForValue);
    fireEvent.change(radius, { target: { value: radiusValue } });

    await userEvent.click(submitButton);

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(submitMock).toHaveBeenCalledWith({
      searchType: searchTypeValue,
      searchFor: searchForValue,
      range: radiusValue,
    });
  });
});
