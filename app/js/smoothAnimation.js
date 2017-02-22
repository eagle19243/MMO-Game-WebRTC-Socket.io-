class SmoothAnimation {
  constructor(object) {
    for (const i in object) {
      this[i] = object[i];
    }

    this.__time = performance.now();

    this.__smoothRate = 0.5;
  }

  update(object) {
    for (const i in object) {
      this[i] = object[i];
    }
  }

  loop() {
    const time = performance.now();
    const deltaTime = time - this.___time;

    this.___x += (this.__x - this.___x) * this.__smoothRate;
    this.__x += (this._x - this.__x) * this.__smoothRate;

    this.___y += (this.__y - this.___y) * this.__smoothRate;
    this.__y += (this._y - this.__y) * this.__smoothRate;

    this.___radius += (this.__radius - this.___radius) * this.__smoothRate;
    this.__radius += (this._radius - this.__radius) * this.__smoothRate;
  }

  set x(value) {
    if (this._x === undefined) {
      this.__x = this.___x = value;
    }
    this._x = value;
  }

  get x() {
    return this.___x | 0;
  }

  set y(value) {
    if (this._y === undefined) {
      this.__y = this.___y = value;
    }
    this._y = value;
  }

  get y() {
    return this.___y | 0;
  }

  set radius(value) {
    if (this._radius === undefined) {
      this.__radius = this.___radius = value;
    }
    this._radius = value;
  }

  get radius() {
    return this.___radius | 0;
  }
}

export default SmoothAnimation;
