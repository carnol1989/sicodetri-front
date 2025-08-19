/**
 * Web Vitals reporting helper for SICODETRI-FRONT. <br/>
 * Invokes the `web-vitals` library to measure and report key performance metrics:
 * CLS, FID, FCP, LCP, and TTFB. <br/>
 * Path: src/reportWebVitals.js
 *
 * @module reportWebVitals
 * @requires module: web-vitals
 *
 * <b>Component</b>: {@link reportWebVitals} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JS) File creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Web Vitals metric object as reported by the `web-vitals` library.
 * (Shape simplified for JSDoc; see library types for full details.) <br/>
 * Typical fields include: `name`, `value`, `id`, `delta`, `entries`, `rating`.
 *
 * @typedef {Object} WebVitalsMetric
 * @property {string} name - Metric name (e.g., 'CLS', 'FID', 'FCP', 'LCP', 'TTFB').
 * @property {number} value - Numeric value of the metric.
 * @property {string} id - Unique identifier for the metric sample.
 * @property {number} [delta] - Delta since last report (for cumulative metrics).
 * @property {Array<PerformanceEntry>} [entries] - Related performance entries.
 * @property {'good'|'needs-improvement'|'poor'} [rating] - Qualitative rating.
 */

/**
 * Signature of the callback that receives each reported metric.
 *
 * @callback WebVitalsHandler
 * @param {WebVitalsMetric} metric - The Web Vitals metric data.
 * @returns {void} */

/**
 * Reports Core Web Vitals and other key metrics to the provided callback. <br/>
 * When a function is passed, this utility subscribes it to all supported metrics:
 * - CLS (Cumulative Layout Shift) via {@link getCLS}
 * - FID (First Input Delay) via {@link getFID}
 * - FCP (First Contentful Paint) via {@link getFCP}
 * - LCP (Largest Contentful Paint) via {@link getLCP}
 * - TTFB (Time To First Byte) via {@link getTTFB}
 *
 * @function reportWebVitals
 * @param {WebVitalsHandler} [onPerfEntry] - Callback invoked once per metric with its data.
 * @example
 * // Log metrics to the console
 * import reportWebVitals from './reportWebVitals';
 * reportWebVitals((metric) => {
 *   console.log(`[WebVitals] ${metric.name}:`, metric.value);
 * });
 *
 * @example
 * // Send metrics to an analytics endpoint
 * reportWebVitals((metric) => {
 *   navigator.sendBeacon('/analytics', JSON.stringify(metric));
 * });
 */
const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
