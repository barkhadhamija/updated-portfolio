// About: tap the photo stack and the front photo goes to the back.

export function init(stack: HTMLElement) {
  const photos = [...stack.querySelectorAll<HTMLElement>('[data-photo]')];
  let order = photos.map((_, i) => i);
  stack.addEventListener('click', () => {
    order = order.slice(1).concat(order[0]);
    order.forEach((photoIndex, depth) => (photos[photoIndex].dataset.depth = String(depth)));
  });
}
