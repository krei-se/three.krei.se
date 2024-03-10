import { CatmullRomCurve3, Vector3 } from "three"

export const ColorSchemes: any = {}
ColorSchemes.FourColours = ['FFE4C4', '87CEEB', '66CDAA', 'F08080', 'd56bd7', 'FFFFFF']
ColorSchemes.Autumn = ['9c5708', 'f47b20', 'f05133', 'ffd200', 'FFFFFF', 'FFFFFF']
ColorSchemes.PurplePath = ['a050a1', 'd56bd7', 'bc5e95', '502851', 'bc5e95', 'FFFFFF']
ColorSchemes.Cyber = ['c9f2f8', '60daea', '13ecd5', '2d84d2', 'FFFFFF', 'FFFFFF']
ColorSchemes.Phoenix = ['D1793b', 'dadbdd', 'd4af37', 'b2beb5', 'b2beb5', 'FFFFFF']
ColorSchemes.Toxic = ['f19f22', 'F3D05F', '7b4122', 'BCB455', 'FFFFFF', 'FFFFFF']
ColorSchemes.BaseColors = ['ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff']

// FlyCurve

const longCurve: number = 10.0
const shortCurve: number = 3.5

export const flyCurveVectors: CatmullRomCurve3 = new CatmullRomCurve3([

  // Start from last entry:
  new Vector3(shortCurve, shortCurve, -longCurve),
  new Vector3(-shortCurve, -shortCurve, -longCurve),

  new Vector3(0, 0, 0),
  new Vector3(longCurve, shortCurve, -shortCurve),
  new Vector3(longCurve, -shortCurve, shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-longCurve, shortCurve, shortCurve),
  new Vector3(-longCurve, -shortCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, longCurve, shortCurve),
  new Vector3(shortCurve, longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, -longCurve, shortCurve),
  new Vector3(-shortCurve, -longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, -shortCurve, longCurve),
  new Vector3(shortCurve, shortCurve, longCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, -shortCurve, -longCurve),
  new Vector3(-shortCurve, shortCurve, -longCurve),
  new Vector3(0, 0, 0),
  new Vector3(longCurve, shortCurve, shortCurve),
  new Vector3(longCurve, -shortCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-longCurve, shortCurve, -shortCurve),
  new Vector3(-longCurve, -shortCurve, shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, longCurve, shortCurve),
  new Vector3(-shortCurve, longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, -longCurve, shortCurve),
  new Vector3(shortCurve, -longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, shortCurve, longCurve),
  new Vector3(shortCurve, -shortCurve, longCurve),
  new Vector3(0, 0, 0)
  // new Vector3(shortCurve, shortCurve, -longCurve)
  // new Vector3(-shortCurve, -shortCurve, -longCurve) <-- ignored, as we start from this
  //,
  // new Vector3(0, 0, 0)

])

flyCurveVectors.closed = true

