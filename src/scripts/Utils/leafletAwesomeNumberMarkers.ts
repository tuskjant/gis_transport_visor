/*
Adapted from:
  Leaflet.AwesomeNumberMarkers, a plugin that adds number markers for Leaflet

  http://leafletjs.com
  https://github.com/zahidul-islam
*/

import * as L from 'leaflet';

interface AwesomeNumberMarkerOptions extends L.IconOptions {
  icon: string;
  markerColor: string;
  numberColor: string;
  number: string;
}

class AwesomeNumberMarkers extends L.Icon {
  options: AwesomeNumberMarkerOptions;

  constructor(options: AwesomeNumberMarkerOptions) {
    super(options);
    this.options = {
      iconSize: [35, 45],
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
      className: 'awesome-number-marker',
      ...options,
    };
  }

  createIcon(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = this._createInner();
    this._setIconStyles(div, 'icon-' + this.options.markerColor);
    return div;
  }

  _createInner(): string {
    let iconColorStyle = "";
    if (this.options.numberColor) {
      iconColorStyle = "style='color: " + this.options.numberColor + "' ";
    }
    return "<i " + iconColorStyle + "><b>" + this.options.number + "</b></i>";
  }

  _setIconStyles(img: HTMLElement, name: string): void {
    const size = L.point(this.options.iconSize as L.PointTuple);
    const anchor = L.point(this.options.iconAnchor as L.PointTuple);

    img.className = 'awesome-number-marker-' + name + ' ' + this.options.className;

    if (anchor) {
      img.style.marginLeft = (-anchor.x) + 'px';
      img.style.marginTop = (-anchor.y) + 'px';
    }

    if (size) {
      img.style.width = size.x + 'px';
      img.style.height = size.y + 'px';
    }
  }
}

export { AwesomeNumberMarkers };
export type { AwesomeNumberMarkerOptions };
