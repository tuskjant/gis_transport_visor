declare module "leaflet-easybutton" {
  import * as L from "leaflet";

  interface EasyButtonOptions {
    states?: EasyButtonState[];
    icon?: string;
    title?: string;
    onClick?: (btn: EasyButton, map: L.Map) => void;
    position?: L.ControlPosition;
  }

  interface EasyButtonState {
    stateName: string;
    onClick: (btn: EasyButton, map: L.Map) => void;
    title: string;
    icon: string;
  }

  class EasyButton extends L.Control {
    constructor(
      icon: string,
      onClick: (btn: EasyButton, map: L.Map) => void,
      title?: string,
      id?: string
    );
    constructor(options: EasyButtonOptions);

    state(stateName: string): this;
    enable(): this;
    disable(): this;
    remove(): this;
  }

  function easyButton(
    icon: string,
    onClick: (btn: EasyButton, map: L.Map) => void,
    title?: string,
    id?: string
  ): EasyButton;
  function easyButton(options: EasyButtonOptions): EasyButton;

  function easyBar(
    buttons: EasyButton[],
    options?: L.ControlOptions
  ): L.Control;
}
