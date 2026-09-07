/**
 * Base Web Component for accessible popup dropdowns (e.g. LanguageSwitcher, ThemeSwitcher).
 * Provides click-outside closing and full keyboard navigation (Escape, Arrow Up/Down, Home, End).
 */
export abstract class PopupMenu extends HTMLElement {
  protected toggleButton: HTMLButtonElement | null = null;
  protected menu: HTMLElement | null = null;
  protected optionsButton: NodeListOf<HTMLElement> | null = null;

  private handleOutsideClickBound: (e: MouseEvent) => void;
  private handleKeyDownBound: (e: KeyboardEvent) => void;
  private handleToggleClickBound: () => void;
  private handleOptionClickBound: (e: Event) => void;

  constructor() {
    super();
    this.handleOutsideClickBound = this.handleOutsideClick.bind(this);
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.handleToggleClickBound = () => {
      this.toggleMenu();
    };
    this.handleOptionClickBound = (e: Event) => {
      this.handleClick(e);
    };
  }

  connectedCallback() {
    this.toggleButton = this.querySelector(`button[aria-expanded]`);
    this.menu = this.querySelector(`.popup-panel`);
    this.optionsButton = this.querySelectorAll(`.popup-item`);

    this.setupEventListeners();
    this.syncActiveUI();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    this.toggleButton?.addEventListener("click", this.handleToggleClickBound);

    this.optionsButton?.forEach((option) => {
      option.addEventListener("click", this.handleOptionClickBound);
    });

    document.addEventListener("click", this.handleOutsideClickBound);
    this.addEventListener("keydown", this.handleKeyDownBound);
  }

  removeEventListeners() {
    this.toggleButton?.removeEventListener("click", this.handleToggleClickBound);

    this.optionsButton?.forEach((button) => {
      button.removeEventListener("click", this.handleOptionClickBound);
    });

    document.removeEventListener("click", this.handleOutsideClickBound);
    this.removeEventListener("keydown", this.handleKeyDownBound);
  }

  // Close menu when clicking outside of this component
  handleOutsideClick(e: MouseEvent) {
    const isInside = e.composedPath().includes(this);
    if (!isInside) {
      this.hideMenu();
    }
  }

  // Keyboard navigation for accessibility
  handleKeyDown(e: KeyboardEvent) {
    const items = this.optionsButton ? Array.from(this.optionsButton) : [];
    const isMenuOpen = !this.menu?.classList.contains("hidden");

    // Close on Escape and return focus to toggle button
    if (e.key === "Escape") {
      if (isMenuOpen) {
        e.stopPropagation();
        e.preventDefault();
        this.hideMenu();
        this.toggleButton?.focus();
      }
      return;
    }

    // Arrow navigation through menu items
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isMenuOpen) {
        this.showMenu();
        const target = e.key === "ArrowDown" ? items[0] : items[items.length - 1];
        target?.focus();
        return;
      }

      const activeIndex = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") {
        const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        items[nextIndex]?.focus();
      } else {
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        items[prevIndex]?.focus();
      }
    } else if (e.key === "Home" && isMenuOpen) {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End" && isMenuOpen) {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  showMenu() {
    this.menu?.classList.remove("hidden");
    this.toggleButton?.setAttribute("aria-expanded", "true");
  }

  hideMenu() {
    this.menu?.classList.add("hidden");
    this.toggleButton?.setAttribute("aria-expanded", "false");
  }

  toggleMenu() {
    const isVisible = !this.menu?.classList.contains("hidden");
    if (isVisible) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  /** Handler called when a menu item is clicked */
  abstract handleClick(e: Event): void;

  /** Updates the active/selected state in the UI */
  abstract syncActiveUI(): void;
}
