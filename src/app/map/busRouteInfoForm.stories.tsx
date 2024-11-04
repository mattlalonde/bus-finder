import type { Meta, StoryObj } from "@storybook/react";

import { BusRouteInfoForm } from "./busRouteInfoForm";
import { fn } from "@storybook/test";

const meta: Meta<typeof BusRouteInfoForm> = {
  component: BusRouteInfoForm,
  decorators: [
    (Story) => (
      <div className="container mx-auto flex-1">
        <Story />
      </div>
    ),
  ],
  args: { onSubmit: fn() },
};

export default meta;

type Story = StoryObj<typeof BusRouteInfoForm>;

export const Form: Story = {};
