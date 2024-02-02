import kreiseLogo from './kreise.svg'

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

  logoImg.classList.add('logo')
  logoImg.classList.add('vanilla')

  introDiv.append(logoImg)

  const infoParagraph: HTMLParagraphElement = document.createElement('p')
  infoParagraph.setAttribute('id', 'info')

  const datenschutzParagraph: HTMLParagraphElement = document.createElement('p')
  datenschutzParagraph.setAttribute('id', 'datenschutz')
  const datenschutzLink: HTMLAnchorElement = document.createElement('a')
  datenschutzLink.setAttribute('href', 'datenschutz.html')
  datenschutzLink.innerHTML = 'Impressum · Datenschutz'

  datenschutzParagraph.append(datenschutzLink)

  introDiv.append(datenschutzParagraph)
  introDiv.append(infoParagraph)

  return pageOverlayDiv
}

export function fadeoutDatenschutzAndInfoParagraphs (): void {
  const datenschutzParagraph: HTMLParagraphElement = document.querySelector('#datenschutz') ?? document.createElement('p')
  datenschutzParagraph.style.cssText = 'opacity : 0.0; transition:opacity 30s;'
  const infoParagraph: HTMLParagraphElement = document.querySelector('#info') ?? document.createElement('p')
  infoParagraph.style.cssText = 'opacity : 0.0; transition:opacity 30s;'
}
