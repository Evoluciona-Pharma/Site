/** Shared class strings for accessible controls.
 *
 * The design was built with click handlers on `div`/`span`, which puts every
 * affected control outside the tab order. The fix is a real `<button>` or
 * `<input>` at each site — these constants keep that swap from changing a pixel.
 */

/** Strips the UA button chrome so a semantic `<button>` can carry the design's
    own styling. Use as `className={`${resetButton} …the original classes`}`. */
export const resetButton = 'cursor-pointer border-none bg-transparent p-0 text-left font-sans';

/** Focus ring for controls whose real input is `sr-only` (facets, presentation
    chips, the attestation checkbox). The input carries `peer sr-only`; the
    visible box next to it carries this, so keyboard focus stays visible even
    though the control itself is off-screen. */
export const peerRing =
  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand';
