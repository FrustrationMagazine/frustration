import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const ToggleButtons = ({ donationType, setDonationType }) => {
  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment">
      <ToggleButton
        value="left"
        aria-label="left aligned">
        Ponctuel
      </ToggleButton>
      <ToggleButton
        value="center"
        aria-label="centered">
        Récurrent
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
