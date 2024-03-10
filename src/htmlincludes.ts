import kreiseLogo from './kreise.svg'
import derchemnitzLogo from '.derchemnitz.svg'

export function getPageOverlayDiv (): HTMLDivElement {

  const pageOverlayDiv: HTMLDivElement = document.createElement('div')
  pageOverlayDiv.setAttribute('id', 'pageOverlay')

  const introDiv: HTMLDivElement = document.createElement('div')
  introDiv.setAttribute('id', 'introDiv')
  pageOverlayDiv.append(introDiv)

  const logoLink: HTMLAnchorElement = document.createElement('a')
  logoLink.setAttribute('href', 'https://krei.se')

  introDiv.append(logoLink)

  const logoImg: HTMLImageElement = document.createElement('img')
  logoImg.setAttribute('src', kreiseLogo)
  logoImg.setAttribute('alt', 'Krei.se Logo')

  logoImg.classList.add('kreiseLogo')
  logoImg.classList.add('vanilla')
  introDiv.classList.add('applyInvertFilter')
  

  introDiv.append(logoImg)

  const infoParagraph: HTMLParagraphElement = document.createElement('p')
  infoParagraph.setAttribute('id', 'info')
  infoParagraph.classList.add('applyFadeOut')

  // const cycleGraphLink: HTMLAnchorElement = document.createElement('a')
  // cycleGraphLink.setAttribute('href', 'cycleGraph.html')
  // cycleGraphLink.innerHTML = 'L&ouml;sung zyklische Graphen'
  // infoParagraph.append(cycleGraphLink)

  const datenschutzParagraph: HTMLParagraphElement = document.createElement('p')
  datenschutzParagraph.setAttribute('id', 'datenschutz')
  datenschutzParagraph.style.fontWeight = '400'
  datenschutzParagraph.classList.add('applyFadeOut')

  const datenschutzLink: HTMLAnchorElement = document.createElement('a')
  datenschutzLink.setAttribute('href', 'datenschutz.html')
  datenschutzLink.innerHTML = 'Impressum · Datenschutz'

  datenschutzParagraph.append(datenschutzLink)

  introDiv.append(datenschutzParagraph)
  introDiv.append(infoParagraph)

  return pageOverlayDiv
}

export function fadeoutDatenschutzAndInfoParagraphs (): void {

  const applyFadeOutElements = document.querySelectorAll('.applyFadeOut') ?? []

  applyFadeOutElements.forEach((element: Element) => {
    
    element.style.transition = 'opacity 60s'
    element.style.opacity = '0'
    
    window.setTimeout((element: HTMLElement) => {
      element.parentNode!.removeChild (element)
    }, 10000)

  })

}
