import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function () {
	const marquees = document.querySelectorAll(".js-marquee");

	marquees.forEach((marquee) => {
		const marqueeText = marquee.dataset.text || "Marquee Text";
		const pillBackground = marquee.dataset.pillBackground || "#ffffff";
		const textColor = marquee.dataset.textColor || "#ffffff";
		const fontFamily = marquee.dataset.fontFamily || "arial,sans-serif";
		const speed = parseFloat(marquee.dataset.speed) || 5;
		const linkUrl = marquee.dataset.linkUrl || "";

		// Seleccionamos el .marquee-pill
		const pill = marquee.querySelector(".marquee-pill");
		if (!pill) return;

		// Borramos el contenido inicial (o lo conservas si prefieres)
		pill.innerHTML = "";

		// Creamos dos nodos contenedores .marquee-text para el efecto “loop infinito”
		const marqueeText1 = document.createElement("span");
		marqueeText1.classList.add("marquee-text");
		Object.assign(marqueeText1.style, {
			display: "inline-block",
			whiteSpace: "nowrap",
			color: textColor,
			fontFamily: fontFamily,
		});

		const marqueeText2 = marqueeText1.cloneNode(); // Clon vacío
		marqueeText2.classList.add("marquee-text");

		// 1) Medir ancho de una sola instancia
		const tempSpan = document.createElement("span");
		tempSpan.style.whiteSpace = "nowrap";
		tempSpan.style.visibility = "hidden";
		tempSpan.style.fontFamily = fontFamily;
		tempSpan.innerText = marqueeText;
		pill.appendChild(tempSpan);

		const singleWidth = tempSpan.offsetWidth;
		pill.removeChild(tempSpan);

		const containerWidth = marquee.offsetWidth;
		// Cuántas copias hacen falta
		const needed = Math.ceil(containerWidth / singleWidth) + 2;

		// 2) Generar array de spans
		const repeats = Array.from({ length: needed }, () => marqueeText);

		// 3) Insertarlos en marqueeText1 y marqueeText2
		repeats.forEach((txt) => {
			const span = document.createElement("span");
			span.style.marginRight = "1em";
			span.textContent = txt;
			marqueeText1.appendChild(span.cloneNode(true));
			marqueeText2.appendChild(span.cloneNode(true));
		});

		// 4) Añadirlos al DOM
		pill.appendChild(marqueeText1);
		pill.appendChild(marqueeText2);

		// 5) Lanzar animación GSAP
		if (typeof gsap !== "undefined") {
			gsap.to([marqueeText1, marqueeText2], {
				xPercent: -100,
				duration: speed,
				repeat: -1,
				ease: "none",
			});
		}
	});
});
