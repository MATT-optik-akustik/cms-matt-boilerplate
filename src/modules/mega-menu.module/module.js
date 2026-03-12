document.querySelectorAll("[data-mega-menu]").forEach((menu) => {
	const items = Array.from(menu.querySelectorAll("[data-mega-menu-item]"));
	const mobileBreakpoint = window.matchMedia("(max-width: 991px)");
	const closeDelay = 300;

	const closeTimers = new WeakMap();

	const clearCloseTimer = (item) => {
		const timer = closeTimers.get(item);

		if (timer) {
			window.clearTimeout(timer);
			closeTimers.delete(item);
		}
	};

	const closeItem = (item) => {
		const trigger = item.querySelector("[data-mega-menu-trigger]");
		const panel = item.querySelector("[data-mega-menu-panel]");

		if (!trigger || !panel) {
			return;
		}

		clearCloseTimer(item);
		item.classList.remove("is-open");
		trigger.setAttribute("aria-expanded", "false");
		panel.hidden = true;
	};

	const openItem = (item) => {
		const trigger = item.querySelector("[data-mega-menu-trigger]");
		const panel = item.querySelector("[data-mega-menu-panel]");

		if (!trigger || !panel) {
			return;
		}

		clearCloseTimer(item);
		item.classList.add("is-open");
		trigger.setAttribute("aria-expanded", "true");
		panel.hidden = false;
	};

	const scheduleCloseItem = (item) => {
		clearCloseTimer(item);

		const timer = window.setTimeout(() => {
			closeItem(item);
		}, closeDelay);

		closeTimers.set(item, timer);
	};


	const closeAll = (exceptItem) => {
		items.forEach((item) => {
			if (item !== exceptItem) {
				closeItem(item);
			}
		});
	};

	items.forEach((item) => {
		const trigger = item.querySelector("[data-mega-menu-trigger]");
		const panel = item.querySelector("[data-mega-menu-panel]");

		if (!trigger || !panel) {
			return;
		}

		item.addEventListener("mouseenter", () => {
			if (mobileBreakpoint.matches) {
				return;
			}

			clearCloseTimer(item);
			closeAll(item);
			openItem(item);
		});

		item.addEventListener("mouseleave", () => {
			if (mobileBreakpoint.matches) {
				return;
			}

			scheduleCloseItem(item);
		});

		trigger.addEventListener("focus", () => {
			if (mobileBreakpoint.matches) {
				return;
			}

		clearCloseTimer(item);
			closeAll(item);
			openItem(item);
		});

		item.addEventListener("focusout", (event) => {
			if (mobileBreakpoint.matches || item.contains(event.relatedTarget)) {
				return;
			}

			closeItem(item);
		});

		trigger.addEventListener("click", (event) => {
			if (!mobileBreakpoint.matches) {
				return;
			}

			event.preventDefault();

			if (item.classList.contains("is-open")) {
				closeItem(item);
				return;
			}

			closeAll(item);
			openItem(item);
		});
	});

	menu.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return;
		}

		closeAll();
	});

	document.addEventListener("click", (event) => {
		if (menu.contains(event.target)) {
			return;
		}

		closeAll();
	});

	const resetMenu = () => closeAll();

	if (mobileBreakpoint.addEventListener) {
		mobileBreakpoint.addEventListener("change", resetMenu);
	} else {
		mobileBreakpoint.addListener(resetMenu);
	}
});
