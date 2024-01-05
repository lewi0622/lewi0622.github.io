// this is an old version available on npm and jsdelivr, but you can download
// newer version here: https://sourceforge.net/projects/jsclipper/files/ and keep it
// locally in your project
import ClipperLib from "https://cdn.jsdelivr.net/npm/js-clipper@1.0.1/+esm";

const SUBJECT = ClipperLib.PolyType.ptSubject; // 0
const CLIP = ClipperLib.PolyType.ptClip; // 1
const FILL_NON_ZERO = ClipperLib.PolyFillType.pftNonZero;
const FILL_EVEN_ODD = ClipperLib.PolyFillType.pftEvenOdd;
const DIFFERENCE = ClipperLib.ClipType.ctDifference;
const INTERSECTION = ClipperLib.ClipType.ctIntersection;
const XOR = ClipperLib.ClipType.ctXor;
const UNION = ClipperLib.ClipType.ctUnion;
const SCALE = 10000;

const nonEmpty = (arr) => arr.length > 0;

const point = (X, Y) => ({ X, Y });

function polygonBooleanOperation(type, p1, p2){
  let p1Polygon = ClipperLib.Clipper.CleanPolygons(
    scalePolygonForClipper(p1),
    0.3 * SCALE
  );
  let p2Polygon = ClipperLib.Clipper.CleanPolygons(
    scalePolygonForClipper(p2),
    0.3 * SCALE
  );
  let result = [];
  const clipper = new ClipperLib.Clipper();

  const p1FillType = p1.length > 1 ? FILL_EVEN_ODD : FILL_NON_ZERO;
  const p2FillType = p2.length > 1 ? FILL_EVEN_ODD : FILL_NON_ZERO;

  clipper.AddPaths(p1Polygon, SUBJECT, true);
  clipper.AddPaths(p2Polygon, CLIP, true);
  clipper.Execute(type, result, p1FillType, p2FillType);
  return ClipperLib.Clipper.SimplifyPolygons(
    descalePolygonForClipper(result).filter(nonEmpty)
  );
}

const intersection = (p1, p2) => polygonBooleanOperation(INTERSECTION, p1, p2);
window.intersection = intersection;
const difference = (p1, p2) => polygonBooleanOperation(DIFFERENCE, p1, p2);
window.difference = difference;
const union = (p1, p2) => polygonBooleanOperation(UNION, p1, p2);
window.union = union;
const xor = (p1, p2) => polygonBooleanOperation(XOR, p1, p2);
window.xor = xor;