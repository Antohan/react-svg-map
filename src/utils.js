import get from "lodash/get";
import defaultTheme from "./theme/defaultTheme";

export function getAllPlainValuesAsObj(obj) {
  const plain = {};
  Object.keys(obj).forEach(
    key => (typeof obj[key] !== 'object' ? (plain[key] = obj[key]) : null)
  );
  return plain;
}

export function getThemeAsPlainObjectByKeys(theme, ...keys) {
  const plain = getAllPlainValuesAsObj(theme);

  keys.forEach(key => theme[key] && Object.assign(plain, theme[key]));

  return plain;
}

export function innerMerge(obj, ...others) {
  others.forEach((v) => {
    for (const key in v) {
      if (typeof obj[key] === 'object' && typeof v[key] === 'object') {
        obj[key] = innerMerge({}, obj[key], v[key]);
      } else {
        obj[key] = v[key];
      }
    }
  });

  return obj;
}

export function fireEvent(elementId, eventName) {
  const node = document.getElementById(elementId);
  if (!node) return;

  if (node.fireEvent) node.fireEvent(`on${eventName}`);
  else {
    const event = document.createEvent('Events');
    event.initEvent(eventName, true, false);
    node.dispatchEvent(event);
  }
}

export function getSequence(from, to, total, precision = 10) {
  const delta = Math.abs(to - from);
  let appendValue = delta / (total - 1);
  if (from > to) appendValue *= -1;
  const result = [];
  let nextValue = from;
  while (total > 0) {
    total -= 1;
    result.push(Math.round(nextValue * precision) / precision);
    nextValue += appendValue;
  }
  return result;
}

export function getScale(wrapSize, targetSize, precision = 100) {
  const [maxWidth, maxHeight] = wrapSize;
  const [targetWidth, targetHeight] = targetSize;

  const scale = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);

  return Math.round((scale - scale / 10) * precision) / precision;
}

export function getPosition([mapX, mapY] = [0, 0], [targetX, targetY] = [0, 0], wrapper) {
  let x = Math.floor(Math.abs(mapX - targetX));
  let y = Math.floor(Math.abs(mapY - targetY));
  if (targetX > mapX) x *= -1;
  if (targetY > mapY) y *= -1;

  const scale = Math.min(wrapper.width / 2 / mapX, wrapper.height / 2 / mapY);

  return [x * scale, y * scale];
}

export function getTheme(theme, key) {
  const merged = innerMerge({}, get(defaultTheme, key, {}), get(theme, key, {}));
  return getThemeAsPlainObjectByKeys(merged);
}

export function getGlobalTheme(theme) {
  return innerMerge({}, defaultTheme, theme);
}

export function getFlatMap(map) {
  const result = {};
  if (!map) return result;

  function getFlatArray(element) {
    let res = [];

    res.push(element);
    if (element.children) {
      element.children.forEach((child) => {
        res = [].concat(res, getFlatArray(child));
      });
    }

    return res;
  }

  getFlatArray(map).forEach((element) => {
    result[element.id] = element;
  });

  return result;
}
