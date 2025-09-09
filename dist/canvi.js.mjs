class e {
  constructor(t = {}) {
    this.options = Object.assign({
      speed: "0.3s",
      width: "300px",
      isDebug: !1,
      position: "left",
      pushContent: !0,
      navbar: ".canvi-navbar",
      content: ".canvi-content",
      openButton: ".canvi-open-button"
    }, t), this.isOpen = !1, this.body = document.querySelector("body"), this.transitionEvent = this._whichTransitionEvent(), this.navbar = document.querySelector(this.options.navbar), this.content = document.querySelector(this.options.content), this.openButton = document.querySelector(this.options.openButton), this.listeners = {
      open: () => this.open(),
      close: () => this.close(),
      responsiveWidth: () => this._responsiveWidth(),
      transitionOpenEnd: (i) => this._transitionOpenEnd(i),
      transitionCloseEnd: (i) => this._transitionCloseEnd(i)
    }, this.init();
  }
  init() {
    this.options.isDebug && (console.log("%c %s", "color: #e01a51; font-style: italic;", "CANVI: Init is running..."), this._objectLog()), this._buildMarkup(), this._initializeMainEvents(), this._triggerCanviEvent("canvi.init"), this.navbar.setAttribute("inert", ""), this.navbar.setAttribute("aria-hidden", "true");
  }
  open() {
    this.isOpen || (this.options.isDebug && console.log("%c %s", "color: #e01a51; font-style: italic;", "CANVI: Open is running..."), this._triggerCanviEvent("canvi.before-open"), this._buildOverlay(), this._setZindex(), this.content.classList.add("is-canvi-open"), this.body.classList.add("is-canvi-open"), this.navbar.classList.add("is-canvi-open"), this._responsiveWidth(), (this.options.pushContent ? this.content : this.navbar).addEventListener(this.transitionEvent, this.listeners.transitionOpenEnd), this.navbar.removeAttribute("inert"), this.navbar.removeAttribute("aria-hidden"), this.isOpen = !0);
  }
  close() {
    this.isOpen && (this.options.isDebug && console.log("%c %s", "color: #e01a51; font-style: italic;", "CANVI: Close is running..."), this._triggerCanviEvent("canvi.before-close"), this.overlay.classList.add("canvi-animate-out"), this.content.style.transform = "translateX(0)", this.body.classList.remove("is-canvi-open"), this.navbar.classList.remove("is-canvi-open"), (this.options.pushContent ? this.content : this.navbar).addEventListener(this.transitionEvent, this.listeners.transitionCloseEnd), this.navbar.setAttribute("inert", ""), this.navbar.setAttribute("aria-hidden", "true"), this.isOpen = !1);
  }
  toggle() {
    this.options.isDebug && console.log("%c %s", "color: #e01a51; font-style: italic;", "CANVI: Toggle is running..."), this.isOpen ? this.close() : this.open();
  }
  _buildMarkup() {
    this.options.isDebug && console.log("%c %s", "color: #ccc; font-style: italic;", "CANVI: Build markup..."), this.options.position && (this.navbar.setAttribute("data-position", this.options.position), this.navbar.setAttribute("data-push-content", this.options.pushContent)), this.navbar.style.width = this.options.width, this.body.classList.add("is-canvi-ready");
  }
  _responsiveWidth() {
    this.navbar.classList.contains("is-canvi-open") && window.matchMedia("(min-width: 0px)").matches && (this.navbar.style.width = this.options.width, this._responsiveWidthHelper(this.options.width)), this.navbar.classList.contains("is-canvi-open") && Array.isArray(this.options.responsiveWidths) && this.options.responsiveWidths.length > -1 && this.options.responsiveWidths.forEach((t) => {
      window.matchMedia(`(min-width: ${t.breakpoint})`).matches && (this.navbar.style.width = t.width, this._responsiveWidthHelper(t.width));
    });
  }
  _responsiveWidthHelper(t) {
    this.options.pushContent && (this.content.style.transform = this.options.position === "left" ? `translateX(${t})` : `translateX(-${t})`);
  }
  _buildOverlay() {
    this.options.isDebug && console.log("%c %s", "color: #32da94; font-style: italic;", "CANVI: Build overlay..."), this.content.querySelector(".canvi-overlay") || (this.overlay = document.createElement("div"), this.overlay.className = "canvi-overlay", this.content.appendChild(this.overlay)), this.overlay.addEventListener("click", this.listeners.close), this._setTransitionSpeed();
  }
  _removeOverlay() {
    this.options.isDebug && console.log("%c %s", "color: #32da94; font-style: italic;", "CANVI: Remove overlay..."), this.overlay && (this.content.removeChild(this.overlay), this.overlay.removeEventListener("click", this.listeners.close));
  }
  _initializeMainEvents() {
    this.options.isDebug && (console.log("%c %s", "color: #ccc; font-style: italic;", "CANVI: Init main events..."), console.log("%c %s", "color: #999; font-style: italic;", "---------")), this.body.addEventListener("keyup", (t) => {
      this.isOpen && t.keyCode == 27 && this.close();
    }), this.openButton && this.openButton.addEventListener("click", this.listeners.open), window.addEventListener("resize", this.listeners.responsiveWidth);
  }
  _transitionOpenEnd(t) {
    !this.isOpen || t.propertyName !== "transform" || (this.options.isDebug && (console.log("%c %s", "color: #ff7600; font-style: italic;", "CANVI: Open transition end..."), console.log("%c %s", "color: #999; font-style: italic;", "---------")), this._triggerCanviEvent("canvi.after-open"), (this.options.pushContent ? this.content : this.navbar).removeEventListener(this.transitionEvent, this.listeners.transitionOpenEnd));
  }
  _transitionCloseEnd(t) {
    this.isOpen || t.propertyName !== "transform" || (this.options.isDebug && console.log("%c %s", "color: #ff7600; font-style: italic;", "CANVI: Close transition end..."), this._triggerCanviEvent("canvi.after-close"), this._removeOverlay(), this._resetZindex(), (this.options.pushContent ? this.content : this.navbar).removeEventListener(this.transitionEvent, this.listeners.transitionCloseEnd), this.content.classList.remove("is-canvi-open"));
  }
  _setTransitionSpeed() {
    this.navbar.style.transitionDuration = this.options.speed, this.content.style.transitionDuration = this.options.speed, this.overlay.style.animationDuration = this.options.speed;
  }
  _setZindex() {
    this.navbar.style.zIndex = this.options.pushContent ? 20 : 10, this.content.style.zIndex = this.options.pushContent ? 40 : 5;
  }
  _resetZindex() {
    this.navbar.style.zIndex = 1, this.content.style.zIndex = 5;
  }
  _whichTransitionEvent() {
    let t = document.createElement("fakeelement"), i = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    };
    for (let s in i)
      if (t.style[s] !== void 0)
        return i[s];
  }
  _triggerCanviEvent(t) {
    this.body.dispatchEvent(new CustomEvent(t, {
      details: {
        navbar: this.navbar,
        openButton: this.openButton,
        content: this.content
      }
    }));
  }
  _objectLog() {
    console.groupCollapsed("Canvi Object"), console.log("Open Button: ", this.openButton), console.log("Navbar: ", this.navbar), console.log("Content: ", this.content), console.groupEnd();
  }
}
export {
  e as default
};
